// src/features/service/_components/NewServiceForm.tsx
'use client'

import React, { useEffect, useState } from 'react'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema } from '../_schemas/service'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { weekdayMap } from '@/store/slices/businessSlice'
import { z } from 'zod'
import { ServiceStatus, WeekDay, WeekDays } from '../_types/service' // Use WeekDays from service.ts
import InputField from '@/components/custom-form-fields/input-field'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import FileUploadField from '@/components/custom-form-fields/image-upload'
import DurationSelect from '@/components/custom-form-fields/duration-select'
import ServiceDaySelector from '@/components/custom-form-fields/serivce/service-day-selector'
import ServiceHoursSelector from '@/components/custom-form-fields/serivce/service-hours-selector'
import { storeCreateService, updateService } from '@/store/slices/serviceslice'

export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>
  holidays: WeekDay[]
}

const formatAvailabilityNote = () => {
  return 'Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability.'
}

const transformBusinessAvailability = (
  businessAvailability:
    | {
        weekDay: WeekDays // Use WeekDays from ../_types/service
        timeSlots: { type: string; startTime: string; endTime: string }[]
      }[]
    | null
    | undefined,
  holidays: { holiday: WeekDays }[] | null | undefined,
): BusinessAvailability => {
  const breaks: Record<WeekDay, [string, string][]> = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  }

  if (businessAvailability && Array.isArray(businessAvailability)) {
    businessAvailability.forEach((avail) => {
      // Ensure weekDay is a valid WeekDays enum value
      const isValidWeekDay = Object.values(WeekDays).includes(
        avail.weekDay as WeekDays,
      )
      if (!isValidWeekDay) {
        console.warn(`Invalid weekDay value: ${avail.weekDay}`)
        return
      }
      const dayKey = weekdayMap[avail.weekDay] as WeekDay
      const breakSlots = avail.timeSlots
        .filter((slot) => slot.type === 'BREAK')
        .map((slot) => [slot.startTime, slot.endTime] as [string, string])
      breaks[dayKey] = breakSlots
    })
  }

  const formattedHolidays = holidays
    ? holidays
        .filter((h) => Object.values(WeekDays).includes(h.holiday))
        .map((h) => weekdayMap[h.holiday] as WeekDay)
    : []

  return {
    breaks,
    holidays: formattedHolidays,
  }
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
  const { isFormOpen, serviceFormMode, currentService } = useSelector(
    (state: RootState) => state.service,
  )
  const { selectedBusiness } = useSelector((state: RootState) => state.business)

  const businessAvailability: BusinessAvailability = selectedBusiness
    ? transformBusinessAvailability(
        selectedBusiness.businessAvailability,
        selectedBusiness.holiday,
      )
    : {
        breaks: {
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
          Sun: [],
        },
        holidays: ['Sat', 'Sun'],
      }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      estimatedDuration: 0,
      serviceAvailability: [],
      businessDetailId: user?.ownedBusinesses?.[0]?.id ?? '',
      status: ServiceStatus.ACTIVE,
      message: '',
      image: '',
    },
  })

  useEffect(() => {
    // Inverse weekdayMap to normalize weekDay values
    const inverseWeekdayMap: Record<string, WeekDays> = {
      Mon: WeekDays.MONDAY,
      Tue: WeekDays.TUESDAY,
      Wed: WeekDays.WEDNESDAY,
      Thu: WeekDays.THURSDAY,
      Fri: WeekDays.FRIDAY,
      Sat: WeekDays.SATURDAY,
      Sun: WeekDays.SUNDAY,
      [WeekDays.MONDAY]: WeekDays.MONDAY,
      [WeekDays.TUESDAY]: WeekDays.TUESDAY,
      [WeekDays.WEDNESDAY]: WeekDays.WEDNESDAY,
      [WeekDays.THURSDAY]: WeekDays.THURSDAY,
      [WeekDays.FRIDAY]: WeekDays.FRIDAY,
      [WeekDays.SATURDAY]: WeekDays.SATURDAY,
      [WeekDays.SUNDAY]: WeekDays.SUNDAY,
    }

    const normalizeWeekDay = (day: string): WeekDays => {
      return (
        inverseWeekdayMap[day] ||
        (Object.values(WeekDays).includes(day as WeekDays)
          ? (day as WeekDays)
          : WeekDays.MONDAY)
      )
    }

    if (isFormOpen && serviceFormMode === 'edit' && currentService) {
      form.reset({
        title: currentService.title,
        description: currentService.description,
        estimatedDuration: currentService.estimatedDuration || 0,
        serviceAvailability:
          currentService.serviceAvailability?.map((avail) => ({
            weekDay: normalizeWeekDay(avail.weekDay),
            timeSlots:
              avail.timeSlots?.map((slot) => ({
                startTime: slot.startTime || '',
                endTime: slot.endTime || '',
              })) || [],
          })) || [],
        businessDetailId:
          currentService.businessDetailId ||
          user?.ownedBusinesses?.[0]?.id ||
          '',
        status: currentService.status,
        message: '',
        image: '',
      })
    } else if (selectedBusiness?.serviceAvailability) {
      form.reset({
        title: '',
        description: '',
        estimatedDuration: 0,
        serviceAvailability: selectedBusiness.serviceAvailability.map(
          (avail) => ({
            weekDay: normalizeWeekDay(avail.weekDay),
            timeSlots: avail.timeSlots
              .filter((slot) => slot.startTime && slot.endTime) // Filter valid slots
              .map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
              })),
          }),
        ),
        businessDetailId:
          selectedBusiness.id || user?.ownedBusinesses?.[0]?.id || '',
        status: ServiceStatus.ACTIVE,
        message: '',
        image: '',
      })
    }
  }, [
    isFormOpen,
    serviceFormMode,
    currentService,
    form,
    user,
    selectedBusiness,
  ])

  const onSubmit = async (data: z.infer<typeof serviceSchema>) => {
    console.log('onSubmit triggered with data:', data)
    if (!user?.id) {
      toast.error('You must be logged in to create or update a service')
      return
    }

    try {
      setIsSubmitting(true)
      const serviceData = {
        title: data.title,
        description: data.description,
        estimatedDuration: data.estimatedDuration,
        serviceAvailability: data.serviceAvailability?.map((day) => ({
          weekDay: day.weekDay,
          timeSlots:
            day.timeSlots?.map(({ startTime, endTime }) => ({
              startTime,
              endTime,
            })) || [],
        })),
        businessDetailId:
          data.businessDetailId || user.ownedBusinesses?.[0]?.id || '',
        status: ServiceStatus.ACTIVE,
        message: data.message,
        image: data.image,
        userId: user.id,
      }

      if (serviceFormMode === 'edit' && currentService?.id) {
        await dispatch(
          updateService({ id: currentService.id, data: serviceData }),
        ).unwrap()
        toast.success('Service updated successfully')
      } else {
        await dispatch(storeCreateService(serviceData)).unwrap()
        toast.success('Service created successfully')
      }
      onChange(false)
    } catch (error) {
      toast.error(
        `Failed to ${serviceFormMode === 'edit' ? 'update' : 'create'} service`,
      )
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    onChange(false)
    // dispatch(closeServiceForm())
  }

  return (
    <Dialog onOpenChange={handleBack} open={open}>
      <DialogContent className="md:max-w-2xl overflow-y-scroll max-h-[40rem]">
        <DialogHeader className="gap-0">
          <DialogTitle className="flex justify-center text-blue-700 text-xl">
            {serviceFormMode === 'edit'
              ? 'Edit Service'
              : 'Enter Service Details'}
          </DialogTitle>
          <DialogDescription className="flex justify-center text-sm text-muted-foreground">
            {serviceFormMode === 'edit'
              ? 'Update existing service details'
              : 'Fill the detail below to create a new service'}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation()
              form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-5"
            aria-busy={isSubmitting}
          >
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="text-red-500 p-2 border border-red-500 rounded">
                <pre>
                  Form Errors: {JSON.stringify(form.formState.errors, null, 2)}
                </pre>
              </div>
            )}
            <InputField
              name="title"
              label="Service Name"
              placeholder="Enter Service Name"
            />
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
            <DurationSelect name="estimatedDuration" label="Duration" />
            <ServiceDaySelector
              name="serviceAvailability"
              businessAvailability={businessAvailability}
            />
            <ServiceHoursSelector
              name="serviceAvailability"
              dayName="serviceAvailability"
              businessBreaks={businessAvailability.breaks}
            />
            <TextAreaField
              name="message"
              label="Additional Notes"
              placeholder="Any special requests?"
            />
            <div className="flex flex-col gap-3 md:flex-row justify-center items-center mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto hover:opacity-80 active:outline active:outline-blue-700 transition-transform duration-200"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                ← Back
              </Button>
              <Button
                type="submit"
                variant="default"
                className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              {formatAvailabilityNote()}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => console.log('Form values:', form.getValues())}
            >
              Debug Form Values
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default NewServiceForm
