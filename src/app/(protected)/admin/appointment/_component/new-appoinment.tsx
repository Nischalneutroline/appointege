// 'use client'

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { useForm, FormProvider } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import InputField from '@/components/custom-form-fields/input-field'
// import SelectField from '@/components/custom-form-fields/select-field'
// import TextAreaField from '@/components/custom-form-fields/textarea-field'
// import PhoneInputField from '@/components/custom-form-fields/phone-field'
// import TimePickerField from '@/components/custom-form-fields/time-field'
// import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/navigation'
// import DatePickerField from '@/components/custom-form-fields/date-field'
// import { useEffect, useState } from 'react'
// import LoadingSpinner from '@/components/loading-spinner'
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import {
//   CircleCheckBig,
//   Clock,
//   HandHeart,
//   Mail,
//   Phone,
//   UserRound,
// } from 'lucide-react'
// import ViewItem from './view/view-item'
// import { format } from 'date-fns'
// import { useSelector, useDispatch } from 'react-redux'
// import { RootState, AppDispatch } from '@/store/store'
// import {
//   AppointmentStatus,
//   PostAppoinmentData,
// } from '@/app/(protected)/admin/appointment/_types/appointment'
// import { normalDateToIso } from '@/utils/utils'
// import {
//   storeCreateAppointment,
//   updateAppointment,
//   openAppointmentEditForm,
//   closeAppointmentForm,
// } from '@/store/slices/appointmentSlice'
// import { toast } from 'sonner'
// import { fetchServices } from '@/store/slices/serviceslice'

// interface ServiceOption {
//   label: string
//   value: string
// }

// const appointmentSchema = z.object({
//   fullName: z.string().min(1, 'Full name is required'),
//   // firstName: z.string().min(1, 'First name is required'),
//   // lastName: z.string().min(1, 'Last name is required'),
//   email: z.string().email('Invalid email address').min(1, 'Email is required'),
//   phone: z
//     .string()
//     .min(1, 'Phone number is required')
//     .regex(
//       /^\+\d{1,4}\s\d{7,}$/,
//       'Valid phone number is required (e.g., +977 9818275115)',
//     ),
//   service: z.string().min(1, 'Service is required'),
//   date: z.date({ required_error: 'Date is required' }),
//   time: z.string().min(1, 'Time is required'),
//   message: z.string().optional(),
//   appointmentType: z.string().min(1, 'Appointment type is required'),
// })

// type FormData = z.infer<typeof appointmentSchema>

// const availableTimeSlots = [
//   '09:00 AM',
//   '10:00 AM',
//   '10:15 AM',
//   '11:00 AM',
//   '12:00 PM',
//   '01:00 PM',
//   '02:00 PM',
//   '03:00 PM',
//   '04:00 PM',
//   '05:00 PM',
// ]

// const NewAppointment = ({
//   open,
//   onChange,
// }: {
//   open: boolean
//   onChange: (open: boolean) => void
// }) => {
//   const dispatch = useDispatch<AppDispatch>()
//   const { user } = useSelector((state: RootState) => state.auth)
//   const {
//     services,
//     isLoading: isLoadingServices,
//     serviceOptions,
//   } = useSelector((state: RootState) => state.service)
//   const { isFormOpen, appoinmentFormMode, currentAppointment, success } =
//     useSelector((state: RootState) => state.appointment)

//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [filledData, setFilledData] = useState<FormData | null>(null)

//   const form = useForm<FormData>({
//     resolver: zodResolver(appointmentSchema),
//     defaultValues: {
//       fullName: '',
//       email: '',
//       phone: '',
//       service: '',
//       date: undefined,
//       time: '',
//       message: '',
//       appointmentType: 'in-person',
//     },
//   })

//   useEffect(() => {
//     if (services.length === 0 && !isLoadingServices) {
//       dispatch(fetchServices(false)).catch((error) => {
//         console.error('Failed to fetch services:', error)
//         toast.error('Failed to load services. Please try again.')
//       })
//     }

//     if (isFormOpen && appoinmentFormMode === 'edit' && currentAppointment) {
//       form.reset({
//         fullName: currentAppointment.customerName,
//         email: currentAppointment.email,
//         phone: currentAppointment.phone,
//         service: currentAppointment.serviceId,
//         date: new Date(currentAppointment.selectedDate), // Convert string to Date for form
//         time: currentAppointment.selectedTime,
//         message: currentAppointment.message || '',
//         appointmentType: 'in-person', // Adjust based on your data model
//       })
//     } else if (!isFormOpen) {
//       form.reset()
//     }
//   }, [
//     isFormOpen,
//     appoinmentFormMode,
//     currentAppointment,
//     services,
//     isLoadingServices,
//     dispatch,
//     form,
//   ])

//   useEffect(() => {
//     if (success && isSubmitting) {
//       setIsSubmitted(true)
//       setIsSubmitting(false)
//     }
//   }, [success, isSubmitting])

//   const appointmentTypeOptions = [
//     { label: 'Physical', value: 'physical' },
//     { label: 'Virtual', value: 'virtual' },
//   ]

//   const getLabelFromValue = (value: string, options: ServiceOption[]) => {
//     const option = options.find((opt) => opt.value === value)
//     return option ? option.label : value
//   }

//   const onSubmit = async (formData: FormData) => {
//     const errors = form.formState.errors
//     if (Object.keys(errors).length > 0) {
//       console.log('Validation errors:', errors)
//       toast.error('Please correct the form errors and try again.')
//       return
//     }

//     if (!user?.id) {
//       console.error('User is not authenticated')
//       toast.error('You must be logged in to create or update an appointment')
//       return
//     }

//     try {
//       setIsSubmitting(true)
//       const appointmentData: PostAppoinmentData = {
//         customerName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         serviceId: formData.service,
//         selectedDate: normalDateToIso(formData.date), // Convert Date to ISO string
//         selectedTime: formData.time,
//         status: currentAppointment?.status || AppointmentStatus.SCHEDULED,
//         message: formData.message,
//         userId: user?.id,
//         isForSelf: false,
//         bookedById: user?.id,
//         createdById: user?.id,
//       }

//       console.log('Submitting appointment:', appointmentData)

//       if (appoinmentFormMode === 'edit' && currentAppointment?.id) {
//         await dispatch(
//           updateAppointment({
//             id: currentAppointment.id,
//             data: appointmentData,
//           }),
//         ).unwrap()
//       } else {
//         await dispatch(storeCreateAppointment(appointmentData)).unwrap()
//       }
//       setFilledData(formData)
//     } catch (error: any) {
//       console.error(
//         `Error ${appoinmentFormMode === 'edit' ? 'updating' : 'creating'} appointment:`,
//         error,
//       )
//       // Toast notifications are handled in the slice
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleBack = () => {
//     dispatch(closeAppointmentForm())
//     onChange(false)
//   }

//   if (isSubmitted) {
//     return (
//       <div className="max-w-md md:max-w-2xl">
//         <Dialog onOpenChange={setIsSubmitted} open={isSubmitted}>
//           <DialogContent className="md:max-w-lg overflow-y-scroll space-y-1 pb-3">
//             <DialogHeader className="gap-1">
//               <DialogTitle className="text-blue-700 text-xl flex flex-col gap-1 items-center">
//                 <CircleCheckBig
//                   strokeWidth={2.5}
//                   className="text-[#4caf50] w-8 h-8"
//                 />
//                 Appointment Confirmed!
//               </DialogTitle>
//               <DialogDescription className="text-sm text-muted-foreground text-center">
//                 Appointment successfully{' '}
//                 {appoinmentFormMode === 'edit' ? 'updated' : 'scheduled'} on
//                 behalf of the customer
//               </DialogDescription>
//             </DialogHeader>
//             <div className="flex flex-col gap-5 px-4 py-6 bg-[#eff5ff] rounded-[8px]">
//               <ViewItem
//                 title="Name"
//                 value={filledData?.fullName || ''}
//                 icon={<UserRound className="w-4 h-4" strokeWidth={2.5} />}
//                 bgColor="#dae8fe"
//                 textColor="#3d73ed"
//               />
//               <ViewItem
//                 title="Email"
//                 value={filledData?.email || ''}
//                 icon={<Mail className="w-4 h-4" strokeWidth={2} />}
//                 bgColor="#dae8fe"
//                 textColor="#3d73ed"
//               />
//               <ViewItem
//                 title="Phone"
//                 value={filledData?.phone || ''}
//                 icon={<Phone className="w-4 h-4" strokeWidth={2} />}
//                 bgColor="#dae8fe"
//                 textColor="#3d73ed"
//               />
//               <div className="border-t-2 border-[#BEDAFE] w-full" />
//               <ViewItem
//                 title="Service"
//                 value={
//                   filledData?.service
//                     ? getLabelFromValue(filledData.service, serviceOptions)
//                     : ''
//                 }
//                 icon={<HandHeart className="w-4.5 h-4.5" strokeWidth={2} />}
//                 bgColor="#d2fae5"
//                 textColor="#099668"
//               />
//               <ViewItem
//                 title="Date & Time"
//                 value={
//                   filledData?.date && filledData?.time
//                     ? `${format(new Date(filledData.date), 'MMM d yyyy')}, ${filledData.time}, ${format(new Date(filledData.date), 'EEE')}`
//                     : ''
//                 }
//                 icon={<Clock className="w-4 h-4" strokeWidth={2} />}
//                 bgColor="#d2fae5"
//                 textColor="#099668"
//               />
//               <ViewItem
//                 title="Type"
//                 value={
//                   filledData?.appointmentType
//                     ? getLabelFromValue(
//                         filledData.appointmentType,
//                         appointmentTypeOptions,
//                       )
//                     : ''
//                 }
//                 icon={<Clock className="w-4 h-4" strokeWidth={2} />}
//                 bgColor="#d2fae5"
//                 textColor="#099668"
//               />
//             </div>
//             <div className="flex flex-col gap-3 md:flex-row justify-center">
//               <Button
//                 type="submit"
//                 variant="default"
//                 onClick={() => {
//                   setIsSubmitted(false)
//                   handleBack()
//                 }}
//                 className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
//               >
//                 Done
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     )
//   }

//   return (
//     <Dialog onOpenChange={handleBack} open={open}>
//       {/* <DialogContent className="md:max-w-2xl overflow-y-scroll"> */}
//       <DialogContent className="md:max-w-[600px] overflow-y-scroll space-y-4">
//         <DialogHeader className="gap-2">
//           <DialogTitle className="flex justify-center text-blue-700 text-xl md:text-2x">
//             {appoinmentFormMode === 'edit'
//               ? 'Edit Appointment'
//               : 'Create New Appointment'}
//           </DialogTitle>
//           <DialogDescription className="flex justify-center text-sm text-muted-foreground">
//             {appoinmentFormMode === 'edit'
//               ? 'Update existing appointment details'
//               : 'Fill the details below to create an appointment on behalf of the customer'}
//           </DialogDescription>
//         </DialogHeader>

//         {isLoadingServices ? (
//           <div className="flex justify-center items-center py-20 text-muted-foreground">
//             Loading services...
//           </div>
//         ) : services.length === 0 ? (
//           <div className="flex justify-center items-center py-20 text-muted-foreground">
//             No services found to add appointment
//           </div>
//         ) : (
//           <FormProvider {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="flex flex-col gap-2"
//               aria-busy={isSubmitting}
//             >
//               <InputField name="fullName" label="Full Name" placeholder="Doe" />
//               <InputField
//                 name="email"
//                 label="Email"
//                 type="email"
//                 placeholder="john@example.com"
//               />
//               <PhoneInputField
//                 name="phone"
//                 label="Phone"
//                 placeholder="Enter your number"
//                 className="h-10 border border-blue-200  rounded-[4px]"
//               />
//               <SelectField
//                 name="service"
//                 label="Service"
//                 options={serviceOptions}
//                 placeholder="Select service"
//                 disabled={isSubmitting}
//                 className="!h-10 border border-blue-200  rounded-[4px]"
//               />
//               <div className="grid grid-cols-2 items-center gap-4">
//                 <DatePickerField
//                   name="date"
//                   label="Date"
//                   placeholder="Pick a date"
//                   buttonClassName="h-10 border border-blue-200  rounded-[4px]"
//                 />
//                 <TimePickerField
//                   name="time"
//                   label="Time"
//                   className="!h-10 w-full border border-blue-200  rounded-[4px]"
//                   availableTimeSlots={availableTimeSlots}
//                 />
//               </div>
//               <TextAreaField
//                 name="message"
//                 label="Message"
//                 placeholder="Any special requests?"
//                 className="!h-10 w-full border border-blue-200  rounded-[4px]"
//               />
//               <FormField
//                 control={form.control}
//                 name="appointmentType"
//                 render={({ field }) => (
//                   <FormItem className="">
//                     <FormLabel>Appointment Type</FormLabel>
//                     <FormControl className="">
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
//               />
//               <div className="flex flex-col gap-3 md:flex-row justify-center items-center mt-6">
//                 <Button
//                   type="submit"
//                   variant="default"
//                   className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
//                   disabled={isLoadingServices || isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <LoadingSpinner
//                       text={
//                         appoinmentFormMode === 'edit'
//                           ? 'Updating...'
//                           : 'Creating...'
//                       }
//                     />
//                   ) : appoinmentFormMode === 'edit' ? (
//                     'Update'
//                   ) : (
//                     'Submit'
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </FormProvider>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default NewAppointment

'use client'

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
import InputField from '@/components/custom-form-fields/input-field'
import SelectField from '@/components/custom-form-fields/select-field'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import PhoneInputField from '@/components/custom-form-fields/phone-field'
import TimePickerField from '@/components/custom-form-fields/time-field'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import DatePickerField from '@/components/custom-form-fields/date-field'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/loading-spinner'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  CircleCheckBig,
  Clock,
  HandHeart,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react'
import ViewItem from './view/view-item'
import { format } from 'date-fns'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import {
  AppointmentStatus,
  PostAppoinmentData,
} from '@/app/(protected)/admin/appointment/_types/appointment'
import { normalDateToIso } from '@/utils/utils'
import {
  storeCreateAppointment,
  updateAppointment,
  openAppointmentEditForm,
  closeAppointmentForm,
} from '@/store/slices/appointmentSlice'
import { toast } from 'sonner'
import { fetchServices } from '@/store/slices/serviceslice'

interface ServiceOption {
  label: string
  value: string
}

const appointmentSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  // firstName: z.string().min(1, 'First name is required'),
  // lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+\d{1,4}\s\d{7,}$/,
      'Valid phone number is required (e.g., +977 9818275115)',
    ),
  service: z.string().min(1, 'Service is required'),
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, 'Time is required'),
  message: z.string().optional(),
  appointmentType: z.string().min(1, 'Appointment type is required'),
})

