// 'use client'

// // External Libraries
// import React, { useState } from 'react'

// import { cn } from '@/lib/utils'

// // Icons
// import {
//   Settings,
//   Bell,
//   ChevronRight,
//   LayoutDashboard,
//   Calendar,
//   UsersRound,
//   Wrench,
//   CircleHelp,
//   SquareArrowUpRight,
//   ArrowUpRight,
// } from 'lucide-react'
// import { NavLinks, NavLinksMobile } from './nav-links'
// import CompanyProfile from '../company-profile'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/store/store'
// import { toggleDesktopNav } from '@/store/slices/navSlice'

// export const navLinks = [
//   { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard  },
//   {
//     name: 'Appointments',
//     path: '/admin/appointment',
//     icon: <Calendar ,
//   },
//   {
//     name: 'Customers',
//     path: '/admin/customer',
//     icon: <UsersRound ,
//   },
//   {
//     name: 'Services',
//     path: '/admin/service',
//     icon: <Wrench ,
//   },
//   {
//     name: 'Business Settings',
//     path: '/admin/settings',
//     icon: <Settings ,
//   },
//   {
//     name: 'Supports',
//     path: '/admin/support',
//     icon: <CircleHelp ,
//   },
//   {
//     name: 'Reminders',
//     path: '/admin/reminders',
//     icon: <Bell ,
//   },
// ]

// /**
//  * SidebarDesktop Component
//  *
//  * A responsive sidebar component that can be toggled between collapsed and expanded states.
//  * Displays navigation links with icons and handles navigation between different admin sections.
//  */
// const SidebarDesktop = () => {
//   // Hooks

//   const { desktopNavCollapse } = useSelector((state: RootState) => state.nav)
//   const dispatch = useDispatch()

//   /**
//    * Navigation links configuration
//    * Each link includes:
//    * - name: Display text
//    * - path: Route path
//    * - icon: React icon component
//    */

//   /**
//    * Handles navigation to the specified path
//    * @param {string} path - The path to navigate to
//    */

//   return (
//     <aside
//       className={cn(
//         'flex flex-col bg-white h-full border-r-1 border-[#E5E7EB] transition-all duration-150 ease-in-out',
//         desktopNavCollapse ? 'w-18 ' : 'w-70 items-center',
//       )}
//     >
//       {!desktopNavCollapse ? (
//         // Expanded Sidebar
//         <div className=" relative flex flex-col w-full gap-6 h-full ">
//           {/* Logo and Title Section */}
//           <CompanyProfile
//             name="Business Name"
//             setCollapsed={() => dispatch(toggleDesktopNav())}
//           />

//           {/* Navigation Links */}
//           <div className="flex flex-col px-4 gap-4">
//             <div className="flex flex-col gap-8 px-4">
//               {navLinks.slice(0, 4).map((link) => (
//                 <NavLinks key={link.name} {...link} />
//               ))}
//             </div>
//             {/* Separator */}
//             <div className="border-t-2 border-gray-200 w-full" />
//             {/* Remaining Navigation Links */}
//             <div className="flex px-4">
//               {navLinks.slice(4, 5).map((link) => (
//                 <NavLinks key={link.name} {...link} />
//               ))}
//             </div>
//             {/* Lower Nav Links */}
//             <div className="flex flex-col absolute bottom-0 w-full left-0 px-4 gap-4 mb-4">
//               {/* Separator */}
//               <div className="border-t-2 border-gray-200 w-full" />

//               {/* Remaining Bottom Links */}
//               <div className="flex flex-col gap-8 px-4">
//                 {navLinks.slice(5).map((link) => (
//                   <NavLinks key={link.name} {...link} />
//                 ))}
//               </div>
//               {/* Separator */}
//               <div className="border-t-2 border-gray-200 w-full" />

//               <button
//                 className="flex items-center gap-3 text-base font-medium transition-all px-3 py-1 bg-[#E9F1FD] w-full leading-8 border-1 border-[#5BA4FF] rounded-md"
//                 style={{
//                   boxShadow: 'inset 0 2px 10px rgba(37, 99, 235, 0.15)',
//                 }}
//               >
//                 <ArrowUpRight className="bg-[#2672EF] text-white rounded-sm h-6 w-6" />
//                 <div className="font-normal">Upgrade Plan</div>
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // Collapsed Sidebar
//         <div className="flex z-[20] md:z-[10] flex-col gap-6 h-full relative items-center p-4">
//           <div className="flex justify-center w-full gap-6">
//             <div className="h-8 w-8 rounded-[10px] bg-gradient-to-r from-[#00A6F4] to-[#155DFC] text-white flex items-center justify-center font-medium text-sm">
//               BP
//             </div>
//           </div>

