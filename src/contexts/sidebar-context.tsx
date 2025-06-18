'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type SidebarContextType = {
  isMobileOpen: boolean
  isDesktopCollapsed: boolean
  toggleMobileSidebar: () => void
  toggleDesktopSidebar: () => void
  closeMobileSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if the current view is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const toggleMobileSidebar = () => {
    if (!isMobile) return
    setIsMobileOpen((prev) => !prev)
  }

  const toggleDesktopSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev)
    } else {
      setIsDesktopCollapsed((prev) => !prev)
    }
  }

  const closeMobileSidebar = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false)
    }
  }

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        isDesktopCollapsed,
        toggleMobileSidebar,
        toggleDesktopSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
