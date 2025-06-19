// hooks/use-current-user.ts
'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export function useCurrentUser() {
  const { data: session, status, update } = useSession()

  useEffect(() => {
    console.log('Session Status:', status, 'Session Data:', session)
  }, [session, status])

  // Return the user object from the session, or null if not authenticated
  return session?.user ?? null
}