//           <div className="flex flex-col items-center gap-8 w-full">
//             <ChevronRight
//               className="w-6 h-6 text-[#6B7280] cursor-pointer hover:text-blue-700 transition-colors"
//               onClick={() => dispatch(toggleDesktopNav())}
//             />

//             {/* Navigation Icons Only */}

//             {navLinks.slice(0, 4).map((link) => (
//               <NavLinksMobile key={link.name} {...link} />
//             ))}
//           </div>

//           {/* Separator */}
//           <div className="border-t-2 border-gray-200 w-full" />

//           <div className="flex flex-col gap-8 items-center  w-full ">
//             {/* Remaining Navigation Links */}
//             {navLinks.slice(4, 5).map((link) => (
//               <NavLinksMobile key={link.name} {...link} />
//             ))}
//           </div>

//           {/* Separator */}
//           <div className="border-t-2 border-gray-200 w-full" />

//           <div className="flex flex-col absolute bottom-0 w-full   px-4 gap-8 mb-4">
//             {/* Remaining Bottom Links */}
//             <div className="flex flex-col gap-8  items-center ">
//               {navLinks.slice(5).map((link) => (
//                 <NavLinksMobile key={link.name} {...link} />
//               ))}
//             </div>
//             {/* Separator */}
//             <div className="border-t-2 border-gray-200 w-full" />

//             <button className="flex justify-center items-center">
//               <ArrowUpRight className="bg-[#2672EF] text-white rounded-sm h-6.5 w-6.5 " />
//             </button>
//           </div>
//         </div>
//       )}
//     </aside>
//   )
// }

// export default SidebarDesktop

// 'use client'

// // External Libraries
// import React from 'react'
// import { cn } from '@/lib/utils'
// import {
//   Settings,
//   Bell,
//   ChevronRight,
//   LayoutDashboard,
//   Calendar,
//   UsersRound,
//   Wrench,
//   CircleHelp,
//   SquareArrowUpRight,
//   ArrowUpRight,
// } from 'lucide-react'
// import CompanyProfile from '../company-profile'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/store/store'
// import { toggleDesktopNav } from '@/store/slices/navSlice'
// import { usePathname, useRouter } from 'next/navigation'

// export const navLinks = [
//   { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard /> },
//   {
//     name: 'Appointments',
//     path: '/admin/appointment',
//     icon: <Calendar />,
//   },
//   {
//     name: 'Customers',
//     path: '/admin/customer',
//     icon: <UsersRound />,
//   },
//   { name: 'Services', path: '/admin/service', icon: <Wrench /> },
//   {
//     name: 'Business Settings',
//     path: '/admin/settings',
//     icon: <Settings />,
//   },
//   { name: 'Supports', path: '/admin/support', icon: <CircleHelp /> },
//   { name: 'Reminders', path: '/admin/reminders', icon: <Bell /> },
// ]

// const SidebarDesktop = () => {
//   const { desktopNavCollapse } = useSelector((state: RootState) => state.nav)
//   const dispatch = useDispatch()
//   const router = useRouter()

//   // check the pathname and set is active in nav link item for highlighting
//   const pathname = usePathname()

//   // handle nav click
//   const handleNavClick = (link: string) => {
//     router.push(link)
//   }
//   return (
//     <aside
//       className={cn(
//         'flex flex-col p-3 bg-white h-full border-r border-[#E5E7EB] transition-all duration-300 ease-in-out',
//         desktopNavCollapse ? 'w-16' : 'w-70',
//       )}
//     >
//       {/* Logo and Title Section */}
//       <div className=" relative flex items-center justify-between py-4 px-1">
//         <div className="flex items-center gap-3 ">
//           <div className="h-8 w-8 rounded-[10px] bg-gradient-to-r from-[#00A6F4] to-[#155DFC] text-white flex items-center justify-center font-medium text-sm">
//             BP
//           </div>
//           <span
//             className={cn(
//               'whitespace-nowrap text-lg font-semibold transition-all duration-300 ease-in-out',
//               desktopNavCollapse ? 'opacity-0 w-0' : 'opacity-100 w-auto',
//             )}
//             style={{
//               overflow: 'hidden',
//               transitionProperty: 'opacity, width',
//             }}
//           >
//             Business Name
//           </span>
//           <ChevronRight
//             className={cn(
//               'absolute  w-6 h-6 text-[#6B7280] cursor-pointer hover:text-blue-700 transition-all duration-200 ease-in-out',
//               desktopNavCollapse
//                 ? 'rotate-0'
//                 : 'rotate-180  bg-gray-100 rounded-sm',
//               desktopNavCollapse ? '-right-4' : 'right-0',
//             )}
//             onClick={() => dispatch(toggleDesktopNav())}
//           />
//         </div>
//       </div>

