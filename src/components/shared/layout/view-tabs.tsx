import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import { Grid2x2, List, LayoutGrid } from 'lucide-react'

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
    icon: <Grid2x2 size={16} strokeWidth={1.8} />,
  },
  { value: 'list', label: 'List', icon: <List size={16} strokeWidth={1.8} /> },
  {
    value: 'grid',
    label: 'Grid',
    icon: <LayoutGrid size={16} strokeWidth={1.8} />,
  },
]

const ViewTabs = ({
  viewMode,
  setViewMode,
  options = defaultOptions,
  className,
}: ViewTabsProps) => {
  return (
    <div className={cn('flex items-center gap-1 rounded-lg', className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={viewMode === option.value ? 'cardActive' : 'ghost'}
          onClick={() => setViewMode(option.value)}
          className={cn(
            'text-sm px-4 h-9 text-[#6a7380] cursor-pointer font-normal rounded-[9px]',
            viewMode === option.value && 'text-black',
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
