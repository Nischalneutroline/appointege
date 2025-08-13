'use client'

import * as React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckIcon } from 'lucide-react'

type Option = {
  label: string
  value: string | number
  disabled?: boolean
  description?: string
}

type RadioGroupFieldProps = {
  name: string
  label?: string
  options: Option[]
  multiple?: boolean
  required?: boolean
  className?: string
  labelClassName?: string
  optionClassName?: string
  orientation?: 'horizontal' | 'vertical'
  error?: string
  helperText?: string
  disabled?: boolean
}

export function RadioGroupField({
  name,
  label,
  options,
  multiple = false,
  required = false,
  className,
  labelClassName,
  optionClassName,
  orientation = 'horizontal',
  error,
  helperText,
  disabled = false,
}: RadioGroupFieldProps) {
  const { control } = useFormContext()

  if (multiple) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value = [] } }) => (
          <div className={cn('space-y-2', className)}>
            {label && (
              <Label className={cn('text-sm font-medium', labelClassName)}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <div
              className={cn(
                'flex flex-wrap gap-4',
                orientation === 'vertical' ? 'flex-col' : 'flex-row',
              )}
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'relative flex items-start space-x-2',
                    optionClassName,
                    disabled && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id={`${name}-${option.value}`}
                      checked={value?.includes(option.value) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onChange([...(value || []), option.value])
                        } else {
                          onChange(
                            (value || []).filter(
                              (v: any) => v !== option.value,
                            ),
                          )
                        }
                      }}
                      className={cn(
                        'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
                        error && 'border-destructive',
                      )}
                      disabled={disabled || option.disabled}
                    />
                  </div>
                  <div className="text-sm leading-5">
                    <label
                      htmlFor={`${name}-${option.value}`}
                      className={cn(
                        'font-medium text-foreground',
                        (disabled || option.disabled) &&
                          'text-muted-foreground',
                      )}
                    >
                      {option.label}
                    </label>
                    {option.description && (
                      <p className="text-muted-foreground text-xs">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {error && (
              <p className="text-destructive text-sm font-medium">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-muted-foreground text-sm">{helperText}</p>
            )}
          </div>
        )}
      />
    )
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn('space-y-2', className)}>
          {label && (
            <Label className={cn('text-sm font-medium', labelClassName)}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className={cn(
              'flex flex-wrap items-start gap-4',
              orientation === 'horizontal' ? 'flex-row' : 'flex-col',
            )}
            disabled={disabled}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'flex items-center space-x-2',
                  (disabled || option.disabled) &&
                    'opacity-50 cursor-not-allowed',
                  optionClassName,
                )}
              >
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`${name}-${option.value}`}
                  disabled={disabled || option.disabled}
                  className={cn(
                    'data-[state=checked]:border-primary data-[state=checked]:bg-primary/10',
                    error && 'border-destructive',
                  )}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className={cn(
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap',
                    (disabled || option.disabled) && 'text-muted-foreground',
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-muted-foreground text-xs">
                    {option.description}
                  </p>
                )}
              </div>
            ))}
          </RadioGroup>
          {error && (
            <p className="text-destructive text-sm font-medium">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-muted-foreground text-sm">{helperText}</p>
          )}
        </div>
      )}
    />
  )
}

export default RadioGroupField
