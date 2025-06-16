"use client"

import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>
  holidays: WeekDay[]
}

interface Props {
  name: string
  businessAvailability: BusinessAvailability
}

const days: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/* Format holidays for display */
const formatHolidays = (holidays: WeekDay[]) => {
  if (!holidays || holidays.length === 0) {
    return "No holidays scheduled."
  }
  if (holidays.length === 1) {
    return `Holiday on ${holidays[0]}.`
  }
  const holidayStrings = [...holidays]
  const lastHoliday = holidayStrings.pop()
  return `Holidays are on ${holidayStrings.join(", ")}, and ${lastHoliday}.`
}

export default function ServiceDaySelector({
  name,
  businessAvailability,
}: Props) {
  const { watch, setValue } = useFormContext()
  const selectedDays: WeekDay[] = watch(name) || []

  const toggleDay = (day: WeekDay) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day]
    setValue(name, updatedDays, { shouldDirty: true })
  }

  // Exclude holidays from selectable days
  const availableDays = days.filter(
    (day) => !businessAvailability.holidays?.includes(day)
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Calendar className="size-4 text-gray-500" />
        <Label>Service Days</Label>
      </div>
      <div className="flex flex-wrap gap-3">
        {availableDays.map((day) => (
          <Button
            type="button"
            key={day}
            variant={selectedDays.includes(day) ? "default" : "outline"}
            className={cn(
              "min-w-[72px] px-6",
              selectedDays.includes(day) && "shadow-[inset_0_2px_4px_#001F5280]"
            )}
            onClick={() => toggleDay(day)}
          >
            {day}
          </Button>
        ))}
      </div>
      {/* Holiday Note */}
      <div className="mt-2 flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground max-w-md">
        <Info className="size-4 mt-0.5 flex-shrink-0" />
        <p>{formatHolidays(businessAvailability.holidays)}</p>
      </div>
    </div>
  )
}
