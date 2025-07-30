// 'use client'

// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { cn } from '@/lib/utils'
// import {
//   AppointmentFilterValue,
//   FilterAppoinmentState,
// } from '@/app/(protected)/admin/appointment/_data/data'
// import { setActiveFilter } from '@/store/slices/appointmentSlice'
// import { RootState } from '@/store/store'

// interface FilterTabsProps {
//   option: FilterAppoinmentState
// }

// const FilterTabs = ({ option }: FilterTabsProps) => {
//   const [isHovered, setIsHovered] = useState(false)
//   const dispatch = useDispatch()
//   const { activeFilter, activeFilters, counts } = useSelector(
//     (state: RootState) => state.appointment,
//   )

//   const isActive = activeFilter === option.value
//   const backgroundColor = isActive
//     ? option.background
//     : isHovered
//       ? 'oklch(96.7% 0.003 264.542)'
//       : '#F8F9FA'
//   const border = isActive ? `1px solid ${option.border}` : 'none'

//   return (
//     <div
//       key={option.value}
//       className={cn(
//         `w-fit text-sm font-normal px-2 py-2 flex justify-center items-center
//          transition-transform duration-300 cursor-pointer rounded-[8px] active:scale-95 hover:bg-slate-50/80 dark:hover:bg-slate-800/50
//         `,
//       )}
//       style={{
//         backgroundColor: backgroundColor,
//         border,
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={() => {
//         dispatch(setActiveFilter(option.value))
//       }}
//     >
//       <div className="flex gap-1">
//         {option.label === 'All' ? 'All' : option.label}
//         <span className="flex justify-center items-center md:hidden rounded-full bg-primary size-5 text-white">
//           <div
//             className={cn(
//               'text-sm',
//               option.value === activeFilter && 'font-bold',
//             )}
//           >
//             {counts[option.value]}
//           </div>
//         </span>
//       </div>
//     </div>
//   )
// }

// export default FilterTabs
// 'use client'

// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { cn } from '@/lib/utils'
// import { AppointmentFilterValue } from '@/app/(protected)/admin/appointment/_data/data'
// import {
//   FilterOptionState,
//   setActiveFilter,
// } from '@/store/slices/appointmentSlice'
// import { RootState } from '@/store/store'

// const FilterTabs = ({
//   label,
//   value,
//   background,
//   border,
// }: FilterOptionState) => {
//   const [isHovered, setIsHovered] = useState(false)
//   const dispatch = useDispatch()
//   const { activeFilter } = useSelector((state: RootState) => state.appointment)

//   const isActive = activeFilter === value
//   const backgroundColor = isActive
//     ? background
//     : isHovered
//       ? 'oklch(96.7% 0.003 264.542)'
//       : '#F8F9FA'
//   border = isActive ? `1px solid ${border}` : 'none'
//   const { counts } = useSelector((state: RootState) => state.appointment)

//   return (
//     <div
//       key={value}
//       className={cn(
//         `w-fit text-sm font-normal px-2 py-2 flex justify-center items-center
//          transition-transform duration-300 cursor-pointer rounded-[8px] active:scale-95 hover:bg-slate-50/80 dark:hover:bg-slate-800/50
//         `,
//       )}
//       style={{
//         backgroundColor: backgroundColor,
//         border,
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={() => {
//         dispatch(setActiveFilter(value))
//       }}
//     >
//       <div className="flex gap-1">
//         {label === 'All' ? 'All' : label}
//         <span className="flex justify-center items-center md:hidden rounded-full bg-primary size-5 text-white">
//           <div className={cn('text-sm', value === activeFilter && 'font-bold')}>
//             {counts[value] || 0}
//           </div>
//         </span>
//       </div>
//     </div>
//   )
// }

// export default FilterTabs

'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { RootState } from '@/store/store'

// Generic FilterOptionState to support different filter value types
export interface FilterOptionState<T extends string> {
  label: string
  value: T
  textColor: string
  border: string
  background: string
  icon: string
}

interface FilterTabsProps<T extends string> {
  label: string
  value: T
  background: string
  border: string
  sliceName: 'appointment' | 'customer' | 'service' | 'faq' | 'ticket' // Add more slice names as needed
  onDispatch: (value: T) => any
}

const FilterTabs = <T extends string>({
  label,
  value,
  background,
  border,
  sliceName,
  onDispatch,
}: FilterTabsProps<T>) => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()
  const { activeFilter, counts } = useSelector(
    (state: RootState) => state[sliceName],
  )

  const isActive = activeFilter === value
  const backgroundColor = isActive
    ? background
    : isHovered
      ? 'oklch(96.7% 0.003 264.542)'
      : '#F8F9FA'
  const borderStyle = isActive ? `1px solid ${border}` : 'none'

  return (
    <div
      key={value}
      className={cn(
        `w-full md:w-22 text-sm font-normal px-2 py-2 flex justify-center items-center 
         transition-transform duration-300 cursor-pointer rounded-[8px] active:scale-95 hover:bg-slate-50/80 dark:hover:bg-slate-800/50
        `,
      )}
      style={{
        backgroundColor,
        border: borderStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        dispatch(onDispatch(value))
      }}
    >
      <div className="flex gap-1">
        {label === 'All' ? 'All' : label}
        <span className="flex justify-center items-center md:hidden rounded-full bg-primary size-5 text-white">
          <div className={cn('text-sm', value === activeFilter && 'font-bold')}>
            {counts[value as keyof typeof counts] || 0}
          </div>
        </span>
      </div>
    </div>
  )
}

export default FilterTabs
