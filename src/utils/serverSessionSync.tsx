'use client'

import { setSession } from '@/store/slices/authSlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

interface SessionSyncProps {
  serverSession: {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: 'user' | 'admin' | 'super-admin'
    } | null
  }
}

export function SessionSync({ serverSession }: SessionSyncProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setSession({
        user: serverSession.user,
        isLoading: false,
      }),
    )
  }, [dispatch, serverSession.user])

  return null
}
