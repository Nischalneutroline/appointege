// 'use client'

// import React, { useEffect, useMemo, useCallback, useRef } from 'react'
// import { AppointmentFilterValue, createFilterOptions } from './_data/data'
// import SearchBar from '@/components/shared/layout/search-bar'
// import { ChevronDown, Funnel, RefreshCcw } from 'lucide-react'
// import DataTable from '@/components/table/data-table'
// import { columns } from './_data/column'
// import { Appointment } from '@/data/appointment'
// import FilterTabs from '@/components/shared/layout/filter-tabs'
// import AppointmentCard from './_component/appointment-card'
// import Image from 'next/image'
// import AppointmentGrid from './_component/appointment-grid'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import {
//   fetchAppointments,
//   setActiveFilter,
//   deleteAppointment,
// } from '@/store/slices/appointmentSlice'
// import { toast } from 'sonner'
// import { cn } from '@/utils/utils'

// const Page = () => {
//   const {
//     isLoading,
//     isRefreshing,
//     appointments,
//     hasFetched,
//     activeFilter,
//     filteredAppointments,
//   } = useSelector((state: RootState) => state.appointment)
//   const { viewMode } = useSelector((state: RootState) => state.view)
//   const dispatch = useDispatch<AppDispatch>()
//   const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
//   const hasFetchedOnce = useRef(false)

//   // Dynamic filterOptions
//   const filterOptions = useMemo(
//     () => createFilterOptions(appointments),
//     [appointments],
//   )

//   // Initial fetch
//   useEffect(() => {
//     if (hasFetchedOnce.current || isLoading || isRefreshing || hasFetched) {
//       return
//     }
//     console.log('Initial fetch triggered: no data fetched')
//     hasFetchedOnce.current = true
//     dispatch(fetchAppointments(false))
//   }, [isLoading, isRefreshing, hasFetched, dispatch])

//   // Auto-refresh every 5 minutes (silent)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       console.log('Silent auto-refresh triggered')
//       dispatch(fetchAppointments(false))
//     }, 300000) // 5 minutes
//     return () => clearInterval(interval)
//   }, [dispatch])

//   // Cleanup debounce on unmount
//   useEffect(() => {
//     return () => {
//       if (debounceTimeout.current) {
//         clearTimeout(debounceTimeout.current)
//       }
//     }
//   }, [])

//   // Manual refresh handler
//   const handleRefresh = useCallback(() => {
//     if (debounceTimeout.current) {
//       return
//     }
//     console.log('Manual refresh triggered')
//     debounceTimeout.current = setTimeout(() => {
//       dispatch(fetchAppointments(true))
//       debounceTimeout.current = null
//     }, 300)
//   }, [dispatch])

//   // Delete handler
//   const handleDelete = useCallback(
//     async (id: string) => {
//       await dispatch(deleteAppointment(id))
//     },
//     [dispatch],
//   )

//   // Memoized columns with delete handler
//   const memoizedColumns = useMemo(() => columns, [handleDelete])

//   return (
//     <div className="flex flex-col gap-4 h-full w-full overflow-hidden">
//       <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
//         <div
//           className={cn(
//             'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border-[1px] border-[#E5E7EB]',
//             'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
//           )}
//         >
//           {filterOptions.map((option, index) => (
//             <FilterTabs
//               key={index}
//               option={option}
//               activeFilter={activeFilter}
//               setSelectedData={() => {}} // No longer needed
//               setActiveFilter={(filter: AppointmentFilterValue) =>
//                 dispatch(setActiveFilter(filter))
//               }
//             />
//           ))}
//         </div>
//         <div className="flex gap-2 lg:gap-3 justify-between">
//           <SearchBar
//             className="bg-white rounded-[8px]"
//             placeholder="Search appointment"
//             width="w-full max-w-[330px]"
//             onSearch={(value) => console.log(value)}
//           />
//           <div className="flex gap-3 justify-end">
//             <div className="flex text-[#6B7280] items-center gap-1 justify-center border-[1px] bg-[#FFFFFF] border-[#E5E7EB] rounded-[8px] w-24 cursor-pointer hover:scale-110 transition duration-400">
//               <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
//               <div className="text-sm font-normal">Filter</div>
//               <ChevronDown strokeWidth={2.5} size={14} />
//             </div>
//             <div
//               className={cn(
//                 'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-400 hover:scale-110',
//                 isRefreshing && 'animate-spin',
//               )}
//               onClick={handleRefresh}
//               aria-label={
//                 isRefreshing
//                   ? 'Refreshing appointments'
//                   : 'Refresh appointments'
//               }
//               aria-busy={isRefreshing}
//             >
//               <RefreshCcw strokeWidth={2.5} size={18} />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="h-full flex-1 bg-red-600"></div>
//       {/* <div className="flex-1 w-full overflow-y-scroll pb-6">
//         {isLoading && !hasFetched ? (
//           <div className="text-center py-8 text-sm text-gray-500 italic">
//             Loading appointments...
//           </div>
//         ) : filteredAppointments.length > 0 ? (
//           <>
//             {viewMode === 'list' ? (
//               <div className="w-full overflow-x-auto">
//                 <div className="min-w-[800px]">
//                   <DataTable
//                     columns={memoizedColumns}
//                     data={filteredAppointments}
//                     rowKey="id"
//                   />
//                 </div>
//               </div>
//             ) : viewMode === 'card' ? (
//               <div className="flex flex-col h-full overflow-y-auto gap-2 pb-6">
//                 {filteredAppointments.map((item) => (
//                   <AppointmentCard item={item} key={item.id} />
//                 ))}
//               </div>
//             ) : viewMode === 'grid' ? (
//               <div className="h-full overflow-y-auto">
//                 <div
//                   className={cn(
//                     'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl grid-cols-4',
//                     'h-full pb-6',
//                   )}
//                 >
//                   {filteredAppointments.map((item) => (
//                     <AppointmentGrid item={item} key={item.id} />
//                   ))}
//                 </div>
//               </div>
//             ) : null}
//           </>
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-500">
//             <div className="flex flex-col items-center gap-2">
//               <Image
//                 src="/assets/ecommerce.svg"
//                 alt="ecommerce"
//                 width={140}
//                 height={140}
//               />
//               <div className="text-2xl text-[#4F7CFF] font-semibold">
//                 No Appointments Found
//               </div>
//               <div className="text-[#9F9C9C] text-sm font-medium">
//                 No appointments found for{' '}
//                 {activeFilter !== 'all'
//                   ? `'${filterOptions.find((opt) => opt.value === activeFilter)?.label}'`
//                   : ''}
//                 .
//                 <button
//                   className="p-1 ml-1 text-blue-600 hover:underline"
//                   onClick={handleRefresh}
//                   disabled={isRefreshing}
//                   aria-label="Retry fetching appointments"
//                 >
//                   Try refreshing
//                 </button>{' '}
//                 or creating a new appointment.
//               </div>
//             </div>
//           </div>
//         )}
//       </div> */}
//     </div>
//   )
// }

// export default Page

'use client'

import React, { useEffect, useMemo, useCallback, useRef } from 'react'
import { AppointmentFilterValue, createFilterOptions } from './_data/data'
import SearchBar from '@/components/shared/layout/search-bar'
import { ChevronDown, Funnel, RefreshCcw } from 'lucide-react'
import DataTable from '@/components/table/data-table'
import { columns } from './_data/column'
import FilterTabs from '@/components/shared/layout/filter-tabs'
import AppointmentCard from './_component/appointment-card'
import AppointmentGrid from './_component/appointment-grid'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  fetchAppointments,
  setActiveFilter,
  deleteAppointment,
} from '@/store/slices/appointmentSlice'
import { cn } from '@/utils/utils'

// Main page component for displaying appointments
const Page = () => {
  // Redux state and dispatch
  const {
    isLoading,
    isRefreshing,
    appointments,
    hasFetched,
    activeFilter,
    filteredAppointments,
  } = useSelector((state: RootState) => state.appointment)
  const { viewMode } = useSelector((state: RootState) => state.view)
  const dispatch = useDispatch<AppDispatch>()

  // Refs for managing fetch and debounce states
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const hasFetchedOnce = useRef(false)
  const hasAttemptedEmptyFetch = useRef(false)

  // Memoized filter options based on appointments
  const filterOptions = useMemo(() => {
    const result = createFilterOptions(appointments)
    console.log('Filter options:', result)
    return result
  }, [appointments])

  // Manual refresh handler with debouncing
  const handleRefresh = useCallback(() => {
    if (debounceTimeout.current) return
    console.log('Manual refresh triggered')
    debounceTimeout.current = setTimeout(() => {
      dispatch(fetchAppointments(true)).then((action) => {
        if (action.type === fetchAppointments.fulfilled.type) {
          hasAttemptedEmptyFetch.current =
            Array.isArray(action.payload) && action.payload.length === 0
        }
        debounceTimeout.current = null
      })
    }, 300)
  }, [dispatch])

  // Handle appointment deletion
  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(deleteAppointment(id))
    },
    [dispatch],
  )

  // Memoized columns (assuming columns don't depend on handleDelete)
  const memoizedColumns = useMemo(() => columns, [])

  // Fetch appointments on initial load or when empty
  useEffect(() => {
    if (
      hasFetchedOnce.current ||
      isLoading ||
      isRefreshing ||
      (hasFetched && hasAttemptedEmptyFetch.current)
    ) {
      return
    }

    if (!hasFetched || appointments.length === 0) {
      console.log(
        `Triggering fetch: hasFetched=${hasFetched}, appointments.length=${appointments.length}`,
      )
      hasFetchedOnce.current = true
      dispatch(fetchAppointments(false)).then((action) => {
        if (action.type === fetchAppointments.fulfilled.type) {
          hasAttemptedEmptyFetch.current =
            Array.isArray(action.payload) && action.payload.length === 0
        }
      })
    }
  }, [isLoading, isRefreshing, hasFetched, appointments, dispatch])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Silent auto-refresh triggered')
      dispatch(fetchAppointments(false))
    }, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [dispatch])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-hidden py-0.5 ">
      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
        {/* Filter Tabs */}
        <div
          className={cn(
            'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
            'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
          )}
        >
          {filterOptions.map((option, index) => (
            <FilterTabs
              key={index}
              option={option}
              activeFilter={activeFilter}
              setSelectedData={() => {}}
              setActiveFilter={(filter: AppointmentFilterValue) =>
                dispatch(setActiveFilter(filter))
              }
            />
          ))}
        </div>
        {/* Search Bar */}
        <div className="flex gap-2 lg:gap-3 justify-between">
          <SearchBar
            className="bg-white rounded-[8px]"
            placeholder="Search appointment"
            width="w-full max-w-[330px]"
            onSearch={(value) => console.log('Search:', value)}
          />
          <div className="flex gap-3 justify-end">
            <div className="flex text-[#6B7280] items-center gap-1 justify-center border border-[#E5E7EB] bg-white rounded-[8px] w-24 cursor-pointer hover:scale-110 transition duration-400">
              <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
              <div className="text-sm font-normal">Filter</div>
              <ChevronDown strokeWidth={2.5} size={14} />
            </div>
            <div
              className={cn(
                'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-400 hover:scale-110',
                isRefreshing && 'animate-spin',
              )}
              onClick={handleRefresh}
              aria-label={
                isRefreshing
                  ? 'Refreshing appointments'
                  : 'Refresh appointments'
              }
              aria-busy={isRefreshing}
            >
              <RefreshCcw strokeWidth={2.5} size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Display */}
      <div className="flex-1 h-full   min-h-0 md:border-t rounded-lg overflow-y-auto">
        {isLoading && !hasFetched ? (
          <div className="text-center py-8 text-sm text-gray-500 italic">
            Loading appointments...
          </div>
        ) : filteredAppointments.length > 0 ? (
          <>
            {viewMode === 'list' && (
              <div className="w-full overflow-x-auto ">
                <div className="  min-w-[800px]">
                  <DataTable
                    columns={memoizedColumns}
                    data={filteredAppointments}
                    rowKey="id"
                  />
                </div>
              </div>
            )}
            {viewMode === 'card' && (
              <div
                className={cn(
                  'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  ',
                  'pb-6',
                )}
              >
                {filteredAppointments.map((item) => (
                  <AppointmentGrid item={item} key={item.id} />
                ))}
              </div>
            )}
            {/* {viewMode === 'grid' && (
              <div className="h-full overflow-y-auto">
                <div
                  className={cn(
                    'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                    'h-full pb-6',
                  )}
                >
                  {filteredAppointments.map((item) => (
                    <AppointmentGrid item={item} key={item.id} />
                  ))}
                </div>
              </div>
            )} */}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/assets/ecommerce.svg"
                alt="No appointments"
                width={140}
                height={140}
              />
              <div className="text-2xl text-[#4F7CFF] font-semibold">
                No Appointments Found
              </div>
              <div className="text-[#9F9C9C] text-sm font-medium">
                No appointments found for{' '}
                {activeFilter !== 'all'
                  ? `'${filterOptions.find((opt) => opt.value === activeFilter)?.label}'`
                  : 'the current filter'}
                .
                <button
                  className="p-1 ml-1 text-blue-600 hover:underline disabled:opacity-50"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isLoading}
                  aria-label="Retry fetching appointments"
                >
                  Try refreshing
                </button>{' '}
                or creating a new appointment.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    // <div className="flex flex-col gap-4 h-full w-full rounded-md overflow-hidden">
    //   {/* tabs | filter |search |refresh */}
    //   {/* Filter and Search Controls */}
    //   <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
    //     <div
    //       className={cn(
    //         'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
    //         'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
    //       )}
    //     >
    //       {filterOptions.map((option, index) => (
    //         <FilterTabs
    //           key={index}
    //           option={option}
    //           activeFilter={activeFilter}
    //           setSelectedData={() => {}}
    //           setActiveFilter={(filter: AppointmentFilterValue) =>
    //             dispatch(setActiveFilter(filter))
    //           }
    //         />
    //       ))}
    //     </div>
    //     <div className="flex gap-2 lg:gap-3 justify-between">
    //       <SearchBar
    //         className="bg-white rounded-[8px]"
    //         placeholder="Search appointment"
    //         width="w-full max-w-[330px]"
    //         onSearch={(value) => console.log('Search:', value)}
    //       />
    //       <div className="flex gap-3 justify-end">
    //         <div className="flex text-[#6B7280] items-center gap-1 justify-center border border-[#E5E7EB] bg-white rounded-[8px] w-24 cursor-pointer hover:scale-110 transition duration-400">
    //           <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
    //           <div className="text-sm font-normal">Filter</div>
    //           <ChevronDown strokeWidth={2.5} size={14} />
    //         </div>
    //         <div
    //           className={cn(
    //             'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-400 hover:scale-110',
    //             isRefreshing && 'animate-spin',
    //           )}
    //           onClick={handleRefresh}
    //           aria-label={
    //             isRefreshing
    //               ? 'Refreshing appointments'
    //               : 'Refresh appointments'
    //           }
    //           aria-busy={isRefreshing}
    //         >
    //           <RefreshCcw strokeWidth={2.5} size={18} />
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main Content : Appointments */}
    //   <div className="flex-1 border rounded-lg min-h-0">
    //     <div className="flex flex-col gap-2 h-full overflow-y-auto p-4">
    //       {filteredAppointments.length > 0 ? (
    //         <div className="flex flex-col h-full overflow-y-auto gap-2 pb-6">
    //           {viewMode === 'list' ? (
    //             <div className="w-full overflow-x-auto">
    //               <div className="min-w-[800px]">
    //                 <DataTable
    //                   columns={memoizedColumns}
    //                   data={filteredAppointments}
    //                   rowKey="id"
    //                 />
    //               </div>
    //             </div>
    //           ) : viewMode === 'card' ? (
    //             <div className="flex flex-col h-full overflow-y-auto gap-2 pb-6">
    //               {filteredAppointments.map((item) => (
    //                 <AppointmentCard item={item} key={item.id} />
    //               ))}
    //             </div>
    //           ) : (
    //             <div className="flex flex-col h-full overflow-y-auto gap-2 pb-6">
    //               {filteredAppointments.map((item) => (
    //                 <AppointmentGrid item={item} key={item.id} />
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       ) : (
    //         <></>
    //       )}
    //     </div>
    //   </div>
    // </div>
  )
}

export default Page
