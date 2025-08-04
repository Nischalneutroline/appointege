// 'use client'

// import React, { useEffect, useState } from 'react'
// import { FormProvider, useForm, useWatch } from 'react-hook-form'
// import { useDispatch, useSelector } from 'react-redux'
// import InputField from '@/components/custom-form-fields/input-field'
// import PhoneField from '@/components/custom-form-fields/phone-field'
// import SelectField from '@/components/custom-form-fields/select-field'

// import { AppDispatch, RootState } from '@/store/store'
// import BusinessDaySelector from '@/components/custom-form-fields/business-settings/business-day-selector'
// import { WeekDay } from '@/components/custom-form-fields/business-settings/business-day-selector'
// import BusinessHourSelector from '@/components/custom-form-fields/business-settings/business-hour-selector'
// import { normalizeWeekDays } from '../../business-settings/_components/form/business-availability'
// import {
//   transformToSupportBusinessDetail,
//   transformServiceAvailability,
// } from '@/lib/support-business'
// import {
//   createSupportBusinessDetail,
//   fetchBusinessDetail,
//   updateSupportBusinessDetail,
// } from '@/store/slices/businessSlice'
// import { convertFromApiFormat } from '@/lib/business-availability'

// const SUPPORT_HOUR_OPTIONS = [
//   { label: 'Same as Business Hours', value: 'SAME_AS_BUSINESS_HOURS' },
//   { label: 'Same as Support Hours', value: 'SAME_AS_SUPPORT_HOURS' },
// ]

// // const DEFAULT_SERVICE_HOURS = {
// //   monday: [{ open: '09:00', close: '17:00' }],
// //   tuesday: [{ open: '09:00', close: '17:00' }],
// //   wednesday: [{ open: '09:00', close: '17:00' }],
// //   thursday: [{ open: '09:00', close: '17:00' }],
// //   friday: [{ open: '09:00', close: '17:00' }],
// //   saturday: [{ open: '09:00', close: '17:00' }],
// //   sunday: [{ open: '09:00', close: '17:00' }],
// // }

// const CustomerInformation = () => {
//   const form = useForm()
//   const dispatch = useDispatch<AppDispatch>()
//   const user = useSelector((state: RootState) => state.auth.user)
//   useEffect(() => {
//     dispatch(fetchBusinessDetail(user?.ownedBusinesses?.[0]?.id as string))
//   }, [user])

//   const [activeDay, setActiveDay] = useState<WeekDay>('Mon')
//   const { businessDetail, isLoading } = useSelector(
//     (state: RootState) => state.business,
//   )

//   const supportHour = useWatch({
//     control: form.control,
//     name: 'supportHourType',
//   })
//   console.log(businessDetail, 'businessDetail')
//   const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
//     'default',
//   )
//   // const [selectedDay, setSelectedDay] = useState<string[]>(['monday'])
//   // const [manuallySelectedDay, setManuallySelectedDay] = useState<string | null>(
//   //   'monday',
//   // )

//   // Load API data: update Redux and reset form

//   const apiDataToForm = convertFromApiFormat({
//     timeZone: businessDetail?.timeZone || '',
//     businessAvailability: businessDetail?.businessAvailability || [],
//     holiday: businessDetail?.holiday || [],
//   })
//   const apiSupportToForm = convertFromApiFormat({
//     timeZone: businessDetail?.timeZone || '',
//     businessAvailability:
//       businessDetail?.supportBusinessDetail?.supportAvailability || [],
//     holiday: businessDetail?.supportBusinessDetail?.supportHoliday || [],
//   })

//   // dispatch(updateBusinessAvailabilityForm(apiDataToForm))
//   // form.reset(apiDataToForm)

//   // 🔄 Sync service hours with business hours if "Same as Business Hours" is selected

//   // ✅ Set default values including support details and service hours (business or support)
//   const defaultValues = {
//     supportTeamName:
//       businessDetail?.supportBusinessDetail?.supportBusinessName || '',
//     supportEmail: businessDetail?.supportBusinessDetail?.supportEmail || '',
//     supportNumber: businessDetail?.supportBusinessDetail?.supportPhone || '',
//     physicalAddress:
//       businessDetail?.supportBusinessDetail?.supportAddress || '',
//     googleMap: businessDetail?.supportBusinessDetail?.supportGoogleMap || '',
//     supportHourType: businessDetail?.supportBusinessDetail
//       ? 'SAME_AS_SUPPORT_HOURS'
//       : 'SAME_AS_BUSINESS_HOURS',
//     businessAvailability: apiDataToForm.businessAvailability,
//     businessHours:
//       supportHour === 'SAME_AS_BUSINESS_HOURS'
//         ? apiDataToForm.businessHours
//         : businessDetail?.supportBusinessDetail?.supportAvailability
//           ? apiSupportToForm.businessHours
//           : {
//               Mon: [['09:00 AM', '05:00 PM']],
//               Tue: [['09:00 AM', '05:00 PM']],
//               Wed: [['09:00 AM', '05:00 PM']],
//               Thu: [['09:00 AM', '05:00 PM']],
//               Fri: [['09:00 AM', '05:00 PM']],
//               Sat: [['09:00 AM', '05:00 PM']],
//               Sun: [['09:00 AM', '05:00 PM']],
//             },
//     breakHours:
//       supportHour === 'SAME_AS_BUSINESS_HOURS'
//         ? apiDataToForm.breakHours
//         : businessDetail?.supportBusinessDetail?.supportAvailability
//           ? apiSupportToForm.breakHours
//           : {
//               Mon: [['12:00 PM', '01:00 PM']],
//               Tue: [['12:00 PM', '01:00 PM']],
//               Wed: [['12:00 PM', '01:00 PM']],
//               Thu: [['12:00 PM', '01:00 PM']],
//               Fri: [['12:00 PM', '01:00 PM']],
//               Sat: [['12:00 PM', '01:00 PM']],
//               Sun: [['12:00 PM', '01:00 PM']],
//             },
//   }
//   // 🧹 Reset form when businessDetail or supportHourType changes
//   useEffect(() => {
//     if (!businessDetail) return

