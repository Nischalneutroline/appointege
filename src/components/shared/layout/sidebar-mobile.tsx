'use client'

import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import CompanyProfile from '../company-profile'
import { NavLinks, NavLinksMobileSidebar } from './nav-links'
import { navLinks } from './sidebar-desktop'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { toggleMobileNav } from '@/store/slices/navSlice'

const SidebarMobile = () => {
  // const { isOpen, closeSidebar } = useSidebar()
  // console.log(isOpen, 'IsOpen')

  const { mobileNavCollapse } = useSelector((state: RootState) => state.nav)
  const dispatch = useDispatch()
  const handleToggle = () => {
    dispatch(toggleMobileNav())
  }
  return (
    <>
      {/* Overlay */}
      {mobileNavCollapse && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={handleToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-70 bg-white border-r-1 border-[#E5E7EB] z-50 transform transition-transform duration-300 ease-in-out',
          mobileNavCollapse ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="relative flex flex-col h-full overflow-y-auto gap-6">
          {/* Logo and Title Section */}

          <CompanyProfile name="Business Name" setCollapsed={handleToggle} />

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col px-4 gap-4">
            <div className="flex flex-col gap-8 px-4">
              {navLinks.slice(0, 4).map((link) => (
                <NavLinksMobileSidebar key={link.name} {...link} />
              ))}
            </div>

            <div className="border-t-2 border-gray-200 w-full" />

            <div className="flex px-4">
              {navLinks.slice(4, 5).map((link) => (
                <NavLinksMobileSidebar key={link.name} {...link} />
              ))}
            </div>

            <div className="flex flex-col absolute bottom-0 w-full left-0 px-4 gap-4 mb-4">
              <div className="border-t-2 border-gray-200 w-full" />

              <div className="flex flex-col gap-8 px-4">
                {navLinks.slice(5).map((link) => (
                  <NavLinksMobileSidebar key={link.name} {...link} />
                ))}
              </div>

              <div className="border-t-2 border-gray-200 w-full" />

              <button
                className="flex items-center gap-3 text-base font-medium transition-all px-3 py-1 bg-[#E9F1FD] w-full leading-8 border-1 border-[#5BA4FF] rounded-md"
                style={{
                  boxShadow: 'inset 0 2px 10px rgba(37, 99, 235, 0.15)',
                }}
              >
                <ArrowUpRight className="bg-[#2672EF] text-white rounded-sm h-6 w-6 " />
                <div className="font-normal">Upgrade Plan</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarMobile
