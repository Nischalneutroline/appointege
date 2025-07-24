'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { Ban, AlarmClock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

const DAYS = [
  { value: 'Mon', label: 'Mon' },
  { value: 'Tue', label: 'Tue' },
  { value: 'Wed', label: 'Wed' },
  { value: 'Thu', label: 'Thu' },
  { value: 'Fri', label: 'Fri' },
  { value: 'Sat', label: 'Sat' },
  { value: 'Sun', label: 'Sun' },
] as const

type DayValue = (typeof DAYS)[number]['value']
type TimeRange = [string, string]

type BusinessHours = Record<DayValue, TimeRange[]>
type BreakHours = Record<DayValue, TimeRange[]>

interface Props {
  businessHoursName: string
  breakHoursName: string
  selectedDaysName: string
}

const DaySchedule = ({
  businessHours,
  breakHours,
  isSelected,
}: {
  businessHours: TimeRange[]
  breakHours: TimeRange[]
  isSelected: boolean
}) => {
  if (!isSelected) {
    return (
      <div className="flex flex-col items-center justify-center h-[100px] rounded-md bg-gray-200 text-gray-500 shadow-sm text-sm">
        <Ban className="mb-1" />
        Closed
      </div>
    )
  }

  return (
    <div className="rounded-md shadow-sm bg-white text-sm">
      {businessHours.length > 0 && (
        <div className="px-2 pt-3 pb-1 bg-blue-50 rounded-t-md text-[#21609F] font-semibold flex items-center gap-1">
          <AlarmClock size={14} />
          <div className="text-xs">Open Hours</div>
        </div>
      )}
      <div className=" bg-blue-50 text-[#21609F] text-xs font-medium">
        {businessHours.length === 0 && (
          <div className=" italic w-full text-center">No hours set</div>
        )}
        {businessHours.map(([start, end], i) => (
          <div key={i} className="ml-1 w-fit p-1 text-xs font-semibold">
            {start} – {end}
          </div>
        ))}
      </div>

      {breakHours.length > 0 && (
        <div className=" rounded-[4px]">
          <div className="border-t border-blue-100" />
          <div className="px-2 pt-3 pb-1 bg-[#FFFBE9] rounded-b-md text-[#B45609] font-semibold flex items-center gap-1">
            <AlarmClock size={16} />
            <div className="text-xs">Break Hours</div>
          </div>
          {/* <div className="p-2">
            {breakHours.map(([start, end], i) => (
              <div key={i} className="text-[#B45609] text-xs font-medium">
                {start} – {end}
              </div>
            ))}
          </div> */}
          <div className="pb-3 bg-[#FFFBE9] text-[#B45609] text-xs font-medium">
            {breakHours.length === 0 && (
              <div className=" italic w-full text-center">No hours set</div>
            )}
            {breakHours.map(([start, end], i) => (
              <div key={i} className="ml-1 w-fit p-1 text-xs font-semibold">
                {start} – {end}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function WeeklySchedulePreview({
  businessHoursName,
  breakHoursName,
  selectedDaysName,
}: Props) {
  const { control } = useFormContext()

  const businessHours =
    (useWatch({ control, name: businessHoursName }) as BusinessHours) || {}
  const breakHours =
    (useWatch({ control, name: breakHoursName }) as BreakHours) || {}
  const selectedDayRanges = useWatch({ control, name: selectedDaysName }) || []

  // Flatten selected day ranges into a Set of selected days
  const selectedDays = useMemo(() => {
    if (!Array.isArray(selectedDayRanges)) return new Set<DayValue>()
    return new Set(
      selectedDayRanges.filter((day): day is DayValue =>
        DAYS.some((d) => d.value === day),
      ),
    )
  }, [selectedDayRanges])

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Weekly Schedule Preview</h2>
      <div className="flex flex-wrap gap-4">
        {DAYS.map(({ value, label }) => {
          const isSelected = selectedDays.has(value)
          const dayBusinessHours = businessHours[value] || []
          const dayBreakHours = breakHours[value] || []

          return (
            <div key={value} className="flex flex-col w-[160px] gap-1">
              <div
                className={cn(
                  'px-3 py-1.5 rounded-[6px] font-semibold text-xs ',
                  isSelected
                    ? 'bg-[#EDF7FF] text-[#1A4B7C]'
                    : 'bg-[#F1F0F0] text-[#A0A0A0]',
                )}
              >
                {label}
              </div>
              <DaySchedule
                isSelected={isSelected}
                businessHours={dayBusinessHours}
                breakHours={dayBreakHours}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
