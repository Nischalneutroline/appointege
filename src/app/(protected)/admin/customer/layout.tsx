// 'use client'

// // app/(admin)/appointments/layout.tsx
// import Heading from '@/components/admin/shared/heading'

// import { useState } from 'react'

// import CreateButton from '@/components/shared/create-action-button'

// import ViewTabs from '@/components/shared/layout/view-tabs'
// import LayoutCards from '@/components/shared/layout/layout-cards'

// import NewAppoinment from '../appointment/_component/new-appoinment'

// import { openAppointmentCreateForm } from '@/store/slices/appointmentSlice'
// import { useDispatch } from 'react-redux'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/store/store'
// import { closeAppointmentForm } from '@/store/slices/appointmentSlice'
// import ViewAppointment from '../appointment/_component/view/view-appointment'
// import DeleteAppointment from '../appointment/_component/delete-appointment'
// // import { useCustomerFilterOptions } from '../appointment/_data/data'

// import { filterCustomerOptions } from './_data/data'
// import DeleteModal from '../appointment/_component/delete-appointment'
// import NewCustomerForm from './_component/new-customer'
// import {
//   closeCustomerForm,
//   openCustomerCreateForm,
// } from '@/store/slices/customerSlice'

// const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
//   const dispatch = useDispatch()
//   const [viewMode, setViewMode] = useState<'card' | 'list' | 'grid'>('card')

//   // customers: User[]
//   // filteredCustomers: User[]
//   // isLoading: boolean
//   // isRefreshing: boolean
//   // hasFetched: boolean
//   // currentCustomer: User | null
//   // isFormOpen: boolean
//   // customerFormMode: 'create' | 'edit' | 'view' | 'delete' | null
//   // error: string | null
//   // message: string | null
//   // success: boolean
//   // activeFilter: 'all' | 'active' | 'inactive'

//   const {
//     isFormOpen,
//     customerFormMode,
//     currentCustomer,
//     filteredCustomers,
//     hasFetched,
//     customers,
//   } = useSelector((state: RootState) => state.customer)

//   // Filtered Customer
//   // const filteredCustomer = filterCustomerOptions(customersData)

//   return (
//     <main className="flex flex-col gap-4 ">
//       <div className="flex flex-col  justify-between gap-4">
//         <div className="w-full flex  flex-col lg:flex-row  lg:items-center lg:justify-between gap-2 lg:gap-0">
//           <Heading
//             title="Customer"
//             description="Manage and update your customers effortlessly."
//           />
//           <div className="flex flex-row gap-2 md:gap-0 justify-between items-center lg:gap-3 h-10">
//             {/* View Tabs for Card List Grid */}
//             <div className="flex items-center bg-[#E5E7EB] w-fit h-9 py-1  rounded-[8px]">
//               <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
//             </div>

//             {/* Add Appointment Button */}
//             <div className="">
//               <CreateButton
//                 label="New Customer"
//                 onClick={() => {
//                   dispatch(openCustomerCreateForm())
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
//           {/* {filteredCustomers.map((option) => (
//             <LayoutCards key={option.id} option={option} />
//           ))} */}
//           {filterCustomerOptions(customers).map((option) => (
//             <LayoutCards key={option.value} option={option} />
//           ))}
//         </div>
//       </div>

//       <div className="flex-1 h-full overflow-visible">{children}</div>

//       {isFormOpen &&
//         (customerFormMode === 'create' || customerFormMode === 'edit') && (
//           <NewCustomerForm
//             open={isFormOpen}
//             onChange={() => dispatch(closeCustomerForm())}
//           />
//         )}
//       {isFormOpen && customerFormMode === 'view' && currentCustomer && (
//         <ViewAppointment
//           open={isFormOpen}
//           onChange={() => dispatch(closeCustomerForm())}
//         />
//       )}
//       {isFormOpen && customerFormMode === 'delete' && currentCustomer && (
//         <DeleteModal
//           open={isFormOpen}
//           onChange={() => dispatch(closeCustomerForm())}
//           isLoading={false}
//           // onDelete={() => console.log('clicked delete')}
//         />
//       )}
//     </main>
//   )
// }

