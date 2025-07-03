'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import {
  AppointmentFilterValue,
  FilterAppoinmentState,
} from '@/app/(protected)/admin/appointment/_data/data'
import { setActiveFilter } from '@/store/slices/appointmentSlice'
import { RootState } from '@/store/store'

interface FilterTabsProps {
  option: FilterAppoinmentState
}

const FilterTabs = ({ option }: FilterTabsProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()
  const { activeFilter, activeFilters } = useSelector(
    (state: RootState) => state.appointment,
  )

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
        `w-fit text-sm font-normal px-2 py-2 flex justify-center items-center 
         transition-transform duration-300 cursor-pointer rounded-[8px] active:scale-95 hover:bg-slate-50/80 dark:hover:bg-slate-800/50
        `,
      )}
      style={{
        backgroundColor: backgroundColor,
        border,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        dispatch(setActiveFilter(option.value))
      }}
    >
      <div className="flex gap-1">
        {option.label === 'All' ? 'All' : option.label}
        <span className="flex justify-center items-center md:hidden rounded-full bg-primary size-5 text-white">
          {option.count && (
            <div
              className={cn(
                'text-sm',
                option.value === activeFilter && 'font-bold',
              )}
            >
              {option.count}
            </div>
          )}
        </span>
      </div>
    </div>
  )
}

export default FilterTabs
