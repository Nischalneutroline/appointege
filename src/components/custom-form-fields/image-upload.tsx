"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface FileUploadFieldProps {
  name: string
  label: string
  placeholder?: string
  className?: string
  icon?: LucideIcon
}

const FileUploadField = ({
  name,
  label,
  placeholder,
  className,
  icon: Icon,
}: FileUploadFieldProps) => {
  const { control } = useFormContext()

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
          <FormControl>
            <Input
              type="file"
              placeholder={placeholder}
              className={cn("w-max", className)}
              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FileUploadField
