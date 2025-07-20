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
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TimeSlot {
  open: string
  close: string
}

interface TimeSlotItem {
  value: string
  label: string
}

interface FieldTimeSlot extends TimeSlot {
  id: string
}

interface ServiceHoursProps {
  name: string
  label?: string
  className?: string
  isEditMode?: boolean
  openLabel: string
  endLabel: string
  isDefaultMode: boolean
  serviceHours?: Record<string, TimeSlot[]>
  businessHours?: Record<string, TimeSlot[]> // needed to limit times by business hours
  breakHours?: Record<string, TimeSlot[]> // needed to exclude breaks
  onCustomModeActivate?: () => void
  manuallySelectedDay: string | null
}

const ServiceHours = ({
  name,
  label,
  className = '',
  isEditMode = false,
  openLabel,
  endLabel,
  isDefaultMode,
  serviceHours,
  businessHours,
  breakHours,
  onCustomModeActivate,
  manuallySelectedDay,
}: ServiceHoursProps) => {
  const form = useFormContext()
  const { control, setValue } = form
  const watchedValues = useWatch({
    control,
    name: name, // e.g., 'serviceHours.monday'
    defaultValue: [],
  })
  const baseKey = name.split('.')[0] // serviceHours or breakHours

  const fieldArrayName = isDefaultMode
    ? `${baseKey}.default`
    : `${baseKey}.${manuallySelectedDay}`
  const currentOpenTime = useWatch({
    control,
    name: `${baseKey}.${manuallySelectedDay}.open`,
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: fieldArrayName,
    keyName: 'id', // react-hook-form default
  })

  const [applyToAll, setApplyToAll] = useState(false)
  const currentDay = name.split('.').pop()?.toLowerCase() || ''
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
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

  const generateTimeSlots = (): TimeSlotItem[] => {
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

  const timeSlots: TimeSlotItem[] = generateTimeSlots()

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
    setHasUserInteracted(true)
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

  // Business hours and breakHours control time slot availability for serviceHours
  const selectedBusinessSlots: TimeSlot[] =
    businessHours?.[manuallySelectedDay || currentDay] || []
  const selectedBreakSlots: TimeSlot[] =
    breakHours?.[manuallySelectedDay || currentDay] || []
  // Filter time slots that fall within business hours
  const businessFilteredSlots = timeSlots.filter((t) =>
    selectedBusinessSlots.some(
      (slot) =>
        isTimeInRange(t.value, slot.open, slot.close) ||
        t.value === slot.open ||
        t.value === slot.close,
    ),
  )

  // Further filter to remove slots that fall within break hours
  const finalTimeSlots = businessFilteredSlots.filter(
    (t) =>
      !selectedBreakSlots.some(
        (slot) =>
          isTimeInRange(t.value, slot.open, slot.close) ||
          t.value === slot.open ||
          t.value === slot.close,
      ),
  )
  console.log(finalTimeSlots, 'finalTimeSlots')

  const disabledTimes = timeSlots
    .map((t) => t.value)
    .filter((time) => !finalTimeSlots.map((t) => t.value).includes(time))

  useEffect(() => {
    if (!businessHours || hasUserInteracted) return

    const dayKey = manuallySelectedDay || currentDay
    const existingSlots = watchedData?.[dayKey] || []
    const businessSlots = businessHours[dayKey] || []

    // ⚠️ Only override if there’s no existing data
    if (existingSlots.length > 0) return

    if (businessSlots.length > 0) {
      const convertedSlots = businessSlots.map((slot) => ({
        id: Math.random().toString(),
        ...slot,
      }))

      setValue(fieldArrayName, convertedSlots, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      })
      replace(convertedSlots)
    } else {
      replace([])
    }
  }, [businessHours, manuallySelectedDay, isDefaultMode, hasUserInteracted])

  const handleAddTimeSlot = () => {
    setHasUserInteracted(true)
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

  const handleRemoveTimeSlot = (index: number) => {
    setHasUserInteracted(true)
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

  const getDisabledCloseTimes = (openTime?: string): string[] => {
    if (!openTime) return []

    const openMinutes = getMinutes(openTime)
    const selectedDay = manuallySelectedDay || currentDay

    const businessSlotsForDay: TimeSlot[] = businessHours?.[selectedDay] || []
    const breakSlotsForDay: TimeSlot[] = breakHours?.[selectedDay] || []

    // Find the max allowed close time from business hours for the openTime
    // It must be after openTime and within the same business slot
    // For simplicity, get the max close time from business hours slots where openTime fits
    let maxCloseMinutes = 24 * 60 // default max (end of day)

    for (const slot of businessSlotsForDay) {
      const slotOpenMinutes = getMinutes(slot.open)
      const slotCloseMinutes = getMinutes(slot.close)
      if (openMinutes >= slotOpenMinutes && openMinutes < slotCloseMinutes) {
        maxCloseMinutes = slotCloseMinutes
        break
      }
    }

    return timeSlots
      .map((t) => t.value)
      .filter((time) => {
        const timeMinutes = getMinutes(time)

        // Disable if time is before or equal to open time
        if (timeMinutes <= openMinutes) return true

        // Disable if time is outside business hours for close time (after maxCloseMinutes)
        if (timeMinutes > maxCloseMinutes) return true

        // Disable if time falls into any break slot
        for (const breakSlot of breakSlotsForDay) {
          const breakStart = getMinutes(breakSlot.open)
          const breakEnd = getMinutes(breakSlot.close)

          if (timeMinutes > breakStart && timeMinutes <= breakEnd) {
            return true
          }
        }

        return false
      })
  }

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
        {fields.map((field, index) => {
          const openTimeForIndex = useWatch({
            control,
            name: `${name}.${index}.open`,
            defaultValue: fields[index]?.open || '',
          })

          return (
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
                        setHasUserInteracted(true)
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
                        {timeSlots.map((time) => (
                          <SelectItem
                            key={time.value}
                            value={time.value}
                            disabled={disabledTimes.includes(time.value)}
                            className={cn(
                              disabledTimes.includes(time.value)
                                ? 'text-muted-foreground cursor-not-allowed opacity-60'
                                : '',
                            )}
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
                        setHasUserInteracted(true)
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
                        {timeSlots.map((time) => {
                          const disabledCloseTimes =
                            getDisabledCloseTimes(openTimeForIndex)

                          return (
                            <SelectItem
                              key={time.value}
                              value={time.value}
                              disabled={disabledCloseTimes.includes(time.value)}
                              className={cn(
                                disabledCloseTimes.includes(time.value)
                                  ? 'text-muted-foreground cursor-not-allowed opacity-60'
                                  : '',
                              )}
                            >
                              {time.label}
                            </SelectItem>
                          )
                        })}
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
          )
        })}
      </div>
    </div>
  )
}

export default ServiceHours
