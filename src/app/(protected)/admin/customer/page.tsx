// 'use client'

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// import SearchBar from '@/components/shared/layout/search-bar'
// import { ChevronDown, Funnel, RefreshCcw } from 'lucide-react'
// import DataTable from '@/components/table/data-table'

// import { Appointment } from '@/data/appointment'

// import Image from 'next/image'

// import AppointmentCard from '../appointment/_component/appointment-card'
// import AppointmentGrid from '../appointment/_component/appointment-grid'
// import { columns } from '../customer/_data/column'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import { filterCustomerOptions } from './_data/data'
// import FilterTabs from './_component/filter-tabs-customer'
// import { User } from './_types/customer'
// import CustomerCard from './_component/customer-card'
// import { deleteCustomer } from './_api-call/customer-api-call'
// import { fetchCustomers } from '@/store/slices/customerSlice'

// const Page = () => {
//   // const dispatch = useDispatch()
//   const { isLoading, isRefreshing, customers, hasFetched, filteredCustomers } =
//     useSelector((state: RootState) => state.customer)
//   // const { viewMode } = useSelector((state: RootState) => state.view)
//   const dispatch = useDispatch<AppDispatch>()
//   const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
//   const hasFetchedOnce = useRef(false)
//   const { viewMode } = useSelector((state: RootState) => state.view)

//   const [seletedData, setSelectedData] = useState<User[]>([])
//   const [activeFilter, setActiveFilter] = useState<string>('member')
//   useEffect(() => {
//     setSelectedData(seletedData)
//   }, [seletedData])

//   // Dynamic filterOptions
//   const filterOptions = useMemo(
//     () => filterCustomerOptions(customers),
//     [customers],
//   )

//   // Initial fetch
//   useEffect(() => {
//     if (hasFetchedOnce.current || isLoading || isRefreshing || hasFetched) {
//       return
//     }
//     console.log('Initial fetch triggered: no data fetched')
//     hasFetchedOnce.current = true
//     // dispatch(fetchCustomers(false))
//   }, [isLoading, isRefreshing, hasFetched, dispatch])

//   // Auto-refresh every 5 minutes (silent)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       console.log('Silent auto-refresh triggered')
//       dispatch(fetchCustomers(false))
//     }, 300000) // 5 minutes
//     return () => clearInterval(interval)
//   }, [dispatch])

//   // // Cleanup debounce on unmount
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
//       dispatch(fetchCustomers(true))
//       debounceTimeout.current = null
//     }, 300)
//   }, [dispatch])

//   // Delete handler
//   const handleDelete = useCallback(
//     async (id: string) => {
//       // await dispatch(deleteCustomer(id))
//     },
//     [dispatch],
//   )

//   // Memoized columns with delete handler
//   const memoizedColumns = useMemo(() => columns, [handleDelete])

//   return (
//     <div className="flex flex-col gap-4 overflow-visible">
//       <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2">
//         <div className="w-fit flex items-center gap-2 overflow-auto px-0.5 bg-white h-11 rounded-[10px] border-[1px] border-[#E5E7EB]">
//           {filterOptions.map((option, index) => {
//             return (
//               <FilterTabs
//                 key={index}
//                 option={option}
//                 activeFilter={activeFilter}
//                 setSelectedData={setSelectedData}
//                 setActiveFilter={setActiveFilter}
//               />
//             )
//           })}
//         </div>
//         <div className="flex flex-row gap-2 md:gap-0 lg:gap-3 justify-between  max-h-10">
//           <SearchBar
//             className="bg-white rounded-[8px]"
//             placeholder="Search customer"
//             width="w-[330px]"
//             onSearch={(value) => console.log(value)}
//           />

//           <div className="flex  gap-3 justify-end">
//             <div className="flex text-[#6B7280] items-center gap-1 justify-center border-[1px] bg-[#FFFFFF] border-[#E5E7EB] rounded-[8px] w-24.5 cursor-pointer hover:scale-110 transition duration-400">
//               <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
//               <div className=" text-sm font-normal">Filter</div>
//               <ChevronDown strokeWidth={2.5} size={14} />
//             </div>
//             <div className="flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-400 hover:scale-110 ">
//               <RefreshCcw strokeWidth={2.5} size={18} />
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* <DataTable columns={columns} data={seletedData} rowKey="id" /> */}

