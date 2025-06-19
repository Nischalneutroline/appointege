'use client'

// app/(admin)/appointments/layout.tsx
import Heading from '@/components/admin/shared/heading'

import { useState } from 'react'

import CreateButton from '@/components/shared/create-action-button'
import { filterOptions } from './_data/data'
import ViewTabs from '@/components/shared/layout/view-tabs'
import LayoutCards from '@/components/shared/layout/layout-cards'
import { ViewModeContext } from '@/hooks/useViewMode'

const AppointmentLayout = ({ children }: { children: React.ReactNode }) => {
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card')

  return (
    <main className="flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col  justify-between gap-4">
        <div className="w-full flex  flex-col lg:flex-row  lg:items-center lg:justify-between gap-2 lg:gap-0">
          <Heading
            title="Appointments"
            description="Manage and schedule your appointment effortlessly."
          />
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between  lg:gap-3 h-10">
            {/* View Tabs for Card List Grid */}
            <div className="flex items-center bg-[#E5E7EB] w-fit  rounded-[10px] p-0.5">
              <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Add Appointment Button */}
            <div className="">
              <CreateButton label="New Appointment" onClick={() => {}} />
            </div>
          </div>
        </div>
        {/* Cards in layout */}
        {/* <div className="flex gap-4 w-full">
          {filterOptions.map((option) => (
            <LayoutCards key={option.value} option={option} />
          ))}
        </div> */}
        <div className="mt-9 md:mt-0 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filterOptions.map((option) => (
            <LayoutCards key={option.value} option={option} />
          ))}
        </div>
      </div>

      <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
        <div className="flex-1 h-full overflow-hidden ">{children}</div>
      </ViewModeContext.Provider>
    </main>
  )
}

export default AppointmentLayout