// export default CustomerLayout

// 'use client'

// import Heading from '@/components/admin/shared/heading'
// import { useEffect, useState, useMemo } from 'react'
// import { Button } from '@/components/ui/button'
// import { Plus, ShieldUser, UserCog, UsersRound } from 'lucide-react'
// import ViewTabs from '@/components/shared/layout/view-tabs'
// import LayoutCards from '@/components/shared/layout/layout-cards'
// import { useSelector, useDispatch } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import {
//   closeAppointmentForm,
//   openAppointmentCreateForm,
// } from '@/store/slices/appointmentSlice'
// import { CalendarDays, UserRoundMinus, UserRoundPlus } from 'lucide-react'
// import DeleteModal from '../appointment/_component/delete-appointment'
// import { DEFAULT_CUSTOMER_FILTERS_VALUES } from './_data/data'
// import CustomerForm from './_component/new-customer'
// import {
//   closeCustomerForm,
//   deleteCustomer,
//   openCustomerCreateForm,
// } from '@/store/slices/customerSlice'
// import CustomerDetail from './_component/view-customer-detail'

// // Map icon names to LucideIcon components
// const iconMap: Record<
//   string,
//   React.ComponentType<{ size?: number; className?: string }>
// > = {
//   ShieldUser,
//   UserCog,
//   UserRoundMinus,
//   UserRoundPlus,
//   UsersRound,
// }

// const AppointmentLayout = ({ children }: { children: React.ReactNode }) => {
//   const dispatch = useDispatch<AppDispatch>()
//   const {
//     isFormOpen,
//     isLoading,
//     customerFormMode,
//     currentCustomer,
//     filterOptions,
//     counts,
//     activeFilters,
//   } = useSelector((state: RootState) => state.customer)

//   const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
//   const [buttonName, setButtonName] = useState('New Customer')

//   // --- Combine filterOptions with counts and map icon strings to components
//   const enrichedFilterOptions = useMemo(() => {
//     console.log(' filterOptions', filterOptions)
//     return filterOptions
//       .filter((option) =>
//         DEFAULT_CUSTOMER_FILTERS_VALUES.includes(option.value),
//       )
//       .map((option) => {
//         const IconComponent = iconMap[option.icon] || CalendarDays
//         return {
//           ...option,
//           count: counts[option.value],
//           icon: (
//             <IconComponent size={24} className={`text-[${option.textColor}]`} />
//           ),
//         }
//       })
//   }, [filterOptions, counts])

//   // Adjust button name based on screen size
//   useEffect(() => {
//     const handleResize = () => {
//       setButtonName(window.innerWidth < 500 ? 'New' : 'New Customer')
//     }
//     handleResize() // Set initial value
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   return (
//     <main className="flex flex-col gap-4 h-full">
//       <div className="flex flex-col justify-between gap-4">
//         <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
//           <Heading
//             title="Customer"
//             description="Manage your customers and their appointments."
//           />
//           <div className="flex flex-row gap-2 md:gap-0 justify-between items-center lg:gap-3 h-10">
//             <div className="flex items-center bg-[#E5E7EB] w-fit h-9 py-1 rounded-[8px]">
//               <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
//             </div>
//             <div>
//               <Button
//                 className="active:scale-95"
//                 onClick={() => dispatch(openCustomerCreateForm())}
//               >
//                 <span>
//                   <Plus />
//                 </span>
//                 <span>{buttonName}</span>
//               </Button>
//             </div>
//           </div>
//         </div>

//         <div className="hidden md:flex gap-4 min-w-[340px]">
//           {enrichedFilterOptions.map((option) => (
//             <LayoutCards key={option.value} option={option} />
//           ))}
//         </div>
//       </div>

//       <div className="flex-1 overflow-hidden">{children}</div>

//       {isFormOpen &&
//         (customerFormMode === 'create' || customerFormMode === 'edit') && (
//           <CustomerForm
//             open={isFormOpen}
//             onChange={() => dispatch(closeCustomerForm())}
//           />
//         )}

//       {isFormOpen && customerFormMode === 'view' && currentCustomer && (
//         <CustomerDetail
//           open={isFormOpen}
//           onChange={() => dispatch(closeCustomerForm())}
//           filledData={currentCustomer}
//         />
//       )}
//       {isFormOpen && customerFormMode === 'delete' && currentCustomer && (
//         <DeleteModal
//           open={isFormOpen}
//           onChange={() => dispatch(closeAppointmentForm())}
//           isLoading={isLoading}
//           sliceName="customer"
//           currentItem={currentCustomer}
//           deleteAction={deleteCustomer}
//           closeAction={closeCustomerForm}
//         />
//       )}
//     </main>
//   )
// }

// export default AppointmentLayout

'use client'

import Heading from '@/components/admin/shared/heading'
import React, { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ShieldUser, UserCog, UsersRound } from 'lucide-react'
import ViewTabs from '@/components/shared/layout/view-tabs'
import LayoutCards from '@/components/shared/layout/layout-cards'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  closeAppointmentForm,
  openAppointmentCreateForm,
} from '@/store/slices/appointmentSlice'
import { CalendarDays, UserRoundMinus, UserRoundPlus } from 'lucide-react'
import DeleteModal from '../appointment/_component/delete-appointment'
import { DEFAULT_CUSTOMER_FILTERS_VALUES } from './_data/data'
import CustomerForm from './_component/new-customer'
import {
  closeCustomerForm,
  deleteCustomer,
  openCustomerCreateForm,
} from '@/store/slices/customerSlice'
import CustomerDetail from './_component/view-customer-detail'

