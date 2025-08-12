'use client'
// ScheduleField Component - Handles scheduling of reminders with two modes:
// 1. Relative timing (days/hours/minutes before/after)
// 2. Absolute timing (specific date and time)
// Automatically switches modes based on reminder type

import { useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { CalendarIcon, ClockIcon, Minus, Plus } from 'lucide-react'
import SelectField from './select-field'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

// Props for the ScheduleField component
interface ScheduleFieldProps {
  name: string
  label: string
  dayFieldName?: string
  hourFieldName?: string
  minuteFieldName?: string
  dateFieldName?: string
  onAddCustomSchedule?: () => void
  timeFieldName?: string
}

export const dayOptions = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1} day${i + 1 > 1 ? 's' : ''}`,
  value: (i + 1).toString(),
}))
export const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${i + 1} hour${i + 1 > 1 ? 's' : ''}`,
  value: (i + 1).toString(),
}))
export const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  label: `${i + 1} minute${i + 1 > 1 ? 's' : ''}`,
  value: (i + 1).toString(),
}))

// Main component that renders the schedule field with conditional logic based on reminder type
const ScheduleField = ({
  name,
  label,
  dayFieldName,
  hourFieldName,
  minuteFieldName,
  dateFieldName = 'scheduleDate',
  timeFieldName = 'scheduleTime',
}: ScheduleFieldProps) => {
  const { watch, setValue, register, getValues } = useFormContext()
  const reminderType = watch('type') || 'Upcoming'
  const scheduleDays = watch(dayFieldName || '') || ''
  const scheduleHours = watch(hourFieldName || '') || ''
  const scheduleMinutes = watch(minuteFieldName || '') || ''
  const scheduleDate = watch(dateFieldName) || null
  const scheduleTime = watch(timeFieldName) || ''
  const isScheduled = watch(name) ?? false
  const [open, setOpen] = useState(false)
  const [schedules, setSchedules] = useState<
    Array<{ id: string; label: string }>
  >([])

  // Load existing schedules from form values on mount
  useEffect(() => {
    const existingSchedules = watch('schedules') || []
    if (existingSchedules.length > 0) {
      setSchedules(existingSchedules)
    }
  }, [])

  // Debug logging for development
  console.log(
    'ScheduleField: reminderType =',
    reminderType,
    typeof reminderType,
  )
  console.log('ScheduleField: isScheduled =', isScheduled, typeof isScheduled)
  console.log('ScheduleField: Watched values =', {
    scheduleDays,
    scheduleHours,
    scheduleMinutes,
    scheduleDate,
    scheduleTime,
  })

  // List of valid reminder types for validation
  const validReminderTypes = [
    'Upcoming',
    'Follow-up',
    'Cancellation',
    'Missed',
    'Custom',
  ]
  const isValidReminderType =
    typeof reminderType === 'string' &&
    validReminderTypes.includes(reminderType)
  if (!isValidReminderType) {
    console.warn(
      `Invalid reminderType: ${reminderType}. Defaulting to "Upcoming".`,
    )
  }
  const effectiveReminderType = isValidReminderType ? reminderType : 'Upcoming'

  // Set timing direction based on reminder type
  const timing =
    effectiveReminderType === 'Upcoming' || effectiveReminderType === 'Custom'
      ? 'before'
      : 'after'

  // Add a new schedule based on current selection
  const addSchedule = () => {
    const newSchedule = {
      id: Date.now().toString(),
      label: scheduleText(),
    }

    const updatedSchedules = [...schedules, newSchedule]
    setSchedules(updatedSchedules)
    setValue('schedules', updatedSchedules, { shouldDirty: true })

    // Reset fields after adding
    if (effectiveReminderType === 'Custom') {
      setValue(dateFieldName, null, { shouldDirty: true })
      setValue(timeFieldName, '', { shouldDirty: true })
    } else {
      setValue(dayFieldName || '', '', { shouldDirty: true })
      setValue(hourFieldName || '', '', { shouldDirty: true })
      setValue(minuteFieldName || '', '', { shouldDirty: true })
    }
  }

  // Remove a schedule by id
  const removeSchedule = (id: string) => {
    const updatedSchedules = schedules.filter((s) => s.id !== id)
    setSchedules(updatedSchedules)
    setValue('schedules', updatedSchedules, { shouldDirty: true })
  }

  // Toggle schedule on/off and reset fields when toggling off
  const toggleCheckbox = () => {
    const newValue = !isScheduled
    setValue(name, newValue, { shouldDirty: true })
    if (!newValue) {
      // Clear all schedules when toggling off
      setSchedules([])
      setValue('schedules', [], { shouldDirty: true })

      // Clear input fields
      if (effectiveReminderType === 'Custom') {
        setValue(dateFieldName, null, { shouldDirty: true })
        setValue(timeFieldName, '', { shouldDirty: true })
      } else {
        setValue(dayFieldName || '', '', { shouldDirty: true })
        setValue(hourFieldName || '', '', { shouldDirty: true })
        setValue(minuteFieldName || '', '', { shouldDirty: true })
      }
    }
  }

  // Format the display text based on selected schedule values
  const scheduleText = () => {
    if (effectiveReminderType === 'Custom' && scheduleDate && scheduleTime) {
      const formattedDate = format(new Date(scheduleDate), 'PPP')
      return `${formattedDate} at ${scheduleTime}`
    }

    const parts: string[] = []
    const days = watch(dayFieldName || '') || ''
    const hours = watch(hourFieldName || '') || ''
    const minutes = watch(minuteFieldName || '') || ''

    if (days) parts.push(`${days} day${Number(days) > 1 ? 's' : ''}`)
    if (hours) parts.push(`${hours} hour${Number(hours) > 1 ? 's' : ''}`)
    if (minutes)
      parts.push(`${minutes} minute${Number(minutes) > 1 ? 's' : ''}`)

    return parts.length > 0 ? `${parts.join(', ')} ${timing} appointment` : ''
  }

  // Main render method
  return (
    <FormItem className="mt-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FormControl>
            <Checkbox
              id={label}
              checked={isScheduled}
              onCheckedChange={toggleCheckbox}
            />
          </FormControl>
          <FormLabel htmlFor={label}>{label}</FormLabel>
        </div>
        {/* Display added schedules as checkboxes */}
        {schedules.length > 0 && (
          <div className=" space-y-1">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center gap-2 ">
                <Checkbox checked={true} disabled />
                <span className="text-sm">{schedule.label}</span>
                <div
                  className=" border border-red-400  rounded-full text-destructive hover:text-destructive"
                  onClick={() => removeSchedule(schedule.id)}
                >
                  <Minus className="h-3 w-3" strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        )}
        {isScheduled && (
          <div className="flex flex-col gap-4">
            {effectiveReminderType === 'Custom' ? (
              <div className="flex flex-wrap gap-4 items-center">
                {/* Date Picker */}
                <div className="flex flex-col gap-2">
                  <FormLabel>Date</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[240px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? (
                          format(new Date(scheduleDate), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          scheduleDate ? new Date(scheduleDate) : undefined
                        }
                        onSelect={(date) => {
                          setValue(dateFieldName, date?.toISOString())
                          setOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Time Picker */}
                <div className="flex flex-col gap-2">
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...register(timeFieldName)}
                      className="w-[150px]"
                      placeholder="Select time"
                    />
                  </FormControl>
                </div>
                <div
                  onClick={addSchedule}
                  className="mt-6 p-0.5 border border-blue-600  rounded-full text-blue-600 hover:text-blue-600 "
                >
                  <Plus className="h-3 w-3" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SelectField
                  name={dayFieldName as string}
                  label="Days"
                  placeholder="Select Days"
                  icon={CalendarIcon}
                  options={dayOptions}
                />
                <SelectField
                  name={hourFieldName as string}
                  label="Hours"
                  className="w-[125px] h-[32px]"
                  placeholder="Select Hours"
                  icon={ClockIcon}
                  options={hourOptions}
                />
                <SelectField
                  name={minuteFieldName as string}
                  label="Minutes"
                  className="w-[139px] h-[32px]"
                  placeholder="Select Minutes"
                  icon={ClockIcon}
                  options={minuteOptions}
                />
                <div
                  onClick={addSchedule}
                  className="mt-6 border border-blue-600  rounded-full text-blue-600 hover:text-blue-600 "
                >
                  <Plus className="h-3 w-3" strokeWidth={3} />
                </div>
              </div>
            )}

            {/* Show preview of current selection */}
            {(effectiveReminderType === 'Custom'
              ? scheduleDate && scheduleTime
              : scheduleDays || scheduleHours || scheduleMinutes) && (
              <p className="text-sm text-muted-foreground">
                Current selection: {scheduleText()}
              </p>
            )}
          </div>
        )}
      </div>
    </FormItem>
  )
}

export default ScheduleField
