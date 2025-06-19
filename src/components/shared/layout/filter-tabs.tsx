import { FilterOption } from '@/app/admin/appointment/_data/data'
import { Appointment } from '@/data/appointment'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

interface FilterTabsProps {
  option: FilterOption
  activeFilter: string
  setSelectedData: (data: Appointment[]) => void
  setActiveFilter: (filter: string) => void
}

const FilterTabs = ({
  option,
  activeFilter,
  setSelectedData,
  setActiveFilter,
}: FilterTabsProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const isActive = activeFilter === option.label
  const backgroundColor = isActive
    ? option.background
    : isHovered
      ? option.background
      : undefined

  const border = isActive ? `1px solid ${option.border}` : 'none'

  return (
    <div
      key={option.value}
      className={cn(
        ` w-fit text-sm font-normal px-5 py-2  flex justify-center items-center 
         transition-transform duration-300 cursor-pointer rounded-[8px] gap-1.5
         ${!isActive && 'hover:scale-105 bg-[#F8F9FA]'}`,
      )}
      style={{
        backgroundColor,
        border,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setSelectedData(option.data)
        setActiveFilter(option.label)
      }}
    >
      <div>{option.label === 'All Appointments' ? 'All' : option.label}</div>
      <div className="lg:hidden text-[#6B7280] text-xs font-normal bottom-0 mt-1  ">
        ({option.data.length})
      </div>
    </div>
  )
}

export default FilterTabs
