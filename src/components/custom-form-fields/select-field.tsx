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
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface SelectFieldProps {
  name: string
  label: string
  placeholder?: string
  options: { value: string; label: string }[]
  className?: string
  icon?: LucideIcon
  disabled?: boolean
}

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  className,
  icon: Icon,
  disabled,
}: SelectFieldProps) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            {Icon && <Icon className="size-4 text-gray-500" />}
            <FormLabel className="leading-[20px]">{label}</FormLabel>
          </div>
          <FormControl>
            <Select
              value={field.value ? String(field.value) : ''}
              onValueChange={(value) => {
                console.log(`${name} onValueChange:`, value)
                if (value && options.some((opt) => opt.value === value)) {
                  field.onChange(value)
                } else {
                  console.log(
                    `${name} onValueChange ignored: Invalid or empty value`,
                    value,
                  )
                }
              }}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  'w-full h-10',
                  !field.value && 'text-muted-foreground', // Apply placeholder text color
                  className,
                )}
              >
                <SelectValue
                  placeholder={placeholder}
                  className="text-black" // Ensure placeholder text has specific styling
                />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
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

export default SelectField
