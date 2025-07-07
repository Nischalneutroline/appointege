import { cn } from '@/lib/utils'
import React from 'react'

interface ViewItemProps {
  title: string
  value: string
  icon: React.ReactNode
  bgColor: string
  textColor: string
  className?: string
}

const ViewItem = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
  className,
}: ViewItemProps) => {
  return (
    <div className={cn('flex gap-3 items-center', className)}>
      <div
        className={`w-8 h-8 rounded-sm flex items-center justify-center`}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm font-normal">{value}</div>
      </div>
    </div>
  )
}

export default ViewItem
