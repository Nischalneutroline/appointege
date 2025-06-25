
import { AppointmentFilterValue, FilterAppoinmentState } from '@/app/(protected)/admin/appointment/_data/data'

import { Appointment } from '@/app/(protected)/admin/appointment/_types/appointment'
import { cn } from '@/lib/utils'

import React, { useState } from 'react'

interface FilterTabsProps {
  option: FilterAppoinmentState
  activeFilter: string
  setSelectedData: (data: Appointment[]) => void
  setActiveFilter: (filter: AppointmentFilterValue) => void
}

const FilterTabs = ({
  option,
  activeFilter,
  setSelectedData,
  setActiveFilter,
}: FilterTabsProps) => {
  const [isHovered, setIsHovered] = useState(false)
  console.log('activeFilter', activeFilter)

  const isActive = activeFilter === option.label
  const backgroundColor = isActive
    ? option.background
    : isHovered
      ? 'oklch(96.7% 0.003 264.542)'
      : '#F8F9FA'

  const border = isActive ? `1px solid ${option.border}` : 'none'

  return (
    <div
      key={option.value}
      className={cn(
        `w-22 text-sm font-normal px-2 py-2 flex justify-center items-center 
         transition-transform duration-300 cursor-pointer rounded-[8px]  hover:bg-slate-50/80 dark:hover:bg-slate-800/50
         ${!isActive && 'hover:scale-105'}`,
      )}
      style={{
        backgroundColor,

        border,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setSelectedData(option.data)
        setActiveFilter(option.value)
      }}
    >
      {option.label === 'All' ? 'All' : option.label}
    </div>
  )
}

export default FilterTabs
