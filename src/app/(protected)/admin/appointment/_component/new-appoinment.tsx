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
  Calendar,
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
  Appointment,
  AppointmentStatus,
  PostAppoinmentData,
} from '@/app/(protected)/admin/appointment/_types/appointment'
import { normalDateToIso } from '@/utils/utils'
import {
  storeCreateAppointment,
  updateAppointment,
  closeAppointmentForm,
} from '@/store/slices/appointmentSlice'
import { toast } from 'sonner'
import { fetchServices } from '@/store/slices/serviceSlice'

interface ServiceOption {
  label: string
  value: string
}

const appointmentSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+\d{1,4}\s\d{7,}$/, 'Valid phone number is required!'),
  service: z.string().min(1, 'Service is required'),
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, 'Time is required'),
  message: z.string().optional(),
  appointmentType: z.string().min(1, 'Appointment type is required'),
  status: z
    .enum([
      AppointmentStatus.SCHEDULED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.MISSED,
      AppointmentStatus.CANCELLED,
      AppointmentStatus.FOLLOW_UP,
    ])
    .optional(),
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
  const [filledData, setFilledData] = useState<Appointment | null>(null)

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
      status: AppointmentStatus.SCHEDULED,
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
        date: new Date(currentAppointment.selectedDate),
        time: currentAppointment.selectedTime,
        message: currentAppointment.message || '',
        appointmentType: 'in-person',
        status: currentAppointment.status,
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

  const statusOptions = Object.values(AppointmentStatus).map((status) => ({
    label: status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' '),
    value: status,
  }))

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
        selectedDate: normalDateToIso(formData.date),
        selectedTime: formData.time,
        status:
          appoinmentFormMode === 'edit' && formData.status
            ? formData.status
            : AppointmentStatus.SCHEDULED,
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
      setFilledData(currentAppointment)
    } catch (error: any) {
      console.error(
        `Error ${appoinmentFormMode === 'edit' ? 'updating' : 'creating'} appointment:`,
        error,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    dispatch(closeAppointmentForm())
    onChange(false)
  }

  return (
    // <style jsx>{`
    //   .dialog-content {
    //     box-sizing: border-box;
    //     width: 90vmin;
    //     max-width: min(500px, 90vw);
    //     min-width: 280px;
    //     max-height: 85vh;
    //     position: fixed;
    //     top: 50%;
    //     left: 50%;
    //     transform: translate(-50%, -50%) scale(1);
    //     overflow-y: auto;
    //     overflow-x: hidden;
    //     border-radius: 0.5rem;
    //     font-size: 1rem;
    //     line-height: 1.5;
    //     padding: 1rem;
    //   }
    //   @media (min-width: 640px) {
    //     .dialog-content {
    //       max-width: min(600px, 90vw);
    //       padding: 1.5rem;
    //       font-size: 1.125rem;
    //     }
    //   }
    //   @media (max-width: 400px) {
    //     .dialog-content {
    //       width: 95vmin;
    //       max-width: 95vw;
    //       min-width: 260px;
    //       padding: 0.75rem;
    //       font-size: 0.875rem;
    //     }
    //     .dialog-content h2 {
    //       font-size: 1rem;
    //     }
    //   }
    //   @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    //     .dialog-content {
    //       transform: translate(-50%, -50%) scale(1) !important;
    //       -webkit-font-smoothing: antialiased;
    //       -moz-osx-font-smoothing: grayscale;
    //     }
    //   }
    //   @media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
    //     .dialog-content {
    //       transform: translate(-50%, -50%) scale(1) !important;
    //     }
    //   }
    //   @media (max-height: 600px) {
    //     .dialog-content {
    //       max-height: 90vh;
    //       padding: 0.75rem;
    //     }
    //   }
    //   /* Ensure no browser zoom interference */
    //   @media screen and (max-width: 1024px) and (min-resolution: 192dpi) {
    //     .dialog-content {
    //       width: 92vmin;
    //       max-width: min(550px, 92vw);
    //     }
    //   }
    //   /* Accessibility: Handle macOS Zoom or high contrast */
    //   @media (prefers-contrast: high) {
    //     .dialog-content {
    //       border: 2px solid #000 !important;
    //       background: #fff !important;
    //     }
    //   }
    // `}</style>
    <>
      <Dialog onOpenChange={handleBack} open={open}>
        <DialogContent
          className="dialog-content bg-white shadow-lg w-[90dvw] max-w-[min(550px,90vw)] min-w-[260px] max-h-[85vh] overflow-y-auto overflow-x-hidden"
          style={{ boxSizing: 'border-box' }}
          aria-describedby="dialog-description"
        >
          {!isSubmitted && (
            <DialogHeader className="gap-0.5">
              <DialogTitle className="text-center text-blue-700 text-base sm:text-xl md:text-lg font-semibold">
                {appoinmentFormMode === 'edit'
                  ? 'Edit Appointment'
                  : 'Create New Appointment'}
              </DialogTitle>
              <DialogDescription
                id="dialog-description"
                className="text-center text-xs sm:text-sm text-muted-foreground"
              >
                {appoinmentFormMode === 'edit'
                  ? 'Update existing appointment details'
                  : 'Fill the details below to create an appointment on behalf of the customer'}
              </DialogDescription>
            </DialogHeader>
          )}

          {isSubmitted ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-1">
                <CircleCheckBig
                  strokeWidth={2.5}
                  className="text-[#4caf50] w-6 h-6 sm:w-8 sm:h-8"
                />
                <h2 className="text-blue-900 text-base md:text-xl font-semibold">
                  Appointment Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Appointment successfully{' '}
                  {appoinmentFormMode === 'edit' ? 'updated' : 'scheduled'} on
                  behalf of the customer
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-[#eff5ff] rounded-lg">
                <ViewItem
                  title="Name"
                  value={filledData?.customerName || ''}
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
                <ViewItem
                  className="border-t border-[#BEDAFE] w-full pt-3 md:pt-4"
                  title="Service"
                  value={
                    filledData?.service
                      ? filledData.service.title +
                        ' (' +
                        filledData.service.estimatedDuration +
                        'min)'
                      : ''
                  }
                  icon={<HandHeart className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#d2fae5"
                  textColor="#099668"
                />
                <ViewItem
                  title="Date & Time"
                  value={
                    filledData?.selectedDate && filledData?.selectedTime
                      ? `${format(
                          new Date(filledData.selectedDate),
                          'MMM d yyyy',
                        )}, ${filledData.selectedTime}, ${format(
                          new Date(filledData.selectedDate),
                          'EEE',
                        )}`
                      : ''
                  }
                  icon={<Clock className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#d2fae5"
                  textColor="#099668"
                />
                {/* <ViewItem
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
                /> */}
                {appoinmentFormMode === 'edit' && filledData?.status && (
                  <ViewItem
                    title="Status"
                    value={
                      filledData.status.charAt(0) +
                      filledData.status.slice(1).toLowerCase().replace('_', ' ')
                    }
                    icon={
                      <CircleCheckBig className="w-4 h-4" strokeWidth={2} />
                    }
                    bgColor="#d2fae5"
                    textColor="#099668"
                  />
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    setIsSubmitted(false)
                    handleBack()
                  }}
                  className="w-24 sm:w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : isLoadingServices ? (
            <div className="flex justify-center items-center py-10 sm:py-20 text-muted-foreground text-sm">
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="flex justify-center items-center py-10 sm:py-20 text-muted-foreground text-sm">
              No services found to add appointment
            </div>
          ) : (
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3 sm:gap-4"
                aria-busy={isSubmitting}
              >
                <InputField
                  name="fullName"
                  label="Full Name"
                  placeholder="Doe"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <PhoneInputField
                  name="phone"
                  label="Phone"
                  placeholder="Enter your number"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <SelectField
                  name="service"
                  label="Service"
                  options={serviceOptions}
                  placeholder="Select service"
                  disabled={isSubmitting}
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <DatePickerField
                    name="date"
                    label="Date"
                    placeholder="Pick a date"
                    buttonClassName="h-9 sm:h-10 border border-blue-200 rounded-[4px]"
                    icon={Calendar}
                  />
                  <TimePickerField
                    name="time"
                    label="Time"
                    placeholder="Select Time"
                    className="!h-9 sm:!h-10 w-full border border-blue-200 rounded-[4px]"
                    availableTimeSlots={availableTimeSlots}
                  />
                </div>
                <TextAreaField
                  name="message"
                  label="Message"
                  placeholder="Any special requests?"
                  className="w-full border border-blue-200 rounded-[4px] min-h-[80px] sm:min-h-[100px]"
                />
                <FormField
                  control={form.control}
                  name="appointmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Appointment Type
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
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
                                className="text-xs sm:text-sm font-medium"
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
                {appoinmentFormMode === 'edit' && (
                  <SelectField
                    name="status"
                    label="Status"
                    options={statusOptions}
                    placeholder="Select status"
                    disabled={isSubmitting}
                    className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                  />
                )}
                <div className="flex flex-col gap-3 sm:flex-row justify-center items-center mt-4 sm:mt-6">
                  <Button
                    type="submit"
                    variant="default"
                    className="w-24 sm:w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200 text-xs sm:text-sm"
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
    </>
  )
}

export default NewAppointment
