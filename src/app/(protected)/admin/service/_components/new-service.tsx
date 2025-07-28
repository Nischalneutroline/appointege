// import React, { useState } from 'react'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import { FormProvider, useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { serviceSchema } from '../_schemas/service'
// import TextAreaField from '@/components/custom-form-fields/textarea-field'
// import AvailabilityTabs from '@/components/custom-form-fields/availability-tabs'
// import { z } from 'zod'
// import InputField from '@/components/custom-form-fields/input-field'
// import DurationSelect from '@/components/custom-form-fields/duration-select'
// import { ServiceStatus, WeekDays } from '../_types/service'
// import FileUploadField from '@/components/custom-form-fields/image-upload'
// import ServiceDaySelector from '@/components/custom-form-fields/serivce/service-day-selector'
// import ServiceHoursSelector from '@/components/custom-form-fields/serivce/service-hours-selector'
// import { Button } from '@/components/ui/button'

// export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
// export type BusinessAvailability = {
//   breaks: Record<WeekDay, [string, string][]>
//   holidays: WeekDay[]
// }

// export const toFullDay = (day: string): string => {
//   const map: Record<string, string> = {
//     Mon: 'MONDAY',
//     Tue: 'TUESDAY',
//     Wed: 'WEDNESDAY',
//     Thu: 'THURSDAY',
//     Fri: 'FRIDAY',
//     Sat: 'SATURDAY',
//     Sun: 'SUNDAY',
//   }

//   return map[day] ?? 'MONDAY' // Fallback to MONDAY just in case
// }

// // Default business availability (for testing, can be overridden by prop)
// const defaultBusinessAvailability: BusinessAvailability = {
//   breaks: {
//     Mon: [
//       ['12:00 PM', '01:00 PM'],
//       ['02:00 PM', '03:00 PM'],
//       ['04:00 PM', '05:00 PM'],
//     ],
//     Tue: [['02:00 PM', '04:00 PM']],
//     Wed: [],
//     Thu: [],
//     Fri: [],
//     Sat: [],
//     Sun: [],
//   },
//   holidays: ['Sat', 'Sun'],
// }

// /* Format availability settings note */
// const formatAvailabilityNote = () => {
//   return 'Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability.'
// }

// const NewServiceForm = ({
//   open,
//   onChange,
// }: {
//   open: boolean
//   onChange: (open: boolean) => void
// }) => {
//   const businessAvailability = defaultBusinessAvailability
//   // Dispatch
//   const dispatch = useDispatch<AppDispatch>()
//   // User state`
//   const { user } = useSelector((state: RootState) => state.auth)
//   const { isFormOpen, serviceFormMode } = useSelector(
//     (state: RootState) => state.service,
//   )

//   // Handle dialog close
//   const handleOpenChange = (open: boolean) => {
//     if (!open) {
//       //   dispatch(closeAppointmentForm())
//     }
//   }

//   type FormData = z.infer<typeof serviceSchema>

//   //   const [isLoadingService, setIsLoadingService] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   //   const [isSubmitted, setIsSubmitted] = useState(false)
//   //   const [filledData, setFilledData] = useState<FormData>()

//   // Form Object for Service
//   const form = useForm<FormData>({
//     resolver: zodResolver(serviceSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       estimatedDuration: 0,
//       serviceAvailability: [],
//       businessDetailId: '',
//       ServiceStatus: ServiceStatus.ACTIVE,
//     },
//   })
//   // Loading Services
//   //   const { , isLoading: isLoadingServices } = useSelector(
//   //     (state: RootState) => state.service,
//   //   )
//   const onSubmit = async (data: FormData) => {
//     // try {
//     //   const serviceData = {
//     //     title: data.serviceName,
//     //     description: data.description,
//     //     estimatedDuration: parseInt(data.duration),
//     //     ServiceStatus: data.isAvailable ? 'ACTIVE' : 'INACTIVE',
//     //     serviceAvailability: data.serviceDays.map((day) => ({
//     //       weekDay: toFullDay(day),
//     //       timeSlots: (data.serviceHours[day] || []).map(
//     //         ([startTime, endTime]) => ({
//     //           startTime: toDate(startTime),
//     //           endTime: toDate(endTime),
//     //         }),
//     //       ),
//     //     })),
//     //     businessDetailId: businessId,
//     //   }
//     //   console.log(serviceData, 'servicedata inside onSubmit')
//     //   await createService(serviceData)
//     //   toast.success('Service created successfully')
//     //   router.push('/service')
//     // } catch (error) {
//     //   toast.error('Failed to create service')
//     //   console.error('Error creating service:', error)
//     // }
//   }

