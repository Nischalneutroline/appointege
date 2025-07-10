// 'use client'

// import React, { useEffect, useMemo, useCallback, useRef } from 'react'
// import { AppointmentFilterValue, createFilterOptions } from './_data/data'
// import SearchBar from '@/components/shared/layout/search-bar'
// import { ChevronDown, Funnel, RefreshCcw } from 'lucide-react'
// import DataTable from '@/components/table/data-table'
// import { columns } from './_data/column'
// import FilterTabs from '@/components/shared/layout/filter-tabs'
// import AppointmentCard from './_component/appointment-card'
// import AppointmentGrid from './_component/appointment-grid'
// import Image from 'next/image'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import {
//   fetchAppointments,
//   setActiveFilter,
//   deleteAppointment,
// } from '@/store/slices/appointmentSlice'
// import { cn } from '@/utils/utils'

// // Main page component for displaying appointments
// const Page = () => {
//   // Redux state and dispatch
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

//   // Refs for managing fetch and debounce states
//   const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
//   const hasFetchedOnce = useRef(false)
//   const hasAttemptedEmptyFetch = useRef(false)

//   // Memoized filter options based on appointments
//   const filterOptions = useMemo(() => {
//     const result = createFilterOptions(appointments)
//     console.log('Filter options:', result)
//     return result
//   }, [appointments])

//   // Manual refresh handler with debouncing
//   const handleRefresh = useCallback(() => {
//     if (debounceTimeout.current) return
//     console.log('Manual refresh triggered')
//     debounceTimeout.current = setTimeout(() => {
//       dispatch(fetchAppointments(true)).then((action) => {
//         if (action.type === fetchAppointments.fulfilled.type) {
//           hasAttemptedEmptyFetch.current =
//             Array.isArray(action.payload) && action.payload.length === 0
//         }
//         debounceTimeout.current = null
//       })
//     }, 300)
//   }, [dispatch])

//   // Handle appointment deletion
//   const handleDelete = useCallback(
//     async (id: string) => {
//       await dispatch(deleteAppointment(id))
//     },
//     [dispatch],
//   )

//   // Memoized columns (assuming columns don't depend on handleDelete)
//   const memoizedColumns = useMemo(() => columns, [])

//   // Fetch appointments on initial load or when empty
//   useEffect(() => {
//     if (
//       hasFetchedOnce.current ||
//       isLoading ||
//       isRefreshing ||
//       (hasFetched && hasAttemptedEmptyFetch.current)
//     ) {
//       return
//     }

//     if (!hasFetched || appointments.length === 0) {
//       console.log(
//         `Triggering fetch: hasFetched=${hasFetched}, appointments.length=${appointments.length}`,
//       )
//       hasFetchedOnce.current = true
//       dispatch(fetchAppointments(false)).then((action) => {
//         if (action.type === fetchAppointments.fulfilled.type) {
//           hasAttemptedEmptyFetch.current =
//             Array.isArray(action.payload) && action.payload.length === 0
//         }
//       })
//     }
//   }, [isLoading, isRefreshing, hasFetched, appointments, dispatch])

//   // Auto-refresh every 5 minutes
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
//       if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
//     }
//   }, [])

//   return (
//     <div className="flex flex-col gap-4 h-full w-full overflow-hidden py-0.5 ">
//       {/* Filter and Search Controls */}
//       <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
//         {/* Filter Tabs */}
//         <div
//           className={cn(
//             'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
//             'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
//           )}
//         >
//           {filterOptions.map((option, index) => (
//             <FilterTabs
//               key={index}
//               option={option}
//               activeFilter={activeFilter}
//               setSelectedData={() => {}}
//               setActiveFilter={(filter: AppointmentFilterValue) =>
//                 dispatch(setActiveFilter(filter))
//               }
//             />
//           ))}
//         </div>
//         {/* Search Bar */}
//         <div className="flex gap-2 lg:gap-3 justify-between">
//           <SearchBar
//             className="bg-white rounded-[8px]"
//             placeholder="Search appointment"
//             width="w-full max-w-[330px]"
//             onSearch={(value) => console.log('Search:', value)}
//           />
//           <div className="flex gap-3 justify-end">
//             <div className="flex text-[#6B7280] items-center gap-1 justify-center border border-[#E5E7EB] bg-white rounded-[8px] w-24 cursor-pointer hover:scale-110 transition duration-400">
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