type FormData = z.infer<typeof appointmentSchema>

const availableTimeSlots = [
  '09:00 AM',
  '10:00 AM',
  '10:15 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
]

const NewAppointment = ({
  open,
  onChange,
}: {
  open: boolean
  onChange: (open: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const {
    services,
    isLoading: isLoadingServices,
    serviceOptions,
  } = useSelector((state: RootState) => state.service)
  const { isFormOpen, appoinmentFormMode, currentAppointment, success } =
    useSelector((state: RootState) => state.appointment)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [filledData, setFilledData] = useState<FormData | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      service: '',
      date: undefined,
      time: '',
      message: '',
      appointmentType: 'in-person',
    },
  })

  useEffect(() => {
    if (services.length === 0 && !isLoadingServices) {
      dispatch(fetchServices(false)).catch((error) => {
        console.error('Failed to fetch services:', error)
        toast.error('Failed to load services. Please try again.')
      })
    }

    if (isFormOpen && appoinmentFormMode === 'edit' && currentAppointment) {
      form.reset({
        fullName: currentAppointment.customerName,
        email: currentAppointment.email,
        phone: currentAppointment.phone,
        service: currentAppointment.serviceId,
        date: new Date(currentAppointment.selectedDate), // Convert string to Date for form
        time: currentAppointment.selectedTime,
        message: currentAppointment.message || '',
        appointmentType: 'in-person', // Adjust based on your data model
      })
    } else if (!isFormOpen) {
      form.reset()
    }
  }, [
    isFormOpen,
    appoinmentFormMode,
    currentAppointment,
    services,
    isLoadingServices,
    dispatch,
    form,
  ])

  useEffect(() => {
    if (success && isSubmitting) {
      setIsSubmitted(true)
      setIsSubmitting(false)
    }
  }, [success, isSubmitting])

  const appointmentTypeOptions = [
    { label: 'Physical', value: 'physical' },
    { label: 'Virtual', value: 'virtual' },
  ]

  const getLabelFromValue = (value: string, options: ServiceOption[]) => {
    const option = options.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const onSubmit = async (formData: FormData) => {
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors)
      toast.error('Please correct the form errors and try again.')
      return
    }

    if (!user?.id) {
      console.error('User is not authenticated')
      toast.error('You must be logged in to create or update an appointment')
      return
    }

    try {
      setIsSubmitting(true)
      const appointmentData: PostAppoinmentData = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        serviceId: formData.service,
        selectedDate: normalDateToIso(formData.date), // Convert Date to ISO string
        selectedTime: formData.time,
        status: currentAppointment?.status || AppointmentStatus.SCHEDULED,
        message: formData.message,
        userId: user?.id,
        isForSelf: false,
        bookedById: user?.id,
        createdById: user?.id,
      }

      console.log('Submitting appointment:', appointmentData)

      if (appoinmentFormMode === 'edit' && currentAppointment?.id) {
        await dispatch(
          updateAppointment({
            id: currentAppointment.id,
            data: appointmentData,
          }),
        ).unwrap()
      } else {
        await dispatch(storeCreateAppointment(appointmentData)).unwrap()
      }
      setFilledData(formData)
    } catch (error: any) {
      console.error(
        `Error ${appoinmentFormMode === 'edit' ? 'updating' : 'creating'} appointment:`,
        error,
      )
      // Toast notifications are handled in the slice
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    dispatch(closeAppointmentForm())
    onChange(false)
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md md:max-w-2xl">
        <Dialog onOpenChange={setIsSubmitted} open={isSubmitted}>
          <DialogContent className="md:max-w-lg overflow-y-scroll space-y-1 pb-3">
            <DialogHeader className="gap-1">
              <DialogTitle className="text-blue-700 text-xl flex flex-col gap-1 items-center">
                <CircleCheckBig
                  strokeWidth={2.5}
                  className="text-[#4caf50] w-8 h-8"
                />
                Appointment Confirmed!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground text-center">
                Appointment successfully{' '}
                {appoinmentFormMode === 'edit' ? 'updated' : 'scheduled'} on
                behalf of the customer
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5 px-4 py-6 bg-[#eff5ff] rounded-[8px]">
              <ViewItem
                title="Name"
                value={filledData?.fullName || ''}
                icon={<UserRound className="w-4 h-4" strokeWidth={2.5} />}
                bgColor="#dae8fe"
                textColor="#3d73ed"
              />
              <ViewItem
                title="Email"
                value={filledData?.email || ''}
                icon={<Mail className="w-4 h-4" strokeWidth={2} />}
                bgColor="#dae8fe"
                textColor="#3d73ed"
              />
              <ViewItem
                title="Phone"
                value={filledData?.phone || ''}
                icon={<Phone className="w-4 h-4" strokeWidth={2} />}
                bgColor="#dae8fe"
                textColor="#3d73ed"
              />
              <div className="border-t-2 border-[#BEDAFE] w-full" />
              <ViewItem
                title="Service"
                value={
                  filledData?.service
                    ? getLabelFromValue(filledData.service, serviceOptions)
                    : ''
                }
                icon={<HandHeart className="w-4.5 h-4.5" strokeWidth={2} />}
                bgColor="#d2fae5"
                textColor="#099668"
              />
              <ViewItem
                title="Date & Time"
                value={
                  filledData?.date && filledData?.time
                    ? `${format(new Date(filledData.date), 'MMM d yyyy')}, ${filledData.time}, ${format(new Date(filledData.date), 'EEE')}`
                    : ''
                }
                icon={<Clock className="w-4 h-4" strokeWidth={2} />}
                bgColor="#d2fae5"
                textColor="#099668"
              />
              <ViewItem
                title="Type"
                value={
                  filledData?.appointmentType
                    ? getLabelFromValue(
                        filledData.appointmentType,
                        appointmentTypeOptions,
                      )
                    : ''
                }
                icon={<Clock className="w-4 h-4" strokeWidth={2} />}
                bgColor="#d2fae5"
                textColor="#099668"
              />
            </div>
            <div className="flex flex-col gap-3 md:flex-row justify-center">
              <Button
                type="submit"
                variant="default"
                onClick={() => {
                  setIsSubmitted(false)
                  handleBack()
                }}
                className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <Dialog onOpenChange={handleBack} open={open}>
      {/* <DialogContent className="md:max-w-2xl overflow-y-scroll"> */}
      <DialogContent className="md:max-w-[600px] overflow-y-scroll space-y-3">
        <DialogHeader className="gap-1">
          <DialogTitle className="flex justify-center text-blue-700 text-xl md:text-2x">
            {appoinmentFormMode === 'edit'
              ? 'Edit Appointment'
              : 'Create New Appointment'}
          </DialogTitle>
          <DialogDescription className="flex justify-center text-sm text-muted-foreground">
            {appoinmentFormMode === 'edit'
              ? 'Update existing appointment details'
              : 'Fill the details below to create an appointment on behalf of the customer'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingServices ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            No services found to add appointment
          </div>
        ) : (
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              aria-busy={isSubmitting}
            >
              <InputField
                name="fullName"
                label="Full Name"
                placeholder="Doe"
                className="!h-10 border border-blue-200  rounded-[4px]"
              />
              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="john@example.com"
                className="!h-10 border border-blue-200  rounded-[4px]"
              />
              <PhoneInputField
                name="phone"
                label="Phone"
                placeholder="Enter your number"
                className="!h-10 border border-blue-200  rounded-[4px]"
              />
              <SelectField
                name="service"
                label="Service"
                options={serviceOptions}
                placeholder="Select service"
                disabled={isSubmitting}
                className="!h-10 border border-blue-200  rounded-[4px]"
              />
              <div className="grid grid-cols-2 items-center gap-4">
                <DatePickerField
                  name="date"
                  label="Date"
                  placeholder="Pick a date"
                  buttonClassName="h-10 border border-blue-200  rounded-[4px]"
                />
                <TimePickerField
                  name="time"
                  label="Time"
                  placeholder="Select Time"
                  className="!h-10 w-full border border-blue-200  rounded-[4px]"
                  availableTimeSlots={availableTimeSlots}
                />
              </div>
              <TextAreaField
                name="message"
                label="Message"
                placeholder="Any special requests?"
                className=" w-full border border-blue-200  rounded-[4px]"
              />
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Appointment Type</FormLabel>
                    <FormControl className="">
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                        disabled={isSubmitting}
                      >
                        {appointmentTypeOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                            />
                            <label
                              htmlFor={option.value}
                              className="text-sm font-medium"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3 md:flex-row justify-center items-center mt-6">
                <Button
                  type="submit"
                  variant="default"
                  className="rounded-md w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
                  disabled={isLoadingServices || isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner
                      text={
                        appoinmentFormMode === 'edit'
                          ? 'Updating...'
                          : 'Creating...'
                      }
                    />
                  ) : appoinmentFormMode === 'edit' ? (
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
  )
}

export default NewAppointment