//   const handleBack = () => {
//     onChange(false)
//   }

//   return (
//     <Dialog onOpenChange={onChange} open={open}>
//       <DialogContent className="md:max-w-2xl overflow-y-scroll max-h-[40rem]">
//         <DialogHeader className="gap-0">
//           <DialogTitle className="flex justify-center text-blue-700 text-xl">
//             {serviceFormMode === 'edit'
//               ? 'Edit Service'
//               : 'Enter Service Details'}
//           </DialogTitle>
//           <DialogDescription className="flex justify-center text-sm text-muted-foreground">
//             {serviceFormMode === 'edit'
//               ? 'Update existing service details'
//               : 'Fill the detail below to create a new service'}
//           </DialogDescription>
//         </DialogHeader>

//         {/* {isLoadingServices ? (
//           <div className="flex justify-center items-center py-20 text-muted-foreground">
//             Loading services...
//           </div>
//         ) : !isLoadingServices && serviceOptions.length === 0 ? (
//           <div className="flex justify-center items-center py-20 text-muted-foreground">
//             No service found to add appointment
//           </div>
//         ) : ( */}
//         <FormProvider {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-5"
//             aria-busy={isSubmitting}
//           >
//             {/* <div className="grid grid-cols-2 gap-4"> */}
//             <InputField
//               name="title"
//               label="Service Name"
//               placeholder="Enter Service Name"
//             />
//             {/* <InputField
//                   name="lastName"
//                   label="Last Name"
//                   placeholder="Doe"
//                 /> */}
//             {/* </div> */}

//             <TextAreaField
//               name="description"
//               label="Description"
//               placeholder="Enter Description"
//             />

//             <FileUploadField
//               name="image"
//               label="Cover Page"
//               placeholder="Upload Image"
//             />

//             {/* <SelectField
//                 name="service"
//                 label="Select a Service"
//                 options={serviceOptions}
//                 placeholder="Select service"
//                 disabled={isSubmitting}
//               /> */}

//             {/* <div className="flex flex-col gap-3 md:flex-row items-center justify-center"> */}
//             {/* <AvailabilityTabs name="ServiceStatus" /> */}
//             <DurationSelect name="duration" label="Duration:" />
//             {/* </div> */}
//             <ServiceDaySelector
//               name="serviceDays"
//               businessAvailability={businessAvailability}
//             />
//             <ServiceHoursSelector
//               name="serviceHours"
//               businessBreaks={businessAvailability.breaks}
//             />

//             {/* <div className="grid grid-cols-2 items-center gap-4">
//                 <DatePickerField
//                   name="date"
//                   label="Appointment Date"
//                   placeholder="Pick a date"
//                 />
//                 <TimePickerField
//                   name="time"
//                   label="Appointment Time"
//                   availableTimeSlots={availableTimeSlots}
//                 />
//               </div> */}

//             <TextAreaField
//               name="message"
//               label="Additional Notes"
//               placeholder="Any special requests?"
//             />

//             {/* <FormField
//                 control={form.control}
//                 name="appointmentType"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Appointment Type</FormLabel>
//                     <FormControl>
//                       <RadioGroup
//                         onValueChange={field.onChange}
//                         value={field.value}
//                         className="flex space-x-4"
//                         disabled={isSubmitting}
//                       >
//                         {appointmentTypeOptions.map((option) => (
//                           <div
//                             key={option.value}
//                             className="flex items-center space-x-2"
//                           >
//                             <RadioGroupItem
//                               value={option.value}
//                               id={option.value}
//                             />
//                             <label
//                               htmlFor={option.value}
//                               className="text-sm font-medium"
//                             >
//                               {option.label}
//                             </label>
//                           </div>
//                         ))}
//                       </RadioGroup>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               /> */}

