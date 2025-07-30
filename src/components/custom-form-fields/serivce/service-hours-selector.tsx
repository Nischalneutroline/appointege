// src/components/custom-form-fields/serivce/service-hours-selector.tsx
'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CalendarDays, Hourglass, Plus, Trash2, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { timeOptions, toMin } from '@/lib/lib'
import { weekdayMap } from '@/store/slices/businessSlice'
import { WeekDays } from '@prisma/client'

export type BreakRecord = Record<WeekDay, [string, string][]>

const days = [
  WeekDays.MONDAY,
  WeekDays.TUESDAY,
  WeekDays.WEDNESDAY,
  WeekDays.THURSDAY,
  WeekDays.FRIDAY,
  WeekDays.SATURDAY,
  WeekDays.SUNDAY,
] as const

type Day = WeekDays
type Slot = [string, string]

const getNextValidStartTime = (
  endTime: string,
  breaks: Slot[],
  options: string[],
) => {
  if (!endTime || !options.includes(endTime)) return options[0] || ''
  const endMin = toMin(endTime)
  for (const time of options) {
    const timeMin = toMin(time)
    if (timeMin <= endMin) continue
    const overlap = breaks.some(([bStart, bEnd]) => {
      const bs = toMin(bStart)
      const be = toMin(bEnd)
      return timeMin >= bs && timeMin <= be
    })
    if (!overlap) return time
  }
  return options[options.findIndex((t) => t === endTime) + 1] || options[0]
}

const formatBreaks = (day: Day, breaks: Slot[]) => {
  if (!breaks || breaks.length === 0) {
    return `No breaks scheduled for ${weekdayMap[day]}.`
  }
  if (breaks.length === 1) {
    const [start, end] = breaks[0]
    return `Break on ${weekdayMap[day]} is from ${start} to ${end}.`
  }
  const breakStrings = breaks.map(([start, end]) => `${start} to ${end}`)
  const lastBreak = breakStrings.pop()
  return `Breaks on ${weekdayMap[day]} are from ${breakStrings.join(', ')}, and ${lastBreak}.`
}

interface Props {
  name: string
  businessBreaks?: BreakRecord
  className?: string
  dayName?: string
  label?: string
}

