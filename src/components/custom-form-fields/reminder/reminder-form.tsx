'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import InputField from '@/components/custom-form-fields/input-field'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import ReminderSelectField from './select-field'
import CheckboxGroupField from './checbox-group-field'
import RadioGroupField from './radio-group-field'
import {
  AudioWaveform,
  BetweenHorizonalStart,
  PenLine,
  Send,
  SlidersHorizontal,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import { RootState } from '@/store/store'
import {
  updateFormData,
  resetFormData,
  ReminderTab,
} from '@/store/slices/reminderSlice'
import ScheduleField from './modified-schedule-field'

// Define reminder types for frontend (align with ReminderTab where applicable)
const reminderTypes = [
  'Upcoming',
  'Follow-up',
  'Cancellation',
  'Missed',
  'Custom',
]

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
const scheduleLabels = {
  Upcoming: 'Schedule reminder',
  'Follow-up': 'Schedule follow-up',
  Missed: 'Schedule follow-up',
  Cancellation: 'Schedule follow-up',
  Custom: 'Schedule Reminder',
}

// Define send via and auto-delete options
const sendViaOptions = ['Email', 'SMS', 'Push Notification']
const autoDeleteOptions = ['7 days', '30 days', 'Never']

// Default messages for each reminder type
const defaultMessages: Record<string, string> = {
  'Follow-up':
    'Thank you for visiting us on {selected_appointment_date} for {selected_service_name}. We value your feedback! Please take a moment to share your experience.',
  Upcoming:
    'You have an appointment scheduled on {selected_appointment_date} at {selected_appointment_time} for {selected_service_name}. Please be on time. If you need to reschedule, visit your dashboard.',
  Missed:
    "It looks like you missed your appointment on {selected_appointment_date}. Please contact us if you'd like to reschedule.",
  Cancellation:
    "Your appointment on {selected_appointment_date} was cancelled. Let us know if you'd like to rebook.",
  Custom: 'Custom reminder for your appointment. Please check your schedule.',
  Default: 'Reminder for your appointment. Please check your schedule.',
}

interface FormData {
  type: string
  subject: string
  description: string
  message: string
  service: string
  when: string[]
  isScheduled: boolean
  customSchedules: { date: string; time: string }[]
  scheduleDays: string
  scheduleHours: string
  scheduleMinutes: string
  scheduleDate: string | null
  scheduleTime: string
  notifications: string[]
  autoDelete: string
}

export default function ReminderForm() {
  const dispatch = useDispatch()
  const { activeTab, formData } = useSelector(
    (state: RootState) => state.reminder,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(true) // State for collapsible preview

  const form = useForm<FormData>({
    defaultValues: {
      ...formData,
      customSchedules: formData.customSchedules || [],
    },
  })

  const { watch, setValue, handleSubmit, reset, getValues } = form
  const selectedType = watch('type') || 'Upcoming'
  const selectedService = watch('service')
  const isScheduled = watch('isScheduled') || false
  const scheduleDays = watch('scheduleDays') || ''
  const scheduleHours = watch('scheduleHours') || ''
  const scheduleMinutes = watch('scheduleMinutes') || ''
  const scheduleDate = watch('scheduleDate')
  const scheduleTime = watch('scheduleTime')
  const customSchedules = watch('customSchedules') || []

  // Update message based on selected type
  useEffect(() => {
    const newMessage =
      defaultMessages[selectedType] || defaultMessages['Default']
    setValue('message', newMessage, { shouldDirty: true })
  }, [selectedType, setValue])

  // Sync form data to Redux in real-time
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        dispatch(updateFormData(getValues()))
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, dispatch, getValues])

  // Sync form data to Redux on submit
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)
    console.log('Form submitted:', data)
    dispatch(updateFormData(data))
    setTimeout(() => {
      setIsSubmitting(false)
      dispatch(resetFormData())
      reset(formData)
    }, 1000)
  }

  // Ensure whenOptions[selectedType] is always an array
  const safeWhenOptions = whenOptions[selectedType] || []

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
      <div className="h-full ">
        <div className="grid grid-cols-12 relative gap-4 h-full">
          {/* Form Fields */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Subject Field */}
            <InputField
              name="subject"
              label="Subject"
              placeholder="Enter subject"
              icon={PenLine}
              className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
            />

            {/* Description Field */}
            <TextAreaField
              name="description"
              label="Description"
              placeholder="Enter description"
              className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
            />

            {/* Reminder Type */}
            <div className="space-y-2">
              <Tabs value={selectedType} className="mt-2">
                <TabsList className="grid gap-1 grid-cols-5">
                  {reminderTypes.map((type) => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      className="text-xs"
                      onClick={() => {
                        setValue('type', type, { shouldDirty: true })
                        setValue('when', [], { shouldDirty: true })
                        setValue('isScheduled', false, { shouldDirty: true })
                        setValue('scheduleDays', '', { shouldDirty: true })
                        setValue('scheduleHours', '', { shouldDirty: true })
                        setValue('scheduleMinutes', '', { shouldDirty: true })
                        setValue('scheduleDate', null, { shouldDirty: true })
                        setValue('scheduleTime', '', { shouldDirty: true })
                        setValue('customSchedules', [], { shouldDirty: true })
                      }}
                    >
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedType === 'Follow-up'
                  ? '📌 Follow up with users after their appointment, requesting feedback or next steps.'
                  : selectedType === 'Missed'
                    ? '📌 Reminder sent for missed appointments.'
                    : selectedType === 'Cancellation'
                      ? '📌 Notify users about cancelled appointments.'
                      : selectedType === 'Custom'
                        ? '📌 Create a custom reminder with flexible scheduling.'
                        : '📌 Notify users about their upcoming appointments.'}
              </p>
            </div>

            {/* Appointment Selection (Placeholder for serviceOptions) */}
            <ReminderSelectField
              name="service"
              label="Choose Service"
              options={[
                { value: '1', label: 'Service 1' },
                { value: '2', label: 'Service 2' },
              ]}
              placeholder="Select service to set reminder"
              icon={SlidersHorizontal}
            />

            {/* When to Send */}
            <div className="">
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <Label className="text-xl font-semibold">
                    Reminder Schedule
                  </Label>
                </div>
                <Button
                  type="button"
                  onClick={() =>
                    setValue('isScheduled', !isScheduled, { shouldDirty: true })
                  }
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] text-sm px-2"
                >
                  {isScheduled ? 'Disable Schedule' : 'Schedule Reminder'}
                </Button>
              </div>
              {safeWhenOptions.length > 0 && (
                <CheckboxGroupField
                  name="when"
                  label=""
                  options={safeWhenOptions.filter(
                    (label) => !label.toLowerCase().includes('schedule'),
                  )}
                />
              )}
              {isScheduled && (
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
              )}
              {customSchedules.length > 0 && (
                <div className="mt-2">
                  {customSchedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-300 py-1"
                    >
                      <span>
                        {schedule.date} at {schedule.time}
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeCustomSchedule(index)}
                        className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] text-sm px-2 text-red-500"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Send Via */}
            <CheckboxGroupField
              name="notifications"
              label="Send via"
              options={sendViaOptions.map((opt) => ({
                label: opt,
                value: opt,
              }))}
              icon={AudioWaveform}
            />

            {/* Auto Delete */}
            <RadioGroupField
              name="autoDelete"
              label="Auto-delete expired reminder after?"
              options={autoDeleteOptions}
              icon={Trash2}
            />

            {/* Message */}
            <TextAreaField
              name="message"
              label="Message"
              placeholder="Enter message"
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? 'Submitting...'
                : activeTab === ReminderTab.REMINDER
                  ? 'Create Reminder'
                  : 'Create Announcement'}
            </Button>
          </div>
          {/* Live Preview */}
          <div className="col-span-12 h-fit sticky top-0 lg:col-span-3 bg-white shadow border rounded-md p-4 overflow-y-auto">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            >
              <h3 className="text-base font-semibold">Live Preview</h3>
              <ChevronDown
                className={`size-5 transition-transform duration-200 ${isPreviewOpen ? 'rotate-180' : ''}`}
              />
            </div>
            {isPreviewOpen && (
              <div className="space-y-4 mt-4">
                <div className="space-y-1">
                  <h4 className="font-medium text-stone-600 text-sm">
                    Subject Preview
                  </h4>
                  <p className="break-words text-stone-600 border text-xs p-3 border-blue-200 rounded-[4px]">
                    {formData.subject || 'No subject entered'}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-stone-600 text-sm">
                    Message Preview
                  </h4>
                  <p className="break-words text-stone-600 text-xs whitespace-pre-wrap border p-3 border-blue-200 rounded-[4px]">
                    {formData.message || 'No message entered'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
