'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DaySelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  days: Array<{ value: string; label: string }>
  placeholder?: string
  className?: string
}

export const DaySelector = React.memo(
  ({
    value,
    onChange,
    disabled = false,
    days,
    placeholder = 'Select Day',
    className = 'w-44',
  }: DaySelectorProps) => {
    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {days.map((day) => (
            <SelectItem key={day.value} value={day.value}>
              {day.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)

DaySelector.displayName = 'DaySelector'
