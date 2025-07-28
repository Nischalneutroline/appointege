'use client'

import React, { useEffect, useRef } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import BusinessDaySelector from '@/components/custom-form-fields/business-settings/business-day-selector'
import BusinessHourSelector from '@/components/custom-form-fields/business-settings/business-hour-selector'
import {
  BusinessTab,
  setActiveTab,
  setBusinessDetail,
  setServiceAvailabilityForm,
  transformAvailabilityForForm,
  convertFormToApiFormat,
  convertServiceAvailabilityToApi,
  weekdayMap,
  serviceAvailabilityFormSchema,
  ServiceAvailabilityFormValues,
  createBusiness,
  updateBusiness,
  BusinessDetail,
} from '@/store/slices/businessSlice'
import { normalizeWeekDays } from './business-availability'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

const defaultValues: ServiceAvailabilityFormValues = {
  serviceAvailability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  serviceDays: {
    Mon: [['09:00 AM', '05:00 PM']],
    Tue: [['09:00 AM', '05:00 PM']],
    Wed: [['09:00 AM', '05:00 PM']],
    Thu: [['09:00 AM', '05:00 PM']],
    Fri: [['09:00 AM', '05:00 PM']],
    Sat: [],
    Sun: [],
  },
  isServiceVisible: true,
  isPricingEnabled: false,
}

const ServiceAvailabilityForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedBusiness, businessData, loading } = useSelector(
    (state: RootState) => state.business,
  )
  const { user } = useSelector((state: RootState) => state.auth)
  console.log('user in ServiceAvailabilityForm', user)

  const [currentMode, setCurrentMode] = React.useState<'default' | 'custom'>(
    'default',
  )
  const [activeDay, setActiveDay] = React.useState<WeekDay>('Mon')
  const lastResetDataRef = useRef<string | null>(null)

  const businessHoursFromState =
    businessData?.businessAvailabilityForm?.businessDays
  const businessAvailabilityFromState =
    businessData?.businessAvailabilityForm?.businessAvailability

  const form = useForm<ServiceAvailabilityFormValues>({
    resolver: zodResolver(serviceAvailabilityFormSchema),
    defaultValues:
      businessData?.serviceAvailabilityForm ||
      (businessHoursFromState
        ? {
            serviceAvailability:
              businessAvailabilityFromState ||
              defaultValues.serviceAvailability,
            serviceDays: normalizeWeekDays(
              Object.fromEntries(
                Object.entries(businessHoursFromState).map(([day, slots]) => [
                  day,
                  slots.filter((slot: [string, string]) => slot[0] && slot[1]),
                ]),
              ),
            ),
            isServiceVisible: true,
            isPricingEnabled: false,
          }
        : defaultValues),
  })

  useEffect(() => {
    let initialData: ServiceAvailabilityFormValues = defaultValues

    if (businessData?.serviceAvailabilityForm) {
      const result = serviceAvailabilityFormSchema.safeParse(
        businessData.serviceAvailabilityForm,
      )
      initialData = result.success
        ? {
            ...result.data,
            serviceDays: normalizeWeekDays(
              Object.fromEntries(
                Object.entries(result.data.serviceDays).map(([day, slots]) => [
                  day,
                  slots.filter((slot: [string, string]) => slot[0] && slot[1]),
                ]),
              ),
            ),
          }
        : defaultValues
    } else if (selectedBusiness?.serviceAvailability?.length) {
      initialData = {
        serviceAvailability:
          selectedBusiness.serviceAvailability
            ?.map((avail) => weekdayMap[avail.weekDay] as WeekDay)
            .filter((day): day is WeekDay => !!day) ||
          defaultValues.serviceAvailability,
        serviceDays: normalizeWeekDays(
          Object.fromEntries(
            Object.entries(
              transformAvailabilityForForm(selectedBusiness.serviceAvailability)
                .work,
            ).map(([day, slots]) => [
              day,
              slots.filter((slot: [string, string]) => slot[0] && slot[1]),
            ]),
          ),
        ),
        isServiceVisible: true,
        isPricingEnabled: false,
      }
    } else if (businessHoursFromState && businessAvailabilityFromState) {
      initialData = {
        serviceAvailability: businessAvailabilityFromState,
        serviceDays: normalizeWeekDays(
          Object.fromEntries(
            Object.entries(businessHoursFromState).map(([day, slots]) => [
              day,
              slots.filter((slot: [string, string]) => slot[0] && slot[1]),
            ]),
          ),
        ),
        isServiceVisible: true,
        isPricingEnabled: false,
      }
    }

    const initialDataStr = JSON.stringify(initialData)
    if (initialDataStr !== lastResetDataRef.current) {
      form.reset(initialData, { keepDirty: false })
      lastResetDataRef.current = initialDataStr
    }
  }, [selectedBusiness, businessData, form, user])

  const formData = useWatch({
    control: form.control,
  }) as ServiceAvailabilityFormValues
  const lastFormDataRef = useRef<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = serviceAvailabilityFormSchema.safeParse(formData)
      let safeData: ServiceAvailabilityFormValues

      if (result.success) {
        safeData = {
          ...result.data,
          serviceDays: normalizeWeekDays(
            Object.fromEntries(
              Object.entries(result.data.serviceDays).map(([day, slots]) => [
                day,
                slots.filter((slot: [string, string]) => slot[0] && slot[1]),
              ]),
            ),
          ),
        }
      } else {
        safeData = {
          ...defaultValues,
          ...formData,
          serviceAvailability:
            formData.serviceAvailability || defaultValues.serviceAvailability,
          serviceDays: normalizeWeekDays(
            Object.fromEntries(
              Object.entries(
                formData.serviceDays || defaultValues.serviceDays,
              ).map(([day, slots]) => [
                day,
                slots.filter((slot: [string, string]) => slot[0] && slot[1]),
              ]),
            ),
          ),
          isServiceVisible:
            formData.isServiceVisible ?? defaultValues.isServiceVisible,
          isPricingEnabled:
            formData.isPricingEnabled ?? defaultValues.isPricingEnabled,
        }
      }

      const safeDataStr = JSON.stringify(safeData)
      if (safeDataStr !== lastFormDataRef.current) {
        dispatch(setServiceAvailabilityForm(safeData))
        lastFormDataRef.current = safeDataStr
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [formData, dispatch])

  const onSubmit = async (formData: ServiceAvailabilityFormValues) => {
    if (!businessData?.businessAvailabilityForm) {
      toast.error('Please complete business availability first.')
      dispatch(setActiveTab(BusinessTab.BusinessAvailability))
      return
    }

    const result = serviceAvailabilityFormSchema.safeParse(formData)
    if (!result.success) {
      toast.error('Invalid service availability data.')
      return
    }

    const filteredFormData = {
      ...formData,
      serviceDays: normalizeWeekDays(
        Object.fromEntries(
          Object.entries(formData.serviceDays).map(([day, slots]) => [
            day,
            slots.filter((slot: [string, string]) => slot[0] && slot[1]),
          ]),
        ),
      ),
    }

    const { businessAvailability, holidays } = convertFormToApiFormat(
      businessData.businessAvailabilityForm,
    )
    const serviceAvailability = convertServiceAvailabilityToApi(
      filteredFormData,
      selectedBusiness?.id || crypto.randomUUID(),
    )

    const finalBusinessData = {
      ...businessData,
      ...selectedBusiness,
      timeZone: businessData.businessAvailabilityForm.timezone,
      businessAvailability,
      holiday: holidays,
      serviceAvailability,
      businessOwner: user?.id,
    }

    console.log(finalBusinessData, 'finalBusinessData')

    try {
      dispatch(setBusinessDetail(finalBusinessData))
      dispatch(setServiceAvailabilityForm(filteredFormData))

      if (selectedBusiness?.id) {
        // Update existing business
        await dispatch(
          updateBusiness({ id: selectedBusiness.id, data: finalBusinessData }),
        )
        toast.success('Service availability updated successfully')
      } else {
        // Create new business
        await dispatch(createBusiness(finalBusinessData))
        toast.success('Service availability saved successfully')
      }
    } catch (error) {
      toast.error('Failed to save service availability')
    }
  }

  const handleBack = () => {
    const currentData = form.getValues()
    const result = serviceAvailabilityFormSchema.safeParse(currentData)
    const safeData = result.success
      ? {
          ...result.data,
          serviceDays: normalizeWeekDays(
            Object.fromEntries(
              Object.entries(result.data.serviceDays).map(([day, slots]) => [
                day,
                slots.filter((slot: [string, string]) => slot[0] && slot[1]),
              ]),
            ),
          ),
        }
      : defaultValues
    dispatch(setServiceAvailabilityForm(safeData))
    dispatch(setActiveTab(BusinessTab.BusinessAvailability))
  }

  const handleSkip = () => {
    const currentData = form.getValues()
    const result = serviceAvailabilityFormSchema.safeParse(currentData)
    const safeData = result.success
      ? {
          ...result.data,
          serviceDays: normalizeWeekDays(
            Object.fromEntries(
              Object.entries(result.data.serviceDays).map(([day, slots]) => [
                day,
                slots.filter((slot: [string, string]) => slot[0] && slot[1]),
              ]),
            ),
          ),
        }
      : defaultValues
    dispatch(setServiceAvailabilityForm(safeData))
    toast.info('Service availability skipped')
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
              initialBusinessHours={normalizeWeekDays(businessHoursFromState)}
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
            type="button"
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            <div className="text-[#BBBBBB] text-sm font-normal">Back</div>
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              className="flex gap-1 items-center cursor-pointer text-[#6AA9FF]"
              onClick={handleSkip}
            >
              <div className="text-[#6AA9FF] text-sm font-normal">Skip</div>
              <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </button>
            <Button type="submit" className="cursor-pointer">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" strokeWidth={2.5} />
              )}
              {loading
                ? `${selectedBusiness?.id ? 'Updating' : 'Creating'}`
                : `${selectedBusiness?.id ? 'Update' : 'Create'}`}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default ServiceAvailabilityForm
