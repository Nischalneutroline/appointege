import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { FormProvider, useForm } from 'react-hook-form'
import { appointmentSchema } from '@/app/(protected)/admin/appointment/_schema/appoinment'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema } from '../_schemas/service'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import AvailabilityTabs from '@/components/custom-form-fields/availability-tabs'
import { z } from 'zod'
import InputField from '@/components/custom-form-fields/input-field'
import DurationSelect from '@/components/custom-form-fields/duration-select'
import { Status, WeekDays } from '../_types/service'
import FileUploadField from '@/components/custom-form-fields/image-upload'
import ServiceDaySelector from '@/components/custom-form-fields/serivce/service-day-selector'
import ServiceHoursSelector from '@/components/custom-form-fields/serivce/service-hours-selector'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>
  holidays: WeekDay[]
}

export const toFullDay = (day: string): string => {
  const map: Record<string, string> = {
    Mon: 'MONDAY',
    Tue: 'TUESDAY',
    Wed: 'WEDNESDAY',
    Thu: 'THURSDAY',
    Fri: 'FRIDAY',
    Sat: 'SATURDAY',
    Sun: 'SUNDAY',
  }

  return map[day] ?? 'MONDAY' // Fallback to MONDAY just in case
}

// Default business availability (for testing, can be overridden by prop)
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

/* Format availability settings note */
const formatAvailabilityNote = () => {
  return 'Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability.'
}

const NewServiceForm = ({
  open,
  onChange,
}: {
  open: boolean
  onChange: (open: boolean) => void
}) => {
  const businessAvailability = defaultBusinessAvailability
  // Dispatch
  const dispatch = useDispatch<AppDispatch>()
  // User state`
  const { user } = useSelector((state: RootState) => state.auth)
  const { isFormOpen, formMode } = useSelector(
    (state: RootState) => state.appointment,
  )

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      //   dispatch(closeAppointmentForm())
    }
  }

  type FormData = z.infer<typeof serviceSchema>

  //   const [isLoadingService, setIsLoadingService] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  //   const [isSubmitted, setIsSubmitted] = useState(false)
  //   const [filledData, setFilledData] = useState<FormData>()

  // Form Object for Service
  const form = useForm<FormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      estimatedDuration: 0,
      serviceAvailability: [],
      businessDetailId: '',
      status: Status.ACTIVE,
    },
  })
  // Loading Services
  //   const { , isLoading: isLoadingServices } = useSelector(
  //     (state: RootState) => state.service,
  //   )
  const onSubmit = async (data: FormData) => {
    // try {
    //   const serviceData = {
    //     title: data.serviceName,
    //     description: data.description,
    //     estimatedDuration: parseInt(data.duration),
    //     status: data.isAvailable ? 'ACTIVE' : 'INACTIVE',
    //     serviceAvailability: data.serviceDays.map((day) => ({
    //       weekDay: toFullDay(day),
    //       timeSlots: (data.serviceHours[day] || []).map(
    //         ([startTime, endTime]) => ({
    //           startTime: toDate(startTime),
    //           endTime: toDate(endTime),
    //         }),
    //       ),
    //     })),
    //     businessDetailId: businessId,
    //   }
    //   console.log(serviceData, 'servicedata inside onSubmit')
    //   await createService(serviceData)
    //   toast.success('Service created successfully')
    //   router.push('/service')
    // } catch (error) {
    //   toast.error('Failed to create service')
    //   console.error('Error creating service:', error)
    // }
  }

  const handleBack = () => {
    onChange(false)
  }

  return (
    <Dialog onOpenChange={onChange} open={open}>
      <DialogContent className="md:max-w-2xl overflow-y-scroll">
        <DialogHeader className="gap-0">
          <DialogTitle className="flex justify-center text-blue-700 text-xl">
            {formMode === 'edit' ? 'Edit Service' : 'Enter Service Details'}
          </DialogTitle>
          <DialogDescription className="flex justify-center text-sm text-muted-foreground">
            {formMode === 'edit'
              ? 'Update existing service details'
              : 'Fill the detail below to create a new service'}
          </DialogDescription>
        </DialogHeader>

        {/* {isLoadingServices ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            Loading services...
          </div>
        ) : !isLoadingServices && serviceOptions.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            No service found to add appointment
          </div>
        ) : ( */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            aria-busy={isSubmitting}
          >
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="title"
                label="Service Name"
                placeholder="Enter Service Name"
              />
              {/* <InputField
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                /> */}
            </div>

            <TextAreaField
              name="description"
              label="Description"
              placeholder="Enter Description"
            />

            <FileUploadField
              name="image"
              label="Cover Page"
              placeholder="Upload Image"
            />

            {/* <SelectField
                name="service"
                label="Select a Service"
                options={serviceOptions}
                placeholder="Select service"
                disabled={isSubmitting}
              /> */}

            <div className="flex flex-col gap-3 md:flex-row items-center justify-center">
              <AvailabilityTabs name="status" />
              <DurationSelect name="duration" label="Duration:" />
            </div>
            <ServiceDaySelector
              name="serviceDays"
              businessAvailability={businessAvailability}
            />
            <ServiceHoursSelector
              name="serviceHours"
              businessBreaks={businessAvailability.breaks}
            />

            {/* <div className="grid grid-cols-2 items-center gap-4">
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
              </div> */}

            <TextAreaField
              name="message"
              label="Additional Notes"
              placeholder="Any special requests?"
            />

            {/* <FormField
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
              /> */}

            <div className="flex flex-col gap-3  md:flex-row justify-center items-center mt-6">
              {/* <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-blue-700 transition-transform duration-200"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                ← Back
              </Button> */}
              {/* <Button
                  type="submit"
                  variant="default"
                  className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
                  disabled={
                    isLoadingServices || isLoadingAppointment || isSubmitting
                  }
                >
                  {isEditMode ? (
                    isSubmitting ? (
                      <LoadingSpinner text="Updating..." />
                    ) : (
                      'Submitting...'
                    )
                  ) : isSubmitting ? (
                    <LoadingSpinner text="Creating..." />
                  ) : (
                    'Submit'
                  )}
                </Button> */}
            </div>
          </form>
        </FormProvider>
        {/* )} */}
      </DialogContent>
    </Dialog>
  )
}

export default NewServiceForm
