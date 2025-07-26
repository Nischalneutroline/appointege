'use client'

import React, { useEffect, useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { timezoneOptions } from '@/schemas/businessSchema'
import ServiceHourSelector from '@/components/custom-form-fields/serivce/service-hours-selector'
import ServiceDaySelector from '@/components/custom-form-fields/serivce/service-day-selector'
import SelectField from '@/components/custom-form-fields/select-field'
import BusinessDaySelector from '@/components/custom-form-fields/business-settings/business-day-selector'
import BusinessHourSelector from '@/components/custom-form-fields/business-settings/business-hour-selector'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WeeklyPreview from '../weekly-preview'
import {
  BusinessDetail,
  updateBusinessAvailabilityForm,
} from '@/store/slices/businessSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import {
  businessAvailabilityFormSchema,
  BusinessAvailabilityFormValues,
} from '../../_schema/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertFromApiFormat } from '@/lib/business-availability'
import { z } from 'zod'

// Define allowed days of the week as string literals
export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

// Define the shape of BusinessAvailability with breaks per day and holidays list
export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]> // breaks are arrays of time range tuples per day
  holidays: WeekDay[]
}

// Default initial form values for the entire form
const defaultValues: BusinessAvailabilityFormValues = {
  timezone: 'UTC', // initially empty timezone
  holidays: ['Sat', 'Sun'], // default holidays set to weekend
  businessAvailability: ['Mon', 'Tue', 'Wed', 'Thu'],
  businessDays: {
    // default working hours per day
    Mon: [['09:00 AM', '05:00 PM']],
    Tue: [['09:00 AM', '05:00 PM']],
    Wed: [['09:00 AM', '05:00 PM']],
    Thu: [['09:00 AM', '05:00 PM']],
    Fri: [],
    Sat: [],
    Sun: [],
  },
  breakHours: {
    // default break hours per day
    Mon: [['12:00 PM', '01:00 PM']],
    Tue: [['12:00 PM', '01:00 PM']],
    Wed: [['12:00 PM', '01:00 PM']],
    Thu: [['12:00 PM', '01:00 PM']],
    Fri: [],
    Sat: [],
    Sun: [],
  },
}

// Normalize the weekday to fit into the businessHourSelctor
export const normalizeWeekDays = (
  partial: Partial<Record<WeekDay, [string, string][]>>,
): Record<WeekDay, [string, string][]> => ({
  Mon: partial.Mon || [],
  Tue: partial.Tue || [],
  Wed: partial.Wed || [],
  Thu: partial.Thu || [],
  Fri: partial.Fri || [],
  Sat: partial.Sat || [],
  Sun: partial.Sun || [],
})
// Local storage key for persisting form data
const FORM_STORAGE_KEY = 'businessAvailabilityFormData'