// Map icon names to LucideIcon components
const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  ShieldUser,
  UserCog,
  UserRoundMinus,
  UserRoundPlus,
  UsersRound,
}

const CustomerLayout = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>()
    const {
      isFormOpen,
      isLoading,
      customerFormMode,
      currentCustomer,
      filterOptions,
      counts,
      activeFilters,
    } = useSelector((state: RootState) => state.customer)

    const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
    const [buttonName, setButtonName] = useState('New Customer')

    // Memoize enrichedFilterOptions to prevent unnecessary recalculations
    const enrichedFilterOptions = useMemo(() => {
      return filterOptions
        .filter((option) =>
          DEFAULT_CUSTOMER_FILTERS_VALUES.includes(option.value),
        )
        .map((option) => {
          const IconComponent = iconMap[option.icon] || CalendarDays
          return {
            ...option,
            count: counts[option.value],
            icon: (
              <IconComponent
                size={24}
                className={`text-[${option.textColor}]`}
              />
            ),
          }
        })
    }, [filterOptions, counts])

    // Adjust button name based on screen size
    useEffect(() => {
      const handleResize = () => {
        setButtonName(window.innerWidth < 500 ? 'New' : 'New Customer')
      }
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
      <main className="flex flex-col gap-4 h-full">
        <div className="flex flex-col justify-between gap-4">
          <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
            <Heading
              title="Customer"
              description="Manage your customers and their appointments."
            />
            <div className="flex flex-row gap-2 md:gap-0 justify-between items-center lg:gap-3 h-10">
              <div className="flex items-center bg-[#E5E7EB] w-fit h-9 py-1 rounded-[8px]">
                <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
              </div>
              <div>
                <Button
                  className="active:scale-95"
                  onClick={() => dispatch(openCustomerCreateForm())}
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
          (customerFormMode === 'create' || customerFormMode === 'edit') && (
            <CustomerForm
              open={isFormOpen}
              onChange={() => dispatch(closeCustomerForm())}
            />
          )}

        {isFormOpen && customerFormMode === 'view' && currentCustomer && (
          <CustomerDetail
            open={isFormOpen}
            onChange={() => dispatch(closeCustomerForm())}
          />
        )}
        {isFormOpen && customerFormMode === 'delete' && currentCustomer && (
          <DeleteModal
            open={isFormOpen}
            onChange={() => dispatch(closeCustomerForm())}
            isLoading={isLoading}
            sliceName="customer"
            currentItem={currentCustomer}
            deleteAction={deleteCustomer}
            closeAction={closeCustomerForm}
          />
        )}
      </main>
    )
  },
)

CustomerLayout.displayName = 'CustomerLayout'

export default CustomerLayout
