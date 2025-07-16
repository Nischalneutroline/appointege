'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { Clock3, PauseCircle, Ban, AlarmCheck, AlarmClock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

const DAYS = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
] as const

type DayValue = (typeof DAYS)[number]['value']
type TimeSlot = { open: string; close: string }
type BusinessHours = Record<string, TimeSlot[]>
type BreakHours = Record<string, TimeSlot[]>

interface WeeklySchedulePreviewProps {
  businessHoursName: string
  breakHoursName: string
  selectedDaysName: string
}

const formatTime = (time: string | undefined): string => {
  if (!time) return '--:-- --'
  try {
    const [h, m] = time.split(':').map(Number)
    if (isNaN(h) || isNaN(m)) return '--:-- --'
    const suffix = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 === 0 ? 12 : h % 12
    return `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${suffix}`
  } catch (error) {
    console.error('Error formatting time:', error)
    return '--:-- --'
  }
}

const DaySchedule = ({
  day,
  isSelected,
  businessHours = [],
  breakHours = [],
}: {
  day: (typeof DAYS)[number]
  isSelected: boolean
  businessHours: TimeSlot[]
  breakHours: TimeSlot[]
}) => {
  if (!isSelected) {
    return (
      <div className="rounded-[6px] flex flex-col h-full text-gray-400 bg-[#F1F0F0] text-sm shadow">
        <div className="justify-center flex py-2 border-b-[1px] border-b-[#CCCCCC]">
          Closed
        </div>
        <div className="flex items-center justify-center h-[80px]">
          <Ban className="h-6 w-6 mt-1 text-[#CCCCCC]" />
        </div>
      </div>
    )
  }

  return (
    <div className="text-sm rounded-[4px] shadow">
      {/* Open Hours */}
      {businessHours?.length > 0 && (
        <div className="space-y-0.5 p-3 h-auto rounded-t-[4px] bg-blue-50">
          <div className="flex items-center gap-1 text-[#21609F] font-medium">
            <AlarmClock className="h-4 w-4" />
            Open Hours
          </div>
          {businessHours.map((slot, i) => (
            <div
              key={`${day.value}-open-${i}`}
              className="text-[12px] font-medium text-[#21609F]"
            >
              {formatTime(slot?.open)} – {formatTime(slot?.close)}
            </div>
          ))}
        </div>
      )}
      {/* Break Hours */}
      {breakHours?.length > 0 && (
        <>
          {businessHours?.length > 0 && (
            <div className="h-[1px] bg-[#CEE2FA]" />
          )}
          <div className="space-y-0.5 p-3 h-auto rounded-b-[4px] bg-[#FFFBE9] text-[#B45609]">
            <div className="flex items-center gap-1 font-medium">
              <AlarmClock className="h-4 w-4" />
              Break Hours
            </div>
            {breakHours.map((slot, i) => (
              <div
                key={`${day.value}-break-${i}`}
                className="text-[12px] font-medium"
              >
                {formatTime(slot?.open)} – {formatTime(slot?.close)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const WeeklySchedulePreview = ({
  businessHoursName,
  breakHoursName,
  selectedDaysName,
}: WeeklySchedulePreviewProps) => {
  const { control } = useFormContext()

  const businessHours =
    (useWatch({ control, name: businessHoursName }) as BusinessHours) || {}
  const breakHours =
    (useWatch({ control, name: breakHoursName }) as BreakHours) || {}
  const selectedDayRanges = useWatch({ control, name: selectedDaysName }) || []

  const selectedDays = useMemo(() => {
    const selected = new Set<string>()
    for (const range of selectedDayRanges) {
      if (!range?.from) continue
      
      // If there's no 'to' value, it's a single day selection
      if (!range.to) {
        selected.add(range.from)
        continue
      }
      
      // Handle range of days
      const fromIdx = DAYS.findIndex((d) => d.value === range.from)
      const toIdx = DAYS.findIndex((d) => d.value === range.to)
      
      // Only process if both indices are valid
      if (fromIdx >= 0 && toIdx >= 0) {
        const start = Math.min(fromIdx, toIdx)
        const end = Math.max(fromIdx, toIdx)
        
        for (let i = start; i <= end; i++) {
          selected.add(DAYS[i].value)
        }
      } else if (fromIdx >= 0) {
        // If only 'from' is valid, add just that day
        selected.add(range.from)
      }
    }
    return selected
  }, [selectedDayRanges])

  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium">Weekly Schedule Preview</h2>
      <div className="flex gap-4 flex-wrap">
        {DAYS.map((day) => {
          const isSelected = selectedDays.has(day.value)
          const dayBusinessHours = businessHours[day.value] || []
          const dayBreakHours = breakHours[day.value] || []

          return (
            <div key={`day-${day.value}`} className="flex flex-col gap-1 w-39">
              <div
                className={cn(
                  'flex rounded-[6px] w-full overflow-hidden shadow',
                  isSelected ? 'bg-blue-50' : 'bg-[#F1F0F0] text-[#A0A0A0]',
                )}
              >
                <div
                  className={cn(
                    'text-start font-medium w-full text-sm px-2 py-1',
                    isSelected
                      ? 'bg-[#EDF7FF] text-[#1A4B7C]'
                      : 'bg-[#F1F0F0] h-[36px]',
                  )}
                >
                  {day.label}
                </div>
              </div>
              <DaySchedule
                day={day}
                isSelected={isSelected}
                businessHours={dayBusinessHours}
                breakHours={dayBreakHours}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WeeklySchedulePreview
