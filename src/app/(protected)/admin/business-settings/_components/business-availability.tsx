// import SelectField from '@/components/custom-form-fields/select-field'
// import { Button } from '@/components/ui/button'
// import { cn, getTimezoneInfo } from '@/lib/utils'
// import { ArrowLeft, ArrowRight } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { FormProvider, useForm } from 'react-hook-form'
// import { toast } from 'sonner'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   setActiveStep,
//   completeStep,
//   updateBusinessDetail,
//   updateBusinessAvailabilityForm,
// } from '@/store/slices/businessSlice'

// import BusinessDaysSelector from './business-selector'
// import BusinessHours from './business-hours'
// import WeeklySchedulePreview from './weekly-preview'
// import {
//   transformBusinessAvailability,
//   transformToBusinessAvailability,
// } from '@/lib/business-availability'
// import { AppDispatch, RootState } from '@/store/store'

// // Schema for time in HH:MM format (24-hour)
// const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

// // Schema for day range

//

// // Schema for time slot
//

// // Main form schema
//
// // Create timezone options with consistent formatting
//

// // Create and sort timezone options by offset
//

// /**
//  * Default values for the business availability form
//  * Note: The 'default' property is required by the DaySchedule type
//  * and is used as a fallback when specific day values are not provided
//  */
//

// // --------------------------------* Component Starts Here *-----------------------------------------------

// const BusinessAvailability = ({
//   setTab,
//   data,
// }: {
//   setTab: (tab: string) => void
//   data: any
// }) => {
//   const dispatch = useDispatch<AppDispatch>()
//   const [currentMode, setCurrentMode] = useState('default')
//   const [selectedDay, setSelectedDay] = useState<string[]>(['monday'])
//   const [manuallySelectedDay, setManuallySelectedDay] = useState<string | null>(
//     null,
//   )
//   const businessDetailFormValues = useSelector(
//     (state: RootState) => state.business.businessDetailForm,
//   )

//   const form = useForm<BusinessAvailabilityFormValues>({
//     resolver: zodResolver(businessAvailabilitySchema),
//     defaultValues,
//   })

//   // Get form data from API or use defaults
//   const getFormData = () => {
//     if (data) {
//       return transformBusinessAvailability(data)
//     }
//     return defaultValues
//   }

//   // Initialize and update form when data or mode changes
//   useEffect(() => {
//     const formData = getFormData()
//     const typedFormData: BusinessAvailabilityFormValues = {
//       timezone: formData.timezone || '',
//       businessDays: formData.businessDays || [],
//       businessHours: {
//         monday: formData.businessHours?.monday || [],
//         tuesday: formData.businessHours?.tuesday || [],
//         wednesday: formData.businessHours?.wednesday || [],
//         thursday: formData.businessHours?.thursday || [],
//         friday: formData.businessHours?.friday || [],
//         saturday: formData.businessHours?.saturday || [],
//         sunday: formData.businessHours?.sunday || [],
//         default: formData.businessHours?.default || [],
//       },
//       breakHours: {
//         monday: formData.breakHours?.monday || [],
//         tuesday: formData.breakHours?.tuesday || [],
//         wednesday: formData.breakHours?.wednesday || [],
//         thursday: formData.breakHours?.thursday || [],
//         friday: formData.breakHours?.friday || [],
//         saturday: formData.breakHours?.saturday || [],
//         sunday: formData.breakHours?.sunday || [],
//         default: formData.breakHours?.default || [],
//       },
//     }

//     // Only reset form in default mode or initial load
//     if (currentMode === 'default') {
//       form.reset(typedFormData)
//     }
//   }, [data, currentMode, form])

//   const onSubmit = async (formData: BusinessAvailabilityFormValues) => {
//     console.log('Form submitted with data:', formData);

//     try {
//       // Validate that at least one day is selected
//       if (!formData.businessDays || formData.businessDays.length === 0) {
//         toast.error('Please select at least one business day');
//         return;
//       }

//       // Process selected days
//       const selectedDays = new Set<string>();
//       formData.businessDays.forEach((range) => {
//         const startIndex = daysOfWeek.indexOf(range.from as any);
//         const endIndex = daysOfWeek.indexOf(range.to as any);

//         if (startIndex !== -1) {
//           const end = endIndex !== -1 ? endIndex : startIndex;
//           for (let i = startIndex; i <= end; i++) {
//             selectedDays.add(daysOfWeek[i]);
//           }
//         }
//       });