//       {/* Appointment Display */}
//       <div className="flex-1 h-full   min-h-0  rounded-lg overflow-y-auto">
//         {isLoading && !hasFetched ? (
//           <div className="text-center py-8 text-sm text-gray-500 italic">
//             Loading appointments...
//           </div>
//         ) : filteredAppointments.length > 0 ? (
//           <>
//             {viewMode === 'list' && (
//               <div className="w-full overflow-x-auto ">
//                 <div className="  min-w-[800px]">
//                   <DataTable
//                     columns={memoizedColumns}
//                     data={filteredAppointments}
//                     rowKey="id"
//                   />
//                 </div>
//               </div>
//             )}
//             {viewMode === 'card' && (
//               <div
//                 className={cn(
//                   'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  ',
//                   'pb-6',
//                 )}
//               >
//                 {filteredAppointments.map((item) => (
//                   <AppointmentGrid item={item} key={item.id} />
//                 ))}
//               </div>
//             )}
//             {/* {viewMode === 'grid' && (
//               <div className="h-full overflow-y-auto">
//                 <div
//                   className={cn(
//                     'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
//                     'h-full pb-6',
//                   )}
//                 >
//                   {filteredAppointments.map((item) => (
//                     <AppointmentGrid item={item} key={item.id} />
//                   ))}
//                 </div>
//               </div>
//             )} */}
//           </>
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-500">
//             <div className="flex flex-col items-center gap-2">
//               <Image
//                 src="/assets/ecommerce.svg"
//                 alt="No appointments"
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
//                   : 'the current filter'}
//                 .
//                 <button
//                   className="p-1 ml-1 text-blue-600 hover:underline disabled:opacity-50"
//                   onClick={handleRefresh}
//                   disabled={isRefreshing || isLoading}
//                   aria-label="Retry fetching appointments"
//                 >
//                   Try refreshing
//                 </button>{' '}
//                 or creating a new appointment.
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>

//     // <div className="flex flex-col gap-4 h-full w-full rounded-md overflow-hidden">
//     //   {/* tabs | filter |search |refresh */}
//     //   {/* Filter and Search Controls */}
//     //   <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
//     //     <div
//     //       className={cn(
//     //         'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
//     //         'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
//     //       )}
//     //     >
//     //       {filterOptions.map((option, index) => (
//     //         <FilterTabs
//     //           key={index}
//     //           option={option}
//     //           activeFilter={activeFilter}
//     //           setSelectedData={() => {}}
//     //           setActiveFilter={(filter: AppointmentFilterValue) =>
//     //             dispatch(setActiveFilter(filter))
//     //           }
//     //         />
//     //       ))}
//     //     </div>
//     //     <div className="flex gap-2 lg:gap-3 justify-between">
//     //       <SearchBar
//     //         className="bg-white rounded-[8px]"
//     //         placeholder="Search appointment"
//     //         width="w-full max-w-[330px]"
//     //         onSearch={(value) => console.log('Search:', value)}
//     //       />
//     //       <div className="flex gap-3 justify-end">
//     //         <div className="flex text-[#6B7280] items-center gap-1 justify-center border border-[#E5E7EB] bg-white rounded-[8px] w-24 cursor-pointer hover:scale-110 transition duration-400">
//     //           <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
//     //           <div className="text-sm font-normal">Filter</div>
//     //           <ChevronDown strokeWidth={2.5} size={14} />
//     //         </div>
//     //         <div
//     //           className={cn(
//     //             'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-400 hover:scale-110',
//     //             isRefreshing && 'animate-spin',
//     //           )}
//     //           onClick={handleRefresh}
//     //           aria-label={
//     //             isRefreshing
//     //               ? 'Refreshing appointments'
//     //               : 'Refresh appointments'
//     //           }
//     //           aria-busy={isRefreshing}
//     //         >
//     //           <RefreshCcw strokeWidth={2.5} size={18} />
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   {/* Main Content : Appointments */}
//     //   <div className="flex-1 border rounded-lg min-h-0">
//     //     <div className="flex flex-col gap-2 h-full overflow-y-auto p-4">
//     //       {filteredAppointments.length > 0 ? (
//     //         <div className="flex flex-col h-full overflow-y-auto gap-2 pb-6">
//     //           {viewMode === 'list' ? (
//     //             <div className="w-full overflow-x-auto">
//     //               <div className="min-w-[800px]">
//     //                 <DataTable
//     //                   columns={memoizedColumns}
//     //                   data={filteredAppointments}
//     //                   rowKey="id"
//     //                 />
//     //               </div>
//     //             </div>
//     //           ) : viewMode === 'card' ? (
//     //             <div className="flex flex-col h-full overflow-y-auto gap-2 pb-6">
//     //               {filteredAppointments.map((item) => (
//     //                 <AppointmentCard item={item} key={item.id} />
//     //               ))}
//     //             </div>
//     //           ) : (
//     //             <div className="flex flex-col h-full overflow-y-auto gap-2 pb-6">
//     //               {filteredAppointments.map((item) => (
//     //                 <AppointmentGrid item={item} key={item.id} />
//     //               ))}
//     //             </div>
//     //           )}
//     //         </div>
//     //       ) : (
//     //         <></>
//     //       )}
//     //     </div>
//     //   </div>
//     // </div>
//   )
// }

// export default Page

// --------- recent
// 'use client'

// import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react'
// import { AppointmentFilterValue, createFilterOptions } from './_data/data'
// import SearchBar from '@/components/shared/layout/search-bar'
// import { ChevronDown, Funnel, RefreshCcw } from 'lucide-react'
// import DataTable from '@/components/table/data-table'
// import { columns } from './_data/column'
// import FilterTabs from '@/components/shared/layout/filter-tabs'
// import AppointmentGrid from './_component/appointment-grid'
// import Image from 'next/image'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import {
//   fetchAppointments,
//   setActiveFilter,
//   deleteAppointment,
// } from '@/store/slices/appointmentSlice'
// import { cn } from '@/utils/utils'
// import { Appointment } from '@/app/(protected)/admin/appointment/_types/appointment'

