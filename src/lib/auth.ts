import { auth } from '@/auth'

// accessing user from server auth
export async function currentUser() {
  const session = await auth()
  return session?.user
}

// accessing role from server auth
export async function currentRole() {
  const session = await auth()
  return session?.user.role
}
