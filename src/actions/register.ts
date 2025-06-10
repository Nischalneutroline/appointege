'use server'

import bcrypt from 'bcryptjs'
import { SignupSchema, SignupSchemaType } from '@/schemas'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { generateTokenForEmailVerification } from '@/lib/token'
import { sendVerificationEmail } from '@/lib/mail'
import { Prisma } from '@prisma/client'

export async function register(values: SignupSchemaType) {
  try {
    const validateFields = SignupSchema.safeParse(values)

    if (!validateFields.success) {
      return { error: 'Invalid inputs!' }
    }

    console.log(validateFields.data)
    const { email, password, name, phone } = validateFields.data

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return { error: 'Email already in use!' }
    }

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    })

    if (!newUser) {
      return { error: 'User creation failed!' }
    }
    // Optionally, you can return the new user or some success message
    // return newUser
    if (newUser) {
      // Send Verification Email
      // const verficationToken = await generateTokenForEmailVerification(email)
      // if (!verficationToken) {
      //   return { error: 'Something went wrong while generating token!' }
      // }
      // await sendVerificationEmail(
      //   verficationToken.email,
      //   verficationToken.token,
      // )
      // return { success: 'Email confirmation sent!' }

      const res = await sendVerifyEmail(email)
      return res
    }

    return { error: 'Register failed!' }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known errors (e.g., unique constraint violations)
      console.error('Known prisma error:', error)
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Known validation error:', error)
    }
    console.log('Error while registering user:', error)
    return { error: 'Register failed!' }
  }
}

export async function sendVerifyEmail(
  email: string,
): Promise<{ success?: string } | { error?: string }> {
  if (!email) {
    return { error: 'Email and token are required!' }
  }
  try {
    const verificationToken = await generateTokenForEmailVerification(email)
    if (!verificationToken) {
      return { error: 'Failed to generate verification token!' }
    }
    await sendVerificationEmail(email, verificationToken.token)
    return { success: 'Verification email sent successfully!' }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { error: 'Failed to send verification email' }
  }
  // If the email sending fails, you can throw an error or return a failure response
}