// const Page = () => {
//   const {
//     isLoading,
//     isRefreshing,
//     appointments,
//     hasFetched,
//     activeFilter,
//     filteredAppointments,
//     success,
//   } = useSelector((state: RootState) => state.appointment)
//   const { viewMode } = useSelector((state: RootState) => state.view)
//   const dispatch = useDispatch<AppDispatch>()

//   // State for search query
//   const [searchQuery, setSearchQuery] = useState<string>('')

//   const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
//   const hasFetchedOnce = useRef(false)
//   const hasAttemptedEmptyFetch = useRef(false)

//   const filterOptions = useMemo(() => {
//     const result = createFilterOptions(appointments)
//     console.log('Filter options:', result)
//     return result
//   }, [appointments])

//   // Search logic: filter appointments based on search query
//   const searchedAppointments = useMemo(() => {
//     if (!searchQuery.trim()) {
//       return filteredAppointments
//     }

//     const query = searchQuery.toLowerCase().trim()
//     return filteredAppointments.filter((appointment: Appointment) => {
//       // Adjust these fields based on your Appointment type definition
//       const searchableFields = [
//         appointment.customerName, // customer name
//         appointment.status, // status
//         appointment.selectedDate, // date
//         appointment.selectedTime, // time
//       ].filter(Boolean) // Remove undefined/null values

//       return searchableFields.some((field) =>
//         field.toLowerCase().includes(query),
//       )
//     })
//   }, [filteredAppointments, searchQuery])

//   const handleRefresh = useCallback(() => {
//     if (debounceTimeout.current) return
//     console.log('Manual refresh triggered')
//     debounceTimeout.current = setTimeout(() => {
//       dispatch(fetchAppointments(true)).then((action) => {
//         if (action.type === fetchAppointments.fulfilled.type) {
//           hasAttemptedEmptyFetch.current =
//             Array.isArray(action.payload) && action.payload.length === 0
//         }
//         debounceTimeout.current = null
//       })
//     }, 300)
//   }, [dispatch])

//   const handleDelete = useCallback(
//     async (id: string) => {
//       await dispatch(deleteAppointment(id))
//     },
//     [dispatch],
//   )

//   const memoizedColumns = useMemo(() => columns, [])

//   useEffect(() => {
//     if (
//       hasFetchedOnce.current ||
//       isLoading ||
//       isRefreshing ||
//       (hasFetched && hasAttemptedEmptyFetch.current)
//     ) {
//       return
//     }

//     if (!hasFetched || appointments.length === 0) {
//       console.log(
//         `Triggering fetch: hasFetched=${hasFetched}, appointments.length=${appointments.length}`,
//       )
//       hasFetchedOnce.current = true
//       dispatch(fetchAppointments(false)).then((action) => {
//         if (action.type === fetchAppointments.fulfilled.type) {
//           hasAttemptedEmptyFetch.current =
//             Array.isArray(action.payload) && action.payload.length === 0
//         }
//       })
//     }
//   }, [isLoading, isRefreshing, hasFetched, appointments, dispatch])

//   // Reset activeFilter to 'all' after a successful update to ensure updated appointment is visible
//   useEffect(() => {
//     if (success && filteredAppointments.length === 0 && !searchQuery) {
//       console.log('Success detected, resetting activeFilter to "all"')
//       dispatch(setActiveFilter('all'))
//     }
//   }, [success, filteredAppointments, dispatch, searchQuery])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       console.log('Silent auto-refresh triggered')
//       dispatch(fetchAppointments(false))
//     }, 300000) // 5 minutes
//     return () => clearInterval(interval)
//   }, [dispatch])

//   useEffect(() => {
//     return () => {
//       if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
//     }
//   }, [])

//   return (
//     <div className="flex flex-col gap-4 h-full w-full overflow-hidden py-0.5">
//       <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
//         <div
//           className={cn(
//             'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
//             'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
//           )}
//         >
//           {filterOptions.map((option, index) => (
//             <FilterTabs
//               key={index}
//               option={option}
//               activeFilter={activeFilter}
//               setSelectedData={() => {}}
//               setActiveFilter={(filter: AppointmentFilterValue) =>
//                 dispatch(setActiveFilter(filter))
//               }
//             />
//           ))}
//         </div>
//         <div className="flex gap-2 lg:gap-3 justify-between">
//           <SearchBar
//             className="bg-white rounded-[8px]"
//             placeholder="Search appointments by title, description, or name"
//             width="w-full max-w-[330px]"
//             onSearch={(value) => {
//               console.log('Search:', value)
//               setSearchQuery(value)
//             }}
//           />
//           <div className="flex gap-3 justify-end">
//             <div className="flex text-[#6B7280] items-center gap-1 justify-center border border-[#E5E7EB] bg-white rounded-[8px] w-24 cursor-pointer hover:scale-110 transition duration-400">
//               <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
//               <div className="text-sm font-normal">Filter</div>
//               <ChevronDown strokeWidth={2.5} size={14} />
//             </div>
//             <div
//               className={cn(
//                 'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-700 hover:scale-110',
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

//       <div className="flex-1 h-full min-h-0 rounded-lg overflow-y-auto">
//         {isLoading && !hasFetched ? (
//           <div className="text-center py-8 text-sm text-gray-500 italic">
//             Loading appointments...
//           </div>
//         ) : searchedAppointments.length > 0 ? (
//           <>
//             {viewMode === 'list' && (
//               <div className="w-full overflow-x-auto">
//                 <div className="min-w-[800px]">
//                   <DataTable
//                     columns={memoizedColumns}
//                     data={searchedAppointments}
//                     rowKey="id"
//                   />
//                 </div>
//               </div>
//             )}
//             {viewMode === 'card' && (
//               <div
//                 className={cn(
//                   'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3',
//                   'pb-6',
//                 )}
//               >
//                 {searchedAppointments.map((item) => (
//                   <AppointmentGrid item={item} key={item.id} />
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-500">
//             <div className="flex flex-col items-center gap-2">
//               <Image
//                 src="/assets/ecommerce.svg"
//                 alt="No appointments"
//                 width={140}
//                 height={140}
//               />
//               <div className="text-2xl text-[#4F7CFF] font-semibold">
//                 No Appointments Found
//               </div>
//               <div className="text-[#9F9C9C] text-sm font-medium">
//                 {searchQuery ? (
//                   <>
//                     No appointments match your search query &quot;{searchQuery}
//                     &quot; for{' '}
//                     {activeFilter !== 'all'
//                       ? `'${filterOptions.find((opt) => opt.value === activeFilter)?.label}'`
//                       : 'the current filter'}
//                     .
//                   </>
//                 ) : (
//                   <>
//                     No appointments found for{' '}
//                     {activeFilter !== 'all'
//                       ? `'${filterOptions.find((opt) => opt.value === activeFilter)?.label}'`
//                       : 'the current filter'}
//                     .
//                   </>
//                 )}
//                 <button
//                   className="p-1 ml-1 text-blue-600 hover:underline disabled:opacity-50"
//                   onClick={handleRefresh}
//                   disabled={isRefreshing || isLoading}
//                   aria-label="Retry fetching appointments"
//                 >
//                   Try refreshing
//                 </button>{' '}
//                 or creating a new appointment.
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Page
// 'use client'

// import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
// import SearchBar from '@/components/shared/layout/search-bar'
// import { RefreshCcw } from 'lucide-react'
// import DataTable from '@/components/table/data-table'
// import { appointmentColumns } from './_data/column'
// import FilterTabs from '@/components/shared/layout/filter-tabs'
// import AppointmentGrid from './_component/appointment-grid'
// import Image from 'next/image'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import {
//   fetchAppointments,
//   deleteAppointment,
//   setActiveFilters,
//   setActiveFilter,
// } from '@/store/slices/appointmentSlice'
// import { cn } from '@/utils/utils'
// import {
//   Appointment,
//   DEFAULT_APPOINTMENT_FILTERS_VALUES,
// } from '@/app/(protected)/admin/appointment/_types/appointment'
// import FilterDropdown from '@/components/shared/layout/filter-dropdown'
// import { AppointmentFilterValue } from './_data/data'

// const Page = () => {
//   const {
//     isLoading,
//     isRefreshing,
//     filteredAppointments,
//     filterOptions,
//     counts,
//     hasFetched,
//     success,
//     activeFilter,
//     activeFilters,
//   } = useSelector((state: RootState) => state.appointment)
//   const { viewMode } = useSelector((state: RootState) => state.view)
//   const dispatch = useDispatch<AppDispatch>()

//   // State for search query
//   const [searchQuery, setSearchQuery] = useState<string>('')

//   const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
//   const hasFetchedOnce = useRef(false)
//   const hasAttemptedEmptyFetch = useRef(false)

//   // Combine filterOptions with counts for FilterDropdown and FilterTabs
//   const enrichedFilterOptions = useMemo(() => {
//     return filterOptions.map((option) => ({
//       ...option,
//       count: counts[option.value],
//     }))
//   }, [filterOptions, counts])

//   // Search logic: filter filteredAppointments based on search query
//   const searchedAppointments = useMemo(() => {
//     let result = filteredAppointments
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim()
//       console.log('Searching with query:', query)
//       result = filteredAppointments.filter((appointment: Appointment) => {
//         const searchableFields = [
//           appointment.customerName.toLowerCase(),
//           appointment.status.toLowerCase(),
//           appointment.service?.title.toLowerCase(),
//           appointment.selectedDate.toLowerCase(),
//           appointment.selectedTime.toLowerCase(),
//         ]
//           .filter(Boolean)
//           .map((field) => String(field).toLowerCase())
//         const matches = searchableFields.some((field) =>
//           field.includes(query.toLowerCase()),
//         )
//         console.log(`Appointment ID ${appointment.id}:`, {
//           searchableFields,
//           matches,
//         })
//         return matches
//       })
//     }
//     console.log('Searched appointments:', result)
//     return result
//   }, [filteredAppointments, searchQuery])