//       {/* Main Data Section */}
//       <div className="flex-1">
//         {isLoading && !hasFetched ? (
//           <div className="text-center py-8 text-sm text-gray-500 italic">
//             Loading csutomers...
//           </div>
//         ) : filteredCustomers.length > 0 ? (
//           <>
//             {viewMode === 'list' ? (
//               <div className="w-full overflow-x-auto">
//                 <div className="min-w-max">
//                   <DataTable
//                     columns={memoizedColumns}
//                     data={filteredCustomers}
//                     rowKey="id"
//                   />
//                 </div>
//               </div>
//             ) : viewMode === 'card' ? (
//               <div className="flex flex-col max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-530px)] xl:max-h-[calc(100vh-360px)] overflow-y-auto gap-2">
//                 {filteredCustomers.map((item) => (
//                   <CustomerCard item={item} key={item.id} />
//                 ))}
//               </div>
//             ) : viewMode === 'grid' ? (
//               <div className="h-full overflow-y-visible">
//                 <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 h-full overflow-y-auto max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-530px)] xl:max-h-[calc(100vh-360px)]">
//                   {filteredCustomers.map((item) => (
//                     <AppointmentGrid item={item} key={item.id} />
//                   ))}
//                 </div>
//               </div>
//             ) : null}
//           </>
//         ) : (
//           <div className="py-18 h-full flex items-center justify-center text-gray-500">
//             <div className="flex flex-col items-center gap-2">
//               <Image
//                 src="/assets/ecommerce.svg"
//                 alt="ecommerce"
//                 width={140}
//                 height={140}
//               />
//               <div className="text-2xl text-[#4F7CFF] font-semibold">
//                 No Customers Found
//               </div>
//               <div className="text-[#9F9C9C] text-sm font-medium">
//                 No customers found for{' '}
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
//                 or creating a new customer.
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
import DataTable from '@/components/table/data-table'
import { columns } from './_data/column'
import FilterTabs from '@/components/shared/layout/filter-tabs'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { cn } from '@/utils/utils'
import FilterDropdown from '@/components/shared/layout/filter-dropdown'
import {
  User,
  CustomerFilterValue,
  DEFAULT_CUSTOMER_FILTERS_VALUES,
} from './_types/customer'
import {
  deleteCustomer,
  fetchCustomers,
  setActiveFilter,
  setActiveFilters,
} from '@/store/slices/customerSlice'
import CustomerCard from './_component/customer-card'

