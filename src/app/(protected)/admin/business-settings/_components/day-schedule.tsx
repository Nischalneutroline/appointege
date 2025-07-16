'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus, X } from 'lucide-react'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import TimeInput from './time-input'

interface DayScheduleProps {
  day: string
  dayLabel: string
  name: string
}

const DaySchedule: React.FC<DayScheduleProps> = ({ day, dayLabel, name }) => {
  const { control, watch } = useFormContext()
  const isOpen = watch(`${name}.isOpen`)

  // Business hours time slots
  const {
    fields: businessHourFields,
    append: appendBusinessHour,
    remove: removeBusinessHour,
  } = useFieldArray({
    control,
    name: `${name}.timeSlots`,
  })

  // Break hours time slots
  const {
    fields: breakFields,
    append: appendBreak,
    remove: removeBreak,
  } = useFieldArray({
    control,
    name: `${name}.breaks`,
  })

  const addBusinessHour = () => {
    appendBusinessHour({ open: '09:00', close: '17:00' })
  }

  const addBreak = () => {
    appendBreak({ open: '12:00', close: '13:00' })
  }

  if (!isOpen) return null

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{dayLabel}</h3>
      </div>

      <div className="space-y-6">
        {/* Business Hours */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Business Hours</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addBusinessHour}
              className="text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Time Slot
            </Button>
          </div>

          {businessHourFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <TimeInput
                name={`${name}.timeSlots.${index}.open`}
                placeholder="09:00"
              />
              <span>to</span>
              <TimeInput
                name={`${name}.timeSlots.${index}.close`}
                placeholder="17:00"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBusinessHour(index)}
                className="text-red-500 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Break Hours */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Break Hours</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addBreak}
              className="text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Break
            </Button>
          </div>

          {breakFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <TimeInput
                name={`${name}.breaks.${index}.open`}
                placeholder="12:00"
              />
              <span>to</span>
              <TimeInput
                name={`${name}.breaks.${index}.close`}
                placeholder="13:00"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBreak(index)}
                className="text-red-500 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DaySchedule
