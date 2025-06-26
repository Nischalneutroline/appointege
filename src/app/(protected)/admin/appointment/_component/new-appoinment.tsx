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
// import { useRouter, useParams } from 'next/navigation'
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
// import { AppointmentStatus, PostAppoinmentData } from '../_types/appointment'
// import { normalDateToIso } from '@/utils/utils'
// import {
//   storeCreateAppointment,
//   fetchAppointments,
//   updateAppointment,
// } from '@/store/slices/appointmentSlice'
// import { fetchServices } from '@/store/slices/serviceslice'
// import {
//   openAppointmentEditForm,
//   closeAppointmentForm,
// } from '@/store/slices/appointmentSlice'

// interface ServiceOption {
//   label: string
//   value: string
// }

// const appointmentSchema = z.object({
//   firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   email: z.string().email('Invalid email address').min(1, 'Email is required'),
//   phone: z
//     .string()
//     .min(1, 'Phone number is required')
//     .regex(/^\+\d{1,4}\s\d{7,}$/, 'Valid phone number is required'),
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

// const NewAppoinment = ({
//   open,
//   onChange,
// }: {
//   open: boolean
//   onChange: (open: boolean) => void
// }) => {
//   const dispatch = useDispatch<AppDispatch>()
//   const { user } = useSelector((state: RootState) => state.auth)
//   const { success } = useSelector((state: RootState) => state.appointment)
//   const { services, isLoading: isLoadingServices } = useSelector(
//     (state: RootState) => state.service,
//   )
//   const { isFormOpen, formMode, currentAppointment } = useSelector(
//     (state: RootState) => state.appointment,
//   )

//   console.log('NewAppoinment: services =', services)

//   const router = useRouter()
//   const params = useParams()
//   const id = params?.id as string | undefined
//   const isEditMode = !!id

//   const [isLoadingAppointment, setIsLoadingAppointment] = useState(isEditMode)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [filledData, setFilledData] = useState<FormData>()

//   const form = useForm<FormData>({
//     resolver: zodResolver(appointmentSchema),
//     defaultValues: {
//       firstName: '',
//       lastName: '',
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
//     if (services.length === 0) {
//       dispatch(fetchServices())
//     }
//     if (isFormOpen && formMode === 'edit' && currentAppointment) {
//       // Split the customer name if it exists
//       const [firstName = '', ...lastNameParts] =
//         currentAppointment.customerName.split(' ')
//       const lastName = lastNameParts.join(' ')

//       // Pre-fill the form with existing appointment data
//       form.reset({
//         firstName,
//         lastName,
//         email: currentAppointment.email,
//         phone: currentAppointment.phone,
//         service: currentAppointment.serviceId,
//         date: new Date(currentAppointment.selectedDate),
//         time: currentAppointment.selectedTime,
//         message: currentAppointment.message || '',
//         appointmentType: 'in-person', // Set default or get from appointment
//       })
//     } else if (!isFormOpen) {
//       // Reset form when closing
//       form.reset()
//     }
//   }, [isFormOpen, formMode, currentAppointment, form])

//   // Handle dialog close
//   const handleOpenChange = (open: boolean) => {
//     if (!open) {
//       dispatch(closeAppointmentForm())
//     }
//   }

//   const appointmentTypeOptions = [
//     { label: 'In-Person', value: 'in-person' },
//     { label: 'Virtual', value: 'virtual' },
//   ]

//   const hasFetchedServices = !isLoadingServices

//   const getLabelFromValue = (
//     value: string,
//     options: { label: string; value: string }[],
//   ) => {
//     const option = options.find((opt) => opt.value === value)
//     return option ? option.label : value
//   }

//   const onSubmit = async (formData: FormData) => {
//     try {
//       setIsSubmitting(true)
//       const appointmentData: PostAppoinmentData = {
//         customerName: `${formData.firstName} ${formData.lastName}`.trim(),
//         email: formData.email,
//         phone: formData.phone,
//         serviceId: formData.service,
//         selectedDate: normalDateToIso(formData.date),
//         selectedTime: formData.time,

//         message: formData.message,
//         userId: user?.id,
//         isForSelf: false,
//         bookedById: user?.id,
//         createdById: user?.id,
//         status: currentAppointment?.status || AppointmentStatus.SCHEDULED,
//       }
//       console.log('Submitting appointment via store:', appointmentData)