const BusinessAvailabilityForm = ({
  setTab,
  onBack,
  data,
  onSubmitSuccess,
}: {
  setTab: (tab: string) => void
  onBack: () => void
  data?: BusinessDetail | null
  onSubmitSuccess: () => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const [activeDay, setActiveDay] = useState<WeekDay>('Mon')

  // Load saved form data from localStorage if available
  // const loadSavedFormData = () => {
  //   if (typeof window === 'undefined') return defaultValues

  //   try {
  //     const savedData = localStorage.getItem(FORM_STORAGE_KEY)
  //     if (savedData) {
  //       const parsedData = JSON.parse(savedData)
  //       // Validate the parsed data against our schema
  //       const result = businessAvailabilityFormSchema.safeParse(parsedData)
  //       if (result.success) {
  //         return result.data
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Failed to load saved form data:', error)
  //   }

  //   return defaultValues
  // }

  // Initialize react-hook-form with saved values or defaults
  const form = useForm<BusinessAvailabilityFormValues>({
    resolver: zodResolver(businessAvailabilityFormSchema),
    defaultValues,
  })

  // Watch all form values including nested fields
  // const formValues = useWatch({
  //   control: form.control,
  //   defaultValue: defaultValues,
  // })

  // Save form data to localStorage whenever any value changes
  // Sync Redux on form changes with debounce
  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     const handler = setTimeout(() => {
  //       dispatch(updateBusinessAvailabilityForm(value))
  //     }, 300)

  //     return () => clearTimeout(handler)
  //   })

  //   return () => subscription.unsubscribe()
  // }, [form, dispatch])

  // Load API data: update Redux and reset form
  // useEffect(() => {
  //   if (data) {
  //     const apiDataToForm = convertFromApiFormat({
  //       timeZone: data?.timeZone || '',
  //       businessAvailability: data?.businessAvailability,
  //       holiday: data?.holiday || [],
  //     })

  //     dispatch(updateBusinessAvailabilityForm(apiDataToForm))
  //     form.reset(apiDataToForm)
  //   }
  // }, [data, dispatch, form])
  // useEffect(() => {
  //   if (data) {
  //     const apidata = {
  //       timeZone: data?.timeZone || '',
  //       businessAvailability: data?.businessAvailability,
  //       holiday: data?.holiday || [],
  //     }
  //     const dataToEdit = convertFromApiFormat(apidata)
  //     console.log('Data from API to fit into defaultValue:', dataToEdit)

  //     // Get all days of the week
  //     const allDays: WeekDay[] = [
  //       'Mon',
  //       'Tue',
  //       'Wed',
  //       'Thu',
  //       'Fri',
  //       'Sat',
  //       'Sun',
  //     ]

  //     // Get selected business days from the API data
  //     const selectedDays = dataToEdit.businessAvailability as WeekDay[]
  //     const selectedDaysSet = new Set(selectedDays)

  //     // Calculate holidays as days not in selectedDays
  //     const holidays = allDays.filter((day) => !selectedDaysSet.has(day))

  //     const businessDays: Partial<Record<WeekDay, [string, string][]>> = {}
  //     const breakHours: Partial<Record<WeekDay, [string, string][]>> = {}

  //     // Process business hours and break hours for selected days
  //     selectedDays.forEach((day) => {
  //       if (dataToEdit.businessHours[day]) {
  //         businessDays[day] = dataToEdit.businessHours[day]
  //       }
  //       if (dataToEdit.breakHours[day]) {
  //         breakHours[day] = dataToEdit.breakHours[day]
  //       }
  //     })

  //     // Don't clear saved form data when loading from API
  //     // This allows the form to maintain its state

  //     // Reset the form with the processed data
  //     form.reset({
  //       ...dataToEdit,
  //       timezone: dataToEdit.timeZone || '',
  //       businessDays,
  //       breakHours,
  //       businessAvailability: selectedDays,
  //       holidays: holidays, // Use the calculated holidays
  //     })
  //   }
  // }, [data, form])
  // ---------------- BreakHours Listener ----------------
  // Watch the breakHours field dynamically so we get live updates of breaks as user edits them
  const breakHours = useWatch({
    control: form.control,
    name: 'breakHours',
  })

  // ---------------- Form submission ----------------
  // Form submission handler: gets all form data when user clicks Save
  const onSubmit = (data: BusinessAvailabilityFormValues) => {
    // Create a Set of selected business days
    const selectedDaysSet = new Set(data.businessAvailability)

    // Initialize empty objects that will only include selected days
    const filteredBusinessHours: Partial<Record<WeekDay, [string, string][]>> =
      {}
    const filteredBreakHours: Partial<Record<WeekDay, [string, string][]>> = {}

    // Get all days that exist in the form data
    const allDays = Object.keys(data.businessDays) as WeekDay[]

    // Loop through all the days
    for (const day of allDays) {
      if (selectedDaysSet.has(day)) {
        // Only assign days that are in the selected set
        if (data.businessDays[day]?.length) {
          filteredBusinessHours[day] = data.businessDays[day]
        }

        if (data.breakHours[day]?.length) {
          filteredBreakHours[day] = data.breakHours[day]
        }
      }
    }

    // Get all days of the week
    const allWeekDays: WeekDay[] = [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]

    // Calculate holidays as days not in businessAvailability
    const holidays = allWeekDays.filter(
      (day) => !data.businessAvailability.includes(day),
    )

    // Final structured form data with only selected keys
    const updatedData = {
      timeZone: data.timezone,
      businessHours: filteredBusinessHours,
      breakHours: filteredBreakHours,
      holidays: holidays,
    }

    dispatch(
      updateBusinessAvailabilityForm({
        ...updatedData,
        businessAvailability: data.businessAvailability,
        holidays: holidays,
      }),
    )
    onSubmitSuccess()
  }

  // Clear saved form data only when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if we're not in the middle of a form submission
      if (!form.formState.isSubmitting) {
        localStorage.removeItem(FORM_STORAGE_KEY)
      }
    }
  }, [form.formState.isSubmitting])

  return (
    <FormProvider {...form}>
      {/* Form wrapper with submit handler */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mt-4 w-full"
      >
        {/* Dropdown select field to pick a timezone */}
        <SelectField
          name="timezone"
          label="Time Zone"
          placeholder="Select Time Zone"
          options={timezoneOptions}
        />
        {/* Toggle Mode */}
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
            className=" border border-blue-200 rounded-[8px]"
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            currentMode={currentMode}
            setCurrentMode={setCurrentMode}
          />

          {/* Two columns on desktop, stacked on mobile: Business Hours and Break Hours */}

          {/* Business Hours input UI */}
          <BusinessHourSelector
            name="businessDays" // form field name
            dayName="businessAvailability"
            label="Business Hours"
            initialBusinessHours={normalizeWeekDays(defaultValues.businessDays)} // initial display data for business hours
            businessBreaks={normalizeWeekDays(breakHours)} // pass currently watched breakHours dynamically
            className=" border border-blue-200 rounded-[4px]"
            activeDay={activeDay}
            restrictToInitialHours={false}
            isDefault={currentMode === 'default'}
            setCustom={setCurrentMode}
          />
        </div>
        {/* BusinessDaySelector component shows business days and holidays selector UI */}

        {/* Break Hours input UI */}
        <div className="flex p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
          <BusinessHourSelector
            name="breakHours" // form field name
            dayName="businessAvailability"
            label="Break Hours"
            initialBusinessHours={normalizeWeekDays(defaultValues.breakHours)} // initial break hours display data
            className=" border border-blue-200 rounded-[4px]"
            activeDay={activeDay}
            restrictToInitialHours={false}
            setCustom={setCurrentMode}
            isDefault={currentMode === 'default'}
          />
        </div>
        <WeeklyPreview
          businessHoursName="businessDays"
          breakHoursName="breakHours"
          selectedDaysName="businessAvailability"
        />

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
              onClick={() => setTab('business-availability')}
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

export default BusinessAvailabilityForm
