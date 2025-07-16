'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Controller, useFormContext } from 'react-hook-form'

interface TimeInputProps {
  name: string
  placeholder?: string
  className?: string
}

const TimeInput: React.FC<TimeInputProps> = ({
  name,
  placeholder = '--:--',
  className,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="relative">
          <Input
            {...field}
            type="time"
            placeholder={placeholder}
            className={cn(
              'w-32',
              error && 'border-red-500 focus:ring-red-500',
              className,
            )}
            onBlur={(e) => {
              // Ensure the time is in HH:MM format
              const time = e.target.value
              if (time && !time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
                return
              }
              field.onChange(time)
            }}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      )}
    />
  )
}

export default TimeInput
