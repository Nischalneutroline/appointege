'use client'

// app/(admin)/appointments/layout.tsx
import Heading from '@/components/admin/shared/heading'

import { useState } from 'react'

import CreateButton from '@/components/shared/create-action-button'

import ViewTabs from '@/components/shared/layout/view-tabs'
import LayoutCards from '@/components/shared/layout/layout-cards'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'

import {
  closeServiceForm,
  fetchServices,
  openServiceCreateForm,
} from '@/store/slices/serviceslice'
import { filterServiceOptions } from './_data/data'
import NewServiceForm from './_components/new-service'

import DeleteModal from '../appointment/_component/delete-appointment'

const ServiceLayout = ({ children }: { children: React.ReactNode }) => {
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card')

  const {
    isFormOpen,
    serviceFormMode,
    currentService,
    serviceOptions,
    services,
    isLoading,
  } = useSelector((state: RootState) => state.service)
  const dispatch = useDispatch<AppDispatch>()

  // useEffect(() => {
  //   console.log('Fetching services...')
  //   dispatch(fetchServices())
  // })

  // Filtered Customer
  // const filterOptions = filterServiceOptions(services)

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col  justify-between gap-4">
        <div className="w-full flex  flex-col lg:flex-row  lg:items-center lg:justify-between gap-2 lg:gap-0">
          <Heading
            title="Services"
            description="Manage and schedule your services effortlessly."
          />
          <div className="flex flex-row gap-2 md:gap-0 justify-between items-center lg:gap-3 h-10">
            {/* View Tabs for Card List Grid */}
            <div className="flex items-center bg-[#E5E7EB] w-fit h-9 py-1  rounded-[8px]">
              <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Add Appointment Button */}
            <div className="">
              <CreateButton
                label="New Services"
                onClick={() => dispatch(openServiceCreateForm())}
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
          {filterServiceOptions(services).map((option) => (
            <LayoutCards key={option.value} option={option} />
          ))}
        </div>
      </div>

      <div className="flex-1 h-full overflow-visible">{children}</div>

      {isFormOpen &&
        (serviceFormMode === 'create' || serviceFormMode === 'edit') && (
          <NewServiceForm
            open={isFormOpen}
            onChange={() => dispatch(closeServiceForm())}
          />
        )}
      {/* {isFormOpen && serviceFormMode === 'view' && currentService && (
        <ViewService
          open={isFormOpen}
          onChange={() => dispatch(closeAppointmentForm())}
        />
      )} */}
      {isFormOpen && serviceFormMode === 'delete' && currentService && (
        <DeleteModal
          open={isFormOpen}
          onChange={() => dispatch(closeServiceForm())}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

export default ServiceLayout
