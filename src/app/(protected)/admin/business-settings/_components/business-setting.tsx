'use client'
import { cn } from '@/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import BusinessAvailability from './business-availability'
import BusinessDetail from './business-details'
import Image from 'next/image'
import {
  completeStep,
  fetchBusinessDetail,
  setActiveStep,
} from '@/store/slices/businessSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'
import BusinessAvailabilityForm from './business-availability'
import { ServiceAvailabilityForm } from './service-availability-form'
const STORAGE_KEY1 = 'business-detail-form'
const STORAGE_KEY2 = 'business-availability-form'

const BusinessSetting = () => {
  const businessId = 'cmd1knwcn0004msbwkogvbvx62'
  const dispatch = useDispatch<AppDispatch>()
  const [data1, setData1] = useState<string | null>(null)
  const [data2, setData2] = useState<string | null>(null)
  const [currentMode, setCurrentMode] = useState('business-details')
  const { businessDetail, isLoading, activeStep } = useSelector(
    (state: RootState) => state.business,
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored1 = localStorage.getItem(STORAGE_KEY1)
      const stored2 = localStorage.getItem(STORAGE_KEY2)
      setData1(stored1)
      setData2(stored2)
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      dispatch(fetchBusinessDetail(businessId))
    }
  }, [dispatch])
  const handleBack = useCallback(() => {
    dispatch(setActiveStep('business-settings'))
  }, [dispatch])

  const handleBusinessDetailSubmitSuccess = useCallback(() => {
    dispatch(setActiveStep('business-details'))
    setCurrentMode('business-availability')
  }, [dispatch])
  const handleBusinessAvailabilitySubmitSuccess = useCallback(() => {
    dispatch(completeStep('busines-details'))
    dispatch(setActiveStep('service'))
    setCurrentMode('service-availability')
  }, [dispatch])
  const handleServiceAvailabilitySubmitSuccess = useCallback(() => {
    dispatch(completeStep('services'))
    dispatch(setActiveStep('business-details'))
    setCurrentMode('business-details')
  }, [dispatch])

  console.log(businessDetail, 'busienssDetail')
  return (
    <div className="flex flex-col gap-4 w-full">
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
          Setup your business details, hours and business availability
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="relative rounded-[8px]  w-full md:w-fit overflow-hidden bg-[#EDF7FF] p-2 gap-4 md:gap-8 flex flex-col md:flex-row  items-center">
          {/* Sliding background */}
          <div
            className={`absolute flex h-10  w-[90%] md:w-[200px] rounded-md z-10 bg-white transition-all duration-300 ease-in-out ${
              currentMode === 'business-details'
                ? 'md:translate-x-0 '
                : currentMode === 'service-availability'
                  ? 'md:translate-x-[232%] '
                  : 'md:translate-x-[116%]'
            }`}
            style={{
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          />

          {/* Default Button */}
          <button
            type="button"
            className={cn(
              'relative z-10 w-[200px] h-8 text-base font-medium transition-colors duration-300 cursor-pointer',
              currentMode === 'business-details'
                ? 'text-blue-600'
                : 'text-gray-600',
            )}
            onClick={() => setCurrentMode('business-details')}
          >
            Business details
          </button>

          {/* Custom Button */}
          <button
            type="button"
            className={cn(
              'relative z-10 h-8 w-[200px] text-base font-medium transition-colors duration-300 cursor-pointer',
              currentMode === 'business-availability'
                ? 'text-blue-600'
                : 'text-gray-600',
            )}
            onClick={() => setCurrentMode('business-availability')}
          >
            Business Availability
          </button>
          <button
            type="button"
            className={cn(
              'relative z-10 h-8 w-[200px] text-base font-medium transition-colors duration-300 cursor-pointer ',
              currentMode === 'service-availability'
                ? 'text-blue-600'
                : 'text-gray-600 cursor-not-allowed',
            )}
            // onClick={() => setCurrentMode('service-availability')}
          >
            Service Availability
          </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-260px)]">
          {currentMode === 'business-details' && isLoading && (
            <div className="flex justify-center items-center py-10 sm:py-20 text-muted-foreground text-sm">
              Loading Business Details...
            </div>
          )}
          {currentMode === 'business-details' && !isLoading && (
            <BusinessDetail
              setTab={(tab) => setCurrentMode(tab)}
              data={businessDetail || {}}
              onBack={handleBack}
              onSubmitSuccess={handleBusinessDetailSubmitSuccess}
            />
          )}
          {currentMode === 'business-availability' && isLoading && (
            <div className="flex justify-center items-center py-10 sm:py-20 text-muted-foreground text-sm">
              Loading Business Availability...
            </div>
          )}
          {currentMode === 'business-availability' && !isLoading && (
            <BusinessAvailabilityForm
              setTab={(tab: string) => setCurrentMode(tab)}
              data={businessDetail || {}}
              onBack={handleBack}
              onSubmitSuccess={handleBusinessAvailabilitySubmitSuccess}
            />
          )}
          {currentMode === 'service-availability' && !isLoading && (
            <ServiceAvailabilityForm
              onBack={handleBack}
              onSubmitSuccess={handleServiceAvailabilitySubmitSuccess}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default BusinessSetting
