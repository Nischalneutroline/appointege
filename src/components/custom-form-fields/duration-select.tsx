// src/components/custom-form-fields/duration-select.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Clock } from 'lucide-react'

const durations = [
  { label: '15 min', value: '15' },
  { label: '30 min', value: '30' },
  { label: '45 min', value: '45' },
  { label: '1 hr', value: '60' },
  { label: '1.5 hr', value: '90' },
]

const DurationSelect = ({
  name,
  label,
  className,
}: {
  name: string
  label: string
  className?: string
}) => {
  const { watch, setValue } = useFormContext()

  const selected = watch(name)?.toString() // Convert to string for Select

  return (
    <div className="space-y-1 flex gap-2">
      <div className="flex items-center gap-2">
        {<Clock className="size-4 text-gray-500" />}
        <Label>{label}</Label>
      </div>
      <Select
        value={selected}
        onValueChange={(val) =>
          setValue(name, parseInt(val, 10), { shouldValidate: true })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent className="">
          {durations.map((d) => (
            <SelectItem key={d.value} value={d.value}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default DurationSelect
