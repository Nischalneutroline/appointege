// src/auth.ts
import NextAuth, { DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from '@/auth.config'
import { prisma } from '@/lib/prisma'
import { getUserById } from '@/data/user'
import { DEFAULT_LOGGEDIN_USER_REDIRECT } from './routes'

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/login',
    error: '/error', // Error code passed in query string as ?error=
  },
  events: {
    async linkAccount({ user, account, profile }) {
      // Update the new user in the database for emailVerfied
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }, // Set emailVerified to current date
      })
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return DEFAULT_LOGGEDIN_USER_REDIRECT
    },
    // Only SignIn Callback can use prisma adapter as it happens on the server side for signIn
    // jwt and session callbacks are called on the client side
    async signIn({ user, account, profile }) {
      console.log('SignIn Callback - User:', user)
      // If the account type is not credentials, allow sign-in
      // This is to allow sign-in with other providers like Google, GitHub, etc.
      // If the account type is credentials, we need to check if the user exists and email is verified
      if (account?.type !== 'credentials') {
        return true
      }

      // If user is not defined, prevent sign-in
      if (!user.id) {
        return false
      }

      const existingUser = await getUserById(user.id)
      // console.log("SignIn Callback - Existing User:", existingUser)

      // If user is not found or email is not verified, prevent sign-in
      if (!existingUser || !existingUser.emailVerified) {
        return false
      }

      return true
    },

    async jwt({ token, user }) {
      // console.log("JWT Callback - User:------", user)
      // console.log("JWT Callback - Token:", token)
      // this is one time user came from the credentials provider
      // after it will be undefined on subsequent calls
      if (user) {
        token.sub = user.id

        token.name = user.name
        token.role = user.role // Add role to token
      }
      // if (!token.sub) return token

      // const existingUser = await getUserById(token?.sub)

      // if (!existingUser) return token

      // token.role = existingUser.role // Add role to token

      return token
    },
    async session({ session, token }) {
      // console.log("Session Callback Triggered - Session:", session)
      // console.log("Session Callback Triggered - Token:", token)
      if (token?.sub && session.user) {
        session.user.id = token.sub
        session.user.email = token.email
        session.user.name = token.name
        session.user.role = token.role // Add role to session
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
})
