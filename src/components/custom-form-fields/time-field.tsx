// // components/custom/time-picker-field.tsx
// 'use client'

// import { useFormContext, useController } from 'react-hook-form'
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/select'
// import { Label } from '@/components/ui/label'
// import {
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from '@/components/ui/form'
// import { Clock, LucideIcon } from 'lucide-react'

// interface TimePickerFieldProps {
//   name: string
//   label?: string
//   className?: string
//   availableTimeSlots: string[] // List of available time slots
//   icon?: LucideIcon
//   disabled?: boolean
// }

// const TimePickerField = ({
//   name,
//   label,
//   className,
//   availableTimeSlots,
//   icon: Icon,
//   disabled,
// }: TimePickerFieldProps) => {
//   const { control } = useFormContext()

//   const {
//     field: { onChange, value },
//     fieldState: { error },
//   } = useController({ name, control })

//   console.log('TimePickerField value:', value)

//   return (
//     <FormItem className="">
//       <div className="flex gap-2 items-center">
//         {Icon && <Icon className="size-4 text-gray-500" />}
//         <FormLabel>{label}</FormLabel>
//       </div>
//       <FormControl className={className}>
//         <Select value={value} onValueChange={onChange} disabled={disabled}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select a time slot" />
//           </SelectTrigger>
//           <SelectContent>
//             {availableTimeSlots.map((timeSlot, index) => (
//               <SelectItem key={index} value={timeSlot}>
//                 {timeSlot}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </FormControl>
//       {error && <FormMessage>{error.message}</FormMessage>}
//     </FormItem>
//   )
// }

// export default TimePickerField

'use client'

import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { LucideIcon, Clock } from 'lucide-react'
import React from 'react'

interface TimePickerFieldProps {
  name: string
  label: string
  placeholder?: string
  availableTimeSlots: string[]
  className?: string
  icon?: LucideIcon
  disabled?: boolean
}

const TimePickerField = ({
  name,
  label,
  placeholder = 'Select a time slot',
  availableTimeSlots,
  className,
  icon: Icon,
  // icon: Icon = Clock,
  disabled,
}: TimePickerFieldProps) => {
  const { control } = useFormContext()

  // Convert time slots to options format expected by SelectField
  const timeOptions = availableTimeSlots.map((time) => ({
    value: time,
    label: time,
  }))

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="flex gap-2 items-center">
            {Icon && <Icon className="size-4 text-gray-500" />}
            <FormLabel>{label}</FormLabel>
          </div>
          <FormControl className={className}>
            <Select
              value={field.value ? String(field.value) : ''}
              onValueChange={(value) => {
                if (value && timeOptions.some((opt) => opt.value === value)) {
                  field.onChange(value)
                }
              }}
              disabled={disabled}
            >
              <SelectTrigger className={cn('', className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default TimePickerField
