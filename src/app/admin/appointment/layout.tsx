'use client'

// app/(admin)/appointments/layout.tsx
import Heading from '@/components/admin/shared/heading'
import {
  CalendarDays,
  CircleCheckBig,
  Clock,
  Grid2x2,
  Grid3x3,
  List,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import CreateButton from '@/components/shared/create-action-button'
import { filterOptions } from './_data/data'
import ViewTabs from '@/components/shared/layout/view-tabs'
import LayoutCards from '@/components/shared/layout/layout-cards'
import NewAppoinment from './_component/new-appoinment'

const AppointmentLayout = ({ children }: { children: React.ReactNode }) => {
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card')
  const [isDialogOpen, setIsDialogOpen] = useState(false) // State for dialog

  return (
    <main className="flex flex-col gap-4 ">
      <div className="flex flex-col  justify-between gap-4">
        <div className="flex items-center justify-between ">
          <Heading
            title="Appointments"
            description="Manage and schedule your appointment effortlessly."
          />
          <div className="flex  gap-3 ">
            {/* View Tabs for Card List Grid */}
            <div className="">
              <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Add Appointment Button */}
            <div>
              <CreateButton
                label="New Appointment"
                onClick={() => setIsDialogOpen(true)}
              />
            </div>
          </div>
        </div>
        {/* Cards in layout */}
        <div className="flex gap-4 w-full">
          {filterOptions.map((option) => (
            <LayoutCards key={option.value} option={option} />
          ))}
        </div>
      </div>

      <div className="flex-1 h-full overflow-auto ">{children}</div>
      {/* Include NewAppoinment Dialog */}
      <NewAppoinment open={isDialogOpen} onChange={setIsDialogOpen} />
    </main>
  )
}

export default AppointmentLayout
