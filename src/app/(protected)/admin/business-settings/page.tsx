'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchBusinessByOwnerId } from '@/store/slices/businessSlice'
import BusinessDetail from './_components/form/business-details'
import BusinessAvailabilityForm from './_components/form/business-availability'
import { BusinessTab, setActiveTab } from '@/store/slices/businessSlice'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import ServiceAvailabilityForm from './_components/form/service-availability-form'
import ReminderForm from './_components/form/remiders-form'

const BusinessSettingsPage = ({
  businessOwnerId,
}: {
  businessOwnerId: string
}) => {
  const {
    activeTab,
    loading: isLoading,
    error,
    selectedBusiness,
  } = useSelector((state: RootState) => state.business)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Fetch business data if not already fetched
    if (!selectedBusiness) {
      dispatch(fetchBusinessByOwnerId(businessOwnerId))
    }
  }, [dispatch, businessOwnerId, selectedBusiness])

  return (
    <div className="flex flex-col gap-4 w-full">
      {error && <div className="text-red-600">{error}</div>}
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-2.5 items-center">
          <Image
            src="/assets/building-2.svg"
            alt="Business Icon"
            width={24}
            height={24}
          />
          <div className="text-[#111827] font-semibold text-lg">
            Business Settings
          </div>
        </div>
        <div className="font-normal text-sm text-[#111827]">
          Setup your business details, hours, and business availability
        </div>
      </div>
      {/* Tabs */}
      <div className="flex flex-col gap-2 w-full">
        <div className="relative rounded-[8px] w-full md:w-fit overflow-hidden bg-[#EDF7FF] p-2 gap-4 md:gap-8 flex flex-col md:flex-row items-center">
          <div
            className={cn(
              'absolute flex h-10 w-[90%] md:w-[200px] rounded-md z-10 bg-white transition-all duration-300 ease-in-out',
              activeTab === BusinessTab.BusinessDetail
                ? 'md:translate-x-0'
                : activeTab === BusinessTab.BusinessAvailability
                  ? 'md:translate-x-[116%]'
                  : activeTab === BusinessTab.ServiceAvailability
                    ? 'md:translate-x-[232%]'
                    : activeTab === BusinessTab.Reminder
                      ? 'md:translate-x-[348%]'
                      : 'md:translate-x-[464%]',
            )}
            style={{ boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)' }}
          />
          <button
            type="button"
            className={cn(
              'relative z-10 w-[200px] h-8 text-base font-medium transition-colors duration-300 cursor-pointer',
              activeTab === BusinessTab.BusinessDetail
                ? 'text-blue-600'
                : 'text-gray-600',
            )}
            onClick={() => dispatch(setActiveTab(BusinessTab.BusinessDetail))}
          >
            Business Details
          </button>
          <button
            type="button"
            className={cn(
              'relative z-10 h-8 w-[200px] text-base font-medium transition-colors duration-300 cursor-pointer',
              activeTab === BusinessTab.BusinessAvailability
                ? 'text-blue-600'
                : 'text-gray-600',
            )}
            onClick={() =>
              dispatch(setActiveTab(BusinessTab.BusinessAvailability))
            }
          >
            Business Availability
          </button>
          <button
            type="button"
            className={cn(
              'relative z-10 h-8 w-[200px] text-base font-medium transition-colors duration-300 cursor-pointer',
              activeTab === BusinessTab.ServiceAvailability
                ? 'text-blue-600'
                : 'text-gray-600',
            )}
            onClick={() =>
              dispatch(setActiveTab(BusinessTab.ServiceAvailability))
            }
          >
            Service Availability
          </button>
          <button
            type="button"
            className={cn(
              'relative z-10 h-8 w-[200px] text-base font-medium transition-colors duration-300 cursor-pointer',
              activeTab === BusinessTab.Reminder
                ? 'text-blue-600'
                : 'text-gray-600',
            )}
            onClick={() => dispatch(setActiveTab(BusinessTab.Reminder))}
          >
            Reminder
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-260px)]">
          {isLoading && (
            <div className="flex justify-center items-center py-10 sm:py-20 text-muted-foreground text-sm">
              Loading...
            </div>
          )}
          {!isLoading && activeTab === BusinessTab.BusinessDetail && (
            <BusinessDetail data={selectedBusiness} />
          )}
          {!isLoading && activeTab === BusinessTab.BusinessAvailability && (
            <BusinessAvailabilityForm />
          )}
          {!isLoading && activeTab === BusinessTab.ServiceAvailability && (
            <ServiceAvailabilityForm />
          )}
          {!isLoading && activeTab === BusinessTab.Reminder && <ReminderForm />}
        </div>
      </div>
    </div>
  )
}

export default BusinessSettingsPage
