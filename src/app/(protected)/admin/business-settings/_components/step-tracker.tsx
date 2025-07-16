'use client'

import { cn } from '@/utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { BellRing, Check, HandHeart } from 'lucide-react'
import { IconName } from '@/store/slices/businessSlice'
import { HiOutlineSpeakerphone } from 'react-icons/hi'

interface Step {
  id: string
  label: string
  icon: React.ReactNode
  completed: boolean
  active: boolean
}

const StepTracker = () => {
  const dispatch = useDispatch()
  const { desktopNavCollapse } = useSelector((state: RootState) => state.nav)
  const isVertical = desktopNavCollapse
  const { steps, completedSteps, activeStep } = useSelector(
    (state: RootState) => state.business,
  )

  const iconMap: Record<IconName, React.ReactNode> = {
    Check: <Check className="h-4.5 w-4.5" strokeWidth={2.5} />,
    HandHeart: <HandHeart className="h-4 w-4" strokeWidth={2.5} />,
    BellRing: <BellRing className="h-3.5 w-3.5" strokeWidth={2.5} />,
    HiOutlineSpeakerphone: (
      <HiOutlineSpeakerphone className="h-4 w-4" strokeWidth={2.2} />
    ),
  }

  return (
    <div className={cn('flex flex-col gap-16 w-fit')}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id) || step.completed
        const isActive = activeStep === step.id || step.active
        const isLast = index === steps.length - 1

        const dotClass = cn(
          ' flex items-center justify-center rounded-full w-7 h-7 z-10 border-[1px] transition-colors',
          {
            'bg-green-500 border-green-500 text-white': isCompleted,
            'bg-[#6AA9FF] border-[#6AA9FF] text-white':
              isActive && !isCompleted,
            'bg-white border-[2px] border-gray-300 text-gray-400':
              !isCompleted && !isActive,
          },
        )

        const labelClass = cn('text-sm font-medium py-1  transition-colors', {
          'text-green-600': isCompleted,
          'text-[#6AA9FF] font-semibold': isActive && !isCompleted,
          'text-gray-400': !isCompleted && !isActive,
        })

        const connectorClass = cn('absolute transition-colors', {
          // Vertical line
          'top-3 left-1/2 h-26 w-[3px] -translate-x-1/2': !isLast,
          'bg-green-500': isCompleted,
          'bg-gray-300': !isCompleted,
        })

        return (
          <div key={step.id} className={cn('relative group flex gap-3', {})}>
            {/* Icon and connector */}
            <div className="relative flex flex-col items-center justify-center">
              <div className={dotClass}>
                {isCompleted ? (
                  <Check className="h-3 w-3 " strokeWidth={2} />
                ) : (
                  iconMap[step.icon]
                )}
              </div>
              {!isLast && <div className={connectorClass} />}
            </div>

            {/* Label */}
            <div className={labelClass}>{step.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default StepTracker
