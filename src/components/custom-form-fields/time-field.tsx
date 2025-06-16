// components/custom/time-picker-field.tsx
"use client"

import { useFormContext, useController } from "react-hook-form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Clock, LucideIcon } from "lucide-react"

interface TimePickerFieldProps {
  name: string
  label?: string
  className?: string
  availableTimeSlots: string[] // List of available time slots
  icon?: LucideIcon
  disabled?: boolean
}

const TimePickerField = ({
  name,
  label,
  className,
  availableTimeSlots,
  icon: Icon = Clock,
  disabled,
}: TimePickerFieldProps) => {
  const { control } = useFormContext()

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control })

  console.log('TimePickerField value:', value)

  return (
    <div className={className}>
      <FormItem className="">
        <div className="flex gap-2 items-center">
          {Icon && <Icon className="size-4 text-gray-500" />}
          <FormLabel>{label}</FormLabel>
        </div>
        <FormControl>
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              {availableTimeSlots.map((timeSlot, index) => (
                <SelectItem key={index} value={timeSlot}>
                  {timeSlot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        {error && <FormMessage>{error.message}</FormMessage>}
      </FormItem>
    </div>
  )
}

export default TimePickerField
