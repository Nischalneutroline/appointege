'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { RootState } from '@/store/store'

// Generic interface for filter options
export interface FilterOptionState<T extends string> {
  label: string
  value: T
  textColor: string
  border: string
  background: string
  icon: string
}

interface FilterTabsProps<T extends string> {
  label: string
  value: T
  background: string
  border: string
  sliceName: keyof RootState // Covers all slices
  onDispatch: (value: T) => any
}

const FilterTabs = <T extends string>({
  label,
  value,
  background,
  border,
  sliceName,
  onDispatch,
}: FilterTabsProps<T>) => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()
  const slice = useSelector((state: RootState) => state[sliceName]) as any

  const isActive = slice.activeFilter === value
  const backgroundColor = isActive
    ? background
    : isHovered
      ? 'oklch(96.7% 0.003 264.542)'
      : '#F8F9FA'
  const borderStyle = isActive ? `1px solid ${border}` : 'none'

  const count = slice.counts?.[value as keyof typeof slice.counts] ?? 0

  return (
    <div
      key={value}
      className={cn(
        `w-full md:w-22 text-sm font-normal px-2 py-2 flex justify-center items-center 
         transition-transform duration-300 cursor-pointer rounded-[8px] active:scale-95 hover:bg-slate-50/80 dark:hover:bg-slate-800/50
        `,
      )}
      style={{
        backgroundColor,
        border: borderStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        dispatch(onDispatch(value))
      }}
    >
      <div className="flex gap-1">
        {label}
        <span className="flex justify-center items-center md:hidden rounded-full bg-primary size-5 text-white">
          <div className={cn('text-sm', isActive && 'font-bold')}>{count}</div>
        </span>
      </div>
    </div>
  )
}

export default FilterTabs
