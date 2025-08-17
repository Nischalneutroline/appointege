// 'use client'

// import { auth } from '@/auth'
import Header from '@/components/shared/layout/header'
import SidebarDesktop from '@/components/shared/layout/sidebar-desktop'
import SidebarMobile from '@/components/shared/layout/sidebar-mobile'

// import { use, useEffect } from 'react'
// import { useDispatch } from 'react-redux'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" min-h-screen bg-[#f4f8fe] overflow-y-auto">
      {/* <div className=" min-h-screen bg-[#F8F9FA] overflow-hidden"> */}
      <div className=" flex h-screen">
        {/* ------ Sidebar ------- */}
        <SidebarDesktop />
        <SidebarMobile />

        {/* ------ Content Area ------- */}
        <div className="flex-1 flex flex-col w-full  h-full">
          <Header />
          {/* Main Content */}
          {/* <Toaster position="bottom-right" /> */}
          <div className="flex-1 relative  shadow p-6 pb-4  overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
