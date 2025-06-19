// components/Header.tsx

import LanguageSwitcher from './language-switcher'
import { auth } from '@/auth'
import { UserButton } from './user-header-info'
import HeaderMenu from '@/app/(protected)/admin/appointment/_component/hamburger-menu'

const Header = async () => {
  const session = await auth()
  console.log('Current User in Header:', session?.user)

  return (
    <div className="flex items-center gap-4 w-full bg-white border-b-1 px-6 py-4.5 border-b-[#E5E7EB]">
      <div className="flex items-center justify-between lg:justify-end  w-full rounded-md">
        {/* Search Bar */}
        {/* <SearchBar className="hidden lg:block w-[371px]" /> */}
        <HeaderMenu />

        {/* Notifications & Avatar */}
        <div className="flex items-center gap-8 h-10">
          <LanguageSwitcher />
          <UserButton user={session?.user || null} />
        </div>
      </div>
    </div>
  )
}

export default Header
