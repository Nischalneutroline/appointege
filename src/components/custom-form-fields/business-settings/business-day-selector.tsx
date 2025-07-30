'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import React, { useEffect } from 'react'
import SelectField from '../select-field'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

interface Props {
  name: string
  className?: string
  activeDay: WeekDay
  setActiveDay: (day: WeekDay) => void
  label: string
  availableDays?: WeekDay[] // Prop to restrict selectable days
}

const dayOptions = [
  { value: 'Mon', label: 'Monday' },
  { value: 'Tue', label: 'Tuesday' },
  { value: 'Wed', label: 'Wednesday' },
  { value: 'Thu', label: 'Thursday' },
  { value: 'Fri', label: 'Friday' },
  { value: 'Sat', label: 'Saturday' },
  { value: 'Sun', label: 'Sunday' },
]
const days: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getDayRange(
  from?: WeekDay,
  to?: WeekDay,
  availableDays?: WeekDay[],
): WeekDay[] {
  if (!from || !to) return []

  const fromIndex = days.indexOf(from)
  const toIndex = days.indexOf(to)

  let range: WeekDay[] = []
  if (fromIndex <= toIndex) {
    range = days.slice(fromIndex, toIndex + 1)
  } else {
    range = [...days.slice(fromIndex), ...days.slice(0, toIndex + 1)]
  }

  if (availableDays) {
    return range.filter((day) => availableDays.includes(day))
  }
  return range
}

export default function BusinessDaySelector({
  name,
  className,
  activeDay,
  setActiveDay,
  label,
  availableDays = days, // Default to all days if not provided
}: Props) {
  const { setValue, control } = useFormContext()
  const from: WeekDay | undefined = useWatch({ control, name: 'from' })
  const to: WeekDay | undefined = useWatch({ control, name: 'to' })

  useEffect(() => {
    if (
      from &&
      to &&
      availableDays.includes(from) &&
      availableDays.includes(to)
    ) {
      const range = getDayRange(from, to, availableDays)
      setValue(name, range, { shouldDirty: true })
    }
  }, [from, to, name, setValue, availableDays])

  const filteredDayOptions = dayOptions.filter((opt) =>
    availableDays.includes(opt.value as WeekDay),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Label>{label}</Label>
        <div className="flex gap-2 w-full max-w-[400px]">
          <div className="flex items-center">
            <SelectField
              name="from"
              options={filteredDayOptions}
              placeholder="Select"
              className="w-[130px]"
            />
          </div>
          <div className="flex items-center mx-2">
            <span className="text-sm">To</span>
          </div>
          <div className="flex items-center">
            <SelectField
              name="to"
              options={filteredDayOptions}
              placeholder="Select"
              className="w-[130px]"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 w-full">
        {days.map((day) => {
          const isInRange =
            from && to
              ? getDayRange(from, to, availableDays).includes(day)
              : false
          const isAvailable = availableDays.includes(day)

          return (
            <Button
              type="button"
              key={day}
              onClick={() => {
                if (isAvailable && isInRange) {
                  setActiveDay(day)
                }
              }}
              className={cn(
                'w-[72px] px-6',
                isAvailable
                  ? isInRange
                    ? activeDay === day
                      ? 'bg-[#3291FF] text-white border border-[#2563EB]' // Active day
                      : 'bg-white text-blue-600 border border-[#2563EB] cursor-pointer' // In range
                    : 'bg-[#F1F0F0] text-[#A0A0A0] border border-[#DFE0E3] cursor-not-allowed' // Not in range
                  : 'bg-[#F1F0F0] text-[#A0A0A0] opacity-50 cursor-not-allowed', // Not available
              )}
              disabled={!isAvailable || !isInRange}
            >
              {day}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
