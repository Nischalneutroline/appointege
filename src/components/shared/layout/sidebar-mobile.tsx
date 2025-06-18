import { cn } from '@/lib/utils'
import React from 'react'

import CompanyProfile from '../company-profile'
import { navLinks } from './sidebar-desktop'
import { NavLinks } from './nav-links'
import { SquareArrowUpRight } from 'lucide-react'

const SidebarMobile = () => {
  return (
    <aside
      className={cn(
        'flex flex-col bg-white h-full border-r-1 border-[#E5E7EB] transition-all duration-150 ease-in-out w-70 items-center',
      )}
    >
      <div className=" relative flex flex-col w-full gap-6 h-full ">
        {/* Logo and Title Section */}
        <CompanyProfile name="Business Name" setCollapsed={setCollapsed} />

        {/* Navigation Links */}
        <div className="flex flex-col px-4 gap-8">
          <div className="flex flex-col gap-8 px-4">
            {navLinks.slice(0, 4).map((link) => (
              <NavLinks key={link.name} {...link} />
            ))}
          </div>
          {/* Separator */}
          <div className="border-t-2 border-gray-200 w-full" />
          {/* Remaining Navigation Links */}
          <div className="flex px-4">
            {navLinks.slice(4, 5).map((link) => (
              <NavLinks key={link.name} {...link} />
            ))}
          </div>
          {/* Lower Nav Links */}
          <div className="flex flex-col absolute bottom-0 w-full left-0 px-4 gap-8 mb-4">
            {/* Separator */}
            <div className="border-t-2 border-gray-200 w-full" />

            {/* Remaining Bottom Links */}
            <div className="flex flex-col gap-8 px-4">
              {navLinks.slice(5).map((link) => (
                <NavLinks key={link.name} {...link} />
              ))}
            </div>
            {/* Separator */}
            <div className="border-t-2 border-gray-200 w-full" />

            <button
              className="flex items-center gap-3 text-base font-medium transition-all px-3 py-1 bg-[#E9F1FD] w-full leading-8 border-[1px] border-[#5BA4FF] rounded-[6px]"
              style={{
                boxShadow: 'inset 0 2px 10px rgba(37, 99, 235, 0.15)',
              }}
            >
              <SquareArrowUpRight />
              <div className="font-medium">Upgrade Plan</div>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarMobile
