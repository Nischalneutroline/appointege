'use client'
import { Menu } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { toggleMobileNav } from '@/store/slices/navSlice'

const HeaderMenu = () => {
  const dispatch = useDispatch()
  return (
    <div className="lg:hidden cursor-pointer">
      <Menu
        onClick={() => dispatch(toggleMobileNav())}
        className="text-[#5C6B84]"
      />
    </div>
  )
}

export default HeaderMenu
