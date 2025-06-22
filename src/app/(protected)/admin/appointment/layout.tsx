'use client'

// app/(admin)/appointments/layout.tsx
import Heading from '@/components/admin/shared/heading'

import { useState } from 'react'

import CreateButton from '@/components/shared/create-action-button'
import { filterOptions } from './_data/data'
import ViewTabs from '@/components/shared/layout/view-tabs'
import LayoutCards from '@/components/shared/layout/layout-cards'
import NewAppoinment from './_component/new-appoinment'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import ViewAppointment from './_component/view/view-appointment'
import {
  closeAppointmentForm,
  openAppointmentCreateForm,
} from '@/store/slices/appointmentSlice'
import { useDispatch } from 'react-redux'
import DeleteAppointment from './_component/delete-appointment'

const AppointmentLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const { isFormOpen, formMode, currentAppointment } = useSelector(
    (state: RootState) => state.appointment,
  )
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card')

  const [isViewOpen, setIsViewOpen] = useState(false)

  return (
    <main className="flex flex-col gap-4 ">
      <div className="flex flex-col  justify-between gap-4">
        <div className="w-full flex  flex-col lg:flex-row  lg:items-center lg:justify-between gap-2 lg:gap-0">
          <Heading
            title="Appointments"
            description="Manage and schedule your appointment effortlessly."
          />
          <div className="flex flex-row gap-2 md:gap-0 justify-between items-center  lg:gap-3 h-10">
            {/* View Tabs for Card List Grid */}
            <div className="flex items-center bg-[#E5E7EB] w-fit h-9 py-1  rounded-[8px]">
              <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Add Appointment Button */}
            <div className="">
              <CreateButton
                label="New Appointment"
                onClick={() => {
                  dispatch(openAppointmentCreateForm())
                }}
              />
            </div>
          </div>
        </div>
        {/* Cards in layout */}
        {/* <div className="flex gap-4 w-full">
          {filterOptions.map((option) => (
            <LayoutCards key={option.value} option={option} />
          ))}
        </div> */}
        <div className=" hidden mt-9 md:mt-0 lg:grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filterOptions.map((option) => (
            <LayoutCards key={option.value} option={option} />
          ))}
        </div>
      </div>

      <div className="flex-1 h-full overflow-visible">{children}</div>

      {isFormOpen && (formMode === 'create' || formMode === 'edit') && (
        <NewAppoinment
          open={isFormOpen}
          onChange={() => dispatch(closeAppointmentForm())}
        />
      )}
      {isFormOpen && formMode === 'view' && currentAppointment && (
        <ViewAppointment
          open={isFormOpen}
          onChange={() => dispatch(closeAppointmentForm())}
        />
      )}
      {isFormOpen && formMode === 'delete' && currentAppointment && (
        <DeleteAppointment
          open={isFormOpen}
          onChange={() => dispatch(closeAppointmentForm())}
        />
      )}
    </main>
  )
}

export default AppointmentLayout
