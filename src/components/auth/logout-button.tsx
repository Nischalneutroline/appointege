// components/auth/logout-button.tsx
'use client'
import React from 'react'
import { LogOutIcon } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logOut } from '@/store/slices/authSlice'
import type { AppDispatch } from '@/store/store'

export function LogoutButton() {
  const dispatch = useDispatch<AppDispatch>()

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(logOut())
  }

  return (
    <span
      className="flex items-center gap-x-2 cursor-pointer"
      onClick={onClick}
    >
      <LogOutIcon className="w-4 h-4" /> Logout
    </span>
  )
}
