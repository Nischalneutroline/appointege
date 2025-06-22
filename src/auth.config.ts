import Google from 'next-auth/providers/google'
import Credentails from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { LoginSchema } from './schemas'
import { getUserByEmail, getUserById } from './data/user'
import bcrypt from 'bcryptjs'

export default {
  providers: [
    Credentails({
      // Check the credentials in the database and return the user if valid to callbacks above.
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials)

        if (validateFields.success) {
          const { email, password } = validateFields.data
          const user = await getUserByEmail(email)
          // console.log("User found:", user)

          // If there is no user or password then it might be a social(Google) login
          if (!user || !user.password) {
            return null
          }
          const isValidPassword = await bcrypt.compare(password, user.password)
          if (isValidPassword) {
            return user
          }
        }
        return null
      },
    }),
    Google,
  ],
} satisfies NextAuthConfig
