'use client'

import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBusinessByOwnerId,
  transformAvailabilityForForm,
} from '@/store/slices/businessSlice'
import InputField from '@/components/custom-form-fields/input-field'
import PhoneField from '@/components/custom-form-fields/phone-field'
import SelectField from '@/components/custom-form-fields/select-field'

import { AppDispatch, RootState } from '@/store/store'
import BusinessDaySelector from '@/components/custom-form-fields/business-settings/business-day-selector'
import { WeekDay } from '@/components/custom-form-fields/business-settings/business-day-selector'
import BusinessHourSelector from '@/components/custom-form-fields/business-settings/business-hour-selector'

import {
  transformToSupportBusinessDetail,
  transformServiceAvailability,
} from '@/lib/support-business'

import { CheckCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

// Define the day type for TypeScript
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

// Type for time range (e.g., ["09:00 AM", "05:00 PM"])
type TimeRange = [string, string]

// Type for business hours (e.g., { Mon: [["09:00 AM", "05:00 PM"]] })
type BusinessHours = Record<DayOfWeek, TimeRange[]>

// Type for the form values
interface BusinessFormValues {
  useBusinessInfo: boolean
  supportTeamName: string
  supportEmail: string
  supportNumber: string
  physicalAddress: string
  googleMap: string
  businessAvailability: DayOfWeek[] // Array of selected days
  businessHours: BusinessHours // Business hours for each day
  breakHours: BusinessHours // Break hours for each day
}

const CustomerInformation = () => {
  // const [useBusinessInfo, setUseBusinessInfo] = useState<boolean>(false)
  // Then in your component, use the types like this:
  const form = useForm<BusinessFormValues>({
    defaultValues: {
      useBusinessInfo: false,
      supportTeamName: '',
      supportEmail: '',
      supportNumber: '',
      physicalAddress: '',
      googleMap: '',
      businessAvailability: [], // This will be an array of DayOfWeek
      businessHours: {}, // This will be an object with DayOfWeek keys
      breakHours: {}, // This will be an object with DayOfWeek keys
    },
  })
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  useEffect(() => {
    dispatch(fetchBusinessByOwnerId(user?.id as string))
  }, [user])

  const [activeDay, setActiveDay] = useState<WeekDay>('Mon')
  const { businesses, loading: isLoading } = useSelector(
    (state: RootState) => state.business,
  )
  const businessDetail = businesses?.[0]

  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const useBusinessInfo = useWatch({
    name: 'useBusinessInfo',
    control: form.control,
  })
  // const [selectedDay, setSelectedDay] = useState<string[]>(['monday'])
  // const [manuallySelectedDay, setManuallySelectedDay] = useState<string | null>(
  //   'monday',
  // )

  // Load API data: update Redux and reset form

  // const apiDataToForm = convertFromApiFormat({
  //   timeZone: businessDetail?.timeZone || '',
  //   businessAvailability: businessDetail?.businessAvailability || [],
  //   holiday: businessDetail?.holiday || [],
  // })
  // const apiSupportToForm = convertFromApiFormat({
  //   timeZone: businessDetail?.timeZone || '',
  //   businessAvailability:
  //     businessDetail?.supportBusinessDetail?.supportAvailability || [],
  //   holiday: businessDetail?.supportBusinessDetail?.supportHoliday || [],
  // })

  // dispatch(updateBusinessAvailabilityForm(apiDataToForm))
  // form.reset(apiDataToForm)

  // 🔄 Sync service hours with business hours if "Same as Business Hours" is selected
  // supportTeamName:
  //   businessDetail?.supportBusinessDetail?.supportBusinessName || '',
  // supportEmail: businessDetail?.supportBusinessDetail?.supportEmail || '',
  // supportNumber: businessDetail?.supportBusinessDetail?.supportPhone || '',
  // physicalAddress:
  //   businessDetail?.supportBusinessDetail?.supportAddress || '',
  // googleMap: businessDetail?.supportBusinessDetail?.supportGoogleMap || '',
  // supportHourType: businessDetail?.supportBusinessDetail
  //   ? 'SAME_AS_SUPPORT_HOURS'
  //   : 'SAME_AS_BUSINESS_HOURS',
  // businessAvailability: apiDataToForm.businessAvailability,
  // businessHours:
  //   supportHour === 'SAME_AS_BUSINESS_HOURS'
  //     ? apiDataToForm.businessHours
  //     : businessDetail?.supportBusinessDetail?.supportAvailability
  //       ? apiSupportToForm.businessHours
  //       : {
  //           Mon: [['09:00 AM', '05:00 PM']],
  //           Tue: [['09:00 AM', '05:00 PM']],
  //           Wed: [['09:00 AM', '05:00 PM']],
  //           Thu: [['09:00 AM', '05:00 PM']],
  //           Fri: [['09:00 AM', '05:00 PM']],
  //           Sat: [['09:00 AM', '05:00 PM']],
  //           Sun: [['09:00 AM', '05:00 PM']],
  //         },
  // breakHours:
  //   supportHour === 'SAME_AS_BUSINESS_HOURS'
  //     ? apiDataToForm.breakHours
  //     : businessDetail?.supportBusinessDetail?.supportAvailability
  //       ? apiSupportToForm.breakHours
  // : {
  //     Mon: [['12:00 PM', '01:00 PM']],
  //     Tue: [['12:00 PM', '01:00 PM']],
  //     Wed: [['12:00 PM', '01:00 PM']],
  //     Thu: [['12:00 PM', '01:00 PM']],
  //     Fri: [['12:00 PM', '01:00 PM']],
  //     Sat: [['12:00 PM', '01:00 PM']],
  //     Sun: [['12:00 PM', '01:00 PM']],
  //   },
  // ✅ Set default values including support details and service hours (business or support)
  useEffect(() => {
    const { work: businessHours, break: breakHours } =
      transformAvailabilityForForm(businessDetail?.businessAvailability || [])

    const apiDataToForm = {
      timeZone: businessDetail?.timeZone || '',
      businessAvailability: Object.entries(businessHours)
        .filter(([_, slots]) => slots.length > 0)
        .map(([day]) => day as keyof typeof businessHours),
      businessDays: businessHours,
      breakHours,
      holidays: businessDetail?.holiday?.map((h: any) => h.holiday) || [],
    }

    const { work: supportHours, break: supportBreakHours } =
      transformAvailabilityForForm(
        businessDetail?.supportBusinessDetail?.supportAvailability || [],
      )

    const apiSupportToForm = {
      timeZone: businessDetail?.timeZone || '',
      businessAvailability: Object.entries(supportHours)
        .filter(([_, slots]) => slots.length > 0)
        .map(([day]) => day as keyof typeof supportHours),
      businessDays: supportHours,
      breakHours: supportBreakHours,
      holidays:
        businessDetail?.supportBusinessDetail?.supportHoliday?.map(
          (h: any) => h.holiday,
        ) || [],
    }
    if (!businessDetail) return

    const hasSupportDetail = !!businessDetail?.supportBusinessDetail

    const isBusinessInfoValid =
      businessDetail?.name &&
      businessDetail?.email &&
      businessDetail?.phone &&
      businessDetail?.address?.[0]

    const isSupportInfoValid =
      hasSupportDetail &&
      businessDetail?.supportBusinessDetail?.supportBusinessName &&
      businessDetail?.supportBusinessDetail?.supportEmail &&
      businessDetail?.supportBusinessDetail?.supportPhone

    // Prevent premature form reset if data not ready
    if (useBusinessInfo && !isBusinessInfoValid) return
    if (!useBusinessInfo && !isSupportInfoValid) return

    const defaultValues = useBusinessInfo
      ? {
          supportTeamName: businessDetail.name || '',
          supportEmail: businessDetail.email || '',
          supportNumber: businessDetail.phone || '',
          physicalAddress: `${businessDetail.address?.[0]?.street || ''}, ${businessDetail.address?.[0]?.city || ''}, ${businessDetail.address?.[0]?.country || ''}`,
          googleMap: businessDetail.address?.[0]?.googleMap || '',
          businessAvailability: apiDataToForm.businessAvailability as WeekDay[],
          businessHours: apiDataToForm.businessDays as BusinessHours,
          breakHours: apiDataToForm.breakHours as BusinessHours,
        }
      : {
          supportTeamName:
            businessDetail.supportBusinessDetail?.supportBusinessName || '',
          supportEmail:
            businessDetail.supportBusinessDetail?.supportEmail || '',
          supportNumber:
            businessDetail.supportBusinessDetail?.supportPhone || '',
          physicalAddress:
            businessDetail.supportBusinessDetail?.supportAddress || '',
          googleMap:
            businessDetail.supportBusinessDetail?.supportGoogleMap || '',
          businessAvailability:
            apiSupportToForm.businessAvailability as WeekDay[],
          businessHours: apiSupportToForm.businessDays as BusinessHours,
          breakHours: apiSupportToForm.breakHours as BusinessHours,
        }

    form.reset(defaultValues)
  }, [useBusinessInfo, businessDetail])

  // 🧹 Reset form when businessDetail or supportHourType changes
  // useEffect(() => {
  //   if (!businessDetail) return

  //   const formData = {
  //     ...defaultValues,
  //     serviceHours: {
  //       businessHours: apiSupportToForm.businessHours,
  //       breakHours: apiSupportToForm.breakHours,
  //     },
  //   }

  //   form.reset(formData)
  // }, [businessDetail, form, supportHour])

  const onSubmit = (data: any) => {
    console.log(data, 'data')
    const updatedData = transformToSupportBusinessDetail(
      data,
      businessDetail?.id as string,
    )
    if (businessDetail?.supportBusinessDetail?.id) {
      dispatch(
        updateSupportBusinessDetail({
          id: businessDetail?.supportBusinessDetail?.id,
          data: updatedData,
        }),
      )
    } else {
      dispatch(createSupportBusinessDetail({ data: updatedData }))
    }
    console.log(updatedData, 'updatedData')
  }

  return (
    <div className="flex p-4 h-full  gap-4  bg-white  rounded-[8px] border border-[#E5E7EB]">
      {isLoading ? (
        <div>Loading support details...</div>
      ) : (
        <div className="flex flex-col w-full gap-6">
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
              <div className="space-y-2">
                <Controller
                  control={form.control}
                  name="useBusinessInfo"
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center gap-2">
                      <Switch checked={value} onCheckedChange={onChange} />
                      <div className="flex items-center gap-2">
                        <CheckCircle className="size-4 text-gray-500" />
                        <Label>Use Business Info</Label>
                      </div>
                    </div>
                  )}
                />

                <p className="text-xs text-muted-foreground">
                  📌 To let users know who to reach to for specific issues.
                  Following details are taken from Business Settings &gt;
                  Business Details.
                </p>
              </div>
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
                <InputField
                  name="googleMap"
                  label="Google Map Link"
                  placeholder="Enter Google Map Link"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
              </div>

              {/* 🕒 Show service hour editor if supportHourType is set */}

              <div className="mt-2 flex flex-col gap-4">
                <BusinessDaySelector
                  name="businessAvailability"
                  label="Business Days"
                  className=" border border-blue-200 rounded-[8px]"
                  activeDay={activeDay}
                  setActiveDay={setActiveDay}
                  currentMode={currentMode}
                  setCurrentMode={setCurrentMode}
                />

                {/* <BusinessHours
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
                  /> */}
                <BusinessHourSelector
                  name="businessHours" // form field name
                  dayName="businessAvailability"
                  label="Business Hours"
                  initialBusinessHours={apiDataToForm.businessHours} // initial display data for business hours
                  businessBreaks={apiDataToForm.breakHours} // pass transformed break hours
                  className=" border border-blue-200 rounded-[4px]"
                  activeDay={activeDay}
                  restrictToInitialHours={false}
                  isDefault={currentMode === 'default'}
                  setCustom={setCurrentMode}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="w-[150px] py-2.5 px-3 text-sm font-semibold text-center bg-[#2563EB] text-white rounded-[8px] cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  )
}

export default CustomerInformation
