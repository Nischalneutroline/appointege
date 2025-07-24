'use client'

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

const weekDayToWeekDays: Record<WeekDay, WeekDays> = {
  Mon: WeekDays.MONDAY,
  Tue: WeekDays.TUESDAY,
  Wed: WeekDays.WEDNESDAY,
  Thu: WeekDays.THURSDAY,
  Fri: WeekDays.FRIDAY,
  Sat: WeekDays.SATURDAY,
  Sun: WeekDays.SUNDAY,
}

// Get all days of the week
const allDays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const ServiceAvailabilityForm = ({
  onBack,
  onSubmitSuccess,
  data,
}: {
  onBack: () => void
  onSubmitSuccess: () => void
  data: ServiceAvailability[] | undefined
}) => {
  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const dispatch = useDispatch<AppDispatch>()

  const businessDetailForm = useSelector(
    (state: RootState) => state.business?.businessDetailForm,
  )
  const businessDetail = useSelector(
    (state: RootState) => state.business?.businessDetail,
  )
  const businessAvailabilityForm = useSelector(
    (state: RootState) => state.business?.businessAvailabilityForm,
  )

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
  const weekDays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const businessForm = businessAvailabilityForm?.[0]

  const defaultValues = React.useMemo(() => {
    const toWeekDay = (day: WeekDays): WeekDay => {
      const dayMap: Record<WeekDays, WeekDay> = {
        [WeekDays.MONDAY]: 'Mon',
        [WeekDays.TUESDAY]: 'Tue',
        [WeekDays.WEDNESDAY]: 'Wed',
        [WeekDays.THURSDAY]: 'Thu',
        [WeekDays.FRIDAY]: 'Fri',
        [WeekDays.SATURDAY]: 'Sat',
        [WeekDays.SUNDAY]: 'Sun',
      }
      return dayMap[day]
    }

    // Initialize defaults
    const defaults = {
      serviceAvailability: [] as WeekDay[],
      serviceDays: {} as Record<WeekDay, [string, string][]>,
      breakHours: {} as Record<WeekDay, [string, string][]>,
    }

    // Initialize empty arrays for each day
    weekDays.forEach((day) => {
      defaults.serviceDays[day] = []
      defaults.breakHours[day] = []
    })

    // 1. Use data from businessDetail if available
    if (data && data?.length > 0) {
      defaults.serviceAvailability = data.map((entry) =>
        toWeekDay(entry.weekDay),
      )

      defaults.serviceDays = convertServiceAvailabilityToObject(data)
      // Initialize break hours from data if available
      weekDays.forEach((day) => {
        if (breakHours) {
          defaults.breakHours[day] = breakHours?.[day] ?? []
        } else {
          defaults.breakHours[day] = []
        }
      })
      console.log(defaults, 'defa')
      return defaults
    }
    // 2. Use businessAvailabilityForm from Redux if available
    else if (businessAvailabilityForm) {
      defaults.serviceAvailability = (businessAvailabilityValues ?? []).map(
        (d: string) => toWeekDay(d as WeekDays),
      )

      weekDays.forEach((day) => {
        defaults.serviceDays[day] = businessHours?.[day] ?? []
        defaults.breakHours[day] = breakHours?.[day] ?? []
      })
    }
    // 3. Fallback: hardcoded defaults (Mon-Fri, 9-5)
    else {
      const weekdays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      defaults.serviceAvailability = [...weekdays]

      weekdays.forEach((day) => {
        defaults.serviceDays[day] = [['09:00', '17:00']]
      })
    }

    return defaults
  }, [
    data,
    businessForm,
    businessAvailabilityValues,
    businessHours,
    breakHours,
  ])

  const [isServiceVisible, setIsServiceVisible] = useState(true)
  const [isPricingEnabled, setIsPricingEnabled] = useState(false)
  // const user = useSelector((state: RootState) => state.auth.user)
  const handleServiceVisibility = (checked: boolean) => {
    setIsServiceVisible(checked)
  }
  const handlePricingToggle = (checked: boolean) => {
    setIsPricingEnabled(checked)
  }
  console.log(defaultValues, 'defaultValues')
  const form = useForm({
    // resolver: zodResolver(businessAvailabilityFormSchema),
    defaultValues,
  })
  // // useEffect
  // useEffect(() => {
  //   if (Array.isArray(data) && data.length > 0) {
  //     const normalized = data.map((item) => ({
  //       ...item,
  //       timeSlots: item.timeSlots ?? [],
  //     }))
  //     const serviceAvailabilityData =
  //       convertServiceAvailabilityToObject(normalized)
  //     console.log(serviceAvailabilityData, 'Service Availability Data')
  //   }
  // }, [data, businessForm, businessDetailForm])

  useEffect(() => {
    form.reset(defaultValues)
  }, [data, businessForm])
  // Onsubmit handler
  const onSubmit = (data: any) => {
    console.log(form.formState.errors, 'Form error')
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
    console.log(updatedBusinessAvailabilityForm, 'updated Values')

    // return updatedData
    if (businessDetail?.id) {
      const dataToAPpi = {
        id: businessDetail?.id,
        ...businessDetailForm,
        ...updatedBusinessAvailabilityForm,
        businessOwner: user?.id,
        serviceAvailability: updatedServiceAvailability,
      }
      console.log(dataToAPpi, 'data to api')
      dispatch(
        updateBusinessDetail({
          id: businessDetail?.id as string,
          data: dataToAPpi,
        }),
      )
    }
    if (!businessDetail?.id) {
      const dataToAPpi = {
        ...businessDetailForm,
        ...updatedBusinessAvailabilityForm,
        businessOwner: user?.id,
        serviceAvailability: updatedServiceAvailability,
      }
      console.log(dataToAPpi, 'data to api')
      dispatch(createBusinessDetail({ data: dataToAPpi }))
    }
  }
  return (
    <FormProvider {...form}>
      <form
        className="space-y-8 mt-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
            />
          </div>

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

        {/* Submit button to save the form */}
        <div className="flex justify-between text-[#BBBBBB]    ">
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
