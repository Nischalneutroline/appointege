'use client'

// External Libraries
import React, { useState } from 'react'

import { cn } from '@/lib/utils'

// Icons
import {
  Settings,
  Bell,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  UsersRound,
  Wrench,
  CircleHelp,
  SquareArrowUpRight,
  ArrowUpRight,
} from 'lucide-react'
import { NavLinks, NavLinksMobile } from './nav-links'
import CompanyProfile from '../company-profile'

export const navLinks = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={24} /> },
  {
    name: 'Appointments',
    path: '/admin/appointment',
    icon: <Calendar size={24} />,
  },
  {
    name: 'Customers',
    path: '/admin/customer',
    icon: <UsersRound size={24} />,
  },
  {
    name: 'Services',
    path: '/admin/service',
    icon: <Wrench size={24} />,
  },
  {
    name: 'Business Settings',
    path: '/admin/settings',
    icon: <Settings size={24} />,
  },
  {
    name: 'Supports',
    path: '/admin/support',
    icon: <CircleHelp size={24} />,
  },
  {
    name: 'Reminders',
    path: '/admin/reminders',
    icon: <Bell size={24} />,
  },
]

/**
 * SidebarDesktop Component
 *
 * A responsive sidebar component that can be toggled between collapsed and expanded states.
 * Displays navigation links with icons and handles navigation between different admin sections.
 */
const SidebarDesktop = () => {
  // Hooks

  const [isSidebarCollapsed, setCollapsed] = useState(false)

  /**
   * Navigation links configuration
   * Each link includes:
   * - name: Display text
   * - path: Route path
   * - icon: React icon component
   */

  /**
   * Handles navigation to the specified path
   * @param {string} path - The path to navigate to
   */

  return (
    <aside
      className={cn(
        'flex flex-col bg-white h-full border-r-1 border-[#E5E7EB] transition-all duration-150 ease-in-out',
        isSidebarCollapsed ? 'w-18 ' : 'w-70 items-center',
      )}
    >
      {!isSidebarCollapsed ? (
        // Expanded Sidebar
        <div className=" relative flex flex-col w-full gap-6 h-full ">
          {/* Logo and Title Section */}
          <CompanyProfile
            name="Business Name"
            collapsed={isSidebarCollapsed}
            setCollapsed={setCollapsed}
          />

          {/* Navigation Links */}
          <div className="flex flex-col px-4 gap-4">
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
            <div className="flex flex-col absolute bottom-0 w-full left-0 px-4 gap-4 mb-4">
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
                className="flex items-center gap-3 text-base font-medium transition-all px-3 py-1 bg-[#E9F1FD] w-full leading-8 border-1 border-[#5BA4FF] rounded-md"
                style={{
                  boxShadow: 'inset 0 2px 10px rgba(37, 99, 235, 0.15)',
                }}
              >
                <ArrowUpRight className="bg-[#2672EF] text-white rounded-sm h-6 w-6" />
                <div className="font-normal">Upgrade Plan</div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Collapsed Sidebar
        <div className="flex z-[20] md:z-[10] flex-col gap-6 h-full relative items-center p-4">
          <div className="flex justify-center w-full gap-6">
            <div className="h-8 w-8 rounded-[10px] bg-gradient-to-r from-[#00A6F4] to-[#155DFC] text-white flex items-center justify-center font-medium text-sm">
              BP
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 w-full">
            <ChevronRight
              className="w-6 h-6 text-[#6B7280] cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => setCollapsed(false)}
            />

            {/* Navigation Icons Only */}

            {navLinks.slice(0, 4).map((link) => (
              <NavLinksMobile key={link.name} {...link} />
            ))}
          </div>

          {/* Separator */}
          <div className="border-t-2 border-gray-200 w-full" />

          <div className="flex flex-col gap-8 items-center  w-full ">
            {/* Remaining Navigation Links */}
            {navLinks.slice(4, 5).map((link) => (
              <NavLinksMobile key={link.name} {...link} />
            ))}
          </div>

          {/* Separator */}
          <div className="border-t-2 border-gray-200 w-full" />

          <div className="flex flex-col absolute bottom-0 w-full   px-4 gap-8 mb-4">
            {/* Remaining Bottom Links */}
            <div className="flex flex-col gap-8  items-center ">
              {navLinks.slice(5).map((link) => (
                <NavLinksMobile key={link.name} {...link} />
              ))}
            </div>
            {/* Separator */}
            <div className="border-t-2 border-gray-200 w-full" />

            <button className="flex justify-center items-center">
              <ArrowUpRight className="bg-[#2672EF] text-white rounded-sm h-6.5 w-6.5 " />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}

export default SidebarDesktop
