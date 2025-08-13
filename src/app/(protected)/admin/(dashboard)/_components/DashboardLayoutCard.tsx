'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

interface DashboardLayoutCardProps {
  count: number
  label: string
  icon: React.ReactNode
  subText: string
  backgroundColor: string
  borderColor: string
  textColor: string
  isDown?: boolean // Optional prop to indicate if the count is down
}

const DashboardLayoutCard = ({
  count,
  label,
  icon,
  subText,
  backgroundColor,
  borderColor,
  textColor,
  isDown = false,
}: DashboardLayoutCardProps) => {
  const subTextColor = isDown ? 'text-red-600' : 'text-green-600'
  const subTextClass = `${subTextColor} text-xs font-light`

  return (
    <Card className="flex-1 gap-3   p-3 rounded-xl flex flex-col justify-between shadow-sm">
      {/* Top section */}
      <div className="space-y-1">
        {/* Count and icon section */}
        <div className="flex justify-between">
          <div className="text-2xl font-semibold">{count}</div>
          <div
            className="w-8 h-8 bg-white rounded-md flex items-center justify-center shadow"
            style={{ backgroundColor }}
          >
            {icon}
          </div>
        </div>

        {/* Text section */}
        <p
          className="text-sm font-medium text-stone-600"
          //  style={{ color: textColor }}
        >
          {label}
          {isDown}
        </p>
      </div>
      {/* Subtext section */}
      <div
        className={cn(
          'text-sm font-normal ',
          isDown ? 'text-[#b91021]' : 'text-[#10B981]',
        )}
      >
        {subText}
      </div>
    </Card>
  )
}

export default DashboardLayoutCard
