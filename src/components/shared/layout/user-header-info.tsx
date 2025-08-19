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
import { FaQuestion, FaUser } from 'react-icons/fa'
import { LogoutButton } from '@/components/auth/logout-button'
import { useDispatch, useSelector } from 'react-redux'
import { setSession } from '@/store/slices/authSlice'
import type { RootState } from '@/store/store'
import { NavigateTo } from '@/components/shared/layout/NavigateTo'
import { UserRound } from 'lucide-react'
import { GoQuestion } from 'react-icons/go'

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null
  ownedBusinesses?: any[] | null
}

export function UserButton({ user }: { user: User | null }) {
  const dispatch = useDispatch()
  const reduxState = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    console.log('Current User in UserButton:', user)
    console.log('Redux State in UserButton:', reduxState)
    if (user && user.id) {
      dispatch(
        setSession({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            ownedBusinesses: user.ownedBusinesses || null,
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

  if (reduxState.isLoading) {
    return <div>Loading...</div>
  }

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
      <DropdownMenuContent
        align="end"
        className="p-3 py-2 space-y-2 min-w-[250px]"
      >
        <div>
          <DropdownMenuLabel className="capitalize text-lg p-0 m-0 font-medium">
            {user?.name}
          </DropdownMenuLabel>
          <DropdownMenuLabel className="text-sm p-0 m-0 text-muted-foreground">
            {user?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </div>
        <div>
          <DropdownMenuItem className="px-1 cursor-pointer">
            <NavigateTo
              link="/admin/profile"
              text="My Profile"
              type="profile"
              icon={UserRound}
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="px-1 cursor-pointer">
            <NavigateTo
              link="/admin/support"
              text="Help & Support"
              icon={GoQuestion}
            />
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="px-1">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