//       {/* Navigation Section */}
//       <div className="flex flex-col justify-between w-full gap-6 h-full p-3">
//         {/* TOP: Navigation Links */}
//         <div>
//           <div className="">
//             {navLinks.slice(0, 4).map((link, index) => (
//               <div
//                 key={index}
//                 className={cn(
//                   'group flex items-center gap-3 py-3  rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-700 cursor-pointer transition-all duration-200',
//                   pathname === link.path && 'bg-gray-50 text-blue-700 font-medium',
//                 )}
//                 onClick={() => handleNavClick(link.path)}
//               >
//                 <span className="">{link.icon}</span>
//                 <span
//                   className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out  ${
//                     desktopNavCollapse ? 'opacity-0 w-0' : 'opacity-100 w-auto'
//                   }`}
//                   style={{
//                     overflow: 'hidden',
//                     transitionProperty: 'opacity, width',
//                   }}
//                 >
//                   {link.name}
//                 </span>
//               </div>
//             ))}

//             {/* Separator */}
//             <div className=" w-full" />

//             {/* Middle Navigation Link */}
//             <div className="">
//               {navLinks.slice(4, 5).map((link, index) => (
//                 <div
//                   key={index}
//                   className={cn(
//                     'group flex items-center gap-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-700 cursor-pointer transition-all duration-200',
//                     pathname === link.path && 'bg-gray-50 text-blue-700 font-medium',
//                   )}
//                   onClick={() => handleNavClick(link.path)}
//                 >
//                   <span className="">{link.icon}</span>
//                   <span
//                     className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out  ${
//                       desktopNavCollapse
//                         ? 'opacity-0 w-0'
//                         : 'opacity-100 w-auto'
//                     }`}
//                     style={{
//                       overflow: 'hidden',
//                       transitionProperty: 'opacity, width',
//                     }}
//                   >
//                     {link.name}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         {/* BOTTOM: Navigation Links */}
//         <div>
//           {/* Separator */}
//           <div className="border-t-2 border-gray-200 w-full" />

//           {/* Bottom Navigation Links and Upgrade Button */}
//           <div className="">
//             {navLinks.slice(5).map((link, index) => (
//               <div
//                 key={index}
//                 className={cn(
//                   'group flex items-center gap-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-700 cursor-pointer transition-all duration-200',
//                   pathname === link.path && 'bg-gray-50 text-blue-700 font-medium',
//                 )}
//                 onClick={() => handleNavClick(link.path)}
//               >
//                 <span className="">{link.icon}</span>
//                 <span
//                   className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out  ${
//                     desktopNavCollapse ? 'opacity-0 w-0' : 'opacity-100 w-auto'
//                   }`}
//                   style={{
//                     overflow: 'hidden',
//                     transitionProperty: 'opacity, width',
//                   }}
//                 >
//                   {link.name}
//                 </span>
//               </div>
//             ))}
//           </div>
// <button
//   className={cn(
//     'flex items-center gap-3 text-base font-medium transition-all px-3 py-1 rounded-md',
//     desktopNavCollapse
//       ? 'justify-center bg-transparent w-full'
//       : 'bg-[#E9F1FD] border border-[#5BA4FF] w-full',
//     {
//       'shadow-[inset_0_2px_10px_rgba(37,99,235,0.15)]':
//         !desktopNavCollapse,
//     },
//   )}
// >
//   <ArrowUpRight
//     className={cn(
//       'bg-[#2672EF] text-white rounded-sm',
//       desktopNavCollapse ? 'h-6.5 w-6.5' : 'h-6 w-6',
//     )}
//   />
//   <span
//     className={cn(
//       'whitespace-nowrap font-normal transition-all duration-300 ease-in-out',
//       desktopNavCollapse ? 'opacity-0 w-0' : 'opacity-100 w-auto',
//     )}
//     style={{
//       overflow: 'hidden',
//       transitionProperty: 'opacity, width',
//     }}
//   >
//     Upgrade Plan
//   </span>
// </button>
//         </div>
//       </div>
//     </aside>
//   )
// }

// export default SidebarDesktop
'use client'
import React, { useState } from 'react'
import {
  House,
  CalendarDays,
  Users,
  HandPlatter,
  Settings,
  Bell,
  Headset,
  Calendar,
  LayoutDashboard,
  UsersRound,
  Wrench,
  CircleHelp,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

export const navLinks = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard /> },
  { name: 'Appointments', path: '/admin/appointment', icon: <Calendar /> },
  { name: 'Customers', path: '/admin/customer', icon: <UsersRound /> },
  { name: 'Services', path: '/admin/service', icon: <Wrench /> },
  {
    name: 'Business Settings',
    path: '/admin/business-settings',
    icon: <Settings />,
  },
  { name: 'Supports', path: '/admin/support', icon: <CircleHelp /> },
  { name: 'Reminders', path: '/admin/reminders', icon: <Bell /> },
]

