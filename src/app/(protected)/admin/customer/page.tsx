'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import SearchBar from '@/components/shared/layout/search-bar'
import { ChevronDown, Funnel, RefreshCcw } from 'lucide-react'
import DataTable from '@/components/table/data-table'

import { Appointment } from '@/data/appointment'

import Image from 'next/image'

import AppointmentCard from '../appointment/_component/appointment-card'
import AppointmentGrid from '../appointment/_component/appointment-grid'
import { columns } from '../customer/_data/column'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { filterCustomerOptions } from './_data/data'
import FilterTabs from './_component/filter-tabs-customer'
import { User } from './_types/customer'
import CustomerCard from './_component/customer-card'
import { deleteCustomer } from './_api-call/customer-api-call'
import { fetchCustomers } from '@/store/slices/customerSlice'

const Page = () => {
  // const dispatch = useDispatch()
  const { isLoading, isRefreshing, customers, hasFetched, filteredCustomers } =
    useSelector((state: RootState) => state.customer)
  // const { viewMode } = useSelector((state: RootState) => state.view)
  const dispatch = useDispatch<AppDispatch>()
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const hasFetchedOnce = useRef(false)
  const { viewMode } = useSelector((state: RootState) => state.view)

  const [seletedData, setSelectedData] = useState<User[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('member')
  useEffect(() => {
    setSelectedData(seletedData)
  }, [seletedData])

  // Dynamic filterOptions
  const filterOptions = useMemo(
    () => filterCustomerOptions(customers),
    [customers],
  )

  // Initial fetch
  useEffect(() => {
    if (hasFetchedOnce.current || isLoading || isRefreshing || hasFetched) {
      return
    }
    console.log('Initial fetch triggered: no data fetched')
    hasFetchedOnce.current = true
    // dispatch(fetchCustomers(false))
  }, [isLoading, isRefreshing, hasFetched, dispatch])

  // Auto-refresh every 5 minutes (silent)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Silent auto-refresh triggered')
      dispatch(fetchCustomers(false))
    }, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [dispatch])

  // // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    if (debounceTimeout.current) {
      return
    }
    console.log('Manual refresh triggered')
    debounceTimeout.current = setTimeout(() => {
      dispatch(fetchCustomers(true))
      debounceTimeout.current = null
    }, 300)
  }, [dispatch])

  // Delete handler
  const handleDelete = useCallback(
    async (id: string) => {
      // await dispatch(deleteCustomer(id))
    },
    [dispatch],
  )

  // Memoized columns with delete handler
  const memoizedColumns = useMemo(() => columns, [handleDelete])

  return (
    <div className="flex flex-col gap-4 overflow-visible">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2">
        <div className="w-fit flex items-center gap-2 overflow-auto px-0.5 bg-white h-11 rounded-[10px] border-[1px] border-[#E5E7EB]">
          {filterOptions.map((option, index) => {
            return (
              <FilterTabs
                key={index}
                option={option}
                activeFilter={activeFilter}
                setSelectedData={setSelectedData}
                setActiveFilter={setActiveFilter}
              />
            )
          })}
        </div>
        <div className="flex flex-row gap-2 md:gap-0 lg:gap-3 justify-between  max-h-10">
          <SearchBar
            className="bg-white rounded-[8px]"
            placeholder="Search customer"
            width="w-[330px]"
            onSearch={(value) => console.log(value)}
          />

          <div className="flex  gap-3 justify-end">
            <div className="flex text-[#6B7280] items-center gap-1 justify-center border-[1px] bg-[#FFFFFF] border-[#E5E7EB] rounded-[8px] w-24.5 cursor-pointer hover:scale-110 transition duration-400">
              <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
              <div className=" text-sm font-normal">Filter</div>
              <ChevronDown strokeWidth={2.5} size={14} />
            </div>
            <div className="flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-400 hover:scale-110 ">
              <RefreshCcw strokeWidth={2.5} size={18} />
            </div>
          </div>
        </div>
      </div>
      {/* <DataTable columns={columns} data={seletedData} rowKey="id" /> */}

      {/* Main Data Section */}
      <div className="flex-1">
        {isLoading && !hasFetched ? (
          <div className="text-center py-8 text-sm text-gray-500 italic">
            Loading csutomers...
          </div>
        ) : filteredCustomers.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <div className="w-full overflow-x-auto">
                <div className="min-w-max">
                  <DataTable
                    columns={memoizedColumns}
                    data={filteredCustomers}
                    rowKey="id"
                  />
                </div>
              </div>
            ) : viewMode === 'card' ? (
              <div className="flex flex-col max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-530px)] xl:max-h-[calc(100vh-360px)] overflow-y-auto gap-2">
                {filteredCustomers.map((item) => (
                  <CustomerCard item={item} key={item.id} />
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="h-full overflow-y-visible">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 h-full overflow-y-auto max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-530px)] xl:max-h-[calc(100vh-360px)]">
                  {filteredCustomers.map((item) => (
                    <AppointmentGrid item={item} key={item.id} />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="py-18 h-full flex items-center justify-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/assets/ecommerce.svg"
                alt="ecommerce"
                width={140}
                height={140}
              />
              <div className="text-2xl text-[#4F7CFF] font-semibold">
                No Customers Found
              </div>
              <div className="text-[#9F9C9C] text-sm font-medium">
                No customers found for{' '}
                {activeFilter !== 'all'
                  ? `'${filterOptions.find((opt) => opt.value === activeFilter)?.label}'`
                  : ''}
                .
                <button
                  className="p-1 ml-1 text-blue-600 hover:underline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  aria-label="Retry fetching appointments"
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
