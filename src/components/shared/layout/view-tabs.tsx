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
  { value: 'card', label: 'Card', icon: <Grid2x2 size={16} /> },
  { value: 'list', label: 'List', icon: <List size={16} /> },
  { value: 'grid', label: 'Grid', icon: <LayoutGrid size={16} /> },
]

const ViewTabs = ({
  viewMode,
  setViewMode,
  options = defaultOptions,
  className,
}: ViewTabsProps) => {
  return (
    <div
      className={cn(
        'flex items-center bg-[#E5E7EB]  p-0.5  gap-0.5 rounded-lg',
        className,
      )}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={'ghost'}
          onClick={() => setViewMode(option.value)}
          className={cn(
            'text-sm text-[#6B7280] px-4 h-10  cursor-pointer rounded-[9px] hover:text-[#4F7CFF] hover:bg-white',
            viewMode === option.value && 'text-[#4F7CFF] bg-white',
          )}
        >
          <div className="flex items-center gap-1">
            {option.icon}
            {option.label}
          </div>
        </Button>
      ))}
    </div>
  )
}

export default ViewTabs
