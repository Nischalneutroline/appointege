'use server'

import { getPasswordResetTokenByToken } from '@/data/passwordToken'
import { db } from '@/lib/db'
import { NewPasswordSchema, NewPasswordSchemaType } from '@/schemas'
import bcrypt from 'bcryptjs'

export const changePassword = async (
  value: NewPasswordSchemaType,
  token: string,
): Promise<{
  error?: string
  success?: string
}> => {
  try {
    if (!token) {
      return { error: 'Token is missing!' }
    }

    // Validate the input
    const validateFields = NewPasswordSchema.safeParse(value)

    if (!validateFields.success) {
      return { error: 'Invalid inputs!' }
    }

    // Extract the password from the validated data
    const { password } = validateFields.data

    // Check if the token exists and is valid
    const existinResetToken = await getPasswordResetTokenByToken(token)
    if (!existinResetToken) {
      return { error: 'Invalid token!' }
    }
    if (existinResetToken.expiresAt < new Date()) {
      return { error: 'Token has expired!' }
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the user's password
    const updatedUser = await db.user.update({
      where: { email: existinResetToken.email },
      data: {
        password: hashedPassword, // Assuming you have a function to hash the password
      },
    })

    // Delete the token after successful password change
    await db.passwordResetToken.delete({
      where: { id: existinResetToken.id },
    })
    // Optionally, you can also log the user out or invalidate their session here

    return { success: 'Password changed successfully!' }
  } catch (error) {
    console.error('Error changing password:', error)
    return { error: 'An unexpected error occurred!' }
  }
}
