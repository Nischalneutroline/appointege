'use server'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { sendVerificationEmail } from '@/lib/mail'
import { generateTokenForEmailVerification } from '@/lib/token'
import { DEFAULT_LOGGEDIN_USER_REDIRECT } from '@/routes'
import { LoginSchema, LoginSchemaType } from '@/schemas'
import { AuthError } from 'next-auth'

export async function login(values: LoginSchemaType) {
  const validateFields = LoginSchema.safeParse(values)

  if (!validateFields.success) {
    return { error: 'Invalid credentails!' }
  }

  const { email, password } = validateFields.data

  // check for email exist
  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.password) {
    // if user not found or password is not set, it might be a social login
    // so we return an error message
    return { error: 'Email not registered!' }
  }

  // if email not verified, return error
  if (!existingUser.emailVerified) {
    const verificationToken = await generateTokenForEmailVerification(email)
    if (!verificationToken) {
      return { error: 'Something went wrong while verifying email!' }
    }
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
      existingUser.name || 'User',
    )
    // return success message
    return { success: 'Email Confirmation Sent!' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGGEDIN_USER_REDIRECT,
    })
  } catch (error) {
    console.log('Error while login using credentails', error)
    if (error instanceof AuthError) {
      switch (error.type) {
        // error coming from Credential() provider: authorize() function
        case 'CredentialsSignin':
          return { error: 'Invalid Credentails' }
        default:
          return { error: 'Something went wrong in signIn!' }
      }
    }
    // if not thrown it will not redirect, just for next.js and next-auth to handle the redirect by itself, just logs it and works fine
    throw error
  }

  return { success: 'Login Success!' }
}
