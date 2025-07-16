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
  manuallySelectedDay,
}: BusinessHoursProps) => {
  const form = useFormContext()
  const { control, setValue } = form
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name, // this now reflects 'businessHours.monday', 'businessHours.tuesday' etc.
  })

  const [applyToAll, setApplyToAll] = useState(false)
  const currentDay = name.split('.').pop()?.toLowerCase() || ''
  const baseKey = name.split('.')[0] // businessHours or breakHours

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

  // Compute times to disable based on break slots
  const disabledTimes = isBusinessHourField
    ? allDays.flatMap((day) => {
        if (manuallySelectedDay && day !== manuallySelectedDay) return []

        const breaks: TimeSlot[] = breakData?.[day] || []

        return breaks.flatMap((slot) => {
          const disabled: string[] = []
          for (const time of timeSlots.map((t) => t.value)) {
            if (
              isTimeInRange(time, slot.open, slot.close) ||
              time === slot.open // Also disable the exact break start time
            ) {
              disabled.push(time)
            }
          }
          return disabled
        })
      })
    : []

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
    append({ open: defaultOpen, close: defaultClose })
  }

  const handleRemoveTimeSlot = (index: number) => {
    if (fields.length > 1) remove(index)
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
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Open Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
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
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Close Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
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
                <Button
                  type="button"
                  onClick={handleAddTimeSlot}
                  variant="outline"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              )}
              {index > 0 && (
                <Button
                  type="button"
                  onClick={() => handleRemoveTimeSlot(index)}
                  variant="destructive"
                >
                  <Minus className="h-3 w-3 mr-1" /> Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BusinessHours