const SidebarDesktop = () => {
  const router = useRouter()

  // Check the pathname and set is active in nav link item for highlighting
  const pathname = usePathname() || '/admin' // Default to '/admin' if pathname is undefined

  // Handle nav click
  const handleNavClick = (link: string) => {
    router.push(link)
  }

  const [isSidebarCollapsed, setCollapsed] = useState(false)

  return (
    <aside className="hidden lg:block">
      {/* Sidebar */}
      <div
        className={cn(
          `transition-all duration-300 ease-in-out flex flex-col justify-between shadow bg-white border-r border-[#E5E7EB] p-3 h-full overflow-hidden`,
          isSidebarCollapsed ? 'w-[80px]' : 'w-[250px]',
        )}
      >
        {/* Top - Logo and Title */}
        <div className="space-y-6">
          <div className="relative flex items-center justify-between">
            {/* Left side: Always show circle, show text only when expanded */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                CN
              </div>
              <span
                className={`whitespace-nowrap text-xl font-semibold transition-all duration-300 ease-in-out ${
                  isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}
                style={{
                  overflow: 'hidden',
                  transitionProperty: 'opacity, width',
                }}
              >
                Comany Name
              </span>
              <ChevronRight
                className={cn(
                  'absolute w-6 h-6 text-[#6B7280] cursor-pointer hover:text-blue-700 transition-all duration-200 ease-in-out',
                  isSidebarCollapsed
                    ? 'rotate-0'
                    : 'rotate-180 bg-gray-100 rounded-sm',
                  isSidebarCollapsed ? '-right-4' : 'right-0',
                )}
                onClick={() => setCollapsed(!isSidebarCollapsed)}
              />
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {navLinks.slice(0, 4).map((link, index) => (
              <div
                key={index}
                className={cn(
                  'active:scale-95 group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-700 cursor-pointer transition-all duration-200',
                  (pathname === link.path || (index === 0 && !pathname)) && // Default to Dashboard (index 0) if no pathname
                    'bg-gray-50 text-blue-700 font-medium',
                )}
                onClick={() => handleNavClick(link.path)}
              >
                <span className="">{link.icon}</span>
                <span
                  className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                  style={{
                    overflow: 'hidden',
                    transitionProperty: 'opacity, width',
                  }}
                >
                  {link.name}
                </span>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="border-t" />

          {/* Business Section */}
          <div className="space-y-2">
            {navLinks.slice(4, 5).map((link, index) => (
              <div
                key={index}
                className={cn(
                  'active:scale-95 group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-700 cursor-pointer transition-all duration-200',
                  pathname === link.path &&
                    'bg-gray-50 text-blue-700 font-medium',
                )}
                onClick={() => handleNavClick(link.path)}
              >
                <span>{link.icon}</span>
                <span
                  className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                  style={{
                    overflow: 'hidden',
                    transitionProperty: 'opacity, width',
                  }}
                >
                  {link.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="">
          <div className="border-t py-4">
            {navLinks.slice(5).map((link, index) => (
              <div
                key={index}
                className={cn(
                  'active:scale-95 group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-700 cursor-pointer transition-all duration-200',
                  pathname === link.path &&
                    'bg-gray-50 text-blue-700 font-medium',
                )}
                onClick={() => handleNavClick(link.path)}
              >
                <span>{link.icon}</span>
                <span
                  className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                  style={{
                    overflow: 'hidden',
                    transitionProperty: 'opacity, width',
                  }}
                >
                  {link.name}
                </span>
              </div>
            ))}
          </div>
          {/* Bottom: Upgrade Button */}
          <div className="border-t py-4">
            <div
              className={cn(
                'group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-700 cursor-pointer transition-all duration-200',
                !isSidebarCollapsed && 'border-[#5BA4FF] bg-[#E9F1FD]',
                pathname === 'admin/upgrade' && 'bg-gray-50 text-blue-700',
              )}
              onClick={() => handleNavClick('admin/upgrade')}
            >
              <span>
                <ArrowUpRight
                  className={cn(
                    'bg-[#2672EF] text-white rounded-sm ',
                    'h-6 w-6',
                  )}
                />
              </span>
              <span
                className={`whitespace-nowrap text-sm transition-all duration-300 ease-in-out ${
                  isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}
                style={{
                  overflow: 'hidden',
                  transitionProperty: 'opacity, width',
                }}
              >
                Upgrade Plan
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarDesktop
