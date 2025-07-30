'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import SelectField from '@/components/custom-form-fields/select-field'
import BusinessDaySelector from '@/components/custom-form-fields/business-settings/business-day-selector'
import BusinessHourSelector from '@/components/custom-form-fields/business-settings/business-hour-selector'
import WeeklyPreview from '../weekly-preview'
import {
  BusinessTab,
  setActiveTab,
  setBusinessDetail,
  setBusinessAvailabilityForm,
  convertFormToApiFormat,
  transformAvailabilityForForm,
  weekdayMap,
  // NOTE: We import the BASE schema for saving data to Redux
  businessAvailabilityFormSchema,
} from '@/store/slices/businessSlice'
import { timezoneOptions } from '@/schemas/businessSchema'
import { z } from 'zod'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

const allDays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// NEW: Define the extended schema and type LOCALLY for the form's UI state.
// This schema will be used for form validation only.
const businessAvailabilityFormSchemaExtended =
  businessAvailabilityFormSchema.extend({
    from: z.enum(allDays).optional(),
    to: z.enum(allDays).optional(),
  })
type BusinessAvailabilityFormValuesExtended = z.infer<
  typeof businessAvailabilityFormSchemaExtended
>

const defaultValues: BusinessAvailabilityFormValuesExtended = {
  timezone: 'UTC',
  holidays: ['Sat', 'Sun'],
  from: 'Mon',
  to: 'Fri',
  businessAvailability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  businessDays: {
    Mon: [['09:00 AM', '05:00 PM']],
    Tue: [['09:00 AM', '05:00 PM']],
    Wed: [['09:00 AM', '05:00 PM']],
    Thu: [['09:00 AM', '05:00 PM']],
    Fri: [['09:00 AM', '05:00 PM']],
    Sat: [],
    Sun: [],
  },
  breakHours: {
    Mon: [['12:00 PM', '01:00 PM']],
    Tue: [['12:00 PM', '01:00 PM']],
    Wed: [['12:00 PM', '01:00 PM']],
    Thu: [['12:00 PM', '01:00 PM']],
    Fri: [['12:00 PM', '01:00 PM']],
    Sat: [],
    Sun: [],
  },
}

export const normalizeWeekDays = (
  partial?: Partial<Record<WeekDay, [string, string][]>> | null,
): Record<WeekDay, [string, string][]> => {
  const defaultHours: Record<WeekDay, [string, string][]> = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  }
  return partial ? { ...defaultHours, ...partial } : defaultHours
}

const BusinessAvailabilityForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedBusiness, businessData, hasFetched } = useSelector(
    (state: RootState) => state.business,
  )
  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const [activeDay, setActiveDay] = useState<WeekDay>('Mon')
  const isInitialized = useRef(false)

  // MODIFIED: The form uses the extended schema for validation.
  const form = useForm<BusinessAvailabilityFormValuesExtended>({
    resolver: zodResolver(businessAvailabilityFormSchemaExtended),
    defaultValues: {}, // Start empty
  })

  // MODIFIED: Main initialization effect
  useEffect(() => {
    if (isInitialized.current || !hasFetched) return

    let initialValues: BusinessAvailabilityFormValuesExtended | null = null

    if (businessData?.businessAvailabilityForm) {
      // Priority 1: Redux state (for tab navigation)
      const reduxData = businessData.businessAvailabilityForm
      const sortedDays = allDays.filter((d) =>
        reduxData.businessAvailability.includes(d),
      )
      initialValues = {
        ...reduxData,
        from: sortedDays.length > 0 ? sortedDays[0] : undefined,
        to:
          sortedDays.length > 0 ? sortedDays[sortedDays.length - 1] : undefined,
      }
    } else if (
      selectedBusiness &&
      selectedBusiness.businessAvailability?.length > 0
    ) {
      // Priority 2: Fetched data from API
      const { work, break: breakHours } = transformAvailabilityForForm(
        selectedBusiness.businessAvailability,
      )
      const availableDays = Object.keys(work).filter(
        (day) => (work[day as WeekDay] ?? []).length > 0,
      ) as WeekDay[]
      const sortedDays = allDays.filter((d) => availableDays.includes(d))

      initialValues = {
        timezone: selectedBusiness.timeZone || defaultValues.timezone,
        holidays:
          selectedBusiness.holiday
            ?.map((h) => weekdayMap[h.holiday] as WeekDay)
            .filter(Boolean) || defaultValues.holidays,
        businessAvailability: sortedDays,
        businessDays: normalizeWeekDays(work),
        breakHours: normalizeWeekDays(breakHours),
        from: sortedDays.length > 0 ? sortedDays[0] : undefined,
        to:
          sortedDays.length > 0 ? sortedDays[sortedDays.length - 1] : undefined,
      }
    } else if (hasFetched) {
      // Priority 3: No data, use defaults
      initialValues = defaultValues
    }

    if (initialValues) {
      form.reset(initialValues)
      const firstDay = initialValues.businessAvailability?.[0] || 'Mon'
      setActiveDay(firstDay)
      isInitialized.current = true
    }
  }, [hasFetched, selectedBusiness, businessData, form])

  const formData = useWatch({ control: form.control })

  // MODIFIED: This effect saves the CORE data to Redux, stripping out from/to.
  useEffect(() => {
    if (!isInitialized.current) return
    const timer = setTimeout(() => {
      // Validate with the extended schema to ensure `from`/`to` are present for UI
      const validationResult =
        businessAvailabilityFormSchemaExtended.safeParse(formData)
      if (validationResult.success) {
        // But parse with the BASE schema to get a clean object for Redux
        const reduxSafeData = businessAvailabilityFormSchema.parse(
          validationResult.data,
        )
        dispatch(setBusinessAvailabilityForm(reduxSafeData))
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [formData, dispatch])

  const businessDaysValues = useWatch({
    control: form.control,
    name: 'businessDays',
  })
  const breakHours = useWatch({ control: form.control, name: 'breakHours' })

  const onSubmit = async (data: BusinessAvailabilityFormValuesExtended) => {
    // Parse with the base schema to ensure only API-relevant data is used
    const backendSafeData = businessAvailabilityFormSchema.parse(data)
    const { businessAvailability, holidays } =
      convertFormToApiFormat(backendSafeData)

    const updatedData = {
      ...selectedBusiness,
      timeZone: backendSafeData.timezone,
      businessAvailability,
      holiday: holidays,
      updatedAt: new Date(),
    }
    dispatch(setBusinessDetail(updatedData))
    // Save the core data to Redux state
    dispatch(setBusinessAvailabilityForm(backendSafeData))
    toast.success('Business availability saved successfully')
    dispatch(setActiveTab(BusinessTab.ServiceAvailability))
  }

  const handleBack = () => dispatch(setActiveTab(BusinessTab.BusinessDetail))
  const handleSkip = () =>
    dispatch(setActiveTab(BusinessTab.ServiceAvailability))

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mt-4 w-full"
      >
        <SelectField
          name="timezone"
          label="Time Zone"
          placeholder="Select Time Zone"
          options={timezoneOptions}
        />
        <div className="flex bg-[#BBBBBB]/60 rounded-[8px] overflow-hidden w-fit p-1 h-10">
          {['default', 'custom'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setCurrentMode(mode as 'default' | 'custom')}
              className={`w-[100px] text-base font-medium ${currentMode === mode ? 'text-blue-600 bg-white rounded-[6px]' : 'text-gray-600'}`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex p-3 flex-col gap-6 border border-[#E9E9E9] rounded-[4px]">
          <BusinessDaySelector
            name="businessAvailability"
            label="Business Days"
            activeDay={activeDay}
            setActiveDay={setActiveDay}
          />
          <BusinessHourSelector
            name="businessDays"
            dayName="businessAvailability"
            label="Business Hours"
            businessBreaks={normalizeWeekDays(breakHours)}
            activeDay={activeDay}
            restrictToInitialHours={false}
            isDefault={currentMode === 'default'}
            setCustom={setCurrentMode}
          />
        </div>
        <div className="flex p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
          <BusinessHourSelector
            name="breakHours"
            dayName="businessAvailability"
            label="Break Hours"
            initialBusinessHours={normalizeWeekDays(businessDaysValues)}
            activeDay={activeDay}
            restrictToInitialHours={true}
            isDefault={currentMode === 'default'}
            setCustom={setCurrentMode}
          />
        </div>
        <WeeklyPreview
          businessHoursName="businessDays"
          breakHoursName="breakHours"
          selectedDaysName="businessAvailability"
        />
        <div className="flex justify-between text-[#BBBBBB]">
          <button
            type="button"
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            <div className="text-[#BBBBBB] text-sm font-normal">Back</div>
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              className="flex gap-1 items-center cursor-pointer text-[#6AA9FF]"
              onClick={handleSkip}
            >
              <div className="text-[#6AA9FF] text-sm font-normal">Skip</div>
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

export default BusinessAvailabilityForm