//   const handleRefresh = useCallback(() => {
//     if (debounceTimeout.current) return
//     console.log('Manual refresh triggered')
//     debounceTimeout.current = setTimeout(() => {
//       dispatch(fetchAppointments(true)).then((action) => {
//         if (action.type === fetchAppointments.fulfilled.type) {
//           hasAttemptedEmptyFetch.current =
//             Array.isArray(action.payload) && action.payload.length === 0
//         }
//         debounceTimeout.current = null
//       })
//     }, 300)
//   }, [dispatch])

//   const handleDelete = useCallback(
//     async (id: string) => {
//       await dispatch(deleteAppointment(id))
//     },
//     [dispatch],
//   )

//   const memoizedColumns = useMemo(() => appointmentColumns, [])

//   useEffect(() => {
//     if (
//       hasFetchedOnce.current ||
//       isLoading ||
//       isRefreshing ||
//       (hasFetched && hasAttemptedEmptyFetch.current)
//     ) {
//       return
//     }

//     if (!hasFetched || filteredAppointments.length === 0) {
//       console.log(
//         `Triggering fetch: hasFetched=${hasFetched}, filteredAppointments.length=${filteredAppointments.length}`,
//       )
//       hasFetchedOnce.current = true
//       dispatch(fetchAppointments(false)).then((action) => {
//         if (action.type === fetchAppointments.fulfilled.type) {
//           hasAttemptedEmptyFetch.current =
//             Array.isArray(action.payload) && action.payload.length === 0
//         }
//       })
//     }
//   }, [isLoading, isRefreshing, hasFetched, filteredAppointments, dispatch])

//   // Reset activeFilter and activeFilters to default after a successful update if no appointments are found
//   useEffect(() => {
//     if (success && searchedAppointments.length === 0 && !searchQuery) {
//       console.log(
//         'Success detected, resetting activeFilter and activeFilters to default',
//       )
//       dispatch(setActiveFilter('today'))
//     }
//   }, [success, searchedAppointments, searchQuery, dispatch])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       console.log('Silent auto-refresh triggered')
//       dispatch(fetchAppointments(false))
//     }, 300000) // 5 minutes
//     return () => clearInterval(interval)
//   }, [dispatch])

//   useEffect(() => {
//     return () => {
//       if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
//     }
//   }, [])

//   return (
//     <div className="flex flex-col gap-4 h-full w-full overflow-hidden py-0.5">
//       <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
//         <div
//           className={cn(
//             'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
//             'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
//           )}
//         >
//           {enrichedFilterOptions
//             .filter((option) => activeFilters.includes(option.value))
//             .map((option, index) => (
//               <FilterTabs
//                 key={index}
//                 {...option}
//                 sliceName="appointment"
//                 onDispatch={(filter: string) =>
//                   dispatch(setActiveFilter(option.value))
//                 }
//               />
//             ))}
//         </div>
//         <div className="flex gap-2 min-w-1/4 lg:gap-3 justify-between">
//           <SearchBar
//             className="bg-white rounded-[8px]"
//             placeholder="Search by details"
//             width="w-full max-w-[530px]"
//             onSearch={(value) => {
//               console.log('Search:', value)
//               setSearchQuery(value)
//             }}
//           />
//           <div className="flex gap-3 justify-end">
//             {/* <FilterDropdown
//               filterOptions={enrichedFilterOptions}
//               activeFilters={activeFilters}
//               onFilterChange={(filters) => dispatch(setActiveFilters(filters))}
//             /> */}
//             <FilterDropdown<AppointmentFilterValue>
//               filterOptions={enrichedFilterOptions}
//               activeFilters={activeFilters}
//               defaultFilters={DEFAULT_APPOINTMENT_FILTERS_VALUES}
//               sliceName="appointment"
//               onDispatch={{
//                 setActiveFilter,
//                 setActiveFilters,
//               }}
//             />
//             <div
//               className={cn(
//                 'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-700 hover:scale-110',
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

//       <div className="flex-1 h-full min-h-0 rounded-lg overflow-y-auto">
//         {isLoading && !hasFetched ? (
//           <div className="text-center py-8 text-sm text-gray-500 italic">
//             Loading appointments...
//           </div>
//         ) : searchedAppointments.length > 0 ? (
//           <>
//             {viewMode === 'list' && (
//               <div className="w-full overflow-x-auto">
//                 <div className="min-w-[800px]">
//                   <DataTable
//                     columns={memoizedColumns}
//                     data={searchedAppointments}
//                     rowKey="id"
//                   />
//                 </div>
//               </div>
//             )}
//             {viewMode === 'card' && (
//               <div
//                 className={cn(
//                   'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 ',
//                   'pb-6',
//                 )}
//               >
//                 {searchedAppointments.map((item) => (
//                   <AppointmentGrid item={item} key={item.id} />
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-500">
//             <div className="flex flex-col items-center gap-2">
//               <Image
//                 src="/assets/ecommerce.svg"
//                 alt="No appointments"
//                 width={140}
//                 height={140}
//               />
//               <div className="text-2xl text-[#4F7CFF] font-semibold">
//                 No Appointments Found
//               </div>
//               <div className="text-[#9F9C9C] text-sm font-medium">
//                 {searchQuery ? (
//                   <>
//                     No appointments match your search query "{searchQuery}" for{' '}
//                     {activeFilter === 'all'
//                       ? 'all appointments'
//                       : `${activeFilter} appointments`}
//                     .
//                   </>
//                 ) : (
//                   <>
//                     No appointments found for{' '}
//                     {activeFilter === 'all'
//                       ? 'all appointments'
//                       : `${activeFilter} appointments`}
//                     .
//                   </>
//                 )}
//                 <button
//                   className="p-1 ml-1 text-blue-600 hover:underline disabled:opacity-50"
//                   onClick={handleRefresh}
//                   disabled={isRefreshing || isLoading}
//                   aria-label="Retry fetching appointments"
//                 >
//                   Try refreshing
//                 </button>{' '}
//                 or creating a new appointment.
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Page