//             <div className="flex flex-col gap-3  md:flex-row justify-center items-center mt-6">
//               {/* <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-blue-700 transition-transform duration-200"
//                 onClick={handleBack}
//                 disabled={isSubmitting}
//               >
//                 ← Back
//               </Button> */}
//               <Button
//                 type="submit"
//                 variant="default"
//                 className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
//                 // disabled={
//                 //   isLoadingServices || isLoadingAppointment || isSubmitting
//                 // }
//               >
//                 {/* {isEditMode ? (
//                     isSubmitting ? (
//                       <LoadingSpinner text="Updating..." />
//                     ) : (
//                       'Submitting...'
//                     )
//                   ) : isSubmitting ? (
//                     <LoadingSpinner text="Creating..." />
//                   ) : ( */}
//                 Submit
//                 {/* )} */}
//               </Button>
//             </div>
//           </form>
//         </FormProvider>
//         {/* )} */}
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default NewServiceForm

'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { serviceSchema } from '../_schemas/service'
import InputField from '@/components/custom-form-fields/input-field'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import FileUploadField from '@/components/custom-form-fields/image-upload'
import DurationSelect from '@/components/custom-form-fields/duration-select'
import AvailabilityTabs from '@/components/custom-form-fields/availability-tabs'
import ServiceDaySelector from '@/components/custom-form-fields/serivce/service-day-selector'
import ServiceHoursSelector from '@/components/custom-form-fields/serivce/service-hours-selector'
import { Button } from '@/components/ui/button'
import { ServiceStatus, Service } from '../_types/service'

import { toast } from 'sonner'
import { Calendar, CircleCheckBig, Clock, Mail, UserRound } from 'lucide-react'
import { format } from 'date-fns'
import SelectField from '@/components/custom-form-fields/select-field'
import ViewItem from '../../appointment/_component/view/view-item'
import LoadingSpinner from '@/components/loading-spinner'
import { closeServiceForm } from '@/store/slices/serviceslice'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>
  holidays: WeekDay[]
}

const defaultBusinessAvailability: BusinessAvailability = {
  breaks: {
    Mon: [
      ['12:00 PM', '01:00 PM'],
      ['02:00 PM', '03:00 PM'],
      ['04:00 PM', '05:00 PM'],
    ],
    Tue: [['02:00 PM', '04:00 PM']],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  },
  holidays: ['Sat', 'Sun'],
}

const toFullDay = (day: string): string => {
  const map: Record<string, string> = {
    Mon: 'MONDAY',
    Tue: 'TUESDAY',
    Wed: 'WEDNESDAY',
    Thu: 'THURSDAY',
    Fri: 'FRIDAY',
    Sat: 'SATURDAY',
    Sun: 'SUNDAY',
  }
  return map[day] ?? 'MONDAY'
}