//       if (formMode === 'edit' && currentAppointment?.id) {
//         console.log('Updating appointment with ID:', currentAppointment.id)
//         const result = await dispatch(
//           updateAppointment({
//             id: currentAppointment.id,
//             data: appointmentData,
//           }),
//         ).unwrap()
//         console.log('Update successful:', result)
//       } else {
//         console.log('Creating new appointment')
//         const result = await dispatch(
//           storeCreateAppointment(appointmentData),
//         ).unwrap()
//         console.log('Creation successful:', result)
//       }
//       setFilledData(formData)
//       setIsSubmitted(true)
//     } catch (error: any) {
//       console.error(
//         `Error ${formMode === 'edit' ? 'updating' : 'creating'} appointment in form:`,
//         {
//           error,
//           name: error?.name,
//           // data: error?.data,
//           message: error?.message,
//           response: error?.response?.data,
//           stack: error?.stack,
//         },
//       )
//       // Optionally show error to user
//       // toast.error(
//       //   `Failed to ${formMode === 'edit' ? 'update' : 'create'} appointment: ${
//       //     error?.response?.data?.message || error?.message || 'Unknown error'
//       //   }`,
//       // )
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleBack = () => {
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
//                 Appointment successfully scheduled on behalf of the customer
//               </DialogDescription>
//             </DialogHeader>
//             <div className="flex flex-col gap-5 px-4 py-6 bg-[#eff5ff] rounded-[8px]">
//               <ViewItem
//                 title="Name"
//                 value={filledData?.firstName + ' ' + filledData?.lastName}
//                 icon={<UserRound className="w-4 h-4 " strokeWidth={2.5} />}
//                 bgColor="#dae8fe"
//                 textColor="#3d73ed"
//               />
//               <ViewItem
//                 title="Email"
//                 value={filledData?.email || ''}
//                 icon={<Mail className="w-4 h-4 " strokeWidth={2} />}
//                 bgColor="#dae8fe"
//                 textColor="#3d73ed"
//               />
//               <ViewItem
//                 title="Phone"
//                 value={filledData?.phone || ''}
//                 icon={<Phone className="w-4 h-4 " strokeWidth={2} />}
//                 bgColor="#dae8fe"
//                 textColor="#3d73ed"
//               />
//               <div className="border-t-2 border-[#BEDAFE] w-full" />
//               <ViewItem
//                 title="Service"
//                 value={
//                   filledData?.service
//                     ? getLabelFromValue(filledData.service, services)
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
//             <div className="flex flex-col gap-3 md:flex-row justify-center ">
//               {/* <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-blue-700 transition-transform duration-200"
//                 onClick={handleBack}
//               >
//                 ← Back
//               </Button> */}
//               <Button
//                 type="submit"
//                 variant="default"
//                 onClick={() => {
//                   setIsSubmitted(false)
//                   onChange(false)
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
//     <Dialog onOpenChange={onChange} open={open}>
//       <DialogContent className="md:max-w-2xl overflow-y-scroll">
//         <DialogHeader className="gap-0">
//           <DialogTitle className="flex justify-center text-blue-700 text-xl">
//             {isEditMode ? 'Edit Appointment' : 'Enter Appointment Details'}
//           </DialogTitle>
//           <DialogDescription className="flex justify-center text-sm text-muted-foreground">
//             {isEditMode
//               ? 'Update existing appointment details'
//               : 'Fill the detail below to create appointment on behalf of customer'}
//           </DialogDescription>
//         </DialogHeader>

//         {isLoadingServices ? (
//           <div className="flex justify-center items-center py-20 text-muted-foreground">
//             Loading services...
//           </div>
//         ) : !isLoadingServices && services.length === 0 ? (
//           <div className="flex justify-center items-center py-20 text-muted-foreground">
//             No service found to add appointment
//           </div>
//         ) : (
//           <FormProvider {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="space-y-5"
//               aria-busy={isSubmitting}
//             >
//               <div className="grid grid-cols-2 gap-4">
//                 <InputField
//                   name="firstName"
//                   label="First Name"
//                   placeholder="John"
//                 />
//                 <InputField
//                   name="lastName"
//                   label="Last Name"
//                   placeholder="Doe"
//                 />
//               </div>

//               <InputField
//                 name="email"
//                 label="Email"
//                 type="email"
//                 placeholder="john@example.com"
//               />

//               <PhoneInputField
//                 name="phone"
//                 label="Phone Number"
//                 placeholder="Enter your number"
//               />

//               <SelectField
//                 name="service"
//                 label="Select a Service"
//                 options={services}
//                 placeholder="Select service"
//                 disabled={isSubmitting}
//               />

//               <div className="grid grid-cols-2 items-center gap-4">
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
//               </div>

//               <TextAreaField
//                 name="message"
//                 label="Additional Notes"
//                 placeholder="Any special requests?"
//               />

//               <FormField
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
//               />

//               <div className="flex flex-col gap-3  md:flex-row justify-center items-center mt-6">
//                 {/* <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-blue-700 transition-transform duration-200"
//                   onClick={handleBack}
//                   disabled={isSubmitting}
//                 >
//                   ← Back
//                 </Button> */}
//                 <Button
//                   type="submit"
//                   variant="default"
//                   className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
//                   disabled={
//                     isLoadingServices || isLoadingAppointment || isSubmitting
//                   }
//                 >
//                   {isEditMode ? (
//                     isSubmitting ? (
//                       <LoadingSpinner text="Updating..." />
//                     ) : (
//                       'Submitting...'
//                     )
//                   ) : isSubmitting ? (
//                     <LoadingSpinner text="Creating..." />
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

// export default NewAppoinment

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
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
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
  const { services, isLoading: isLoadingServices } = useSelector(
    (state: RootState) => state.service,
  )
  const { isFormOpen, formMode, currentAppointment, success } = useSelector(
    (state: RootState) => state.appointment,
  )

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [filledData, setFilledData] = useState<FormData | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
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
      dispatch(fetchServices(true)).catch((error) => {
        console.error('Failed to fetch services:', error)
        toast.error('Failed to load services. Please try again.')
      })
    }

    if (isFormOpen && formMode === 'edit' && currentAppointment) {
      const [firstName = '', ...lastNameParts] =
        currentAppointment.customerName.split(' ')
      const lastName = lastNameParts.join(' ')
      form.reset({
        firstName,
        lastName,
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
    formMode,
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
    { label: 'In-Person', value: 'in-person' },
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
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
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

      if (formMode === 'edit' && currentAppointment?.id) {
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
        `Error ${formMode === 'edit' ? 'updating' : 'creating'} appointment:`,
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
                {formMode === 'edit' ? 'updated' : 'scheduled'} on behalf of the
                customer
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5 px-4 py-6 bg-[#eff5ff] rounded-[8px]">
              <ViewItem
                title="Name"
                value={filledData?.firstName + ' ' + filledData?.lastName}
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
                    ? getLabelFromValue(filledData.service, services)
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
      <DialogContent className="md:max-w-2xl overflow-y-scroll">
        <DialogHeader className="gap-0">
          <DialogTitle className="flex justify-center text-blue-700 text-xl">
            {formMode === 'edit'
              ? 'Edit Appointment'
              : 'Enter Appointment Details'}
          </DialogTitle>
          <DialogDescription className="flex justify-center text-sm text-muted-foreground">
            {formMode === 'edit'
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
              className="space-y-5"
              aria-busy={isSubmitting}
            >
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                />
                <InputField
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                />
              </div>
              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="john@example.com"
              />
              <PhoneInputField
                name="phone"
                label="Phone Number"
                placeholder="Enter your number"
              />
              <SelectField
                name="service"
                label="Select a Service"
                options={services}
                placeholder="Select service"
                disabled={isSubmitting}
              />
              <div className="grid grid-cols-2 items-center gap-4">
                <DatePickerField
                  name="date"
                  label="Appointment Date"
                  placeholder="Pick a date"
                />
                <TimePickerField
                  name="time"
                  label="Appointment Time"
                  availableTimeSlots={availableTimeSlots}
                />
              </div>
              <TextAreaField
                name="message"
                label="Additional Notes"
                placeholder="Any special requests?"
              />
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <FormControl>
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
                  className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
                  disabled={isLoadingServices || isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner
                      text={formMode === 'edit' ? 'Updating...' : 'Creating...'}
                    />
                  ) : formMode === 'edit' ? (
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