// 'use client'

// import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
// import SearchBar from '@/components/shared/layout/search-bar'
// import { RefreshCcw } from 'lucide-react'
// import { appointmentColumns } from './_data/column'
// import FilterTabs from '@/components/shared/layout/filter-tabs'
// import Image from 'next/image'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import {
//   fetchAppointments,
//   deleteAppointment,
//   setActiveFilters,
//   setActiveFilter,
// } from '@/store/slices/appointmentSlice'
// import { cn } from '@/utils/utils'
// import {
//   Appointment,
//   DEFAULT_APPOINTMENT_FILTERS_VALUES,
// } from '@/app/(protected)/admin/appointment/_types/appointment'
// import FilterDropdown from '@/components/shared/layout/filter-dropdown'
// import { AppointmentFilterValue } from './_data/data'
// import AppointmentItem from './_component/appointment-item'
// import AppointmentCard from './_component/appointment-card'

// // Memoize columns outside the component to avoid recalculation
// const memoizedColumns = appointmentColumns

// /*************  ✨ Windsurf Command ⭐  *************/
// /**
//  * Page
//  *
//  * Appointment listing page, allowing users to view, filter, search, and refresh
//  * appointments.
//  *
//  * @returns Appointment listing page
//  */
// /*******  aa6d1f39-0d0f-4e7e-9f72-42ce65e813de  *******/ const Page = () => {
//   const {
//     isLoading,
//     isRefreshing,
//     filteredAppointments,
//     filterOptions,
//     counts,
//     hasFetched,
//     success,
//     activeFilter,
//     activeFilters,
//   } = useSelector((state: RootState) => state.appointment)
//   const { viewMode } = useSelector((state: RootState) => state.view)
//   const dispatch = useDispatch<AppDispatch>()

//   const [searchQuery, setSearchQuery] = useState<string>('')
//   const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
//   const hasFetchedOnce = useRef(false)
//   const hasAttemptedEmptyFetch = useRef(false)

//   // Memoize enrichedFilterOptions with stable dependencies
//   const enrichedFilterOptions = useMemo(() => {
//     return filterOptions.map((option) => ({
//       ...option,
//       count: counts[option.value] || 0,
//     }))
//   }, [filterOptions, counts])

//   // Memoize searchedAppointments with optimized filtering
//   const searchedAppointments = useMemo(() => {
//     if (!searchQuery.trim()) return filteredAppointments
//     const query = searchQuery.toLowerCase().trim()
//     return filteredAppointments.filter((appointment: Appointment) =>
//       [
//         appointment.customerName.toLowerCase(),
//         appointment.status.toLowerCase(),
//         appointment.service?.title.toLowerCase() || '',
//         appointment.selectedDate.toLowerCase(),
//         appointment.selectedTime.toLowerCase(),
//       ].some((field) => field.includes(query)),
//     )
//   }, [filteredAppointments, searchQuery])

//   const handleRefresh = useCallback(() => {
//     if (debounceTimeout.current || isRefreshing) return
//     debounceTimeout.current = setTimeout(() => {
//       dispatch(fetchAppointments(true)).then((action) => {
//         if (fetchAppointments.fulfilled.match(action)) {
//           hasAttemptedEmptyFetch.current =
//             Array.isArray(action.payload) && action.payload.length === 0
//         }
//         debounceTimeout.current = null
//       })
//     }, 300)
//   }, [dispatch, isRefreshing])

//   const handleDelete = useCallback(
//     async (id: string) => {
//       await dispatch(deleteAppointment(id))
//     },
//     [dispatch],
//   )

//   // Fetch data only once on mount, avoiding redundant calls
//   useEffect(() => {
//     if (hasFetchedOnce.current || isLoading || isRefreshing || hasFetched)
//       return
//     hasFetchedOnce.current = true
//     dispatch(fetchAppointments(false)).then((action) => {
//       if (fetchAppointments.fulfilled.match(action)) {
//         hasAttemptedEmptyFetch.current =
//           Array.isArray(action.payload) && action.payload.length === 0
//       }
//     })
//   }, [isLoading, isRefreshing, hasFetched, dispatch])

//   // Reset filters on success with no results
//   useEffect(() => {
//     if (success && searchedAppointments.length === 0 && !searchQuery) {
//       dispatch(setActiveFilter('today'))
//     }
//   }, [success, searchedAppointments, searchQuery, dispatch])

