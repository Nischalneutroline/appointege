'use client'

import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import SelectField from '@/components/custom-form-fields/select-field'
import BusinessDaysSelector from './business-selector'
import BusinessHours from './business-hours'
import WeeklySchedulePreview from './weekly-preview'
import {
  BusinessAvailability,
  completeStep,
  setActiveStep,
  updateBusinessAvailabilityForm,
} from '@/store/slices/businessSlice'
import { AppDispatch, RootState } from '@/store/store'

import {
  transformBusinessAvailability,
  transformToBusinessAvailability,
} from '@/lib/business-availability'

import {
  BusinessAvailabilityFormValues,
  businessAvailabilitySchema,
  DaySchedule,
  timezoneOptions,
} from '@/lib/businessSchema'

const BusinessAvailabilityForm = ({
  setTab,
  data,
  onBack,
  onSubmitSuccess,
}: {
  setTab: (tab: string) => void
  data: any
  onBack?: () => void
  onSubmitSuccess?: () => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const businessDetailFormValues = useSelector(
    (state: RootState) => state.business.businessDetailForm,
  )

  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const [selectedDay, setSelectedDay] = useState<string[]>(['monday'])
  const [manuallySelectedDay, setManuallySelectedDay] = useState<string | null>(
    null,
  )

  const defaultValues = {
    timezone: '',
    businessDays: [{ from: 'monday', to: 'friday' }],
    businessHours: {
      // Default schedule for each day of the week
      monday: [{ open: '09:00', close: '17:00' }],
      tuesday: [{ open: '09:00', close: '17:00' }],
      wednesday: [{ open: '09:00', close: '17:00' }],
      thursday: [{ open: '09:00', close: '17:00' }],
      friday: [{ open: '09:00', close: '17:00' }],
      saturday: [{ open: '09:00', close: '17:00' }],
      sunday: [{ open: '09:00', close: '17:00' }],
      // Default schedule that will be used when no specific day is selected
      default: [{ open: '09:00', close: '17:00' }],
    },
    breakHours: {
      // Break hours for each day of the week
      monday: [{ open: '12:00', close: '13:00' }],
      tuesday: [{ open: '12:00', close: '13:00' }],
      wednesday: [{ open: '12:00', close: '13:00' }],
      thursday: [{ open: '12:00', close: '13:00' }],
      friday: [{ open: '12:00', close: '13:00' }],
      saturday: [{ open: '12:00', close: '13:00' }],
      sunday: [{ open: '12:00', close: '13:00' }],
      // Default break hours that will be used when no specific day is selected
      default: [{ open: '12:00', close: '13:00' }],
    },
  }

  const form = useForm<BusinessAvailabilityFormValues>({
    resolver: zodResolver(businessAvailabilitySchema),
    defaultValues,
  })

  // Load data from API or fallback to default values
  useEffect(() => {
    const transformedData = transformBusinessAvailability(data)
    console.log(transformedData, 'transformedData')
    const formData = data ? transformedData : defaultValues
    form.reset(formData)
  }, [data, form])

  // Handle form submit
  const onSubmit = async (formData: BusinessAvailabilityFormValues) => {
    console.log(formData, 'Value from the form')
    const selectedDays = new Set<string>()
    for (const range of formData.businessDays) {
      const startIndex = formData.businessDays.findIndex(
        (d) => d.from === range.from,
      )
      const endIndex = formData.businessDays.findIndex((d) => d.to === range.to)
      for (let i = startIndex; i <= endIndex; i++) {
        selectedDays.add(formData.businessDays[i].from)
      }
    }

    const hasValidTime = Array.from(selectedDays).some((day) =>
      formData.businessHours[day as keyof DaySchedule]?.some(
        (slot) => slot.open && slot.close,
      ),
    )

    if (!hasValidTime) {
      return toast.error(
        'Please add at least one time slot for the selected days',
      )
    }
    const data = {
      ...formData,
      selectedDays: Array.from(selectedDays),
      breakHours: formData.breakHours || {},
    }

    const transformedData = transformToBusinessAvailability(
      data,
      businessDetailFormValues || {},
    ) as { businessAvailability: BusinessAvailability[]; holidays: any[] }

    console.log(transformedData, 'Transformed Data')
    dispatch(
      updateBusinessAvailabilityForm([
        {
          timeZone: formData.timezone,
          businessAvailability: transformedData.businessAvailability,
          holiday: transformedData.holidays || [],
        },
      ]),
    )
    dispatch(completeStep('business-settings'))
    dispatch(setActiveStep('services'))
    toast.success('Business availability saved successfully')
    setTab('services')
    onSubmitSuccess?.()
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        {/* Timezone Select */}
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
              className={`w-[100px] text-base font-medium ${currentMode === mode ? 'text-blue-600 bg-white' : 'text-gray-600'}`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Business Days Selector */}
        <BusinessDaysSelector
          name="businessDays"
          label="Business Days"
          isDefaultMode={currentMode === 'default'}
          selectedDays={selectedDay}
          setSelectedDays={setSelectedDay}
          manuallySelectedDays={manuallySelectedDay}
          setManuallySelectedDays={setManuallySelectedDay}
        />

        {/* Business Hours */}
        <BusinessHours
          name={
            manuallySelectedDay
              ? `businessHours.${manuallySelectedDay}`
              : 'businessHours.default'
          }
          label="Business Hours"
          openLabel="Open Time"
          endLabel="Close Time"
          isDefaultMode={currentMode === 'default'}
          isEditMode={manuallySelectedDay !== null}
          onCustomModeActivate={() => setCurrentMode('custom')}
          manuallySelectedDay={manuallySelectedDay}
        />

        {/* Break Hours */}
        <BusinessHours
          name={
            manuallySelectedDay
              ? `breakHours.${manuallySelectedDay}`
              : 'breakHours.default'
          }
          label="Break Hours"
          openLabel="Break Start"
          endLabel="Break End"
          isDefaultMode={currentMode === 'default'}
          isEditMode={manuallySelectedDay !== null}
          manuallySelectedDay={manuallySelectedDay}
        />

        {/* Preview */}
        <WeeklySchedulePreview
          businessHoursName="businessHours"
          breakHoursName="breakHours"
          selectedDaysName="businessDays"
        />

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setTab('business-details')}
            className="text-[#BBBBBB] text-sm flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} /> Back
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => dispatch(setActiveStep('services'))}
              className="text-[#6AA9FF] text-sm flex items-center gap-1"
            >
              Skip <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </button>
            <Button type="submit">Save and Continue</Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default BusinessAvailabilityForm
