'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import BusinessDaySelector from '@/components/custom-form-fields/business-settings/business-day-selector'
import BusinessHourSelector from '@/components/custom-form-fields/business-settings/business-hour-selector'
import {
  BusinessTab,
  setActiveTab,
  setServiceAvailabilityForm,
  transformAvailabilityForForm,
  convertFormToApiFormat,
  convertServiceAvailabilityToApi,
  serviceAvailabilityFormSchema, // Base schema for Redux/API
  ServiceAvailabilityFormValues,
  createBusiness,
  updateBusiness,
} from '@/store/slices/businessSlice'
import { normalizeWeekDays } from './business-availability'
import { z } from 'zod'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
const allDays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// LOCAL EXTENDED SCHEMA: Add `from` and `to` for UI-only state management
const serviceAvailabilityFormSchemaExtended =
  serviceAvailabilityFormSchema.extend({
    from: z.enum(allDays).optional(),
    to: z.enum(allDays).optional(),
  })
type ServiceAvailabilityFormValuesExtended = z.infer<
  typeof serviceAvailabilityFormSchemaExtended
>

const ServiceAvailabilityForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedBusiness, businessData, loading, hasFetched } = useSelector(
    (state: RootState) => state.business,
  )
  const { user } = useSelector((state: RootState) => state.auth)

  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const [activeDay, setActiveDay] = useState<WeekDay>('Mon')
  const isInitialized = useRef(false)

  // Get data from the previous step to use as constraints
  const businessHoursFromState =
    businessData?.businessAvailabilityForm?.businessDays
  const businessBreaksFromState =
    businessData?.businessAvailabilityForm?.breakHours

  const form = useForm<ServiceAvailabilityFormValuesExtended>({
    resolver: zodResolver(serviceAvailabilityFormSchemaExtended),
    defaultValues: {}, // Will be populated by the main useEffect
  })

  // THE "BRAIN": This effect correctly initializes the form based on mode (Create vs. Update)
  useEffect(() => {
    if (isInitialized.current || !hasFetched) return

    let sourceData: ServiceAvailabilityFormValues
    let sourceAvailabilityArray: WeekDay[] = []

    const isUpdateMode = !!selectedBusiness?.id

    if (isUpdateMode && selectedBusiness.serviceAvailability?.length > 0) {
      // --- UPDATE MODE ---
      // Source of truth is the existing service availability from the fetched business
      const { work: serviceWork } = transformAvailabilityForForm(
        selectedBusiness.serviceAvailability,
      )
      sourceAvailabilityArray = allDays.filter(
        (day) => (serviceWork[day] || []).length > 0,
      )

      sourceData = {
        serviceAvailability: sourceAvailabilityArray,
        serviceDays: normalizeWeekDays(serviceWork),
        isServiceVisible: true, // You might want to get this from `selectedBusiness` if it's stored there
        isPricingEnabled: false,
      }
    } else {
      // --- CREATE MODE (or an update with no existing service data) ---
      // Source of truth is the Business Availability from the previous step
      const businessAvail =
        businessData?.businessAvailabilityForm?.businessAvailability || []
      const businessHours =
        businessData?.businessAvailabilityForm?.businessDays || {}

      sourceAvailabilityArray = businessAvail
      sourceData = {
        serviceAvailability: businessAvail,
        serviceDays: normalizeWeekDays(businessHours),
        isServiceVisible: true,
        isPricingEnabled: false,
      }
    }

    // Derive `from` and `to` from the determined availability array
    const sortedDays = allDays.filter((d) =>
      sourceAvailabilityArray.includes(d),
    )
    const from = sortedDays.length > 0 ? sortedDays[0] : undefined
    const to =
      sortedDays.length > 0 ? sortedDays[sortedDays.length - 1] : undefined

    // Reset the form with the complete data, including the UI fields `from` and `to`
    form.reset({
      ...sourceData,
      from,
      to,
    })

    setActiveDay(from || 'Mon')
    isInitialized.current = true
  }, [selectedBusiness, businessData, hasFetched, form])

  // This effect saves the CORE data (without from/to) to Redux for persistence
  const formData = useWatch({ control: form.control })
  useEffect(() => {
    if (!isInitialized.current) return
    const timer = setTimeout(() => {
      const validationResult =
        serviceAvailabilityFormSchemaExtended.safeParse(formData)
      if (validationResult.success) {
        // Parse with BASE schema to strip UI fields before dispatching
        const reduxSafeData = serviceAvailabilityFormSchema.parse(
          validationResult.data,
        )
        dispatch(setServiceAvailabilityForm(reduxSafeData))
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [formData, dispatch])

  const onSubmit = async (data: ServiceAvailabilityFormValuesExtended) => {
    if (!businessData?.businessAvailabilityForm) {
      toast.error('Please complete the Business Availability step first.')
      dispatch(setActiveTab(BusinessTab.BusinessAvailability))
      return
    }

    // Parse with BASE schema to get clean data for the API
    const apiSafeData = serviceAvailabilityFormSchema.parse(data)

    const { businessAvailability, holidays } = convertFormToApiFormat(
      businessData.businessAvailabilityForm,
    )
    const serviceAvailability = convertServiceAvailabilityToApi(
      apiSafeData,
      selectedBusiness?.id || '',
    )

    const finalBusinessData = {
      ...businessData,
      ...selectedBusiness,
      timeZone: businessData.businessAvailabilityForm.timezone,
      businessAvailability,
      holiday: holidays,
      serviceAvailability,
      businessOwner: user?.id,
    }

    try {
      if (selectedBusiness?.id) {
        await dispatch(
          updateBusiness({ id: selectedBusiness.id, data: finalBusinessData }),
        ).unwrap()
        toast.success('Business and service availability updated successfully.')
      } else {
        await dispatch(createBusiness(finalBusinessData)).unwrap()
        toast.success('Business created successfully.')
      }
    } catch (error) {
      toast.error('An error occurred while saving.')
    }
  }

  const handleBack = () =>
    dispatch(setActiveTab(BusinessTab.BusinessAvailability))

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mt-4 w-full"
      >
        <div className="flex flex-col gap-4 w-full pt-4">
          <div className="flex bg-[#BBBBBB]/60 rounded-[8px] overflow-hidden w-fit p-1 h-10">
            {['default', 'custom'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCurrentMode(mode as 'default' | 'custom')}
                className={cn(
                  'w-[100px] text-base font-medium',
                  currentMode === mode
                    ? 'text-blue-600 bg-white rounded-[6px]'
                    : 'text-gray-600',
                )}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex p-3 flex-col gap-6 border border-[#E9E9E9] rounded-[4px]">
            <BusinessDaySelector
              name="serviceAvailability"
              label="Service Days"
              activeDay={activeDay}
              setActiveDay={setActiveDay}
            />
            <BusinessHourSelector
              name="serviceDays"
              dayName="serviceAvailability"
              label="Service Hours"
              initialBusinessHours={normalizeWeekDays(businessHoursFromState)}
              businessBreaks={normalizeWeekDays(businessBreaksFromState)}
              activeDay={activeDay}
              restrictToInitialHours={true}
              isDefault={currentMode === 'default'}
              setCustom={setCurrentMode}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#111827]">
                Service Visibility
              </span>
              <Switch
                checked={form.watch('isServiceVisible')}
                onCheckedChange={(checked) =>
                  form.setValue('isServiceVisible', checked, {
                    shouldDirty: true,
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#111827]">
                Enable Pricing?
              </span>
              <Switch
                checked={form.watch('isPricingEnabled')}
                onCheckedChange={(checked) =>
                  form.setValue('isPricingEnabled', checked, {
                    shouldDirty: true,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[#BBBBBB]">
          <button
            type="button"
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            <div className="text-sm font-normal">Back</div>
          </button>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" strokeWidth={2.5} />
              )}
              {loading
                ? `${selectedBusiness?.id ? 'Updating...' : 'Saving...'}`
                : `${selectedBusiness?.id ? 'Update & Finish' : 'Save & Finish'}`}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default ServiceAvailabilityForm
