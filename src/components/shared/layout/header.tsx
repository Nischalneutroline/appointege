'use client'
import { Bell, ChevronDown, Menu, Sidebar } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { useState } from 'react'
import SearchBar from './search-bar'
import LanguageSwitcher from './language-switcher'
import UserHeaderInfo from './user-header-info'
// import SidebarMobile from "./sidebar-mobile";
// import { useNavStore } from "@/state/store";
const Header = () => {
  //   const { onOpen } = useNavStore();

  return (
    <div className="flex items-center gap-4 w-full bg-white border-b-1 px-6 py-4.5 border-b-[#E5E7EB] ">
      <div className="flex items-center w-full   rounded-md">
        {/* Search Bar */}
        {/* <SearchBar className="hidden lg:block w-[371px]" /> */}

        {/* Notifications & Avatar */}
        <div className="flex w-full justify-end items-center gap-8 h-10">
          <LanguageSwitcher />
          <UserHeaderInfo />
        </div>
      </div>
    </div>
  )
}

export default Header