//   // Auto-refresh every 5 minutes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       dispatch(fetchAppointments(false))
//     }, 300000)
//     return () => clearInterval(interval)
//   }, [dispatch])

//   // Cleanup debounce
//   useEffect(() => {
//     return () => {
//       if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
//     }
//   }, [])

//   return (
//     <div className="flex flex-col gap-4 h-full w-full overflow-hidden py-0.5">
//       <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
//         <div
//           className={cn(
//             'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
//             'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
//           )}
//         >
//           {enrichedFilterOptions
//             .filter((option) => activeFilters.includes(option.value))
//             .map((option, index) => (
//               <FilterTabs
//                 key={index}
//                 {...option}
//                 sliceName="appointment"
//                 onDispatch={(filter: string) =>
//                   dispatch(setActiveFilter(option.value))
//                 }
//               />
//             ))}
//         </div>
//         <div className="flex gap-2 min-w-1/4 lg:gap-3 justify-between">
//           <SearchBar
//             className="bg-white rounded-[8px]"
//             placeholder="Search by details"
//             width="w-full max-w-[530px]"
//             onSearch={(value) => setSearchQuery(value)}
//           />
//           <div className="flex gap-3 justify-end">
//             <FilterDropdown<AppointmentFilterValue>
//               filterOptions={enrichedFilterOptions}
//               activeFilters={activeFilters}
//               defaultFilters={DEFAULT_APPOINTMENT_FILTERS_VALUES}
//               sliceName="appointment"
//               onDispatch={{ setActiveFilter, setActiveFilters }}
//             />
//             <div
//               className={cn(
//                 'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-700 hover:scale-110',
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

//       <div className="flex-1 h-full min-h-0 rounded-lg overflow-y-auto">
//         {isLoading && !hasFetched ? (
//           <div className="text-center py-8 text-sm text-gray-500 italic">
//             Loading appointments...
//           </div>
//         ) : searchedAppointments.length > 0 ? (
//           <>
//             {viewMode === 'list' && (
//               <div className="w-full overflow-x-auto">
//                 <div className="space-y-3">
//                   {searchedAppointments.map((item) => (
//                     <AppointmentItem
//                       key={item.id}
//                       item={item}
//                       // onDelete={handleDelete}
//                     />
//                   ))}
//                 </div>
//                 {/* <DataTable
//                     columns={memoizedColumns}
//                     data={searchedAppointments}
//                     rowKey="id"
//                   /> */}
//                 {/* </div> */}
//               </div>
//             )}
//             {viewMode === 'card' && (
//               <div
//                 className={cn(
//                   'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4',
//                   'pb-6',
//                 )}
//               >
//                 {searchedAppointments.map((item) => (
//                   <AppointmentCard key={item.id} item={item} />
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-500">
//             <div className="flex flex-col items-center gap-2">
//               <Image
//                 src="/assets/ecommerce.svg"
//                 alt="No appointments"
//                 width={140}
//                 height={140}
//               />
//               <div className="text-2xl text-[#4F7CFF] font-semibold">
//                 No Appointments Found
//               </div>
//               <div className="text-[#9F9C9C] text-sm font-medium">
//                 {searchQuery ? (
//                   <>
//                     No appointments match your search query "{searchQuery}" for{' '}
//                     {activeFilter === 'all'
//                       ? 'all appointments'
//                       : `${activeFilter} appointments`}
//                     .
//                   </>
//                 ) : (
//                   <>
//                     No appointments found for{' '}
//                     {activeFilter === 'all'
//                       ? 'all appointments'
//                       : `${activeFilter} appointments`}
//                     .
//                   </>
//                 )}
//                 <button
//                   className="p-1 ml-1 text-blue-600 hover:underline disabled:opacity-50"
//                   onClick={handleRefresh}
//                   disabled={isRefreshing || isLoading}
//                   aria-label="Retry fetching appointments"
//                 >
//                   Try refreshing
//                 </button>{' '}
//                 or creating a new appointment.
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Page

'use client'

import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import SearchBar from '@/components/shared/layout/search-bar'
import { RefreshCcw } from 'lucide-react'
import { appointmentColumns } from './_data/column'
import FilterTabs from '@/components/shared/layout/filter-tabs'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  fetchAppointments,
  deleteAppointment,
  setActiveFilters,
  setActiveFilter,
} from '@/store/slices/appointmentSlice'
import { cn } from '@/utils/utils'
import {
  Appointment,
  DEFAULT_APPOINTMENT_FILTERS_VALUES,
} from '@/app/(protected)/admin/appointment/_types/appointment'
import FilterDropdown from '@/components/shared/layout/filter-dropdown'
import { AppointmentFilterValue } from './_data/data'
import AppointmentItem from './_component/appointment-item'
import AppointmentCard from './_component/appointment-card'

// Memoize columns outside the component to avoid recalculation
const memoizedColumns = appointmentColumns

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Page
 *
 * Appointment listing page, allowing users to view, filter, search, and refresh
 * appointments.
 *
 * @returns Appointment listing page
 */
