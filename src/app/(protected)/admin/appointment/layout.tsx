// 'use client'

// // app/(admin)/appointments/layout.tsx
// import Heading from '@/components/admin/shared/heading'

// import { useEffect, useState } from 'react'

// import CreateButton from '@/components/shared/create-action-button'
// import { filterOptions } from './_data/data'
// import ViewTabs from '@/components/shared/layout/view-tabs'
// import LayoutCards from '@/components/shared/layout/layout-cards'
// import NewAppoinment from './_component/new-appoinment'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/store/store'
// import ViewAppointment from './_component/view/view-appointment'
// import {
//   closeAppointmentForm,
//   fetchAppointments,
//   openAppointmentCreateForm,
// } from '@/store/slices/appointmentSlice'
// import { useDispatch } from 'react-redux'
// import DeleteAppointment from './_component/delete-appointment'

// const AppointmentLayout = ({ children }: { children: React.ReactNode }) => {
//   const dispatch = useDispatch()
// const { isFormOpen, appoinmentFormMode, currentAppointment, appointments } =
//   useSelector((state: RootState) => state.appointment)
//   const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card')

//   const [isViewOpen, setIsViewOpen] = useState(false)

//   useEffect(() => {
//     fetchAppointments()
//   }, [appointments])

//   return (
//     <main className="flex flex-col gap-4 ">
//       <div className="flex flex-col  justify-between gap-4">
//         <div className="w-full flex  flex-col lg:flex-row  lg:items-center lg:justify-between gap-2 lg:gap-0">
//           <Heading
//             title="Appointments"
//             description="Manage and schedule your appointment effortlessly."
//           />
//           <div className="flex flex-row gap-2 md:gap-0 justify-between  lg:gap-3 h-10">
//             {/* View Tabs for Card List Grid */}
//             <div className="flex items-center bg-[#E5E7EB] w-fit  rounded-[10px] p-0.5">
//               <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
//             </div>

//             {/* Add Appointment Button */}
//             <div className="">
//               <CreateButton
//                 label="New Appointment"
//                 onClick={() => {
//                   dispatch(openAppointmentCreateForm())
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//         {/* Cards in layout */}
//         {/* <div className="flex gap-4 w-full">
//           {filterOptions.map((option) => (
//             <LayoutCards key={option.value} option={option} />
//           ))}
//         </div> */}
//         <div className=" hidden mt-9 md:mt-0 lg:grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
//           {filterOptions.map((option) => (
//             <LayoutCards key={option.value} option={option} />
//           ))}
//         </div>
//       </div>

//       <div className="flex-1 h-full overflow-visible">{children}</div>

//       {isFormOpen && (appoinmentFormMode === 'create' || appoinmentFormMode === 'edit') && (
//         <NewAppoinment
//           open={isFormOpen}
//           onChange={() => dispatch(closeAppointmentForm())}
//         />
//       )}
//       {isFormOpen && appoinmentFormMode === 'view' && currentAppointment && (
//         <ViewAppointment
//           open={isFormOpen}
//           onChange={() => dispatch(closeAppointmentForm())}
//         />
//       )}
//       {isFormOpen && appoinmentFormMode === 'delete' && currentAppointment && (
//         <DeleteAppointment
//           open={isFormOpen}
//           onChange={() => dispatch(closeAppointmentForm())}
//         />
//       )}
//     </main>
//   )
// }

// export default AppointmentLayout
'use client'

import Heading from '@/components/admin/shared/heading'
import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import ViewTabs from '@/components/shared/layout/view-tabs'
import LayoutCards from '@/components/shared/layout/layout-cards'
import NewAppoinment from './_component/new-appoinment'
import ViewAppointment from './_component/view/view-appointment'
import DeleteModal from './_component/delete-appointment'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  closeAppointmentForm,
  openAppointmentCreateForm,
} from '@/store/slices/appointmentSlice'
import { DEFAULT_APPOINTMENT_FILTERS_VALUES } from './_types/appointment'
import {
  CalendarDays,
  Clock,
  CircleCheckBig,
  Delete,
  PhoneMissed,
  Users,
} from 'lucide-react'

// Map icon names to LucideIcon components
const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  CalendarDays,
  Clock,
  CircleCheckBig,
  Delete,
  PhoneMissed,
  Users,
}

const AppointmentLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    isFormOpen,
    isLoading,
    appoinmentFormMode,
    currentAppointment,
    filterOptions,
    counts,
    activeFilters,
  } = useSelector((state: RootState) => state.appointment)

  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [buttonName, setButtonName] = useState('New Appointment')

  // --- Combine filterOptions with counts and map icon strings to components
  const enrichedFilterOptions = useMemo(() => {
    return filterOptions
      .filter((option) =>
        DEFAULT_APPOINTMENT_FILTERS_VALUES.includes(option.value),
      )
      .map((option) => {
        const IconComponent = iconMap[option.icon] || CalendarDays
        return {
          ...option,
          count: counts[option.value],
          icon: (
            <IconComponent size={24} className={`text-[${option.textColor}]`} />
          ),
        }
      })
  }, [filterOptions, counts])

  // Adjust button name based on screen size
  useEffect(() => {
    const handleResize = () => {
      setButtonName(window.innerWidth < 500 ? 'New' : 'New Appointment')
    }
    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="flex flex-col justify-between gap-4">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
          <Heading
            title="Appointments"
            description="Manage and schedule your appointment effortlessly."
          />
          <div className="flex flex-row gap-2 md:gap-0 justify-between items-center lg:gap-3 h-10">
            <div className="flex items-center bg-[#E5E7EB] w-fit h-9 py-1 rounded-[8px]">
              <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
            </div>
            <div>
              <Button
                className="active:scale-95"
                onClick={() => dispatch(openAppointmentCreateForm())}
              >
                <span>
                  <Plus />
                </span>
                <span>{buttonName}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-4 min-w-[340px]">
          {enrichedFilterOptions.map((option) => (
            <LayoutCards key={option.value} option={option} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">{children}</div>

      {isFormOpen &&
        (appoinmentFormMode === 'create' || appoinmentFormMode === 'edit') && (
          <NewAppoinment
            open={isFormOpen}
            onChange={() => dispatch(closeAppointmentForm())}
          />
        )}
      {isFormOpen && appoinmentFormMode === 'view' && currentAppointment && (
        <ViewAppointment
          open={isFormOpen}
          onChange={() => dispatch(closeAppointmentForm())}
        />
      )}
      {isFormOpen && appoinmentFormMode === 'delete' && currentAppointment && (
        <DeleteModal
          open={isFormOpen}
          onChange={() => dispatch(closeAppointmentForm())}
          isLoading={isLoading}
        />
      )}
    </main>
  )
}

export default AppointmentLayout
