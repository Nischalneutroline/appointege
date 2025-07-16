'use client'

// import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Controller,
  useFieldArray,
  useWatch,
  useFormContext,
  Control,
  FieldValues,
} from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Constants
const DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const

// Types
type DayValue = (typeof DAYS)[number]['value']

interface DayRange {
  from: DayValue
  to: DayValue
}

interface BusinessHoursFormValues extends FieldValues {
  timezone: string
  businessDays: DayRange[]
}

interface BusinessDaysSelectorProps {
  name: string
  label: string
  control?: Control<BusinessHoursFormValues>
  defaultValue?: DayValue[]
  isDefaultMode: boolean
  selectedDays: string[]
  setSelectedDays: (days: string[] | ((prev: string[]) => string[])) => void
  manuallySelectedDays?: string | null
  setManuallySelectedDays?: React.Dispatch<React.SetStateAction<string | null>>
}

/**
 * BusinessDaysSelector Component
 *
 * A component that allows users to select business days and time ranges.
 * Supports multiple day ranges and individual day selection.
 */
const BusinessDaysSelector = ({
  name,
  label,
  control: controlProp,
  defaultValue = [],
  isDefaultMode,
  selectedDays,
  setSelectedDays,
  manuallySelectedDays,
  setManuallySelectedDays,
}: BusinessDaysSelectorProps) => {
  // Get form context or use provided control
  let formMethods
  try {
    formMethods = useFormContext<BusinessHoursFormValues>()
  } catch (e) {
    if (!controlProp) {
      throw new Error(
        'BusinessDaysSelector must be used within a FormProvider or passed a control prop',
      )
    }
  }

  const control = controlProp || formMethods!.control
  const setValue = formMethods?.setValue ?? (() => {})

  // Initialize field array for day ranges
  const { fields, append, remove } = useFieldArray({ control, name })
  const selectedRanges = useWatch({ control, name }) || []

  // Set default values on initial render
  const initialized = useRef(false)

  useEffect(() => {
    if (
      defaultValue.length > 0 &&
      fields.length === 0 &&
      !initialized.current
    ) {
      defaultValue.forEach((range) => append(range))
      initialized.current = true
    }
  }, [defaultValue, fields.length, append])

  // Update selected days when ranges change
  useEffect(() => {
    const days = new Set<DayValue>()

    selectedRanges.forEach((range: DayRange) => {
      // Ensure we have at least a 'from' value
      if (!range?.from) return

      // If 'to' is not provided, use 'from' as 'to' to make it a single day range
      const from = range.from
      const to = range.to || from

      const fromIndex = DAYS.findIndex((d) => d.value === from)
      const toIndex = DAYS.findIndex((d) => d.value === to)

      // Only process if both indices are valid
      if (fromIndex >= 0 && toIndex >= 0) {
        const start = Math.min(fromIndex, toIndex)
        const end = Math.max(fromIndex, toIndex)

        for (let i = start; i <= end; i++) {
          days.add(DAYS[i].value)
        }
      } else if (fromIndex >= 0) {
        // If only 'from' is valid, add just that day
        days.add(from)
      }
    })

    setSelectedDays(Array.from(days))
  }, [selectedRanges, setSelectedDays])

  // Get today's day name
  const today = (() => {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ]
    return days[new Date().getDay()]
  })()

  /**
   * Add a new day range
   */
  const handleAddRange = () => {
    const last = selectedRanges[selectedRanges.length - 1]?.to || 'monday'
    const lastIndex = DAYS.findIndex((d) => d.value === last)
    const nextDay =
      DAYS[Math.min(lastIndex + 1, DAYS.length - 1)]?.value || 'monday'
    // Always ensure both from and to are set, even for single days
    append({ from: nextDay, to: nextDay })
  }

  /**
   * Renders a day select dropdown
   */
  const renderSelect = (
    rangeIndex: number,
    fieldType: 'from' | 'to',
    disableToBeforeFrom = false,
  ) => {
    // Get the current range values
    const currentRange = selectedRanges[rangeIndex] || { from: '', to: '' }
    const { from, to } = currentRange

    // If this is a 'to' field and it's empty, use the 'from' value
    const displayValue =
      fieldType === 'to' && !to && from ? from : currentRange[fieldType]

    return (
      <Controller
        name={`${name}.${rangeIndex}.${fieldType}`}
        control={control}
        defaultValue={displayValue || 'monday'}
        render={({ field: { onChange, value, ref } }) => {
          // Ensure value is never empty
          const selectValue = value || displayValue || 'monday'

          return (
            <Select
              value={selectValue}
              onValueChange={useCallback(
                (newVal: string) => {
                  // Only proceed if the value actually changes
                  if (newVal !== value) {
                    onChange(newVal)
                    // If this is a 'from' field and we need to validate 'to' field
                    if (fieldType === 'from' && disableToBeforeFrom) {
                      const currentTo = selectedRanges[rangeIndex]?.to
                      const fromIndex = DAYS.findIndex(
                        (d) => d.value === newVal,
                      )
                      const toIndex = DAYS.findIndex(
                        (d) => d.value === currentTo,
                      )

                      // If new 'from' is after current 'to' or 'to' is not set, update 'to' to match 'from'
                      if (fromIndex > toIndex || !currentTo) {
                        // Use setTimeout to ensure this runs after the current render cycle
                        setTimeout(() => {
                          setValue(
                            `${name}.${rangeIndex}.to`,
                            newVal as DayValue,
                            { shouldValidate: true },
                          )
                        }, 0)
                      }
                    }
                  }
                },
                [
                  fieldType,
                  disableToBeforeFrom,
                  name,
                  onChange,
                  rangeIndex,
                  selectedRanges,
                  setValue,
                  value,
                ],
              )}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => {
                  const fromVal = selectedRanges[rangeIndex]?.from
                  const fromIndex = DAYS.findIndex((d) => d.value === fromVal)
                  const dayIndex = DAYS.findIndex((d) => d.value === day.value)

                  // Disable days in 'to' select that are before the selected 'from' day
                  const disabled =
                    fieldType === 'to' &&
                    disableToBeforeFrom &&
                    dayIndex < fromIndex

                  return (
                    <SelectItem
                      key={day.value}
                      value={day.value}
                      disabled={disabled}
                    >
                      {day.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
      />
    )
  }

  return (
    <div className="flex flex-col space-y-3">
      {/* Main day range selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <label className="flex text-base font-medium text-gray-900 w-32 leading-5 h-full items-center">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {renderSelect(0, 'from', true)}
          <span className="text-sm text-gray-900">To</span>
          {renderSelect(0, 'to')}

          {/* Add range button (only in non-default mode) */}
          {!isDefaultMode && (
            <button
              onClick={handleAddRange}
              type="button"
              className="rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              aria-label="Add another day range"
            >
              <Plus className="h-3 w-3" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Additional day ranges */}
      {fields.slice(1).map((field, index) => (
        <div key={field.id} className="flex items-center gap-2  md:ml-36">
          {renderSelect(index + 1, 'from', true)}
          <span className="text-sm text-gray-900">To</span>
          {renderSelect(index + 1, 'to')}
          <button
            type="button"
            onClick={() => remove(index + 1)}
            className="rounded-full text-red-500 hover:bg-red-50 border-[1px] border-red-500"
            aria-label="Remove day range"
          >
            <Minus className="w-3 h-3" strokeWidth={2.5} />
          </button>
        </div>
      ))}

      {/* Visual day selector */}
      <div className="flex gap-2 flex-wrap">
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value)
          const isManuallySelected = manuallySelectedDays?.includes(day.value)
          const isClickable = isSelected

          return (
            <div
              key={day.value}
              onClick={() => {
                if (!isClickable) return
                setManuallySelectedDays?.(
                  day.value === manuallySelectedDays ? null : day.value,
                )
              }}
              className={cn(
                'px-3 py-1.5 rounded-[8px] text-sm font-medium w-16 text-center shadow-sm',
                // Default state (selected but not manually selected)
                isSelected &&
                  !isManuallySelected &&
                  'bg-white border border-[#6090FA] text-[#6090FA] shadow-sm hover:shadow-[0_2px_10px_0_rgba(0,0,0,0.25)]',
                // Manually selected state
                isManuallySelected &&
                  'bg-blue-600 border border-[#6090FA] text-white font-semibold',
                // Not selected state
                !isSelected && 'bg-gray-100 text-gray-400',
                // Today's indicator (when selected)
                isSelected &&
                  day.value === today &&
                  'bg-green-500 text-white border border-green-400 shadow-[0_2px_10px_0_rgba(0,0,0,0.25)]',
                // Today's indicator (when manually selected)
                isSelected &&
                  day.value === today &&
                  isManuallySelected &&
                  'bg-blue-600 border border-blue-600 text-white font-semibold',
                // Cursor styling
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed',
              )}
              style={{
                boxShadow: 'inset 0px 4px 4px rgba(255,255,255,0.25)',
              }}
            >
              {day.label.slice(0, 3)}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-500">
        Select the individual day inorder to input open hours and close hours
      </p>
    </div>
  )
}

export default BusinessDaysSelector
