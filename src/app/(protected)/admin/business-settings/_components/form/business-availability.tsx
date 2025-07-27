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
  updateBusiness,
  convertFormToApiFormat,
  transformAvailabilityForForm,
  weekdayMap,
  businessAvailabilityFormSchema,
  BusinessAvailabilityFormValues,
} from '@/store/slices/businessSlice'
import { timezoneOptions } from '@/schemas/businessSchema'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

const defaultValues: BusinessAvailabilityFormValues = {
  timezone: 'UTC',
  holidays: ['Sat', 'Sun'],
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
  const { selectedBusiness, businessData } = useSelector(
    (state: RootState) => state.business,
  )
  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const [activeDay, setActiveDay] = useState<WeekDay>('Mon')
  const lastFormDataRef = useRef<string | null>(null)
  const lastResetDataRef = useRef<string | null>(null)

  const form = useForm<BusinessAvailabilityFormValues>({
    resolver: zodResolver(businessAvailabilityFormSchema),
    defaultValues,
  })

  useEffect(() => {
    let initialData: BusinessAvailabilityFormValues = defaultValues

    if (businessData?.businessAvailabilityForm) {
      initialData = businessData.businessAvailabilityForm
    } else if (selectedBusiness?.businessAvailability?.length) {
      initialData = {
        timezone: selectedBusiness.timeZone || defaultValues.timezone,
        holidays:
          selectedBusiness.holiday?.map(
            (h) => weekdayMap[h.holiday] as WeekDay,
          ) || defaultValues.holidays,
        businessAvailability:
          selectedBusiness.businessAvailability
            ?.map((avail) => weekdayMap[avail.weekDay] as WeekDay)
            .filter((day): day is WeekDay => !!day) ||
          defaultValues.businessAvailability,
        businessDays:
          transformAvailabilityForForm(selectedBusiness.businessAvailability)
            .work || defaultValues.businessDays,
        breakHours:
          transformAvailabilityForForm(selectedBusiness.businessAvailability)
            .break || defaultValues.breakHours,
      }
    }

    const initialDataStr = JSON.stringify(initialData)
    if (initialDataStr !== lastResetDataRef.current) {
      form.reset(initialData)
      lastResetDataRef.current = initialDataStr
    }
  }, [selectedBusiness, businessData, form])

  const formData = useWatch({
    control: form.control,
  }) as BusinessAvailabilityFormValues

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = businessAvailabilityFormSchema.safeParse(formData)
      let safeData: BusinessAvailabilityFormValues

      if (result.success) {
        safeData = result.data
      } else {
        safeData = {
          ...defaultValues,
          ...formData,
          timezone: formData.timezone || defaultValues.timezone,
          holidays: formData.holidays || defaultValues.holidays,
          businessAvailability:
            formData.businessAvailability || defaultValues.businessAvailability,
          businessDays: formData.businessDays || defaultValues.businessDays,
          breakHours: formData.breakHours || defaultValues.breakHours,
        }
      }

      const safeDataStr = JSON.stringify(safeData)
      if (safeDataStr !== lastFormDataRef.current) {
        dispatch(setBusinessAvailabilityForm(safeData))
        lastFormDataRef.current = safeDataStr
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [formData, dispatch])

  const breakHours = useWatch({
    control: form.control,
    name: 'breakHours',
    defaultValue: defaultValues.breakHours,
  })

  const onSubmit = async (formData: BusinessAvailabilityFormValues) => {
    const { businessAvailability, holidays } = convertFormToApiFormat(formData)

    const updatedData = {
      ...selectedBusiness,
      timeZone: formData.timezone,
      businessAvailability,
      holiday: holidays,
      updatedAt: new Date(),
    }

    console.log(updatedData, '--------------updatedData')

    dispatch(setBusinessDetail(updatedData))

    try {
      // if (selectedBusiness?.id) {
      // await dispatch(
      //   updateBusiness({ id: selectedBusiness.id, data: updatedData }),
      // ).unwrap()
      //   toast.success('Business availability updated successfully')
      // } else {
      //   toast.error('No business ID found. Please save business details first.')
      //   return
      // }
      dispatch(setActiveTab(BusinessTab.ServiceAvailability))
    } catch (error) {
      toast.error('Failed to save business availability')
    }
  }

  const handleSkip = () => {
    const currentData = form.getValues()
    const result = businessAvailabilityFormSchema.safeParse(currentData)
    const safeData: BusinessAvailabilityFormValues = result.success
      ? result.data
      : {
          ...defaultValues,
          ...currentData,
          timezone: currentData.timezone || defaultValues.timezone,
          holidays: currentData.holidays || defaultValues.holidays,
          businessAvailability:
            currentData.businessAvailability ||
            defaultValues.businessAvailability,
          businessDays: currentData.businessDays || defaultValues.businessDays,
          breakHours: currentData.breakHours || defaultValues.breakHours,
        }
    dispatch(setBusinessAvailabilityForm(safeData))
    dispatch(setActiveTab(BusinessTab.ServiceAvailability))
  }

  const handleBack = () => {
    const currentData = form.getValues()
    const result = businessAvailabilityFormSchema.safeParse(currentData)
    const safeData: BusinessAvailabilityFormValues = result.success
      ? result.data
      : {
          ...defaultValues,
          ...currentData,
          timezone: currentData.timezone || defaultValues.timezone,
          holidays: currentData.holidays || defaultValues.holidays,
          businessAvailability:
            currentData.businessAvailability ||
            defaultValues.businessAvailability,
          businessDays: currentData.businessDays || defaultValues.businessDays,
          breakHours: currentData.breakHours || defaultValues.breakHours,
        }
    dispatch(setBusinessAvailabilityForm(safeData))
    dispatch(setActiveTab(BusinessTab.BusinessDetail))
  }

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
            name="businessAvailability"
            label="Business Days"
            className="border border-blue-200 rounded-[8px]"
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            currentMode={currentMode}
            setCurrentMode={setCurrentMode}
          />
          <BusinessHourSelector
            name="businessDays"
            dayName="businessAvailability"
            label="Business Hours"
            initialBusinessHours={defaultValues.businessDays}
            businessBreaks={normalizeWeekDays(
              breakHours || defaultValues.breakHours,
            )}
            className="border border-blue-200 rounded-[4px]"
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
            // initialBusinessHours={defaultValues.breakHours}
            className="border border-blue-200 rounded-[4px]"
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
        <div className="flex justify-between text-[#BBBBBB]">
          <button
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            <div className="text-[#BBBBBB] text-sm font-normal">Back</div>
          </button>
          <div className="flex gap-4">
            <button
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
