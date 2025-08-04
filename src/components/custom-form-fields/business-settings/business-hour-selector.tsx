'use client'

import { useFormContext } from 'react-hook-form'
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
import {
  CalendarDays,
  Hourglass,
  Plus,
  Trash2,
  Info,
  Minus,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { timeOptions, toMin } from '@/lib/lib'
import { useWatch } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type BreakRecord = Record<WeekDay, [string, string][]>

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
type Day = (typeof days)[number]
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
    if (timeMin < endMin) continue
    const overlap = breaks.some(([bStart, bEnd]) => {
      const bs = toMin(bStart)
      const be = toMin(bEnd)
      return timeMin > bs && timeMin < be
    })
    if (!overlap) return time
  }
  return options[0] || ''
}

interface Props {
  name: string
  businessBreaks?: BreakRecord
  className?: string
  initialBusinessHours?: BreakRecord
  dayName?: string
  label?: string
  activeDay: Day
  restrictToInitialHours: boolean
  isDefault?: boolean
  setCustom: (
    value:
      | 'custom'
      | 'default'
      | ((prev: 'custom' | 'default') => 'custom' | 'default'),
  ) => void
}

export default function BusinessHourSelector({
  name,
  businessBreaks,
  dayName,
  className,
  label,
  initialBusinessHours,
  activeDay,
  restrictToInitialHours = false,
  isDefault,
  setCustom,
}: Props) {
  const { setValue, getValues } = useFormContext()
  const [applyToAll, setApplyToAll] = useState(false)
  const isFirstRender = useRef(true)

  const handleApplyToAll = () => {
    setApplyToAll(!applyToAll)
  }

  const watchedValue =
    useWatch({ name: dayName || 'serviceDays' || 'businessAvailability' }) || []
  const serviceDays: Day[] = Array.isArray(watchedValue)
    ? watchedValue.filter((day): day is Day => typeof day === 'string')
    : []
  const serviceHours: Record<Day, Slot[]> = useWatch({ name }) || {}

  const initialDaySlots = initialBusinessHours?.[activeDay] ?? []
  const minInitialTime = initialDaySlots.length
    ? initialDaySlots.reduce(
        (min, [start]) => (toMin(start) < toMin(min) ? start : min),
        initialDaySlots[0][0],
      )
    : undefined
  const maxInitialTime = initialDaySlots.length
    ? initialDaySlots.reduce(
        (max, [, end]) => (toMin(end) > toMin(max) ? end : max),
        initialDaySlots[0][1],
      )
    : undefined

  const filteredWorkTimeOptions = useMemo(() => {
    let options = [...timeOptions]
    if (restrictToInitialHours && minInitialTime && maxInitialTime) {
      const minInitialMin = toMin(minInitialTime)
      const maxInitialMin = toMin(maxInitialTime)
      options = options.filter((t) => {
        const tMin = toMin(t)
        return tMin >= minInitialMin && tMin <= maxInitialMin
      })
    }
    return options
  }, [activeDay, initialBusinessHours, restrictToInitialHours])

  const getAvailableTimes = (
    afterTime: string | undefined,
    options: string[],
    isEnd: boolean = false,
  ) => {
    if (!afterTime || !options.includes(afterTime)) return options
    const index = options.indexOf(afterTime)
    return isEnd ? options.slice(index + 1) : options.slice(index)
  }

  const isTimeDisabled = (
    time: string,
    breaks: Slot[],
    isEnd: boolean,
    referenceTime: string,
  ): boolean => {
    if (
      referenceTime &&
      toMin(time) < (isEnd ? toMin(referenceTime) + 1 : toMin(referenceTime))
    ) {
      return true
    }
    return breaks.some(([bStart, bEnd]) => {
      const timeMin = toMin(time)
      const bStartMin = toMin(bStart)
      const bEndMin = toMin(bEnd)
      if (isEnd) {
        return (
          (time === bEnd && timeMin !== bEndMin) ||
          (timeMin > bStartMin && timeMin < bEndMin)
        )
      }
      return time === bStart || (timeMin > bStartMin && timeMin < bEndMin)
    })
  }

  const update = (idx: number, pos: 0 | 1, val: string) => {
    if (isDefault) {
      setCustom('custom')
    }
    const updated = { ...serviceHours }
    const slots = [...(updated[activeDay] || [])]
    const slot = slots[idx] ? [...slots[idx]] : ['', '']
    slot[pos] = val
    slots[idx] = slot as Slot
    updated[activeDay] = slots
    setValue(name, updated, { shouldDirty: true })
  }

  const addSlot = () => {
    if (isDefault) {
      setCustom('custom')
    }
    const updated = { ...serviceHours }
    const prevSlots = updated[activeDay] || []
    const prevEnd = prevSlots.at(-1)?.[1] ?? filteredWorkTimeOptions[0]
    const breaks = businessBreaks?.[activeDay] ?? []
    const nextStart = getNextValidStartTime(
      prevEnd,
      breaks,
      filteredWorkTimeOptions,
    )
    updated[activeDay] = [...prevSlots, [nextStart, '']]
    setValue(name, updated, { shouldDirty: true })
  }

  const removeSlot = (idx: number) => {
    const updated = { ...serviceHours }
    updated[activeDay] = updated[activeDay].filter((_, i) => i !== idx)
    setValue(name, updated, { shouldDirty: true })
  }

  useEffect(() => {
    if (initialBusinessHours) {
      const current = getValues(name)
      const isEmpty = !current || Object.keys(current).length === 0
      if (isEmpty) {
        setValue(name, initialBusinessHours, { shouldDirty: true })
      }
    }
  }, [initialBusinessHours, name, setValue])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!applyToAll) return
    const currentHours = getValues(name) || {}
    const sourceSlots = currentHours[activeDay] || []
    if (sourceSlots.length === 0 || serviceDays.length <= 1) return
    const updatedHours = { ...currentHours }
    serviceDays.forEach((day) => {
      if (day !== activeDay) {
        updatedHours[day] = [...sourceSlots]
      }
    })
    setValue(name, updatedHours, { shouldDirty: true })
  }, [applyToAll])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center justify-between">
        <Label>{label || `Business Hour / day`}</Label>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm',
              applyToAll ? 'text-[#111827]' : 'text-[#B5B4B4]',
            )}
          >
            Apply to all
          </span>
          <Switch
            checked={applyToAll}
            onCheckedChange={handleApplyToAll}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
      <div
        className={cn(
          'space-y-2 flex flex-col items-center',
          dayName === 'businessAvailability' && 'items-start',
          dayName === 'serviceAvailability' && 'items-start',
        )}
      >
        {serviceDays.includes(activeDay) &&
        (serviceHours[activeDay] || []).length === 0 ? (
          <div className="flex flex-col items-start gap-2 p-4 w-full bg-gray-50 rounded-md">
            <p className="text-gray-600">
              No {label?.toLowerCase() || 'hours'} scheduled for {activeDay}.
            </p>
            <Button
              type="button"
              onClick={addSlot}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {label?.split(' ')[0] || 'Hour'} Time Slot
            </Button>
          </div>
        ) : (
          (serviceHours[activeDay] || []).map((slot, idx) => {
            if (!slot[0]) {
              const prevSlot = serviceHours[activeDay][idx - 1]
              const prevEnd = prevSlot ? prevSlot[1] : ''
              const breaks = businessBreaks?.[activeDay] ?? []
              slot[0] = getNextValidStartTime(
                prevEnd,
                breaks,
                filteredWorkTimeOptions,
              )
            }
            const prevEnd = idx > 0 ? serviceHours[activeDay][idx - 1][1] : ''
            const breaks = businessBreaks?.[activeDay] ?? []
            const startList = getAvailableTimes(
              prevEnd,
              filteredWorkTimeOptions,
              false,
            )
            const endList = getAvailableTimes(
              slot[0],
              filteredWorkTimeOptions,
              true,
            )
            return (
              <div key={idx} className="flex gap-4 items-center">
                <div className="flex flex-col gap-1">
                  <div className="text-[#252B38] text-sm font-normal">
                    Open Time
                  </div>
                  <Select
                    value={slot[0] || undefined}
                    onValueChange={(v) => update(idx, 0, v)}
                  >
                    <SelectTrigger className="w-32 md:w-40">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {startList.map((t) => {
                        const tMin = toMin(t)
                        const disabledByRestriction =
                          restrictToInitialHours &&
                          minInitialTime &&
                          maxInitialTime &&
                          (tMin < toMin(minInitialTime) ||
                            tMin > toMin(maxInitialTime))
                        return (
                          <SelectItem
                            key={t}
                            value={t}
                            disabled={
                              disabledByRestriction ||
                              isTimeDisabled(
                                t,
                                breaks,
                                false,
                                prevEnd || filteredWorkTimeOptions[0],
                              )
                            }
                          >
                            {t}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex flex-col gap-1">
                  <div className="text-[#252B38] text-sm font-normal">
                    Close Time
                  </div>
                  <Select
                    value={slot[1] || undefined}
                    onValueChange={(v) => update(idx, 1, v)}
                  >
                    <SelectTrigger className="w-32 md:w-40">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {endList.map((t) => {
                        const tMin = toMin(t)
                        const disabledByRestriction =
                          restrictToInitialHours &&
                          minInitialTime &&
                          maxInitialTime &&
                          (tMin < toMin(minInitialTime) ||
                            tMin > toMin(maxInitialTime))
                        return (
                          <SelectItem
                            key={t}
                            value={t}
                            disabled={
                              disabledByRestriction ||
                              isTimeDisabled(
                                t,
                                breaks,
                                true,
                                slot[0] || filteredWorkTimeOptions[0],
                              )
                            }
                          >
                            {t}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  {idx === 0 && !isDefault && (
                    <div
                      className="absolute -right-6 top-9 text-xs border-blue-600 rounded-[4px] border-[1px]"
                      onClick={addSlot}
                    >
                      <Plus className="w-3 h-3" />
                    </div>
                  )}
                  {idx > 0 && (
                    <div
                      className="absolute -right-6 top-9 border-[1px] border-red-400 rounded-[4px]"
                      onClick={() => removeSlot(idx)}
                    >
                      <Minus className="w-3 h-3 text-destructive" />
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