//       // Process time slots for each day
//       const processedDays = Array.from(selectedDays);
//       const hasValidTimeSlots = processedDays.some(day => {
//         const daySlots = formData.businessHours[day as keyof DaySchedule];
//         return daySlots && daySlots.length > 0 && daySlots.some(slot => slot.open && slot.close);
//       });

//       if (!hasValidTimeSlots) {
//         toast.error('Please add at least one time slot for the selected days');
//         return;
//       }

//       const processedData = {
//         ...formData,
//         selectedDays: processedDays,
//       };

//       console.log('Processed data before transformation:', processedData);

//       const transformedData = transformToBusinessAvailability(
//         processedData,
//         businessDetailFormValues || {},
//       );

//       console.log('Transformed data:', transformedData);

//       // Update the business availability form in the store
//       dispatch(
//         updateBusinessAvailabilityForm([
//           {
//             businessAvailability: transformedData.businessAvailability,
//             holidays: transformedData.holidays || [],
//           },
//         ]),
//       );

//       // Mark the step as complete and move to the next step
//       dispatch(completeStep('business-settings'));
//       dispatch(setActiveStep('services'));

//       toast.success('Business availability saved successfully');

//       // If setTab is provided, navigate to the services tab
//       if (setTab) {
//         setTab('services');
//       }
//     } catch (error) {
//       console.error('Form submission error:', error)
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : 'Failed to submit form. Please try again.',
//       )
//     }
//   }

//   const handleBack = () => {
//     setTab('business-details')
//     dispatch(setActiveStep('business-settings'))
//   }

//   return (
//     <FormProvider {...form}>
//       <form
//         className="flex flex-col gap-8"
//         onSubmit={form.handleSubmit(onSubmit)}
//       >
//         <div className="flex flex-col gap-8 ">
//           <div className="flex pt-2  flex-col gap-6 border border-[transparent] rounded-[4px]">
//             <SelectField
//               name="timezone"
//               label="Time Zone"
//               placeholder="Select Time Zone"
//               options={timezoneOptions}
//             />
//           </div>

//           <div className="flex flex-col gap-2">
//             <div className="relative w-fit rounded-[8px] overflow-hidden bg-[#BBBBBB]/60 p-1 py-2 flex items-center h-10">
//               {/* Sliding background */}
//               <div
//                 className="absolute flex gap-2 h-8 w-[100px] rounded-[6px] z-10 bg-white transition-all duration-300 ease-in-out"
//                 style={{
//                   transform: `translateX(${currentMode === 'default' ? '0' : '100%'})`,
//                   boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
//                 }}
//               />

//               {/* Default Button */}
//               <button
//                 type="button"
//                 className={cn(
//                   'relative z-10 h-9 w-[100px] text-base font-medium transition-colors duration-300 cursor-pointer',
//                   currentMode === 'default' ? 'text-blue-600' : 'text-gray-600',
//                 )}
//                 onClick={() => setCurrentMode('default')}
//               >
//                 Default
//               </button>

//               {/* Custom Button */}
//               <button
//                 type="button"
//                 className={cn(
//                   'relative z-10 h-9 w-[100px] text-base font-medium transition-colors duration-300 cursor-pointer',
//                   currentMode === 'custom' ? 'text-blue-600' : 'text-gray-600',
//                 )}
//                 onClick={() => setCurrentMode('custom')}
//               >
//                 Custom
//               </button>
//             </div>
//             <div className="flex p-3 flex-col gap-6 border border-[#E9E9E9] rounded-[4px]">
//               <div onFocus={() => setCurrentMode('custom')}>
//                 <BusinessDaysSelector
//                   name="businessDays"
//                   label="Business Days"
//                   isDefaultMode={currentMode === 'default'}
//                   selectedDays={selectedDay}
//                   setSelectedDays={setSelectedDay}
//                   manuallySelectedDays={manuallySelectedDay}
//                   setManuallySelectedDays={setManuallySelectedDay}
//                 />
//               </div>

