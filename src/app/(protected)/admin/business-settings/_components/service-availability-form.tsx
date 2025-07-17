'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import BusinessDaysSelector from './business-selector'
import BusinessHours from './business-hours'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  updateBusinessDetail,
  createBusinessDetail,
  WeekDays,
} from '@/store/slices/businessSlice'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DaySchedule } from '@/lib/businessSchema'
import { transformBusinessToServiceSettings } from '@/lib/business-availability'
import { toast } from 'sonner'

export interface ServiceFormValues {
  serviceDays: { from: string; to: string }[]
  serviceHours: DaySchedule
  isServiceVisible: boolean
  isPricingEnabled: boolean
  serviceType: 'PHYSICAL' | 'ONLINE' | 'BOTH'
}

interface ServiceAvailabilityFormProps {
  onBack?: () => void
  onSubmitSuccess?: () => void
  defaultValues?: Partial<ServiceFormValues>
}

export const ServiceAvailabilityForm: React.FC<
  ServiceAvailabilityFormProps
> = ({ onBack, onSubmitSuccess, defaultValues: propDefaultValues }) => {
  const [isServiceVisible, setIsServiceVisible] = useState(true)
  const [isPricingEnabled, setIsPricingEnabled] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const handleServiceVisibility = (checked: boolean) => {
    setIsServiceVisible(checked)
  }
  const handlePricingToggle = (checked: boolean) => {
    setIsPricingEnabled(checked)
  }
  const dispatch = useDispatch<AppDispatch>()
  const { businessAvailability, holiday } = useSelector((state: RootState) => {
    const form = state.business.businessAvailabilityForm?.[0]
    return {
      businessAvailability: form?.businessAvailability || [],
      holiday: form?.holiday || [],
    }
  })
  const businessDetailForm = useSelector(
    (state: RootState) => state.business.businessDetailForm,
  )
  const businessDetail = useSelector(
    (state: RootState) => state.business.businessDetail,
  )

  // State variables
  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [manuallySelectedDay, setManuallySelectedDay] = useState<string | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(false)

  // Get business availability time constraints

  const form = useForm<ServiceFormValues>({
    defaultValues: {
      serviceDays: [{ from: 'monday', to: 'friday' }],
      serviceHours: {},
      isServiceVisible: true,
      isPricingEnabled: false,
      serviceType: 'PHYSICAL',
      ...propDefaultValues,
    },
  })

  const availability =
    businessDetail?.businessAvailability ?? businessAvailability ?? []

  const { serviceDays, serviceHours } =
    transformBusinessToServiceSettings(availability)

  // Get business days from business availability form
  //   const getBusinessDays = () => {
  //     if (businessAvailability && businessAvailability.length > 0) {
  //       const defaultValues =
  //         transformBusinessToServiceSettings(businessAvailability)
  //       return defaultValues?.serviceDays || [{ from: 'monday', to: 'friday' }]
  //     }
  //     return [{ from: 'monday', to: 'friday' }]
  //   }

  // Helper function to convert day range to array of days
  const convertDayRangeToDays = (
    ranges: { from: string; to: string }[],
  ): string[] => {
    const days: string[] = []
    const daysOfWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]

    // Filter out any undefined ranges and ensure from/to exist
    const validRanges = ranges.filter(
      (range) =>
        range &&
        typeof range.from === 'string' &&
        typeof range.to === 'string' &&
        range.from.trim() !== '' &&
        range.to.trim() !== '',
    )

    validRanges.forEach((range) => {
      const fromIndex = daysOfWeek.indexOf(range.from.toLowerCase())
      const toIndex = daysOfWeek.indexOf(range.to.toLowerCase())

      if (fromIndex !== -1 && toIndex !== -1) {
        const start = Math.min(fromIndex, toIndex)
        const end = Math.max(fromIndex, toIndex)

        for (let i = start; i <= end; i++) {
          const day = daysOfWeek[i]
          if (!days.includes(day)) {
            days.push(day)
          }
        }
      }
    })

    return days.length > 0
      ? days
      : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  }

  // Initialize form with business availability data
  useEffect(() => {
    form.reset({
      serviceDays,
      serviceHours,
      isServiceVisible: true,
      isPricingEnabled: false,
      serviceType: 'PHYSICAL',
      ...propDefaultValues,
    } as ServiceFormValues)
  }, [businessAvailability])

  // Update selected days when service days change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'serviceDays' && value.serviceDays) {
        const days = value.serviceDays.filter(
          (day): day is { from: string; to: string } =>
            day !== undefined && day !== null,
        )
        setSelectedDays(convertDayRangeToDays(days))
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Ensure default mode hours are initialized
  useEffect(() => {
    if (currentMode === 'default' && !form.getValues('serviceHours.default')) {
      form.setValue('serviceHours.default', [{ open: '', close: '' }])
    }
  }, [currentMode, form])

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      setIsLoading(true)

      const daysOfWeek = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ]

      // 1. Collect selected days
      const selectedDays = new Set<string>()
      data.serviceDays?.forEach(({ from, to }) => {
        const fromIdx = daysOfWeek.indexOf(from.toLowerCase())
        const toIdx = daysOfWeek.indexOf(to.toLowerCase())
        if (fromIdx !== -1 && toIdx !== -1) {
          const range = daysOfWeek.slice(
            Math.min(fromIdx, toIdx),
            Math.max(fromIdx, toIdx) + 1,
          )
          range.forEach((day) => selectedDays.add(day))
        }
      })

      // 2. Prepare serviceHours with renamed keys and filtered by selected days
      const serviceAvailability = [...selectedDays].map((day) => {
        const slots = data.serviceHours?.[day as keyof DaySchedule] || []

        return {
          weekDay: day.toUpperCase() as WeekDays,
          timeSlots: slots.map(({ open, close }) => ({
            startTime: `2000-01-01T${open}:00`,
            endTime: `2000-01-01T${close}:00`,
          })),
        }
      })

      // 3. Build final payload

      const finalData = {
        ...businessDetailForm,
        businessAvailability: businessAvailability,
        holiday,
        serviceAvailability,
      }
      console.log(finalData, 'finalData')

      // )
      if (businessDetail) {
        dispatch(
          updateBusinessDetail({
            id: businessDetail?.id as string,
            data: finalData,
          }),
        )
      } else {
        dispatch(
          createBusinessDetail({
            data: {
              ...businessDetailForm,
              businessAvailability: businessAvailability,
              serviceAvailability,
            },
          }),
        )
      }
      onSubmitSuccess?.()
    } catch (error) {
      console.error('Failed to save service settings:', error)
      toast.error('Failed to save service settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <div className="relative rounded-[8px] w-fit overflow-hidden bg-[#BBBBBB]/60 p-1 py-0.5 flex items-center">
            <div
              className="absolute flex h-8 w-[100px] rounded-[6px] z-10 bg-white transition-all duration-300 ease-in-out"
              style={{
                transform: `translateX(${currentMode === 'default' ? '0' : '100%'})`,
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            />
            <button
              type="button"
              className={cn(
                'relative z-10 h-9 w-[100px] text-base font-medium transition-colors duration-300 cursor-pointer',
                currentMode === 'default' ? 'text-blue-600' : 'text-gray-600',
              )}
              onClick={() => setCurrentMode('default')}
            >
              Default
            </button>
            <button
              type="button"
              className={cn(
                'relative z-10 h-9 w-[100px] text-base font-medium transition-colors duration-300 cursor-pointer',
                currentMode === 'custom' ? 'text-blue-600' : 'text-gray-600',
              )}
              onClick={() => setCurrentMode('custom')}
            >
              Custom
            </button>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex p-3 flex-col gap-6 border border-[#E9E9E9] rounded-[4px]">
              <BusinessDaysSelector
                name="serviceDays"
                label="Service Days"
                isDefaultMode={currentMode === 'default'}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                manuallySelectedDays={manuallySelectedDay}
                setManuallySelectedDays={setManuallySelectedDay}
              />

              <BusinessHours
                key={`service-${manuallySelectedDay || 'default'}`}
                name={
                  manuallySelectedDay
                    ? `serviceHours.${manuallySelectedDay}`
                    : 'serviceHours.default'
                }
                openLabel="Open Time"
                label="Service Hours"
                endLabel="Close Time"
                isDefaultMode={currentMode === 'default'}
                isEditMode={true}
                manuallySelectedDay={manuallySelectedDay}
              />
            </div>
          </div>

          <div className="flex p-3 flex-col gap-6 border border-[#E9E9E9] rounded-[4px]">
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
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
