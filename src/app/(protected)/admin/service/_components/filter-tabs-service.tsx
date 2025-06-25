import { FilterServiceState } from '@/app/(protected)/admin/service/_data/data'

import { cn } from '@/lib/utils'

import React, { useState } from 'react'
import { ServiceValue } from '../_data/data'
import { Service } from '../_types/service'

interface FilterTabsProps {
  option: FilterServiceState
  activeFilter: string
  setSelectedData: (data: Service[]) => void
  setActiveFilter: (filter: ServiceValue) => void
}

const FilterTabs = ({
  option,
  activeFilter,
  setSelectedData,
  setActiveFilter,
}: FilterTabsProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const isActive = activeFilter === option.value
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
        backgroundColor: backgroundColor,

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
