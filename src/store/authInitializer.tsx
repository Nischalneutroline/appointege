// store/AuthInitializer.tsx
'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'

// store authSlice reducer
import { setSession } from '@/store/slices/authSlice'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const { data: session, status } = useSession()
  console.log('AuthInitializer session:', session, 'status:', status)

  useEffect(() => {
    dispatch(
      setSession({
        user: session?.user
          ? {
              id: session.user.email || 'unknown',
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
              role: session.user.role || 'user',
            }
          : null,
        isLoading: status === 'loading',
      }),
    )
  }, [dispatch, session, status])

  return <>{children}</>
}