//               {manuallySelectedDay ? (
//                 <div onFocus={() => setCurrentMode('custom')}>
//                   <BusinessHours
//                     key={`business-${manuallySelectedDay}`}
//                     name={
//                       manuallySelectedDay
//                         ? `businessHours.${manuallySelectedDay}`
//                         : 'businessHours.default'
//                     }
//                     label={`Business Hours`}
//                     openLabel="Open Time"
//                     endLabel="Close Time"
//                     isDefaultMode={currentMode === 'default'}
//                     manuallySelectedDay={manuallySelectedDay}
//                   />
//                 </div>
//               ) : (
//                 <div onFocus={() => setCurrentMode('custom')}>
//                   <BusinessHours
//                     name="businessHours"
//                     label="Business Hours"
//                     openLabel="Open Time"
//                     endLabel="Close Time"
//                     isDefaultMode={currentMode === 'default'}
//                     manuallySelectedDay={manuallySelectedDay}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="flex p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
//             <div className="flex flex-col gap-4">
//               {manuallySelectedDay ? (
//                 <div onFocus={() => setCurrentMode('custom')}>
//                   <BusinessHours
//                     key={`break-${manuallySelectedDay}`}
//                     name={
//                       manuallySelectedDay
//                         ? `breakHours.${manuallySelectedDay}`
//                         : 'breakHours.default'
//                     }
//                     label={`Break Hours`}
//                     openLabel="Break Start"
//                     endLabel="Break End"
//                     isDefaultMode={currentMode === 'default'}
//                     manuallySelectedDay={manuallySelectedDay}
//                   />
//                 </div>
//               ) : (
//                 <div onFocus={() => setCurrentMode('custom')}>
//                   <BusinessHours
//                     name="breakHours"
//                     label="Break Hours"
//                     openLabel="Break Start"
//                     endLabel="Break End"
//                     isDefaultMode={currentMode === 'default'}
//                     manuallySelectedDay={manuallySelectedDay}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//           <WeeklySchedulePreview
//             businessHoursName="businessHours"
//             breakHoursName="breakHours"
//             selectedDaysName="businessDays"
//           />
//         </div>

//         <div className="flex justify-between text-[#BBBBBB]    ">
//           <button
//             type="button"
//             className="flex gap-1 items-center cursor-pointer"
//             onClick={handleBack}
//           >
//             <ArrowLeft className="w-4 h-4" strokeWidth={3} />

//             <div className="text-[#BBBBBB] text-sm font-normal">Back</div>
//           </button>
//           <div className="flex gap-4">
//             <button
//               type="button"
//               className="flex gap-1 items-center cursor-pointer text-[#6AA9FF]"
//               onClick={() => dispatch(setActiveStep('services'))}
//               // onClick={handleSkip}
//             >
//               <div className="text-[##6AA9FF] text-sm font-normal">Skip</div>
//               <ArrowRight className="w-4 h-4" strokeWidth={3} />
//             </button>
//             <Button type="submit" className="cursor-pointer">
//               Save and Continue
//             </Button>
//           </div>
//         </div>
//       </form>
//     </FormProvider>
//   )
// }

// export default BusinessAvailability

// BusinessAvailability.tsx
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
    const formData = data ? transformBusinessAvailability(data) : defaultValues
    // Fix breakHours if missing or empty
    const fixedFormData = {
      ...formData,
      breakHours:
        Object.keys(formData.breakHours || {}).length > 0
          ? formData.breakHours
          : defaultValues.breakHours,
    }
    console.log(fixedFormData, 'fromData')
    form.reset(fixedFormData)
  }, [data, form])

  // Handle form submit
  const onSubmit = async (formData: BusinessAvailabilityFormValues) => {
    console.log(formData, 'Value from the form')
    const selectedDays = new Set<string>()
    for (const range of formData.businessDays) {
      const startIndex = defaultValues.businessDays.findIndex(
        (d) => d.from === range.from,
      )
      const endIndex = defaultValues.businessDays.findIndex(
        (d) => d.to === range.to,
      )
      for (let i = startIndex; i <= endIndex; i++) {
        selectedDays.add(defaultValues.businessDays[i].from)
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
              : 'businessHours'
          }
          label="Business Hours"
          openLabel="Open Time"
          endLabel="Close Time"
          isDefaultMode={currentMode === 'default'}
          manuallySelectedDay={manuallySelectedDay}
        />

        {/* Break Hours */}
        <BusinessHours
          name={
            manuallySelectedDay
              ? `breakHours.${manuallySelectedDay}`
              : 'breakHours'
          }
          label="Break Hours"
          openLabel="Break Start"
          endLabel="Break End"
          isDefaultMode={currentMode === 'default'}
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
