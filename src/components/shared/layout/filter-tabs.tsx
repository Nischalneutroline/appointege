'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { RootState } from '@/store/store'
import {
  FaqFilterValue,
  setActiveFilter,
  TicketFilterValue,
} from '@/store/slices/supportSlice'

// Generic FilterOptionState to support different filter value types
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
  sliceName: 'appointment' | 'customer' | 'service' | 'support'
  onDispatch: (value: T) => any
  nested?: 'faq' | 'ticket'
  type?: string
}

// Add type for our selector return value

const FilterTabs = <T extends string>({
  label,
  value,
  background,
  border,
  sliceName,
  onDispatch,
  nested,
  type,
}: FilterTabsProps<T>) => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()

  // Get the correct active filter based on the slice and nested type
  const { activeFilter, counts, faq, ticket } = useSelector(
    (state: RootState) => {
      // For support FAQ
      if (sliceName === 'support' && nested === 'faq') {
        return {
          activeFilter: state.support.faq?.activeFilter || 'all',
          counts: state.support.faq?.counts || {
            all: 0,
            public: 0,
            private: 0,
          },
          faq: state.support.faq,
          ticket: state.support.ticket,
        }
      }
      // For support Ticket
      if (sliceName === 'support' && nested === 'ticket') {
        return {
          activeFilter: state.support.ticket?.activeFilter || 'all',
          counts: state.support.ticket?.counts || {
            all: 0,
            open: 0,
            pending: 0,
            resolved: 0,
            closed: 0,
          },
        }
      }

      // For other slice types
      try {
        const sliceState = state[sliceName as keyof RootState] as any
        if (!sliceState) {
          console.warn(`Slice '${sliceName}' not found in Redux state`)
          return { activeFilter: null, counts: {} }
        }

        return {
          activeFilter: sliceState.activeFilter,
          counts: sliceState.counts || {},
        }
      } catch (error) {
        console.error(`Error accessing slice '${sliceName}':`, error)
        return { activeFilter: null, counts: {} }
      }
    },
    (prev, next) => {
      // Only re-render if the active filter or counts have changed
      return (
        prev.activeFilter === next.activeFilter &&
        JSON.stringify(prev.counts) === JSON.stringify(next.counts)
      )
    },
  )

  // Debug logging
  // useEffect(() => {
  //   console.group(`FilterTabs [${label}]`)
  //   console.log('Props:', { label, value, nested, sliceName })
  //   console.log('Redux State:', {
  //     activeFilter,
  //     nestedTab,
  //     counts,
  //     faq,
  //     ticket,
  //   })
  // }, [
  //   label,
  //   value,
  //   nested,
  //   sliceName,
  //   activeFilter,
  //   nestedTab,
  //   counts,
  //   faq,
  //   ticket,
  // ])

  // Get count from the pre-calculated counts in the Redux slice
  const getCount = useCallback((): number => {
    try {
      // For FAQ
      if (nested === 'faq' && faq?.counts) {
        const count = faq.counts[value as keyof typeof faq.counts]
        if (typeof count === 'number') {
          return count
        }
      }

      // For Ticket
      if (nested === 'ticket' && counts && type) {
        const userType = type as 'user' | 'admin'
        const userCounts = counts[userType]

        if (userCounts) {
          // Try exact match first, then uppercase version
          const count =
            userCounts[value as keyof typeof userCounts] ||
            userCounts[
              (value as string).toUpperCase() as keyof typeof userCounts
            ]

          if (typeof count === 'number') {
            return count
          }
        }
      }

      // Fallback to root counts if available
      if (counts && typeof counts === 'object' && !nested) {
        const count = counts[value as keyof typeof counts]
        if (typeof count === 'number') {
          return count
        }
      }

      return 0
    } catch (error) {
      console.error('Error getting count:', error)
      return 0
    }
  }, [nested, value, counts, type, faq?.counts])

  // Determine if the current tab is active
  const isActive = activeFilter === value
  // Determine background color based on active and hover states
  const backgroundColor = isActive ? background : 'transparent'

  return (
    <div
      key={value}
      className={cn(
        'w-full md:w-22 text-sm font-normal px-2 py-2 flex justify-center items-center',
        'transition-all duration-300 cursor-pointer rounded-[8px] active:scale-95',
        isActive
          ? 'text-gray-700'
          : 'text-gray-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50',
        {
          'bg-opacity-100': isActive,
          'hover:bg-opacity-90': isActive,
          'border-opacity-100': isActive,
        },
      )}
      style={{
        backgroundColor: backgroundColor,
        border: isActive ? `1px solid ${border}` : '1px solid transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onDispatch(value)
      }}
    >
      <div className="flex items-center gap-2 ">
        <span>{label}</span>
        <div className="md:hidden">
          <div className="">
            <span
              className={cn(
                'flex justify-center items-center rounded-full size-5 text-xs',
                'translate-y-1 bg-blue-600 text-white',
              )}
            >
              {getCount()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterTabs
