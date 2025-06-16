"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"
import { LucideIcon, ScrollText } from "lucide-react"

interface TextAreaFieldProps {
  name: string
  label: string
  placeholder?: string
  disabled?: boolean
  icon?: LucideIcon
}

const TextAreaField = ({
  name,
  label,
  placeholder,
  disabled,
  icon: Icon = ScrollText,
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
              className="resize-none h-20"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default TextAreaField
