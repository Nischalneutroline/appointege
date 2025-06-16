"use client"

import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  placeholder?: string
  type?: string
  className?: string
  icon?: LucideIcon
  disabled?: boolean
}

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  className,
  icon: Icon,
  value,
  onChange,
  ...rest
}: InputFieldProps) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col ">
          <div className="flex gap-2 items-center">
            {Icon && <Icon className="size-4 text-gray-500" />}
            <FormLabel>{label}</FormLabel>
          </div>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className={cn("w-full placeholder:text-sm text-sm", className)}
              value={value !== undefined ? value : field.value}
              onChange={onChange || field.onChange}
              {...rest}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputField
