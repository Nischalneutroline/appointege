import { cn } from '@/lib/utils'
import React from 'react'

const ColSpan = ({
  className,
  header,
  icon,
  children,
}: {
  className?: string
  header: string
  icon: React.ReactNode
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        ' flex gap-4 flex-col p-4 shadow rounded-md bg-white',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-[#2672EF]">{icon}</span>
        <h2 className="text-lg font-semibold">{header} </h2>
      </div>
      {children}
    </div>
  )
}

export default ColSpan
