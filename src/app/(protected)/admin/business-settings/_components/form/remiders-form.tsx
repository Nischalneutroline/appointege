'use client'

import CheckboxGroupField from '@/components/custom-form-fields/reminder/checbox-group-field'
import ScheduleField from '@/components/custom-form-fields/reminder/schedule-field-with-add'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, AudioWaveform, Plus, Save } from 'lucide-react'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

// Define reminder types for frontend (align with ReminderTab where applicable)
const REMINDER_TYPES = [
  'Upcoming',
  'Follow-up',
  'Missed',
  'Cancellation',
  'Custom',
] as const
type ReminderType = (typeof REMINDER_TYPES)[number]
// Define when options for each reminder type
const whenOptions: Record<string, string[]> = {
  Upcoming: [
    '48 hours before appointment',
    '24 hours before appointment',
    '1 hours before appointment',
  ],
  'Follow-up': [
    '1 hour after appointment',
    '1 days after appointment',
    '2 days after appointment',
  ],
  Missed: [
    '15 minutes after missed',
    '1 hour after missed',
    '24 hours after missed',
    '48 hours after missed',
  ],
  Cancellation: [
    '15 minutes after cancellation',
    '1 hour after cancellation',
    '24 hours after cancellation',
    '48 hours after cancellation',
  ],
  Custom: [],
}

// Define schedule labels for each reminder type
const scheduleLabels: Record<ReminderType, string> = {
  Upcoming: 'Schedule reminder',
  'Follow-up': 'Schedule follow-up',
  Missed: 'Schedule follow-up',
  Cancellation: 'Schedule follow-up',
  Custom: 'Schedule reminder',
}

// Define send via and auto-delete options
const sendViaOptions = ['Email', 'SMS', 'Push Notification']

const RemidersForm = () => {
  const form = useForm({
    // resolver: zodResolver(serviceAvailabilityFormSchemaExtended),
    defaultValues: {
      type: 'Upcoming' as ReminderType,
      isScheduled: false,
      scheduleDate: '',
      scheduleTime: '',
      scheduleDays: '',
      scheduleHours: '',
      scheduleMinutes: '',
      customSchedules: [],
    },
  })
  const { watch, setValue, handleSubmit, reset, getValues } = form
  const selectedType = watch('type') || 'Upcoming'
  const [isScheduled, setIsScheduled] = useState<boolean>(false)
  // Ensure whenOptions[selectedType] is always an array
  const safeWhenOptions = whenOptions[selectedType] || []
  const scheduleDate = watch('scheduleDate')
  const scheduleTime = watch('scheduleTime')
  const customSchedules = watch('customSchedules') || []

  // Add custom schedule
  const addCustomSchedule = () => {
    if (scheduleDate && scheduleTime) {
      const newSchedule = { date: scheduleDate, time: scheduleTime }
      setValue('customSchedules', [...customSchedules, newSchedule], {
        shouldDirty: true,
      })
      setValue('scheduleDate', null, { shouldDirty: true })
      setValue('scheduleTime', '', { shouldDirty: true })
    }
  }

  // Remove custom schedule
  const removeCustomSchedule = (index: number) => {
    const updatedSchedules = customSchedules.filter((_, i) => i !== index)
    setValue('customSchedules', updatedSchedules, { shouldDirty: true })
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="space-y-4 mt-4 w-full"
      >
        <div className="space-y-2">
          <Tabs
            value={selectedType}
            className="mt-2 py-0.5 px-1 border border-[#E5E7EB] rounded-[10px] w-fit"
          >
            <TabsList className="grid gap-1 grid-cols-5">
              {REMINDER_TYPES.map((type) => (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="text-xs py-1"
                  onClick={() => {
                    setValue('type', type, { shouldDirty: true })
                    // setValue('when', [], { shouldDirty: true })
                    // setValue('isScheduled', false, { shouldDirty: true })
                    // setValue('scheduleDays', '', { shouldDirty: true })
                    // setValue('scheduleHours', '', { shouldDirty: true })
                    // setValue('scheduleMinutes', '', { shouldDirty: true })
                    // setValue('scheduleDate', null, { shouldDirty: true })
                    // setValue('scheduleTime', '', { shouldDirty: true })
                    // setValue('customSchedules', [], { shouldDirty: true })
                  }}
                >
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-3 py-3 px-4 flex flex-col border border-[#E5E7EB] rounded-[10px]">
          <div className="flex w-full justify-between">
            <div className="flex text-[#111827] font-semibold text-medium leading-[150%] items-center">
              Reminder Schedule
            </div>
            <Button
              className="text-xs bg-[#F8F9FA] text-[#2563EB] hover:bg-[#2563EB]  hover:text-[#fff] cursor-pointer"
              icon={<Plus />}
              onClick={() => setIsScheduled(true)}
            >
              Add Custom Date
            </Button>
          </div>
          <div className="flex flex-col gap-2 ">
            <CheckboxGroupField
              name="when"
              label=""
              options={safeWhenOptions.filter(
                (label) => !label.toLowerCase().includes('schedule'),
              )}
            />

            {isScheduled ? (
              <>
                <div className="mt-2 border-[1px] border-[#E5E7EB] rounded-[10px]" />
                <ScheduleField
                  name="isScheduled"
                  label={scheduleLabels[selectedType] || 'Schedule reminder'}
                  dayFieldName="scheduleDays"
                  hourFieldName="scheduleHours"
                  minuteFieldName="scheduleMinutes"
                  dateFieldName="scheduleDate"
                  timeFieldName="scheduleTime"
                  onAddCustomSchedule={addCustomSchedule}
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="space-y-3 py-3 px-4 flex flex-col border border-[#E5E7EB] rounded-[10px]">
          <CheckboxGroupField
            className=""
            checkboxDivCss="flex md:flex-row flex-wrap gap-4 "
            checkboxItemCss="p-2 border border-[#E5E7EB] rounded-[10px]"
            name="notifications"
            label="Send via"
            options={sendViaOptions.map((opt) => ({
              label: opt,
              value: opt,
            }))}
            icon={AudioWaveform}
          />
        </div>
        <div className="flex justify-between text-[#BBBBBB]">
          <button
            type="button"
            className="flex gap-1 items-center cursor-pointer"
            // onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            <div className="text-sm font-normal">Back</div>
          </button>
          <Button type="submit" className="cursor-pointer">
            <Save className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Save and Finish
          </Button>
          {/* <button
                    type="button"
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4" strokeWidth={3} />
                    <div className="text-sm font-normal">Back</div>
                  </button>
                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading} className="cursor-pointer">
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" strokeWidth={2.5} />
                      )}
                      {loading
                        ? `${selectedBusiness?.id ? 'Updating...' : 'Saving...'}`
                        : `${selectedBusiness?.id ? 'Update & Finish' : 'Save & Finish'}`}
                    </Button>
          </div> */}
        </div>
      </form>
    </FormProvider>
  )
}

export default RemidersForm
