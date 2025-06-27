// 'use client'

// import { auth } from '@/auth'
import Header from '@/components/shared/layout/header'
import SidebarDesktop from '@/components/shared/layout/sidebar-desktop'
import SidebarMobile from '@/components/shared/layout/sidebar-mobile'
import { currentUser } from '@/lib/auth'
import { AuthInitializer } from '@/store/authInitializer'
import { fetchAppointments } from '@/store/slices/appointmentSlice'
import { fetchServices } from '@/store/slices/serviceslice'
import { AppDispatch, RootState } from '@/store/store'
import { redirect } from 'next/navigation'
// import { use, useEffect } from 'react'
// import { useDispatch } from 'react-redux'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    // <AuthInitializer>
    <div className="relative min-h-screen bg-stone-100 overflow-hidden border-r-2">
      {/* Top Background Gradient */}
      {/* <div className="absolute inset-0 h-[30vh] rounded-b-lg z-0 pointer-events-none bg-gradient" /> */}

      {/* Layout */}
      <div className="relative z-10 flex  h-screen">
        {/* Sidebar */}
        {/* Desktop Sidebar */}
        <div className=" hidden lg:block ">
          <SidebarDesktop />
        </div>

        {/* Mobile Navbar */}
        <div className="block lg:hidden fixed top-0 w-full z-50">
          <SidebarMobile />
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