const NewServiceForm = ({
  open,
  onChange,
}: {
  open: boolean
  onChange: (open: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isFormOpen, serviceFormMode, currentService, success } = useSelector(
    (state: RootState) => state.service,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [filledData, setFilledData] = useState<z.infer<
    typeof serviceSchema
  > | null>(null)

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      estimatedDuration: 0,
      serviceAvailability: [],
      businessDetailId: user?.ownedBusinesses?.[0]?.id ?? '',
      ServiceStatus: ServiceStatus.ACTIVE,
      message: '',
      image: '',
    },
  })

  useEffect(() => {
    if (isFormOpen && serviceFormMode === 'edit' && currentService) {
      form.reset({
        title: currentService.title,
        description: currentService.description,
        estimatedDuration: currentService.estimatedDuration || 0,
        serviceAvailability: currentService.serviceAvailability,
        businessDetailId:
          currentService.businessDetailId ||
          user?.ownedBusinesses?.[0]?.id ||
          '',
        ServiceStatus: currentService.status,
        // message: currentService. || '',
        // image: currentService.image || '',
      })
    } else if (!isFormOpen) {
      form.reset()
    }
  }, [isFormOpen, serviceFormMode, currentService, form, user])

  useEffect(() => {
    if (success && isSubmitting) {
      setIsSubmitted(true)
      setIsSubmitting(false)
    }
  }, [success, isSubmitting])

  const statusOptions = Object.values(ServiceStatus).map((status) => ({
    label: status.charAt(0) + status.slice(1).toLowerCase(),
    value: status,
  }))

  const getLabelFromValue = (
    value: string,
    options: { label: string; value: string }[],
  ) => {
    const option = options.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const onSubmit = async (data: z.infer<typeof serviceSchema>) => {
    if (!user?.id) {
      toast.error('You must be logged in to create or update a service')
      return
    }

    try {
      setIsSubmitting(true)
      const serviceData = {
        name: data.title,
        description: data.description,
        estimatedDuration: data.estimatedDuration,
        serviceAvailability: data.serviceAvailability.map((day) => ({
          weekDay: toFullDay(day.weekDay),
          timeSlots: day.timeSlots.map(({ startTime, endTime }) => ({
            startTime,
            endTime,
          })),
        })),
        businessDetailId:
          data.businessDetailId || user.ownedBusinesses?.[0]?.id || '',
        status: data.ServiceStatus,
        message: data.message,
        image: data.image,
        userId: user.id,
      }

      if (serviceFormMode === 'edit' && currentService?.id) {
        // await dispatch(
        //   updateService({
        //     id: currentService.id,
        //     data: serviceData,
        //   }),
        // ).unwrap()
      } else {
        // await dispatch(storeCreateService(serviceData)).unwrap()
      }
      setFilledData(data)
      toast.success(
        `Service ${serviceFormMode === 'edit' ? 'updated' : 'created'} successfully`,
      )
    } catch (error) {
      toast.error(
        `Failed to ${serviceFormMode === 'edit' ? 'update' : 'create'} service`,
      )
      console.error('Error:', error)
    }
  }

  const handleBack = () => {
    dispatch(closeServiceForm())
    setIsSubmitted(false)
    onChange(false)
  }

  return (
    <>
      {/* <style jsx>{`
        .dialog-content {
          box-sizing: border-box;
          width: 90vmin;
          max-width: min(600px, 90vw);
          min-width: 280px;
          max-height: 85vh;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 0.5rem;
          font-size: 1rem;
          line-height: 1.5;
          padding: 1rem;
        }
        @media (min-width: 640px) {
          .dialog-content {
            max-width: min(700px, 90vw);
            padding: 1.5rem;
            font-size: 1.125rem;
          }
        }
        @media (max-width: 400px) {
          .dialog-content {
            width: 95vmin;
            max-width: 95vw;
            min-width: 260px;
            padding: 0.75rem;
            font-size: 0.875rem;
          }
          .dialog-content h2 {
            font-size: 1rem;
          }
        }
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .dialog-content {
            transform: translate(-50%, -50%) scale(1) !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
        @media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
          .dialog-content {
            transform: translate(-50%, -50%) scale(1) !important;
          }
        }
        @media (max-height: 600px) {
          .dialog-content {
            max-height: 90vh;
            padding: 0.75rem;
          }
        }
        @media screen and (max-width: 1024px) and (min-resolution: 192dpi) {
          .dialog-content {
            width: 92vmin;
            max-width: min(650px, 92vw);
          }
        }
        @media (prefers-contrast: high) {
          .dialog-content {
            border: 2px solid #000 !important;
            background: #fff !important;
          }
        }
      `}</style> */}
      <Dialog onOpenChange={handleBack} open={open}>
        <DialogContent
          className="dialog-content bg-white shadow-lg w-[90dvw] max-w-[min(550px,90vw)] min-w-[260px] max-h-[85vh] overflow-y-auto overflow-x-hidden"
          style={{ boxSizing: 'border-box' }}
          aria-describedby="dialog-description"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-blue-700 text-base sm:text-lg md:text-xl font-semibold">
              {serviceFormMode === 'edit'
                ? 'Edit Service'
                : 'Create New Service'}
            </DialogTitle>
            <DialogDescription
              id="dialog-description"
              className="text-center text-xs sm:text-sm text-muted-foreground"
            >
              {serviceFormMode === 'edit'
                ? 'Update existing service details'
                : 'Fill the details below to create a new service'}
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <CircleCheckBig
                  strokeWidth={2.5}
                  className="text-[#4caf50] w-6 h-6 sm:w-8 sm:h-8"
                />
                <h2 className="text-blue-700 text-base sm:text-lg font-semibold">
                  Service {serviceFormMode === 'edit' ? 'Updated' : 'Created'}!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Service successfully{' '}
                  {serviceFormMode === 'edit' ? 'updated' : 'created'}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-[#eff5ff] rounded-lg">
                <ViewItem
                  title="Name"
                  value={filledData?.title || ''}
                  icon={<UserRound className="w-4 h-4" strokeWidth={2.5} />}
                  bgColor="#dae8fe"
                  textColor="#3d73ed"
                />
                <ViewItem
                  title="Description"
                  value={filledData?.description || ''}
                  icon={<Mail className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#dae8fe"
                  textColor="#3d73ed"
                />
                <ViewItem
                  title="Duration"
                  value={
                    filledData?.estimatedDuration
                      ? `${filledData.estimatedDuration} minutes`
                      : ''
                  }
                  icon={<Clock className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#d2fae5"
                  textColor="#099668"
                />
                <ViewItem
                  title="Availability"
                  value={
                    filledData?.serviceAvailability?.length
                      ? filledData.serviceAvailability.join(', ')
                      : 'None'
                  }
                  icon={<Calendar className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#d2fae5"
                  textColor="#099668"
                />
                <ViewItem
                  title="Status"
                  value={
                    filledData?.ServiceStatus
                      ? getLabelFromValue(
                          filledData.ServiceStatus,
                          statusOptions,
                        )
                      : ''
                  }
                  icon={<CircleCheckBig className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#d2fae5"
                  textColor="#099668"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleBack}
                  className="w-24 sm:w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200 text-xs sm:text-sm"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3 sm:gap-4"
                aria-busy={isSubmitting}
              >
                <InputField
                  name="title"
                  label="Service Name"
                  placeholder="Enter Service Name"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <TextAreaField
                  name="description"
                  label="Description"
                  placeholder="Enter Description"
                  className="w-full border border-blue-200 rounded-[4px] min-h-[80px] sm:min-h-[100px]"
                />
                <FileUploadField
                  name="image"
                  label="Cover Image"
                  placeholder="Upload Image"
                  className="w-full border border-blue-200 rounded-[4px]"
                />
                <AvailabilityTabs
                  name="ServiceStatus"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <DurationSelect
                  name="estimatedDuration"
                  label="Duration"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <ServiceDaySelector
                  name="serviceAvailability"
                  businessAvailability={defaultBusinessAvailability}
                  className="w-full border border-blue-200 rounded-[4px]"
                />
                <ServiceHoursSelector
                  name="serviceHours"
                  dayName="serviceAvailability"
                  businessBreaks={defaultBusinessAvailability.breaks}
                  className="w-full border border-blue-200 rounded-[4px]"
                />

                {serviceFormMode === 'edit' && (
                  <SelectField
                    name="ServiceStatus"
                    label="Status"
                    options={statusOptions}
                    placeholder="Select status"
                    disabled={isSubmitting}
                    className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                  />
                )}
                <TextAreaField
                  name="message"
                  label="Additional Notes"
                  placeholder="Any special requests?"
                  className="w-full border border-blue-200 rounded-[4px] min-h-[80px] sm:min-h-[100px]"
                />
                <div className="flex flex-col gap-3 sm:flex-row justify-center items-center mt-4 sm:mt-6">
                  <Button
                    type="submit"
                    variant="default"
                    className="w-24 sm:w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200 text-xs sm:text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoadingSpinner
                        text={
                          serviceFormMode === 'edit'
                            ? 'Updating...'
                            : 'Creating...'
                        }
                      />
                    ) : serviceFormMode === 'edit' ? (
                      'Update'
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewServiceForm
