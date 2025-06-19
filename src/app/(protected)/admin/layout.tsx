// 'use client'

// import { auth } from '@/auth'
import Header from '@/components/shared/layout/header'
import SidebarDesktop from '@/components/shared/layout/sidebar-desktop'
import { currentUser } from '@/lib/auth'
import { AuthInitializer } from '@/store/authInitializer'
import { redirect } from 'next/navigation'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await currentUser()
  console.log('Current User in Admin Layout:', session)
  if (!session) {
    // Redirect to login if not authenticated
    redirect('/login')
  }

  return (
    // <AuthInitializer>
    <div className="relative min-h-screen bg-stone-100 overflow-hidden border-r-2">
      {/* Top Background Gradient */}
      {/* <div className="absolute inset-0 h-[30vh] rounded-b-lg z-0 pointer-events-none bg-gradient" /> */}

      {/* Layout */}
      <div className="relative z-10 flex  h-screen">
        {/* Sidebar */}
        {/* Desktop Sidebar */}
        <div className="">
          <SidebarDesktop />
        </div>

        {/* Mobile Navbar */}
        <div className="block lg:hidden fixed top-0 w-full z-50">
          {/* <SidebarMobile /> */}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col w-full h-full">
          {/* Header */}
          <Header />
          {/* Main Content */}
          {/* <Toaster position="bottom-right" /> */}
          <div className="flex-1  shadow p-6 bg-[#fbfbfb] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
    // </AuthInitializer>
  )
}

export default AdminLayout