const Page = () => {
  const {
    isLoading,
    isRefreshing,
    filteredCustomers,
    filterOptions,
    counts,
    hasFetched,
    success,
    activeFilter,
    activeFilters,
  } = useSelector((state: RootState) => state.customer)
  const { viewMode } = useSelector((state: RootState) => state.view)
  const dispatch = useDispatch<AppDispatch>()

  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('')

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const hasFetchedOnce = useRef(false)
  const hasAttemptedEmptyFetch = useRef(false)

  // Combine filterOptions with counts for FilterDropdown and FilterTabs
  const enrichedFilterOptions = useMemo(() => {
    return filterOptions.map((option) => ({
      ...option,
      count: counts[option.value] || 0,
    }))
  }, [filterOptions, counts])

  // Search logic: filter filteredCustomers based on search query: email, phone, name, status
  const searchedCustomers = useMemo(() => {
    let result = filteredCustomers
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      console.log('Searching with query:', query)
      result = filteredCustomers.filter((customer: User) => {
        const searchableFields = [
          customer.name?.toLowerCase() || '',
          ...(customer.status ?? []).map((status) => status.toLowerCase()),
          customer.email?.toLowerCase() || '',
          customer.phone?.toLowerCase() || '',
        ].filter(Boolean)
        const matches = searchableFields.some((field) => field.includes(query))
        console.log(`Customer ID ${customer.id}:`, {
          searchableFields,
          matches,
        })
        return matches
      })
    }
    console.log('Searched customers:', result)
    return result
  }, [filteredCustomers, searchQuery])

  const handleRefresh = useCallback(() => {
    if (debounceTimeout.current) return
    console.log('Manual refresh triggered')
    debounceTimeout.current = setTimeout(() => {
      dispatch(fetchCustomers(true)).then((action) => {
        if (action.type === fetchCustomers.fulfilled.type) {
          hasAttemptedEmptyFetch.current =
            Array.isArray(action.payload) && action.payload.length === 0
        }
        debounceTimeout.current = null
      })
    }, 300)
  }, [dispatch])

  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(deleteCustomer(id))
    },
    [dispatch],
  )

  const memoizedColumns = useMemo(() => columns, [])

  useEffect(() => {
    if (
      hasFetchedOnce.current ||
      isLoading ||
      isRefreshing ||
      (hasFetched && hasAttemptedEmptyFetch.current)
    ) {
      return
    }

    if (!hasFetched || filteredCustomers.length === 0) {
      console.log(
        `Triggering fetch: hasFetched=${hasFetched}, filteredCustomers.length=${filteredCustomers.length}`,
      )
      hasFetchedOnce.current = true
      dispatch(fetchCustomers(false)).then((action) => {
        if (action.type === fetchCustomers.fulfilled.type) {
          hasAttemptedEmptyFetch.current =
            Array.isArray(action.payload) && action.payload.length === 0
        }
      })
    }
  }, [isLoading, isRefreshing, hasFetched, filteredCustomers, dispatch])

  // Reset activeFilter and activeFilters to default after a successful update if no customers are found
  useEffect(() => {
    if (success && searchedCustomers.length === 0 && !searchQuery) {
      console.log(
        'Success detected, resetting activeFilter and activeFilters to default',
      )
      dispatch(setActiveFilter('all'))
      dispatch(setActiveFilters(DEFAULT_CUSTOMER_FILTERS_VALUES))
    }
  }, [success, searchedCustomers, searchQuery, dispatch])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Silent auto-refresh triggered')
      dispatch(fetchCustomers(false))
    }, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [dispatch])

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
            .filter(
              (option) =>
                activeFilters.includes(option.value) ||
                option.value === activeFilter,
            )
            .map((option, index) => (
              <FilterTabs
                key={index}
                {...option}
                sliceName="customer"
                onDispatch={setActiveFilter}
              />
            ))}
        </div>
        <div className="flex gap-2 min-w-1/4 lg:gap-3 justify-between">
          <SearchBar
            className="bg-white rounded-[8px]"
            placeholder="Search by details"
            width="w-full max-w-[530px]"
            onSearch={(value) => {
              console.log('Search:', value)
              setSearchQuery(value)
            }}
          />
          <div className="flex gap-3 justify-end">
            <FilterDropdown<CustomerFilterValue>
              filterOptions={enrichedFilterOptions}
              activeFilters={activeFilters}
              defaultFilters={DEFAULT_CUSTOMER_FILTERS_VALUES}
              sliceName="customer"
              onDispatch={{
                setActiveFilter,
                setActiveFilters,
              }}
            />
            <div
              className={cn(
                'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-700 hover:scale-110',
                isRefreshing && 'animate-spin',
              )}
              onClick={handleRefresh}
              aria-label={
                isRefreshing ? 'Refreshing customers' : 'Refresh customers'
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
            Loading customers...
          </div>
        ) : searchedCustomers.length > 0 ? (
          <>
            {viewMode === 'list' && (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                  <DataTable
                    columns={memoizedColumns}
                    data={searchedCustomers}
                    rowKey="id"
                  />
                </div>
              </div>
            )}
            {viewMode === 'card' && (
              <div
                className={cn(
                  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 ',
                  'pb-6',
                )}
              >
                {searchedCustomers.map((item) => (
                  <CustomerCard item={item} key={item.id} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/assets/ecommerce.svg"
                alt="No customers"
                width={140}
                height={140}
              />
              <div className="text-2xl text-[#4F7CFF] font-semibold">
                No Customers Found
              </div>
              <div className="text-[#9F9C9C] text-sm font-medium">
                {searchQuery ? (
                  <>
                    No customers match your search query "{searchQuery}" for{' '}
                    {activeFilter === 'all'
                      ? 'all customers'
                      : `${activeFilter} customers`}
                    .
                  </>
                ) : (
                  <>
                    No customers found for{' '}
                    {activeFilter === 'all'
                      ? 'all customers'
                      : `${activeFilter} customers`}
                    .
                  </>
                )}
                <button
                  className="p-1 ml-1 text-blue-600 hover:underline disabled:opacity-50"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isLoading}
                  aria-label="Retry fetching customers"
                >
                  Try refreshing
                </button>{' '}
                or creating a new customer.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
