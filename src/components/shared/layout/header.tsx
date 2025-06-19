'use client'
import { Menu } from 'lucide-react'

import LanguageSwitcher from './language-switcher'
import UserHeaderInfo from './user-header-info'
import { useSidebar } from '@/context/sidebar-context'
// import SidebarMobile from "./sidebar-mobile";
// import { useNavStore } from "@/state/store";
const Header = () => {
  //   const { onOpen } = useNavStore();
  const { toggleSidebar } = useSidebar()

  return (
    <div className="flex items-center gap-4 w-full bg-white border-b-1 px-6 py-2.5 border-b-[#E5E7EB] ">
      <div className="flex items-center w-full   rounded-md">
        {/* Search Bar */}
        <div className="cursor-pointer lg:hidden" onClick={toggleSidebar}>
          <Menu size={24} />
        </div>

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