//     const formData = {
//       ...defaultValues,
//       serviceHours: {
//         businessHours: apiSupportToForm.businessHours,
//         breakHours: apiSupportToForm.breakHours,
//       },
//     }

//     form.reset(formData)
//   }, [businessDetail, form, supportHour])

//   const onSubmit = (data: any) => {
//     console.log(data, 'data')
//     const updatedData = transformToSupportBusinessDetail(
//       data,
//       businessDetail?.id as string,
//     )
//     if (businessDetail?.supportBusinessDetail?.id) {
//       dispatch(
//         updateSupportBusinessDetail({
//           id: businessDetail?.supportBusinessDetail?.id,
//           data: updatedData,
//         }),
//       )
//     } else {
//       dispatch(createSupportBusinessDetail({ data: updatedData }))
//     }
//     console.log(updatedData, 'updatedData')
//   }

//   return (
//     <>
//       {isLoading ? (
//         <div>Loading support details...</div>
//       ) : (
//         <div className="flex flex-col w-full gap-4">
//           {' '}
//           <div>
//             <div className="text-lg md:text-xl font-semibold text-[#111827]">
//               Contact Information
//             </div>
//             <div className="text-[#6B7280] text-xs md:text-base font-normal">
//               Provide business support details so customers can reach out easily
//             </div>
//           </div>
//           <FormProvider {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="flex flex-col gap-4"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
//                 <InputField
//                   name="supportTeamName"
//                   label="Support Team Name"
//                   placeholder="Enter Support Team Name"
//                   className="!h-9 sm:!h-10  border border-blue-200 rounded-[4px]"
//                 />
//                 <InputField
//                   name="supportEmail"
//                   label="Support Email"
//                   placeholder="Enter Support Email"
//                   className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
//                 <PhoneField
//                   name="supportNumber"
//                   label="Support Number"
//                   placeholder="Enter Support Number"
//                   className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
//                 />
//                 <InputField
//                   name="physicalAddress"
//                   label="Physical Address"
//                   placeholder="Enter Physical Address"
//                   className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
//                 <SelectField
//                   name="supportHourType"
//                   label="Support Hour Type"
//                   placeholder="Enter Support Hour Type"
//                   className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] leading-[20px]"
//                   options={SUPPORT_HOUR_OPTIONS}
//                 />
//                 <InputField
//                   name="googleMap"
//                   label="Google Map Link"
//                   placeholder="Enter Google Map Link"
//                   className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
//                 />
//               </div>

//               {/* 🕒 Show service hour editor if supportHourType is set */}
//               {supportHour && (
//                 <div className="mt-2 flex flex-col gap-4">
//                   <BusinessDaySelector
//                     name="businessAvailability"
//                     label="Business Days"
//                     className=" border border-blue-200 rounded-[8px]"
//                     activeDay={activeDay}
//                     setActiveDay={setActiveDay}
//                     currentMode={currentMode}
//                     setCurrentMode={setCurrentMode}
//                   />

//                   {/* <BusinessHours
//                     className="gap-2"
//                     name={
//                       manuallySelectedDay
//                         ? `businessHours.${manuallySelectedDay}`
//                         : 'businessHours.default'
//                     }
//                     label="Service Hours"
//                     openLabel="Open Time"
//                     endLabel="Close Time"
//                     isDefaultMode={currentMode === 'default'}
//                     isEditMode={!!manuallySelectedDay}
//                     onCustomModeActivate={() => setCurrentMode('custom')}
//                     manuallySelectedDay={manuallySelectedDay}
//                   /> */}
//                   <BusinessHourSelector
//                     name="businessHours" // form field name
//                     dayName="businessAvailability"
//                     label="Business Hours"
//                     initialBusinessHours={defaultValues.businessHours} // initial display data for business hours
//                     businessBreaks={defaultValues.breakHours} // pass transformed break hours
//                     className=" border border-blue-200 rounded-[4px]"
//                     activeDay={activeDay}
//                     restrictToInitialHours={false}
//                     isDefault={currentMode === 'default'}
//                     setCustom={setCurrentMode}
//                   />
//                 </div>
//               )}

//               <div className="flex justify-end mt-6">
//                 <button
//                   type="submit"
//                   className="w-[150px] py-2.5 px-3 text-sm font-semibold text-center bg-[#2563EB] text-white rounded-[8px]"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </FormProvider>
//         </div>
//       )}
//     </>
//   )
// }

// export default CustomerInformation