export default function ServiceHoursSelector({
  name,
  businessBreaks,
  dayName,
  className,
  label,
}: Props) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()
  const watchedValue = watch(dayName || 'serviceAvailability') || []
  const serviceDays: {
    weekDay: Day
    timeSlots: { startTime: string; endTime: string }[]
  }[] = Array.isArray(watchedValue)
    ? watchedValue.filter(
        (
          day: any,
        ): day is {
          weekDay: Day
          timeSlots: { startTime: string; endTime: string }[]
        } => typeof day === 'object' && 'weekDay' in day,
      )
    : []
  const [activeDay, setActiveDay] = useState<Day>(
    serviceDays[0]?.weekDay ?? WeekDays.MONDAY,
  )

  const workTimeOptions = useMemo(() => {
    const breaks = businessBreaks?.[weekdayMap[activeDay] as WeekDay] ?? []
    return timeOptions.filter((t: string) => {
      const min = toMin(t)
      return !breaks.some(([s, e]) => {
        const startMin = toMin(s)
        const endMin = toMin(e)
        return min >= startMin && min <= endMin
      })
    })
  }, [activeDay, businessBreaks])

  const getAvailableTimes = (
    afterTime: string | undefined,
    options: string[],
    isEnd: boolean = false,
  ) => {
    if (!afterTime || !options.includes(afterTime)) return options
    const index = options.indexOf(afterTime)
    return isEnd ? options.slice(index + 1) : options
  }

  const isTimeDisabled = (
    time: string,
    breaks: Slot[],
    isEnd: boolean,
    referenceTime: string,
  ): boolean => {
    if (
      referenceTime &&
      toMin(time) <= (isEnd ? toMin(referenceTime) : toMin(referenceTime) - 1)
    ) {
      return true
    }
    return breaks.some(([bStart, bEnd]) => {
      const startMin = toMin(bStart)
      const endMin = toMin(bEnd)
      return isEnd
        ? toMin(time) >= startMin && toMin(time) <= endMin
        : toMin(time) >= startMin && toMin(time) <= endMin
    })
  }

  const update = (idx: number, pos: 0 | 1, val: string) => {
    const updatedDays = [...serviceDays]
    const dayIndex = updatedDays.findIndex((d) => d.weekDay === activeDay)
    if (dayIndex === -1) return

    const slots = [...(updatedDays[dayIndex].timeSlots || [])]
    const slot = slots[idx] ? { ...slots[idx] } : { startTime: '', endTime: '' }
    if (pos === 0) {
      slot.startTime = val
      const breaks = businessBreaks?.[weekdayMap[activeDay] as WeekDay] ?? []
      const validEndTime = getNextValidStartTime(val, breaks, workTimeOptions)
      if (!slot.endTime || toMin(slot.endTime) <= toMin(val)) {
        slot.endTime = validEndTime
      }
    } else {
      slot.endTime = val
    }
    slots[idx] = slot
    updatedDays[dayIndex].timeSlots = slots.filter(
      (s) => s.startTime && s.endTime, // Remove invalid slots
    )

    setValue(dayName || 'serviceAvailability', updatedDays, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const addSlot = () => {
    const updatedDays = [...serviceDays]
    const dayIndex = updatedDays.findIndex((d) => d.weekDay === activeDay)
    if (dayIndex === -1) return

    const prevSlots = updatedDays[dayIndex].timeSlots || []
    const prevEnd = prevSlots.at(-1)?.endTime ?? workTimeOptions[0]
    const breaks = businessBreaks?.[weekdayMap[activeDay] as WeekDay] ?? []
    const nextStart = getNextValidStartTime(prevEnd, breaks, workTimeOptions)
    updatedDays[dayIndex].timeSlots = [
      ...prevSlots,
      {
        startTime: nextStart,
        endTime: getNextValidStartTime(nextStart, breaks, workTimeOptions),
      },
    ]

    setValue(dayName || 'serviceAvailability', updatedDays, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const removeSlot = (idx: number) => {
    const updatedDays = [...serviceDays]
    const dayIndex = updatedDays.findIndex((d) => d.weekDay === activeDay)
    if (dayIndex === -1) return

    updatedDays[dayIndex].timeSlots = updatedDays[dayIndex].timeSlots.filter(
      (_, i) => i !== idx,
    )
    setValue(dayName || 'serviceAvailability', updatedDays, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Hourglass className="size-4 text-gray-500" />
        <Label>{label || 'Service Hours'}</Label>
      </div>

      <div className="flex items-center gap-2">
        <CalendarDays className="size-5 text-gray-500" />
        <div className="flex gap-2 flex-wrap w-full">
          {serviceDays
            .sort((a, b) => days.indexOf(a.weekDay) - days.indexOf(b.weekDay))
            .map((d) => (
              <Button
                type="button"
                key={d.weekDay}
                variant={d.weekDay === activeDay ? 'default' : 'outline'}
                className={cn(
                  'max-w-[72px] px-4 flex-shrink-0',
                  d.weekDay === activeDay &&
                    'shadow-[inset_0_2px_4px_#001F5280]',
                  className,
                )}
                onClick={() => setActiveDay(d.weekDay)}
              >
                {weekdayMap[d.weekDay]}
              </Button>
            ))}
        </div>
      </div>

      <div className="space-y-4 flex flex-col items-center">
        {(
          serviceDays.find((d) => d.weekDay === activeDay)?.timeSlots || []
        ).map((slot, idx) => {
          const prevEnd =
            idx > 0
              ? serviceDays.find((d) => d.weekDay === activeDay)?.timeSlots[
                  idx - 1
                ]?.endTime
              : ''
          const breaks =
            businessBreaks?.[weekdayMap[activeDay] as WeekDay] ?? []
          const startList = getAvailableTimes(prevEnd, workTimeOptions, false)
          const endList = getAvailableTimes(
            slot.startTime,
            workTimeOptions,
            true,
          )

          return (
            <div key={idx} className="flex gap-4 items-center">
              <Select
                value={slot.startTime || undefined}
                onValueChange={(v) => update(idx, 0, v)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {startList.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      disabled={isTimeDisabled(
                        t,
                        breaks,
                        false,
                        prevEnd || workTimeOptions[0],
                      )}
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <Select
                  value={slot.endTime || undefined}
                  onValueChange={(v) => update(idx, 1, v)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {endList.map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        disabled={isTimeDisabled(
                          t,
                          breaks,
                          true,
                          slot.startTime,
                        )}
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {idx > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute -right-8 top-0"
                    onClick={() => removeSlot(idx)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}

        <Button
          type="button"
          variant="outline"
          className="text-xs gap-1"
          onClick={addSlot}
          disabled={!serviceDays.some((d) => d.weekDay === activeDay)}
        >
          <Plus className="w-3 h-3" /> Add Time Slot
        </Button>

        {businessBreaks && (
          <div className="mt-2 flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground max-w-md">
            <Info className="size-4 mt-0.5 flex-shrink-0" />
            <p>
              {formatBreaks(
                activeDay,
                businessBreaks?.[weekdayMap[activeDay] as WeekDay] ?? [],
              )}
            </p>
          </div>
        )}
      </div>
      {errors[dayName || 'serviceAvailability'] && (
        <p className="text-red-500">
          {JSON.stringify(errors[dayName || 'serviceAvailability'], null, 2)}
        </p>
      )}
    </div>
  )
}
