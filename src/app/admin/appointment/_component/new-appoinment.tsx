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
// import {
//   CalendarIcon,
//   Clock,
//   Mail,
//   PhoneCallIcon,
//   ScrollText,
//   SlidersHorizontal,
//   UserPen,
// } from 'lucide-react'
// import { useEffect, useState, useMemo } from 'react'
// import LoadingSpinner from '@/components/loading-spinner'
// import FormHeader from '@/components/custom-form-fields/form-header'
// import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// interface ServiceOption {
//   label: string
//   value: string
// }

// // Define the form schema using Zod
// const appointmentSchema = z.object({
//   firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   email: z.string().email('Invalid email address').min(1, 'Email is required'),
//   phone: z.string().min(1, 'Phone number is required'),
//   service: z.string().min(1, 'Service is required'),
//   date: z.date({ required_error: 'Date is required' }),
//   time: z.string().min(1, 'Time is required'),
//   message: z.string().optional(),
//   appointmentType: z.string().min(1, 'Appointment type is required'), // New field
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
//   const router = useRouter()
//   const params = useParams()
//   const id = params?.id as string | undefined
//   const isEditMode = !!id

//   const [isLoadingAppointment, setIsLoadingAppointment] = useState(isEditMode)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Initialize react-hook-form with Zod validation
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
//       appointmentType: '', // New field default
//     },
//   })

//   // Reset form when dialog closes
//   useEffect(() => {
//     if (!open) {
//       form.reset()
//     }
//   }, [open, form])

//   const serviceOptions: ServiceOption[] = [
//     { label: 'Service 1', value: 'service1' },
//     { label: 'Service 2', value: 'service2' },
//     { label: 'Service 3', value: 'service3' },
//   ]

//   const appointmentTypeOptions = [
//     { label: 'In-Person', value: 'in-person' },
//     { label: 'Virtual', value: 'virtual' },
//   ]

//   const hasFetchedServices = serviceOptions.length > 0
//   const isLoadingServices = false

//   // Handle form submission
//   const onSubmit = async (formData: FormData) => {
//     setIsSubmitting(true)
//     try {
//       console.log('Form submitted:', formData)
//       // onChange(false) // Close dialog on successful submission
//       // router.push('/admin/appointment')
//     } catch (error) {
//       console.error('Submission error:', error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleBack = () => {
//     onChange(false) // Close dialog
//   }

//   return (
//     <Dialog onOpenChange={onChange} open={open}>
//       <DialogContent className="md:max-w-2xl overflow-y-scroll">
//         <DialogHeader className="gap-0">
//           <DialogTitle className="text-blue-700 text-lg">
//             {isEditMode ? 'Edit Appointment' : 'Enter Appointment Details'}
//           </DialogTitle>
//           <DialogDescription className="text-sm text-muted-foreground">
//             {isEditMode
//               ? 'Update existing appointment details'
//               : 'View and manage your upcoming appointments'}
//           </DialogDescription>
//         </DialogHeader>

//         {isLoadingAppointment || (isLoadingServices && !hasFetchedServices) ? (
//           <div className="flex justify-center items-center py-20 text-muted-foreground">
//             {isLoadingAppointment
//               ? 'Loading appointment...'
//               : 'Loading services...'}
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
//                   // icon={UserPen}
//                 />
//                 <InputField
//                   name="lastName"
//                   label="Last Name"
//                   placeholder="Doe"
//                   // icon={UserPen}
//                 />
//               </div>

//               <InputField
//                 name="email"
//                 label="Email"
//                 type="email"
//                 placeholder="john@example.com"
//                 // icon={Mail}
//               />

//               <PhoneInputField
//                 name="phone"
//                 label="Phone Number"
//                 placeholder="Enter your number"
//                 // icon={PhoneCallIcon}
//               />

//               <SelectField
//                 name="service"
//                 label="Select a Service"
//                 options={serviceOptions}
//                 // icon={SlidersHorizontal}
//                 placeholder={
//                   isLoadingServices ? 'Loading services...' : 'Select a service'
//                 }
//                 disabled={
//                   isLoadingServices ||
//                   (!isLoadingServices && serviceOptions.length === 0)
//                 }
//               />

//               {!isLoadingServices &&
//                 serviceOptions.length === 0 &&
//                 hasFetchedServices && (
//                   <p className="text-sm text-muted-foreground text-center">
//                     No services currently available.
//                   </p>
//                 )}

//               <div className="grid grid-cols-2 items-center gap-4">
//                 <DatePickerField
//                   name="date"
//                   label="Appointment Date"
//                   placeholder="Pick a date"
//                   // icon={CalendarIcon}
//                 />
//                 <TimePickerField
//                   name="time"
//                   label="Appointment Time"
//                   availableTimeSlots={availableTimeSlots}
//                   // icon={Clock}
//                 />
//               </div>

//               <TextAreaField
//                 name="message"
//                 label="Additional Notes"
//                 placeholder="Any special requests?"
//                 // icon={ScrollText}
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
//                         disabled={isLoadingServices || isSubmitting}
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

//               <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-1 active:outline-blue-700 transition-transform duration-200"
//                   onClick={handleBack}
//                   disabled={isSubmitting}
//                 >
//                   ← Back
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="primary"
//                   className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-1 active:outline-blue-700 transition-colors duration-200"
//                   disabled={
//                     isLoadingServices || isLoadingAppointment || isSubmitting
//                   }
//                 >
//                   {isEditMode ? (
//                     isSubmitting ? (
//                       <LoadingSpinner text="Updating..." />
//                     ) : (
//                       'Update Appointment'
//                     )
//                   ) : isSubmitting ? (
//                     <LoadingSpinner text="Creating..." />
//                   ) : (
//                     'Book Appointment'
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
import { useRouter, useParams } from 'next/navigation'
import DatePickerField from '@/components/custom-form-fields/date-field'
import {
  CalendarIcon,
  Clock,
  Mail,
  PhoneCallIcon,
  ScrollText,
  SlidersHorizontal,
  UserPen,
} from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import LoadingSpinner from '@/components/loading-spinner'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { isValidPhoneNumber } from 'libphonenumber-js'

interface ServiceOption {
  label: string
  value: string
}

// Define the form schema using Zod
// Updated appointment schema
// const appointmentSchema = z.object({
//   firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   email: z.string().email('Invalid email address').min(1, 'Email is required'),
//   phone: z
//     .string()
//     .min(1, 'Phone number is required')
//     .refine(
//       (value) => {
//         const parts = value.split(' ')
//         if (parts.length < 2 || !parts[1].trim()) {
//           return false // No number after country code
//         }
//         return isValidPhoneNumber(value.replace(' ', ''))
//       },
//       { message: 'Valid phone number is required' },
//     ),
//   service: z.string().min(1, 'Service is required'),
//   date: z.date({ required_error: 'Date is required' }),
//   time: z.string().min(1, 'Time is required'),
//   message: z.string().optional(),
//   appointmentType: z.string().min(1, 'Appointment type is required'),
// })

const appointmentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+\d{1,4}\s\d{7,}$/, 'Valid phone number is required'),
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

const NewAppoinment = ({
  open,
  onChange,
}: {
  open: boolean
  onChange: (open: boolean) => void
}) => {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string | undefined
  const isEditMode = !!id

  const [isLoadingAppointment, setIsLoadingAppointment] = useState(isEditMode)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize react-hook-form with Zod validation
  const form = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+9779818275115', // US number
      service: 'service1',
      date: new Date(2025, 6, 20),
      time: '10:00 AM',
      message: 'Test appointment',
      appointmentType: 'in-person',
    },
  })

  // Simulate fetching dummy data in edit mode
  // useEffect(() => {
  //   if (isEditMode && open) {
  //     // Dummy data for testing
  //     const dummyData: FormData = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'john@example.com',
  //       phone: '+9779818275115', // US number
  //       service: 'service1',
  //       date: new Date(2025, 6, 20),
  //       time: '10:00 AM',
  //       message: 'Test appointment',
  //       appointmentType: 'in-person',
  //     }
  //     form.reset(dummyData)
  //     setIsLoadingAppointment(false)
  //   } else if (!open) {
  //     form.reset()
  //   }
  // }, [open, isEditMode, form])

  const serviceOptions: ServiceOption[] = [
    { label: 'Service 1', value: 'service1' },
    { label: 'Service 2', value: 'service2' },
    { label: 'Service 3', value: 'service3' },
  ]

  const appointmentTypeOptions = [
    { label: 'In-Person', value: 'in-person' },
    { label: 'Virtual', value: 'virtual' },
  ]

  const hasFetchedServices = serviceOptions.length > 0
  const isLoadingServices = false

  // Handle form submission
  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      console.log('Form submitted:', formData)
      // onChange(false)
      // router.push('/admin/appointment')
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    onChange(false)
  }

  return (
    <Dialog onOpenChange={onChange} open={open}>
      <DialogContent className="md:max-w-2xl overflow-y-scroll">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-blue-700 text-lg">
            {isEditMode ? 'Edit Appointment' : 'Enter Appointment Details'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditMode
              ? 'Update existing appointment details'
              : 'View and manage your upcoming appointments'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingAppointment || (isLoadingServices && !hasFetchedServices) ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            {isLoadingAppointment
              ? 'Loading appointment...'
              : 'Loading services...'}
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
                options={serviceOptions}
                placeholder={
                  isLoadingServices ? 'Loading services...' : 'Select a service'
                }
                disabled={
                  isLoadingServices ||
                  (!isLoadingServices && serviceOptions.length === 0)
                }
              />

              {!isLoadingServices &&
                serviceOptions.length === 0 &&
                hasFetchedServices && (
                  <p className="text-sm text-muted-foreground text-center">
                    No services currently available.
                  </p>
                )}

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
                        disabled={isLoadingServices || isSubmitting}
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

              <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-1 active:outline-blue-700 transition-transform duration-200"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-1 active:outline-blue-700 transition-colors duration-200"
                  disabled={
                    isLoadingServices || isLoadingAppointment || isSubmitting
                  }
                >
                  {isEditMode ? (
                    isSubmitting ? (
                      <LoadingSpinner text="Updating..." />
                    ) : (
                      'Update Appointment'
                    )
                  ) : isSubmitting ? (
                    <LoadingSpinner text="Creating..." />
                  ) : (
                    'Book Appointment'
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

export default NewAppoinment
