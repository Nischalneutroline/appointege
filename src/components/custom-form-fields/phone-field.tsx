// components/custom/phone-field.tsx
"use client"

import { useController, useFormContext } from "react-hook-form"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { LucideIcon, PhoneCall } from "lucide-react"

interface PhoneFieldProps {
  name: string
  label?: string
  placeholder?: string
  className?: string
  icon?: LucideIcon
  disabled?: boolean
}

const PhoneField = ({
  name,
  label,
  className,
  placeholder,
  icon: Icon = PhoneCall,
  disabled,
}: PhoneFieldProps) => {
  const { control } = useFormContext()
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control })

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        {Icon && <Icon className="size-4 text-gray-500" />}
        {label && <Label htmlFor={name}>{label}</Label>}
      </div>
      <PhoneInput
        defaultCountry="np"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        inputClassName={cn(
          "w-full h-10 px-12 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        )}
      />
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  )
}

export default PhoneField
