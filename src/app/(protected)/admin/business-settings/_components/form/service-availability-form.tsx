'use client'

import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import BusinessDaySelector from '@/components/custom-form-fields/business-settings/business-day-selector'
import BusinessHourSelector from '@/components/custom-form-fields/business-settings/business-hour-selector'
import {
  BusinessTab,
  setActiveTab,
  setBusinessDetail,
  updateBusiness,
  createBusiness,
  transformAvailabilityForForm,
  convertFormToApiFormat,
  convertServiceAvailabilityToApi,
  weekdayMap,
  serviceAvailabilityFormSchema,
  ServiceAvailabilityFormValues,
} from '@/store/slices/businessSlice'
import { normalizeWeekDays } from './business-availability'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

const defaultValues: ServiceAvailabilityFormValues = {
  serviceAvailability: ['Mon', 'Tue', 'Wed', 'Thu'],
  serviceDays: {
    Mon: [['09:00', '17:00']],
    Tue: [['09:00', '17:00']],
    Wed: [['09:00', '17:00']],
    Thu: [['09:00', '17:00']],
    Fri: [],
    Sat: [],
    Sun: [],
  },
  isServiceVisible: true,
  isPricingEnabled: false,
}

const ServiceAvailabilityForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedBusiness, businessData } = useSelector(
    (state: RootState) => state.business,
  )
  const [currentMode, setCurrentMode] = useState<'default' | 'custom'>(
    'default',
  )
  const [activeDay, setActiveDay] = useState<WeekDay>('Mon')

  const form = useForm<ServiceAvailabilityFormValues>({
    resolver: zodResolver(serviceAvailabilityFormSchema),
    defaultValues: selectedBusiness?.serviceAvailability?.length
      ? {
          serviceAvailability: selectedBusiness.serviceAvailability
            ?.map((avail) => weekdayMap[avail.weekDay] as WeekDay)
            .filter((day): day is WeekDay => !!day) || [
            'Mon',
            'Tue',
            'Wed',
            'Thu',
          ],
          serviceDays: transformAvailabilityForForm(
            selectedBusiness.serviceAvailability,
          ).work,
          isServiceVisible: true,
          isPricingEnabled: false,
        }
      : businessData?.businessAvailabilityForm
        ? {
            serviceAvailability:
              businessData.businessAvailabilityForm.businessAvailability,
            serviceDays: businessData.businessAvailabilityForm.businessDays,
            isServiceVisible: true,
            isPricingEnabled: false,
          }
        : defaultValues,
  })

  useEffect(() => {
    if (selectedBusiness?.serviceAvailability?.length) {
      const initialData = {
        serviceAvailability: selectedBusiness.serviceAvailability
          ?.map((avail) => weekdayMap[avail.weekDay] as WeekDay)
          .filter((day): day is WeekDay => !!day) || [
          'Mon',
          'Tue',
          'Wed',
          'Thu',
        ],
        serviceDays: transformAvailabilityForForm(
          selectedBusiness.serviceAvailability,
        ).work,
        isServiceVisible: true,
        isPricingEnabled: false,
      }
      form.reset(initialData)
    } else if (businessData?.businessAvailabilityForm) {
      const initialData = {
        serviceAvailability:
          businessData.businessAvailabilityForm.businessAvailability,
        serviceDays: businessData.businessAvailabilityForm.businessDays,
        isServiceVisible: true,
        isPricingEnabled: false,
      }
      form.reset(initialData)
    }
  }, [selectedBusiness, businessData, form])

  const onSubmit = async (formData: ServiceAvailabilityFormValues) => {
    if (!businessData?.businessAvailabilityForm) {
      toast.error('Please complete business availability first.')
      dispatch(setActiveTab(BusinessTab.BusinessAvailability))
      return
    }

    const { businessAvailability, holidays } = convertFormToApiFormat(
      businessData.businessAvailabilityForm,
    )
    const serviceAvailability = convertServiceAvailabilityToApi(
      formData,
      selectedBusiness?.id || crypto.randomUUID(),
    )

    const updatedData = {
      ...selectedBusiness,
      timeZone: businessData.businessAvailabilityForm.timezone,
      businessAvailability,
      holidays,
      serviceAvailability,
      // updatedAt: new Date(),
    }

    console.log(updatedData, 'updatedData ------ in service availability')
    dispatch(setBusinessDetail(updatedData))

    // try {
    //   if (selectedBusiness?.id) {
    //     await dispatch(
    //       updateBusiness({ id: selectedBusiness.id, data: updatedData }),
    //     ).unwrap()
    //     toast.success('Service availability updated successfully')
    //   } else {
    //     await dispatch(createBusiness(updatedData)).unwrap()
    //     toast.success('Business created with service availability')
    //   }
    // } catch (error) {
    //   toast.error('Failed to save service availability')
    // }
  }

  const handleBack = () => {
    dispatch(setActiveTab(BusinessTab.BusinessAvailability))
  }

  const handleSkip = () => {
    toast.info('Service availability skipped')
    // Navigate to a confirmation page or next step
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 mt-4 w-full"
      >
        <div className="flex flex-col gap-4 w-full pt-4">
          <div className="flex bg-[#BBBBBB]/60 rounded-[8px] overflow-hidden w-fit p-1 h-10">
            {['default', 'custom'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCurrentMode(mode as 'default' | 'custom')}
                className={`w-[100px] text-base font-medium ${
                  currentMode === mode
                    ? 'text-blue-600 bg-white rounded-[6px]'
                    : 'text-gray-600'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex p-3 flex-col gap-6 border border-[#E9E9E9] rounded-[4px]">
            <BusinessDaySelector
              name="serviceAvailability"
              label="Service Days"
              className="border border-blue-200 rounded-[8px]"
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              currentMode={currentMode}
              setCurrentMode={setCurrentMode}
            />
            <BusinessHourSelector
              name="serviceDays"
              dayName="serviceAvailability"
              label="Service Hours"
              initialBusinessHours={normalizeWeekDays(
                defaultValues.serviceDays,
              )}
              businessBreaks={normalizeWeekDays({})}
              className="border border-blue-200 rounded-[4px]"
              activeDay={activeDay}
              restrictToInitialHours={true}
              isDefault={currentMode === 'default'}
              setCustom={setCurrentMode}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-medium text-[#111827]')}>
                Service Visibility
              </span>
              <Switch
                {...form.register('isServiceVisible')}
                checked={form.watch('isServiceVisible')}
                onCheckedChange={(checked) =>
                  form.setValue('isServiceVisible', checked)
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-medium text-[#111827]')}>
                Enable Pricing?
              </span>
              <Switch
                {...form.register('isPricingEnabled')}
                checked={form.watch('isPricingEnabled')}
                onCheckedChange={(checked) =>
                  form.setValue('isPricingEnabled', checked)
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[#BBBBBB]">
          <button
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            <div className="text-[#BBBBBB] text-sm font-normal">Back</div>
          </button>
          <div className="flex gap-4">
            <button
              className="flex gap-1 items-center cursor-pointer text-[#6AA9FF]"
              onClick={handleSkip}
            >
              <div className="text-[#6AA9FF] text-sm font-normal">Skip</div>
              <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </button>
            <Button type="submit" className="cursor-pointer">
              Save and Continue
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default ServiceAvailabilityForm
