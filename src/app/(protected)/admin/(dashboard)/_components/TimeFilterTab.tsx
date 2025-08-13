import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import { AppDispatch, RootState } from '@/store/store' // Adjust path
import { useDispatch, useSelector } from 'react-redux'
import { setActiveFilter } from '@/store/slices/dashboardSlice' // Adjust path
import { DashboardFilterOption } from '../_types/dashboard'

interface TimeFilterTabsProps {
  options?: DashboardFilterOption[]
  className?: string
}

const defaultOptions: DashboardFilterOption[] = [
  // Your dashboardTabOptions here, or import them
  {
    value: 'today',
    label: 'Today',
    textColor: '#FF5733',
  },
  {
    value: 'this-week',
    label: 'This week',
    textColor: '#33FF57',
  },
  {
    value: 'this-month',
    label: 'This month',
    textColor: '#3357FF',
  },
  {
    value: 'this-year',
    label: 'This year',
    textColor: '#FF33A1',
  },
]

const TimeFilterTabs: React.FC<TimeFilterTabsProps> = ({
  options = defaultOptions,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { activeFilter } = useSelector((state: RootState) => state.dashboard)

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-[9px] h-9 w-fit px-0.5 bg-[#E5E7EB]',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = activeFilter === option.value

        return (
          <Button
            key={option.value}
            size="sm"
            variant={isActive ? 'cardActive' : 'hover'}
            onClick={() =>
              dispatch(setActiveFilter({ activeFilter: option.value }))
            }
            className={cn(
              'text-sm px-2 h-8 cursor-pointer font-normal rounded-[8px] ',
              isActive && `text-[#4F7CFF] font-medium shadow`,
            )}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}

export default TimeFilterTabs
