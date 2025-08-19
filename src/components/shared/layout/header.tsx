// components/Header.tsx

import LanguageSwitcher from './language-switcher'
import { auth } from '@/auth'
import { UserButton } from './user-header-info'
import HeaderMenu from '@/app/(protected)/admin/appointment/_component/hamburger-menu'
import { redirect } from 'next/navigation'
import { getUserById } from '@/data/user'

const Header = async () => {
  const session = await auth()
  let user = null
  if (!session) {
    console.error('No session found')
    return redirect('/login')
  } else {
    if (session.user?.role === 'ADMIN' && session.user.id) {
      const adminUser = await getUserById(session.user.id)
      if (adminUser) {
        user = adminUser
      } else {
        console.error('Admin user not found')
        return redirect('/login')
      }
      user = adminUser
    }
  }
  // console.log('Current User in Header:', session?.user)

  return (
    <div className="flex items-center gap-4 w-full bg-white border-b-1 px-6 py-[16px] border-b-[#E5E7EB]">
      <div className="flex items-center justify-between lg:justify-end  w-full rounded-md">
        {/* Search Bar */}
        {/* <SearchBar className="hidden lg:block w-[371px]" /> */}
        <HeaderMenu />

        {/* Notifications & Avatar */}
        <div className="flex items-center gap-8 h-10">
          <LanguageSwitcher />

          <UserButton user={user || session?.user || null} />
        </div>
      </div>
    </div>
  )
}

export default Header