/*******  aa6d1f39-0d0f-4e7e-9f72-42ce65e813de  *******/
const Page = () => {
  const {
    isLoading,
    isRefreshing,
    filteredAppointments,
    filterOptions,
    counts,
    hasFetched,
    success,
    activeFilter,
    activeFilters,
  } = useSelector((state: RootState) => state.appointment)
  const { viewMode } = useSelector((state: RootState) => state.view)
  const dispatch = useDispatch<AppDispatch>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const hasFetchedOnce = useRef(false)
  const hasAttemptedEmptyFetch = useRef(false)

  // Memoize enrichedFilterOptions with stable dependencies
  const enrichedFilterOptions = useMemo(() => {
    return filterOptions.map((option) => ({
      ...option,
      count: counts[option.value] || 0,
    }))
  }, [filterOptions, counts])

  // Memoize searchedAppointments with optimized filtering
  const searchedAppointments = useMemo(() => {
    if (!searchQuery.trim()) return filteredAppointments
    const query = searchQuery.toLowerCase().trim()
    return filteredAppointments.filter((appointment: Appointment) =>
      [
        appointment.customerName.toLowerCase(),
        appointment.status.toLowerCase(),
        appointment.service?.title.toLowerCase() || '',
        appointment.selectedDate.toLowerCase(),
        appointment.selectedTime.toLowerCase(),
      ].some((field) => field.includes(query)),
    )
  }, [filteredAppointments, searchQuery])

  const handleRefresh = useCallback(() => {
    if (debounceTimeout.current || isRefreshing) return
    debounceTimeout.current = setTimeout(() => {
      dispatch(fetchAppointments(true)).then((action) => {
        if (fetchAppointments.fulfilled.match(action)) {
          hasAttemptedEmptyFetch.current =
            Array.isArray(action.payload) && action.payload.length === 0
        }
        debounceTimeout.current = null
      })
    }, 300)
  }, [dispatch, isRefreshing])

  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(deleteAppointment(id))
    },
    [dispatch],
  )

  // Fetch data only once on mount, avoiding redundant calls
  useEffect(() => {
    if (hasFetchedOnce.current || isLoading || isRefreshing || hasFetched)
      return
    hasFetchedOnce.current = true
    dispatch(fetchAppointments(false)).then((action) => {
      if (fetchAppointments.fulfilled.match(action)) {
        hasAttemptedEmptyFetch.current =
          Array.isArray(action.payload) && action.payload.length === 0
      }
    })
  }, [isLoading, isRefreshing, hasFetched, dispatch])

  // Reset filters on success with no results, but only if filter needs resetting
  useEffect(() => {
    if (
      success &&
      searchedAppointments.length === 0 &&
      !searchQuery &&
      activeFilter !== 'today'
    ) {
      dispatch(setActiveFilter('today'))
    }
  }, [success, searchedAppointments, searchQuery, activeFilter, dispatch])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchAppointments(false))
    }, 300000)
    return () => clearInterval(interval)
  }, [dispatch])

  // Cleanup debounce
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-hidden py-0.5">
      <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
        <div
          className={cn(
            'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
            'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
          )}
        >
          {enrichedFilterOptions
            .filter((option) => activeFilters.includes(option.value))
            .map((option, index) => (
              <FilterTabs
                key={index}
                {...option}
                sliceName="appointment"
                onDispatch={(filter: string) =>
                  dispatch(setActiveFilter(option.value))
                }
              />
            ))}
        </div>
        <div className="flex gap-2 min-w-1/4 lg:gap-3 justify-between">
          <SearchBar
            className="bg-white rounded-[8px]"
            placeholder="Search by details"
            width="w-full max-w-[530px]"
            onSearch={(value) => setSearchQuery(value)}
          />
          <div className="flex gap-3 justify-end">
            <FilterDropdown<AppointmentFilterValue>
              filterOptions={enrichedFilterOptions}
              activeFilters={activeFilters}
              defaultFilters={DEFAULT_APPOINTMENT_FILTERS_VALUES}
              sliceName="appointment"
              onDispatch={{ setActiveFilter, setActiveFilters }}
            />
            <div
              className={cn(
                'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-700 hover:scale-110',
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

      <div className="flex-1 h-full min-h-0 rounded-lg overflow-y-auto">
        {isLoading && !hasFetched ? (
          <div className="text-center py-8 text-sm text-gray-500 italic">
            Loading appointments...
          </div>
        ) : searchedAppointments.length > 0 ? (
          <>
            {viewMode === 'list' && (
              <div className="w-full overflow-x-auto">
                <div className="space-y-3">
                  {searchedAppointments.map((item) => (
                    <AppointmentItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
            {viewMode === 'card' && (
              <div
                className={cn(
                  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4',
                  'pb-6',
                )}
              >
                {searchedAppointments.map((item) => (
                  <AppointmentCard key={item.id} item={item} />
                ))}
              </div>
            )}
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
                {searchQuery ? (
                  <>
                    No appointments match your search query "{searchQuery}" for{' '}
                    {activeFilter === 'all'
                      ? 'all appointments'
                      : `${activeFilter} appointments`}
                    .
                  </>
                ) : (
                  <>
                    No appointments found for{' '}
                    {activeFilter === 'all'
                      ? 'all appointments'
                      : `${activeFilter} appointments`}
                    .
                  </>
                )}
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
  )
}

export default Page
