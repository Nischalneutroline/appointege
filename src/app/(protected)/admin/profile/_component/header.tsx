'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { RootState } from '@/store/store'
import { Camera, Pen } from 'lucide-react'
import React from 'react'
import { FaUser } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const ProfileHeader = () => {
  const authState = useSelector((state: RootState) => state.auth)

  return (
    <div className="flex justify-between bg-white p-4 rounded-md shadow">
      {/* Avatar and Name */}
      <div className="flex gap-3 items-center">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="size-[100px] relative">
            <AvatarImage
              src={
                authState.user?.image ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }
              className="size-full"
            />
            <AvatarFallback className="bg-sky-400 size-full">
              <FaUser className="size-1/2 object-cover" />
            </AvatarFallback>
          </Avatar>
          <div className=" absolute bottom-2 right-0 p-1 bg-white size-7 border border-blue-400 rounded-full">
            <Camera className="size-full text-blue-400" />
          </div>
        </div>

        {/* Name */}
        <div>
          <h1 className="text-3xl font-semibold capitalize">
            {authState.user?.name}
          </h1>
          <p className="text-muted-foreground text-2xl capitalize">
            {authState.user?.role?.toLowerCase()}
          </p>
        </div>
      </div>
      {/* Edit Button */}
      <Button icon={<Pen />}>Edit Profile</Button>
    </div>
  )
}

export default ProfileHeader
