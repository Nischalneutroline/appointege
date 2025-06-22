import { prisma } from '@/lib/prisma'

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })
    return passwordResetToken
  } catch (error) {
    console.log('Error while getting password reset token by token', error)
    return null
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    })
    return passwordResetToken
  } catch (error) {
    console.log('Error while getting password reset token by email', error)
    return null
  }
}
