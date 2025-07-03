'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useFormContext } from 'react-hook-form'
import { LucideIcon, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TextAreaFieldProps {
  name: string
  label: string
  placeholder?: string
  disabled?: boolean
  icon?: LucideIcon
  className?: string
}

const TextAreaField = ({
  name,
  label,
  placeholder,
  disabled,
  // icon: Icon = ScrollText,
  icon: Icon,
  className,
}: TextAreaFieldProps) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-4 text-gray-500" />}
            <FormLabel>{label}</FormLabel>
          </div>
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'resize-y min-h-[80px] w-full', // Set min-height and ensure full width
                className,
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default TextAreaField
