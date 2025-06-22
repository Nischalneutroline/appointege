import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import { Grid2x2, List, LayoutGrid } from 'lucide-react'
import { AppDispatch, RootState } from '../../../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setViewMode } from '@/store/slices/viewSlice'

export type ViewType = 'card' | 'list' | 'grid'

interface ViewOption {
  value: ViewType
  label: string
  icon: React.ReactNode
}

interface ViewTabsProps {
  viewMode: ViewType
  setViewMode: (viewMode: ViewType) => void
  options?: ViewOption[]
  className?: string
}

const defaultOptions: ViewOption[] = [
  {
    value: 'card',
    label: 'Card',
    icon: <Grid2x2 size={16} strokeWidth={2} />,
  },
  { value: 'list', label: 'List', icon: <List size={16} strokeWidth={2} /> },
  {
    value: 'grid',
    label: 'Grid',
    icon: <LayoutGrid size={16} strokeWidth={2} />,
  },
]

const ViewTabs = ({ options = defaultOptions, className }: ViewTabsProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { viewMode } = useSelector((state: RootState) => state.view)
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-[8px] h-9 px-0.5',
        className,
      )}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={viewMode === option.value ? 'cardActive' : 'hover'}
          onClick={() => dispatch(setViewMode({ viewMode: option.value }))}
          className={cn(
            'text-sm px-2 h-8 cursor-pointer font-normal rounded-[6px]',
            viewMode === option.value && 'text-[#2563EB]',
          )}
          icon={option.icon}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export default ViewTabs
