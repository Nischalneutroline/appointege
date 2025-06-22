import { useSidebar } from '@/context/sidebar-context'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toggleMobileNav } from '@/store/slices/navSlice'
import { useDispatch } from 'react-redux'

interface NavLinksProps {
  name: string
  path: string
  icon: React.ReactNode
  className?: string
  onClick?: () => void
}

export const NavLinks = (props: NavLinksProps) => {
  const { name, path, icon, className, onClick } = props
  const pathname = usePathname()
  const router = useRouter()
  const handleNavClick = (path: string) => {
    router.push(path)
    onClick?.()
  }
  return (
    <Link
      href={path}
      key={name}
      onClick={() => handleNavClick(path)}
      className={cn(
        'flex items-center gap-3 text-lg font-medium transition-all cursor-pointer hover:scale-98',
        pathname === path
          ? 'text-[#3B5FCC]'
          : 'text-[#6B7280] hover:text-[#3B5FCC]',
        className,
      )}
    >
      <div className="font-medium">{icon}</div>
      <span className="font-medium text-sm">{name}</span>
    </Link>
  )
}

export const NavLinksMobile = (props: NavLinksProps) => {
  const { name, path, icon } = props

  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const handleNavClick = (path: string) => {
    router.push(path)
    dispatch(toggleMobileNav())
  }
  return (
    <div
      key={name}
      onClick={() => handleNavClick(path)}
      className={cn(
        'flex items-center gap-5 text-lg font-medium transition-all cursor-pointer ',
        pathname === path
          ? 'text-[#3B5FCC]'
          : 'text-[#6B7280] hover:text-[#3B5FCC]',
      )}
    >
      <div className="font-medium">{icon}</div>
    </div>
  )
}
export const NavLinksMobileSidebar = (props: NavLinksProps) => {
  const { name, path, icon } = props
  const dispatch = useDispatch()
  const pathname = usePathname()
  const router = useRouter()
  return (
    <Link
      href={path}
      key={name}
      onClick={() => {
        router.push(path)
        dispatch(toggleMobileNav())
      }}
      className={cn(
        'flex items-center gap-5 text-lg font-medium transition-all cursor-pointer ',
        pathname === path
          ? 'text-[#3B5FCC]'
          : 'text-[#6B7280] hover:text-[#3B5FCC]',
      )}
    >
      <div className="font-medium">{icon}</div>
      <span className="font-medium text-sm">{name}</span>
    </Link>
  )
}
