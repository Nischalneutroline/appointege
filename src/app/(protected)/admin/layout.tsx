// 'use client'

// import { auth } from '@/auth'
import Header from '@/components/shared/layout/header'
import SidebarDesktop from '@/components/shared/layout/sidebar-desktop'
import SidebarMobile from '@/components/shared/layout/sidebar-mobile'

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
        <SidebarDesktop />
        {/* Mobile Navbar */}
        <SidebarMobile />

        {/* Content Area */}
        <div className="flex-1 flex flex-col w-full h-full">
          {/* Header */}
          <Header />
          {/* Main Content */}
          {/* <Toaster position="bottom-right" /> */}
          <div className="flex-1 relative  shadow p-6 bg-[#fbfbfb] overflow-hidden">
            {/* <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("/assets/grain.jpg")`,
              }}
            /> */}
            {/* <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  'linear-gradient(135deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '4px 4px', // Creates a subtle grid-like static effect
              }}
            /> */}
            {children}
          </div>
        </div>
      </div>
    </div>
    // </AuthInitializer>
  )
}

export default AdminLayout
