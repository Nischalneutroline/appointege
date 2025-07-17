// Fix for BusinessHours.tsx - Ensures stored values appear in inputs when editing

'use client'

import {
  useFormContext,
  useFieldArray,
  Controller,
  useWatch,
} from 'react-hook-form'
import { Plus, Minus, AlarmClock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TimeSlot {
  open: string
  close: string
}

interface FieldTimeSlot extends TimeSlot {
  id: string
}

interface BusinessHoursProps {
  name: string
  label?: string
  className?: string
  isEditMode?: boolean
  openLabel: string
  endLabel: string
  isDefaultMode: boolean
  businessHours?: Record<string, TimeSlot[]>
  onCustomModeActivate?: () => void
  manuallySelectedDay: string | null
}

const BusinessHours = ({
  name,
  label,
  className = '',
  isEditMode = false,
  openLabel,
  endLabel,
  isDefaultMode,
  onCustomModeActivate,
  manuallySelectedDay,
  businessHours,
}: BusinessHoursProps) => {
  const form = useFormContext()
  const { control, setValue } = form
  const baseKey = name.split('.')[0] // businessHours or breakHours

  const fieldArrayName = isDefaultMode
    ? `${baseKey}.default`
    : `${baseKey}.${manuallySelectedDay}`

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: fieldArrayName,
    keyName: 'id', // react-hook-form default
  })

  const [applyToAll, setApplyToAll] = useState(false)
  const currentDay = name.split('.').pop()?.toLowerCase() || ''

  const watchedData = useWatch({ name: baseKey, control })

  const currentDaySlots: TimeSlot[] = manuallySelectedDay
    ? watchedData?.[manuallySelectedDay] || []
    : watchedData?.[currentDay] || []

  const allDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  const generateTimeSlots = () => {
    const times = []
    for (let hour = 6; hour < 24; hour++) {
      for (let minute of ['00', '15', '30', '45']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`
        const period = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 || 12
        times.push({
          value: time,
          label: `${displayHour}:${minute} ${period}`,
        })
      }
    }
    return times
  }

  const timeSlots = generateTimeSlots()
  const isBusinessHourField = baseKey === 'businessHours'

  const breakData = form.getValues('breakHours')

  const getMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Helper: check if a time is in range
  const isTimeInRange = (time: string, start: string, end: string) => {
    const t = getMinutes(time)
    return t > getMinutes(start) && t < getMinutes(end)
  }

  const handleApplyToAll = (value: boolean) => {
    setApplyToAll(value)
    if (value && fields.length > 0 && currentDay && currentDay !== 'default') {
      const slots = JSON.parse(JSON.stringify(fields))
      allDays.forEach((day) => {
        if (day !== currentDay) {
          setValue(`${baseKey}.${day}`, slots)
        }
      })
    }
  }

  const usedTimes = currentDaySlots.map((slot) => slot.open)

  const handleAddTimeSlot = () => {
    const lastSlot = fields[fields.length - 1] as FieldTimeSlot | undefined
    const defaultOpen = lastSlot?.close || '09:00'
    const nextHour = (parseInt(defaultOpen.split(':')[0]) + 1) % 24
    const defaultClose = `${nextHour.toString().padStart(2, '0')}:00`

    if (isDefaultMode && manuallySelectedDay) {
      onCustomModeActivate?.()

      const cloned = fields.map(({ open, close }) => ({ open, close }))
      const updated = [...cloned, { open: defaultOpen, close: defaultClose }]
      setValue(`${baseKey}.${manuallySelectedDay}`, updated)

      // Re-initialize field array state
      replace(updated)
      return
    }

    append({ open: defaultOpen, close: defaultClose })
  }

  useEffect(() => {
    if (manuallySelectedDay) {
      const existingSlots = watchedData?.[manuallySelectedDay] ?? []

      if (existingSlots.length > 0) {
        const updated = existingSlots.map((slot: any) => ({
          id: Math.random().toString(),
          ...slot,
        }))
        setValue(`${baseKey}.${manuallySelectedDay}`, updated, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        })
        replace(updated)
      }
    }

    if (watchedData?.default?.length > 0) {
      const updated = watchedData.default.map((slot: any) => ({
        id: Math.random().toString(),
        ...slot,
      }))
      setValue(`${baseKey}.default`, updated, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      })
      replace(updated)
    }
  }, [manuallySelectedDay, isDefaultMode])

  const handleRemoveTimeSlot = (index: number) => {
    if (isDefaultMode && manuallySelectedDay) {
      onCustomModeActivate?.()

      const cloned = fields.map(({ open, close }) => ({ open, close }))
      if (cloned.length > 1) {
        cloned.splice(index, 1)
        setValue(`${baseKey}.${manuallySelectedDay}`, cloned)

        // Re-initialize field array state
        replace(cloned)
      }
      return
    }

    if (fields.length > 1) remove(index)
  }
  const selectedDay = manuallySelectedDay || currentDay

  const selectedBusinessSlots: TimeSlot[] = businessHours?.[selectedDay] || []
  const selectedBreakSlots: TimeSlot[] = breakData?.[selectedDay] || []

  const isServiceHourField = baseKey === 'serviceHours'

  let allowedTimes: string[] = []

  if (isServiceHourField) {
    // Only allow times within business hours
    allowedTimes = timeSlots
      .map((t) => t.value)
      .filter((time) =>
        selectedBusinessSlots.some(
          (slot) =>
            isTimeInRange(time, slot.open, slot.close) || time === slot.open,
        ),
      )
  }

  // Remove break time slots from allowed times
  let finalTimeSlots = timeSlots
  if (isServiceHourField) {
    finalTimeSlots = timeSlots.filter((t) => {
      const inAllowed = allowedTimes.includes(t.value)
      const inBreak = selectedBreakSlots.some(
        (slot) =>
          isTimeInRange(t.value, slot.open, slot.close) ||
          t.value === slot.open,
      )
      return inAllowed && !inBreak
    })
  }

  // For disabling items in SelectItem
  const disabledTimes = isServiceHourField
    ? timeSlots
        .map((t) => t.value)
        .filter((time) => !finalTimeSlots.map((t) => t.value).includes(time))
    : isBusinessHourField
      ? allDays.flatMap((day) => {
          if (manuallySelectedDay && day !== manuallySelectedDay) return []

          const breaks: TimeSlot[] = breakData?.[day] || []

          return breaks.flatMap((slot) => {
            return timeSlots
              .map((t) => t.value)
              .filter(
                (time) =>
                  isTimeInRange(time, slot.open, slot.close) ||
                  time === slot.open,
              )
          })
        })
      : []

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm',
              applyToAll ? 'text-[#111827]' : 'text-[#B5B4B4]',
            )}
          >
            Apply to all
          </span>
          <Switch
            checked={applyToAll}
            onCheckedChange={handleApplyToAll}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col md:flex-row gap-4 items-center"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal flex gap-2 items-center">
                {openLabel} <AlarmClock className="w-4 h-4 text-[#6AA9FF]" />
              </span>
              <Controller
                name={`${name}.${index}.open`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={(val) => {
                      onChange(val)
                      if (isDefaultMode && manuallySelectedDay) {
                        onCustomModeActivate?.()

                        const cloned = fields.map(({ open, close }) => ({
                          open,
                          close,
                        }))
                        setValue(`${baseKey}.${manuallySelectedDay}`, cloned)
                        replace(cloned)
                      }
                    }}
                  >
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Open Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {finalTimeSlots.map((time) => (
                        <SelectItem
                          key={time.value}
                          value={time.value}
                          disabled={disabledTimes.includes(time.value)}
                        >
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-normal flex gap-2 items-center">
                {endLabel} <AlarmClock className="w-4 h-4 text-[#6AA9FF]" />
              </span>
              <Controller
                name={`${name}.${index}.close`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={(val) => {
                      onChange(val)
                      if (isDefaultMode && manuallySelectedDay) {
                        onCustomModeActivate?.()

                        const cloned = fields.map(({ open, close }) => ({
                          open,
                          close,
                        }))
                        setValue(`${baseKey}.${manuallySelectedDay}`, cloned)
                        replace(cloned)
                      }
                    }}
                  >
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Close Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {finalTimeSlots.map((time) => (
                        <SelectItem
                          key={time.value}
                          value={time.value}
                          disabled={disabledTimes.includes(time.value)}
                        >
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex gap-2 pt-6">
              {index === 0 && !isDefaultMode && (
                <button
                  type="button"
                  onClick={handleAddTimeSlot}
                  className="rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                >
                  <Plus className="h-3 w-3" strokeWidth={2.5} />
                </button>
              )}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTimeSlot(index)}
                  className="rounded-full border border-red-600 text-red-600 hover:bg-red-50 transition"
                >
                  <Minus className="h-3 w-3" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BusinessHours
