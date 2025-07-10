// components/UserButton.tsx
'use client'
import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FaUser } from 'react-icons/fa'
import { LogoutButton } from '@/components/auth/logout-button'
import { useDispatch, useSelector } from 'react-redux'
import { setSession } from '@/store/slices/authSlice'
import type { RootState } from '@/store/store'
import { BusinessDetail } from '@prisma/client'

// Define User interface to match NextAuth session
interface User {
  id?: string // Make id optional to match NextAuth's session
  name?: string | null
  email?: string | null
  image?: string | null
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null
  ownedBusinesses?: BusinessDetail[] | null // TODO: Update this to the correct type
}

export function UserButton({ user }: { user: User | null }) {
  const dispatch = useDispatch()
  const reduxState = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    console.log('Current User in UserButton:', user)
    console.log('Redux State in UserButton:', reduxState)
    // Validate user has required id before dispatching
    if (user && user.id) {
      dispatch(
        setSession({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            ownedBusinesses: user.ownedBusinesses || null, // Ensure ownedBusinesses is handled
          },
          isLoading: false,
        }),
      )
    } else {
      dispatch(
        setSession({
          user: null,
          isLoading: false,
        }),
      )
    }
  }, [user, dispatch])

  // Handle loading state
  if (reduxState.isLoading) {
    return <div>Loading...</div>
  }

  // Render nothing if no user
  if (!reduxState.user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none outline-none">
        <Avatar>
          <AvatarImage src={reduxState.user?.image || ''} />
          <AvatarFallback className="bg-sky-400">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
