'use client'

// app/(admin)/appointments/layout.tsx
import Heading from '@/components/admin/shared/heading'

import { useState } from 'react'

import CreateButton from '@/components/shared/create-action-button'

import ViewTabs from '@/components/shared/layout/view-tabs'
import LayoutCards from '@/components/shared/layout/layout-cards'

import NewAppoinment from '../appointment/_component/new-appoinment'
import { filterCustomerOptions } from '../appointment/_data/data'
import { openAppointmentCreateForm } from '@/store/slices/appointmentSlice'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { closeAppointmentForm } from '@/store/slices/appointmentSlice'
import ViewAppointment from '../appointment/_component/view/view-appointment'
import DeleteAppointment from '../appointment/_component/delete-appointment'

const AppointmentLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card')

  const { isFormOpen, formMode, currentAppointment } = useSelector(
    (state: RootState) => state.appointment,
  )

  return (
    <main className="flex flex-col gap-4 ">
      <div className="flex flex-col  justify-between gap-4">
        <div className="w-full flex  flex-col lg:flex-row  lg:items-center lg:justify-between gap-2 lg:gap-0">
          <Heading
            title="Customer"
            description="Manage and update your customers effortlessly."
          />
          <div className="flex flex-row gap-2 md:gap-0 justify-between  lg:gap-3 h-10">
            {/* View Tabs for Card List Grid */}
            <div className="flex items-center bg-[#E5E7EB] w-fit  rounded-[10px] p-0.5">
              <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Add Appointment Button */}
            <div className="">
              <CreateButton
                label="New Customer"
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
          {filterCustomerOptions.map((option) => (
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
          open={isFormOpen  }
          onChange={() => dispatch(closeAppointmentForm())}
        />
      )}
    </main>
  )
}

export default AppointmentLayout
