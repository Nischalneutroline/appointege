'use client'

import React, { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import InputField from '@/components/custom-form-fields/input-field'
import PhoneField from '@/components/custom-form-fields/phone-field'
import SelectField from '@/components/custom-form-fields/select-field'
import BusinessHours from '../../business-settings/_components/business-hours'
import BusinessDaysSelector from '../../business-settings/_components/business-selector'
import {
  transformFormToSupportBusinessDetailAPI,
  transformServiceAvailability,
} from '@/lib/business-availability'
import { AppDispatch, RootState } from '@/store/store'

const SUPPORT_HOUR_OPTIONS = [
  { label: 'Same as Business Hours', value: 'SAME_AS_BUSINESS_HOURS' },
  { label: 'Same as Support Hours', value: 'SAME_AS_SUPPORT_HOURS' },
]

const DEFAULT_SERVICE_HOURS = {
  monday: [{ open: '09:00', close: '17:00' }],
  tuesday: [{ open: '09:00', close: '17:00' }],
  wednesday: [{ open: '09:00', close: '17:00' }],
  thursday: [{ open: '09:00', close: '17:00' }],
  friday: [{ open: '09:00', close: '17:00' }],
  saturday: [{ open: '09:00', close: '17:00' }],
  sunday: [{ open: '09:00', close: '17:00' }],
  }

const CustomerInformation = () => {
  const form = useForm()
  const dispatch = useDispatch<AppDispatch>()

  const { businessDetail, isLoading } = useSelector(
    (state: RootState) => state.business,
  )

  const supportHour = useWatch({
    control: form.control,
    name: 'supportHourType',
  })

  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const [selectedDay, setSelectedDay] = useState<string[]>(['monday'])
  const [manuallySelectedDay, setManuallySelectedDay] = useState<string | null>(
    'monday',
  )

  // 🔄 Sync service hours with business hours if "Same as Business Hours" is selected
  useEffect(() => {
    if (
      supportHour === 'SAME_AS_BUSINESS_HOURS' &&
      businessDetail?.businessAvailability
    ) {
      form.setValue('serviceHours', businessDetail.businessAvailability)
    }
  }, [supportHour, businessDetail, form])
  const { businessHours, breakHours } = transformServiceAvailability({
    businessAvailability:
      supportHour === 'SAME_AS_BUSINESS_HOURS'
        ? businessDetail?.businessAvailability
        : businessDetail?.supportBusinessDetail?.supportAvailability,
  })

  // ✅ Set default values including support details and service hours (business or support)
  const defaultValues = {
    supportTeamName:
      businessDetail?.supportBusinessDetail?.supportBusinessName || '',
    supportEmail: businessDetail?.supportBusinessDetail?.supportEmail || '',
    supportNumber: businessDetail?.supportBusinessDetail?.supportPhone || '',
    physicalAddress:
      businessDetail?.supportBusinessDetail?.supportAddress || '',
    googleMap: businessDetail?.supportBusinessDetail?.supportGoogleMap || '',
    supportHourType: supportHour || 'SAME_AS_BUSINESS_HOURS',
    serviceDays: [{ from: 'monday', to: 'friday' }],
    businessHours,
    breakHours,
  }

  // 🧹 Reset form when businessDetail or supportHourType changes
  useEffect(() => {
    if (!businessDetail) return

    const formData = {
      ...defaultValues,
      serviceHours: { businessHours, breakHours },
    }

    form.reset(formData)
  }, [businessDetail, form, supportHour])

  const onSubmit = (data: any) => {
    const updatedData = transformFormToSupportBusinessDetailAPI(
      data,
      businessDetail?.id as string,
    )
  }

  return (
    <>
      {isLoading ? (
        <div>Loading support details...</div>
      ) : (
        <div className="flex flex-col w-full gap-4">
          {' '}
          <div>
            <div className="text-lg md:text-xl font-semibold text-[#111827]">
              Contact Information
            </div>
            <div className="text-[#6B7280] text-xs md:text-base font-normal">
              Provide business support details so customers can reach out easily
            </div>
          </div>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                <InputField
                  name="supportTeamName"
                  label="Support Team Name"
                  placeholder="Enter Support Team Name"
                  className="!h-9 sm:!h-10  border border-blue-200 rounded-[4px]"
                />
                <InputField
                  name="supportEmail"
                  label="Support Email"
                  placeholder="Enter Support Email"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                <PhoneField
                  name="supportNumber"
                  label="Support Number"
                  placeholder="Enter Support Number"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <InputField
                  name="physicalAddress"
                  label="Physical Address"
                  placeholder="Enter Physical Address"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                <SelectField
                  name="supportHourType"
                  label="Support Hour Type"
                  placeholder="Enter Support Hour Type"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] leading-[20px]"
                  options={SUPPORT_HOUR_OPTIONS}
                />
                <InputField
                  name="googleMap"
                  label="Google Map Link"
                  placeholder="Enter Google Map Link"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
              </div>

              {/* 🕒 Show service hour editor if supportHourType is set */}
              {supportHour && (
                <div className="mt-2 flex flex-col gap-4">
                  <BusinessDaysSelector
                    name="serviceDays"
                    label="Service Days"
                    isDefaultMode={false}
                    selectedDays={selectedDay}
                    setSelectedDays={setSelectedDay}
                    manuallySelectedDays={manuallySelectedDay}
                    onCustomModeActivate={() => setCurrentMode('custom')}
                    setManuallySelectedDays={setManuallySelectedDay}
                  />

                  <BusinessHours
                    className="gap-2"
                    name={
                      manuallySelectedDay
                        ? `businessHours.${manuallySelectedDay}`
                        : 'businessHours.default'
                    }
                    label="Service Hours"
                    openLabel="Open Time"
                    endLabel="Close Time"
                    isDefaultMode={currentMode === 'default'}
                    isEditMode={!!manuallySelectedDay}
                    onCustomModeActivate={() => setCurrentMode('custom')}
                    manuallySelectedDay={manuallySelectedDay}
                  />
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="w-[150px] py-2.5 px-3 text-sm font-semibold text-center bg-[#2563EB] text-white rounded-[8px]"
                >
                  Submit
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </>
  )
}

export default CustomerInformation
