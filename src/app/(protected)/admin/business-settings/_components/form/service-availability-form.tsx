'use client' // Marks this as a Client Component in Next.js

// Import necessary components and libraries
import BusinessDaySelector from '@/components/custom-form-fields/business-settings/business-day-selector'
import BusinessHourSelector from '@/components/custom-form-fields/business-settings/business-hour-selector'
import React, { useEffect, useState } from 'react'
import {
  createBusinessDetail,
  updateBusinessDetail,
  WeekDay,
  WeekDays,
} from '@/store/slices/businessSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import { businessAvailabilityFormSchema } from '../../_schema/schema'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import {
  convertServiceAvailabilityToApi,
  convertServiceAvailabilityToObject,
  convertToApiFormat,
} from '@/lib/business-availability'
import { ServiceAvailability } from '../../../service/_types/service'
import { normalizeWeekDays } from './business-availability'

// Main component for managing service availability
const ServiceAvailabilityForm = ({
  onBack, // Callback for back button
  data, // Initial service availability data
}: {
  onBack: () => void
  data: ServiceAvailability[] | undefined
}) => {
  // State for managing view mode (default/custom)
  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const dispatch = useDispatch<AppDispatch>()

  // Get business data from Redux store
  const businessDetailForm = useSelector(
    (state: RootState) => state.business?.businessDetailForm,
  )
  const businessDetail = useSelector(
    (state: RootState) => state.business?.businessDetail,
  )
  const businessAvailabilityForm = useSelector(
    (state: RootState) => state.business?.businessAvailabilityForm,
  )

  // State for active day and form values
  const [activeDay, setActiveDay] = useState<WeekDay>('Mon')
  const {
    businessHours,
    breakHours,
    businessAvailabilityValues,
    timeZone,
    holidays,
  } = useSelector((state: RootState) => {
    const form = state.business.businessAvailabilityForm?.[0]
    return {
      businessHours: form?.businessHours,
      breakHours: form?.breakHours,
      businessAvailabilityValues: form?.businessAvailability,
      timeZone: form?.timeZone,
      holidays: form?.holidays || [],
    }
  })

  const user = useSelector((state: RootState) => state.auth.user)
  const businessForm = businessAvailabilityForm?.[0]

  // State for toggles
  const [isServiceVisible, setIsServiceVisible] = useState(true)
  const [isPricingEnabled, setIsPricingEnabled] = useState(false)

  // Toggle handlers
  const handleServiceVisibility = (checked: boolean) => {
    setIsServiceVisible(checked)
  }
  const handlePricingToggle = (checked: boolean) => {
    setIsPricingEnabled(checked)
  }

  const defaultValues = {
    serviceAvailability: businessAvailabilityValues ?? [],
    serviceDays: businessHours ?? {},
    breakHours: breakHours ?? {},
    holidays: holidays ?? [],
  }

  // Initialize form with react-hook-form
  const form = useForm({
    defaultValues, // Initial form values
  })

  // Reset form when data changes
  // useEffect(() => {
  //   form.reset(defaultValues)
  // }, [data, businessForm, businessHours, breakHours, businessAvailabilityValues])

  // Form submission handler
  const onSubmit = (data: any) => {
    // Convert form data to API format
    const updatedBusinessAvailabilityForm = convertToApiFormat({
      timeZone: timeZone ?? '',
      businessAvailability: businessAvailabilityValues ?? [],
      businessHours: businessHours ?? {},
      breakHours: breakHours ?? {},
      holidays: holidays ?? [],
    })

    const updatedServiceAvailability = convertServiceAvailabilityToApi(
      data?.serviceDays,
    )

    // Update or create business details
    if (businessDetail?.id) {
      const dataToAPpi = {
        id: businessDetail?.id,
        ...businessDetailForm,
        ...updatedBusinessAvailabilityForm,
        businessOwner: user?.id,
        serviceAvailability: updatedServiceAvailability,
      }
      dispatch(
        updateBusinessDetail({
          id: businessDetail?.id as string,
          data: dataToAPpi,
        }),
      )
    } else {
      const dataToAPpi = {
        ...businessDetailForm,
        ...updatedBusinessAvailabilityForm,
        businessOwner: user?.id,
        serviceAvailability: updatedServiceAvailability,
      }
      dispatch(createBusinessDetail({ data: dataToAPpi }))
    }
  }

  // Render the form UI
  return (
    <FormProvider {...form}>
      <form
        className="space-y-8 mt-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Mode selector (Default/Custom) */}
        <div className="flex flex-col gap-4 w-full pt-4">
          <div className="flex bg-[#BBBBBB]/60 rounded-[8px] overflow-hidden w-fit p-1 h-10">
            {['default', 'custom'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCurrentMode(mode as 'default' | 'custom')}
                className={`w-[100px] text-base font-medium ${
                  currentMode === mode
                    ? 'text-blue-600 bg-white rounded-[6px]'
                    : 'text-gray-600'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Business day and hour selectors */}
          <div className="flex p-3 flex-col gap-6 border border-[#E9E9E9] rounded-[4px]">
            <BusinessDaySelector
              name="serviceAvailability"
              label="Service Days"
              className="border border-blue-200 rounded-[8px]"
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              currentMode={currentMode}
              setCurrentMode={setCurrentMode}
            />
            <BusinessHourSelector
              name="serviceDays"
              dayName="serviceAvailability"
              label="Service Hours"
              initialBusinessHours={normalizeWeekDays(
                defaultValues.serviceDays,
              )}
              businessBreaks={normalizeWeekDays(defaultValues.breakHours)}
              className="border border-blue-200 rounded-[4px]"
              activeDay={activeDay}
              restrictToInitialHours={true}
              isDefault={currentMode === 'default'}
              setCustom={setCurrentMode}
            />
          </div>

          {/* Toggle switches */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-medium text-[#111827]')}>
                Service Visibility
              </span>
              <Switch
                checked={isServiceVisible}
                onCheckedChange={handleServiceVisibility}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-medium text-[#111827]')}>
                Enable Pricing?
              </span>
              <Switch
                checked={isPricingEnabled}
                onCheckedChange={handlePricingToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-between text-[#BBBBBB]">
          <button
            className="flex gap-1 items-center cursor-pointer"
            disabled
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            <div className="text-[#BBBBBB] text-sm font-normal">Back</div>
          </button>
          <div className="flex gap-4">
            <button
              className="flex gap-1 items-center cursor-pointer text-[#6AA9FF]"
              onClick={onBack}
            >
              <div className="text-[##6AA9FF] text-sm font-normal">Skip</div>
              <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </button>
            <Button type="submit" className="cursor-pointer">
              Save and Continue
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default ServiceAvailabilityForm
