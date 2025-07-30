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
