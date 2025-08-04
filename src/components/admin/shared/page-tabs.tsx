'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

// Use a generic type T constrained to string to support any string-based enum or union
interface PageTabsProps<T extends string> {
  isReminder?: boolean
  activeTab: T
  onTabChange: (tab: T) => void
  customTabs: T[]
  className?: string
}

const PageTabs = <T extends string>({
  activeTab,
  onTabChange,
  customTabs,
  className,
}: PageTabsProps<T>) => {
  const tabs = customTabs

  return (
    <div className={cn('space-y-2 w-full', className)}>
      <ToggleGroup
        type="single"
        value={activeTab}
        className="gap-2 flex w-full" // Remove gap and ensure full width
        onValueChange={(value) => {
          if (value) onTabChange(value as T) // Cast value to T
        }}
      >
        {tabs.map((tab) => (
          <ToggleGroupItem
            key={tab}
            value={tab}
            className={cn(
              'flex-1 capitalize text-lg md:text-xl', // Make each item take equal space
              // 'w-1/2', // Explicitly 50% for two tabs
              'data-[state=on]:bg-[#2563EB] data-[state=on]:border-none data-[state=on]:text-white rounded-md  py-1 md:h-[40px]  lg:h-[56px] px-4',
            )}
            style={{
              boxShadow:
                activeTab === tab
                  ? '0 4px 4px 0 rgba(255, 255, 255, 0.25) inset'
                  : '',
            }}
          >
            {tab}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export default PageTabs
