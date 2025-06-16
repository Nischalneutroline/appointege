"use client"

import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { ClockIcon, CalendarIcon } from "lucide-react"
import InputField from "@/components/custom-form-fields/input-field"
import DatePickerField from "../date-field"

interface ScheduleFieldProps {
  name: string
  label: string
  dateFieldName: string
  timeFieldName: string
}

const ScheduleField = ({
  name,
  label,
  dateFieldName,
  timeFieldName,
}: ScheduleFieldProps) => {
  const { watch, setValue } = useFormContext()

  const toggleCheckbox = () => {
    const current = watch(name)
    if (current.includes(label)) {
      setValue(
        name,
        current.filter((v: string) => v !== label)
      )
    } else {
      setValue(name, [...current, label])
    }
  }

  return (
    <FormItem className="mt-3">
      <div className="flex flex-col md:flex-row gap-3 items-start ">
        <div className="flex items-center gap-2 ">
          <FormControl>
            <Checkbox
              id={label}
              checked={watch(name).includes(label)}
              onCheckedChange={toggleCheckbox}
            />
          </FormControl>
          <FormLabel htmlFor={label}>{label}</FormLabel>
        </div>
        {watch(name).includes(label) && (
          <div className="flex flex-wrap  gap-4     items-center">
            <DatePickerField
              name={dateFieldName}
              label="Date"
              placeholder="Select date"
              icon={CalendarIcon}
            />
            <InputField
              name={timeFieldName}
              label="Time"
              type="time"
              className="w-[100px] h-[32px]"
              icon={ClockIcon}
              value={watch(timeFieldName)}
              onChange={(e) => setValue(timeFieldName, e.target.value)}
            />
          </div>
        )}
      </div>
    </FormItem>
  )
}

export default ScheduleField
