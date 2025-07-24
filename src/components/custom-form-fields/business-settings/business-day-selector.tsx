'use client'

import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import React, { useEffect } from 'react'
import SelectField from '../select-field'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>
  holidays: WeekDay[]
}

interface Props {
  name: string // this is the name of the field storing selected days (e.g., 'businessDays')
  className?: string
  activeDay: WeekDay
  setActiveDay: (day: WeekDay) => void
  currentMode: 'default' | 'custom'
  setCurrentMode: (mode: 'default' | 'custom') => void
  label: string
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

function getDayRange(from?: WeekDay, to?: WeekDay): WeekDay[] {
  const fromIndex = days.indexOf(from as WeekDay)
  const toIndex = days.indexOf(to as WeekDay)

  if (fromIndex === -1 || toIndex === -1) return []

  if (fromIndex <= toIndex) {
    return days.slice(fromIndex, toIndex + 1)
  } else {
    return [...days.slice(fromIndex), ...days.slice(0, toIndex + 1)]
  }
}

export default function BusinessDaySelector({
  name,
  className,
  activeDay,
  setActiveDay,
  currentMode,
  setCurrentMode,
  label,
}: Props) {
  const { watch, setValue, control } = useFormContext()
  const selectedDays: WeekDay[] = watch(name) || []
  const from: WeekDay | undefined = useWatch({ control, name: 'from' })
  const to: WeekDay | undefined = useWatch({ control, name: 'to' })
  useEffect(() => {
    if (selectedDays.length > 0 && (!from || !to)) {
      const sortedDays = days.filter((d) => selectedDays.includes(d))
      if (sortedDays.length > 0) {
        setValue('from', sortedDays[0], { shouldDirty: false })
        setValue('to', sortedDays[sortedDays.length - 1], {
          shouldDirty: false,
        })
      }
    }
  }, [selectedDays, from, to, setValue])

  const toggleDay = (day: WeekDay) => {
    let updatedDays: WeekDay[] = []
    if (selectedDays.includes(day)) {
      updatedDays = selectedDays.filter((d) => d !== day)
    } else {
      updatedDays = [...selectedDays, day]
    }
    const sorted = days.filter((d) => updatedDays.includes(d))
    setValue(name, updatedDays, { shouldDirty: true })
    if (sorted.length > 0) {
      setValue('from', sorted[0], { shouldDirty: true })
      setValue('to', sorted[sorted.length - 1], { shouldDirty: true })
    } else {
      setValue('from', undefined)
      setValue('to', undefined)
    }
    // setCurrentMode('custom')
  }

  // Auto-update day range whenever `from` or `to` changes
  useEffect(() => {
    if (from && to) {
      const range = getDayRange(from, to)
      setValue(name, range, { shouldDirty: true })
      //   setCurrentMode('custom')
    }
  }, [from, to, name, setValue])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Label>{label}</Label>
        <div className="flex gap-2 w-full max-w-[400px]">
          <div className="flex items-center">
            <SelectField
              name="from"
              options={dayOptions}
              placeholder="Select"
              className="w-[130px]"
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm">To</span>
          </div>
          <div className="flex items-center">
            <SelectField
              name="to"
              options={dayOptions}
              placeholder="Select"
              className="w-[130px]"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 w-full">
        {days.map((day) => {
          const isInRange =
            from && to ? getDayRange(from, to).includes(day) : false
          return (
            <Button
              type="button"
              key={day}
              aria-disabled={!isInRange}
              onClick={() => {
                if (isInRange) {
                  if (selectedDays.includes(day)) {
                    setActiveDay(day) // Set active day if it's already selected
                  } else {
                    toggleDay(day) // Otherwise toggle selection
                  }
                }
              }}
              className={cn(
                'w-[72px] px-6 ',
                selectedDays.includes(day) &&
                  'bg-white text-blue-600 border border-[#2563EB]  cursor-pointer',
                !isInRange &&
                  'bg-[#F1F0F0] text-[#A0A0A0] border border-[#DFE0E3] cursor-not-allowed',
                activeDay === day &&
                  'bg-[#3291FF] text-white border border-[#2563EB]  cursor-pointer',
              )}
            >
              {day}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
