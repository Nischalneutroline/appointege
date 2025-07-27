// // 'use client'

// // import React, { useState, useEffect, useRef } from 'react'
// // import { ChevronDown, Funnel } from 'lucide-react'
// // import { cn } from '@/utils/utils'
// // import {
// //   AppointmentFilterValue,
// //   FilterAppoinmentState,
// // } from '@/app/(protected)/admin/appointment/_data/data'

// // interface FilterDropdownProps {
// //   filterOptions: FilterAppoinmentState[]
// //   activeFilters: AppointmentFilterValue[]
// //   onFilterChange: (filters: AppointmentFilterValue[]) => void
// // }

// // const FilterDropdown: React.FC<FilterDropdownProps> = ({
// //   filterOptions,
// //   activeFilters,
// //   onFilterChange,
// // }) => {
// //   const [isOpen, setIsOpen] = useState(false)
// //   const dropdownRef = useRef<HTMLDivElement>(null)

// //   const toggleFilter = (filterValue: AppointmentFilterValue) => {
// //     const newFilters = activeFilters.includes(filterValue)
// //       ? activeFilters.filter((f) => f !== filterValue)
// //       : [...activeFilters, filterValue]
// //     onFilterChange(newFilters)
// //     console.log('New filters:', newFilters)
// //   }

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (
// //         dropdownRef.current &&
// //         !dropdownRef.current.contains(event.target as Node)
// //       ) {
// //         setIsOpen(false)
// //       }
// //     }
// //     document.addEventListener('mousedown', handleClickOutside)
// //     return () => document.removeEventListener('mousedown', handleClickOutside)
// //   }, [])

// //   return (
// //     <div className="relative" ref={dropdownRef}>
// //       <div
// //         className="flex text-[#6B7280] items-center gap-1 justify-center border border-[#E5E7EB] bg-white rounded-[8px] w-24 cursor-pointer hover:scale-110 transition duration-400"
// //         onClick={() => setIsOpen(!isOpen)}
// //       >
// //         <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
// //         <div className="text-sm font-normal">Filter</div>
// //         <ChevronDown strokeWidth={2.5} size={14} />
// //       </div>
// //       {isOpen && (
// //         <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-10">
// //           {filterOptions.map((option) => (
// //             <label
// //               key={option.value}
// //               className="flex items-center gap-2 px-4 py-2 hover:bg-[#F3F4F6] cursor-pointer"
// //             >
// //               <input
// //                 type="checkbox"
// //                 checked={activeFilters.includes(option.value)}
// //                 onChange={() => toggleFilter(option.value)}
// //                 className="h-4 w-4 text-[#4F7CFF] focus:ring-[#4F7CFF] border-[#E5E7EB]"
// //               />
// //               <span className="text-sm" style={{ color: option.textColor }}>
// //                 {option.label} ({option.count})
// //               </span>
// //             </label>
// //           ))}
// //           <button
// //             className="w-full text-left px-4 py-2 text-blue-600 hover:bg-[#F3F4F6]"
// //             onClick={() => {
// //               onFilterChange(['today', 'upcoming', 'completed', 'all'])
// //               setIsOpen(false)
// //             }}
// //           >
// //             Reset to Default
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default FilterDropdown

// // 'use client'

// // import React from 'react'
// // import { useDispatch } from 'react-redux'
// // import { cn } from '@/lib/utils'
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// //   DropdownMenuCheckboxItem,
// // } from '@/components/ui/dropdown-menu'
// // import { Button } from '@/components/ui/button'
// // import {
// //   FilterAppoinmentState,
// //   AppointmentFilterValue,
// // } from '@/app/(protected)/admin/appointment/_data/data'
// // import {
// //   setActiveFilter,
// //   setActiveFilters,
// // } from '@/store/slices/appointmentSlice'
// // import { ChevronDown, Funnel } from 'lucide-react'
// // import { DEFAULT_FILTERS_VALUES } from '@/app/(protected)/admin/appointment/_types/appointment'

// // interface FilterDropdownProps {
// //   filterOptions: FilterAppoinmentState[]
// //   activeFilters: AppointmentFilterValue[]
// //   onFilterChange: (filters: AppointmentFilterValue[]) => void
// // }

// // const FilterDropdown = ({
// //   filterOptions,
// //   activeFilters,
// //   onFilterChange,
// // }: FilterDropdownProps) => {
// //   const dispatch = useDispatch()

// //   const handleFilterChange = (
// //     value: AppointmentFilterValue,
// //     checked: boolean,
// //   ) => {
// //     const newFilters = checked
// //       ? [...activeFilters, value]
// //       : activeFilters.filter(
// //           (filter) =>
// //             !DEFAULT_FILTERS_VALUES.includes(filter) && filter !== value,
// //         )

// //     // Dispatch setActiveFilters with the new filters
// //     onFilterChange(newFilters)
// //     dispatch(setActiveFilters(newFilters))

// //     // Update activeFilter to the first selected filter or 'today' if none
// //     const newActiveFilter = newFilters.length > 0 ? newFilters[0] : 'today'
// //     dispatch(setActiveFilter(newActiveFilter))
// //   }

// //   return (
// //     <DropdownMenu>
// //       <DropdownMenuTrigger asChild>
// //         <Button
// //           variant="outline"
// //           className={cn(
// //             'h-10 w-[160px] justify-between text-sm font-normal text-gray-500',
// //             {
// //               'text-muted-foreground': activeFilters.length === 0,
// //             },
// //           )}
// //         >
// //           <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
// //           <div className="text-sm font-normal"> Select Filters</div>
// //           <ChevronDown strokeWidth={2.5} size={14} />
// //           {/* <ChevronDown className="ml-2 h-4 w-4" /> */}
// //         </Button>
// //       </DropdownMenuTrigger>
// //       <DropdownMenuContent className="w-[160px]">
// //         {filterOptions.map((option) => (
// //           <DropdownMenuCheckboxItem
// //             key={option.value}
// //             checked={activeFilters.includes(option.value)}
// //             onCheckedChange={(checked) =>
// //               handleFilterChange(option.value, checked)
// //             }
// //             className="text-sm"
// //           >
// //             <div className="flex gap-2 items-center">
// //               <span>{option.label === 'All' ? 'All' : option.label}</span>
// //               <span className="text-xs text-muted-foreground">
// //                 ({option.count && option.count})
// //               </span>
// //             </div>
// //           </DropdownMenuCheckboxItem>
// //         ))}
// //       </DropdownMenuContent>
// //     </DropdownMenu>
// //   )
// // }

// // export default FilterDropdown
// // 'use client'

// // import React from 'react'
// // import { useDispatch } from 'react-redux'
// // import { cn } from '@/lib/utils'
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// //   DropdownMenuCheckboxItem,
// // } from '@/components/ui/dropdown-menu'
// // import { Button } from '@/components/ui/button'
// // import { AppointmentFilterValue } from '@/app/(protected)/admin/appointment/_data/data'
// // import {
// //   FilterOptionState,
// //   setActiveFilter,
// //   setActiveFilters,
// // } from '@/store/slices/appointmentSlice'
// // import { ChevronDown, Funnel, Lock } from 'lucide-react'
// // import { DEFAULT_FILTERS_VALUES } from '@/app/(protected)/admin/appointment/_types/appointment'

// // interface FilterDropdownProps {
// //   filterOptions: (FilterOptionState & { count: number })[]
// //   activeFilters: AppointmentFilterValue[]
// //   onFilterChange: (filters: AppointmentFilterValue[]) => void
// // }

// // const FilterDropdown = ({
// //   filterOptions,
// //   activeFilters,
// //   onFilterChange,
// // }: FilterDropdownProps) => {
// //   const dispatch = useDispatch()

// //   const handleFilterChange = (
// //     value: AppointmentFilterValue,
// //     checked?: boolean,
// //   ) => {
// //     if (DEFAULT_FILTERS_VALUES.includes(value)) {
// //       dispatch(setActiveFilter(value))
// //       return
// //     }

// //     const newFilters = checked
// //       ? [...activeFilters, value]
// //       : activeFilters.filter((filter) => filter !== value)

// //     onFilterChange(newFilters)
// //     dispatch(setActiveFilters(newFilters))

// //     const newActiveFilter = newFilters.length > 0 ? newFilters[0] : 'today'
// //     dispatch(setActiveFilter(newActiveFilter))
// //   }

// //   return (
// //     <DropdownMenu>
// //       <DropdownMenuTrigger asChild>
// //         <Button
// //           variant="outline"
// //           className={cn(
// //             'h-10 w-[160px] justify-between text-sm font-normal text-gray-500',
// //             {
// //               'text-muted-foreground': activeFilters.length === 0,
// //             },
// //           )}
// //         >
// //           <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
// //           <div className="text-sm font-normal"> Select Filters</div>
// //           <ChevronDown strokeWidth={2.5} size={14} />
// //         </Button>
// //       </DropdownMenuTrigger>
// //       <DropdownMenuContent className="w-[160px]">
// //         {filterOptions.map((option: FilterOptionState & { count: number }) => {
// //           const isDefaultFilter = DEFAULT_FILTERS_VALUES.includes(option.value)

// //           return isDefaultFilter ? (
// //             <DropdownMenuItem
// //               key={option.value}
// //               onSelect={() => handleFilterChange(option.value)}
// //               className="text-sm"
// //             >
// //               <div className="flex gap-2 items-center">
// //                 <Lock size={14} className="text-gray-400" />
// //                 <span>{option.label === 'All' ? 'All' : option.label}</span>
// //                 <span className="text-xs text-muted-foreground">
// //                   ({option.count})
// //                 </span>
// //               </div>
// //             </DropdownMenuItem>
// //           ) : (
// //             <DropdownMenuCheckboxItem
// //               key={option.value}
// //               checked={activeFilters.includes(option.value)}
// //               onCheckedChange={(checked) =>
// //                 handleFilterChange(option.value, checked)
// //               }
// //               className="text-sm"
// //             >
// //               <div className="flex gap-2 items-center">
// //                 <span>{option.label}</span>
// //                 <span className="text-xs text-muted-foreground">
// //                   ({option.count})
// //                 </span>
// //               </div>
// //             </DropdownMenuCheckboxItem>
// //           )
// //         })}
// //       </DropdownMenuContent>
// //     </DropdownMenu>
// //   )
// // }

// // export default FilterDropdown
// 'use client'

// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { cn } from '@/lib/utils'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
// } from '@/components/ui/dropdown-menu'
// import { Button } from '@/components/ui/button'
// import { RootState } from '@/store/store'
// import { ChevronDown, Funnel, Lock } from 'lucide-react'

// // Generic FilterOptionState to support different filter value types
// export interface FilterOptionState<T extends string> {
//   label: string
//   value: T
//   textColor: string
//   border: string
//   background: string
//   icon: string
// }

// interface FilterDropdownProps<T extends string> {
//   filterOptions: (FilterOptionState<T> & { count: number })[]
//   activeFilters: T[]
//   defaultFilters: T[] // Non-removable filters
//   sliceName: 'appointment' | 'customer' | 'service' // Add more slice names as needed
//   onDispatch: {
//     setActiveFilter: (value: T) => any
//     setActiveFilters: (filters: T[]) => any
//   }
// }

// const FilterDropdown = <T extends string>({
//   filterOptions,
//   activeFilters,
//   defaultFilters,
//   sliceName,
//   onDispatch,
// }: FilterDropdownProps<T>) => {
//   const dispatch = useDispatch()
//   const { activeFilter } = useSelector((state: RootState) => state[sliceName])

//   const handleFilterChange = (value: T, checked?: boolean) => {
//     const isDefaultFilter = defaultFilters.includes(value)

//     if (isDefaultFilter) {
//       // For default filters, only set activeFilter and do not modify activeFilters
//       dispatch(onDispatch.setActiveFilter(value))
//       return
//     }

//     // TODO: For non-default filters, if they are not in activeFilters then dispatch activeFilter
//     // if (!activeFilters.includes(value)) {
//     //   dispatch(onDispatch.setActiveFilter(value))
//     // }

//     // Handle non-default filters
//     const newFilters = checked
//       ? [...activeFilters, value]
//       : activeFilters.filter((filter) => filter !== value)

//     dispatch(onDispatch.setActiveFilters(newFilters))

//     // Set activeFilter to the first non-default filter or a default filter if no others are selected
//     const newActiveFilter =
//       newFilters.length > 0 ? newFilters[0] : defaultFilters[0]
//     if (newActiveFilter !== undefined) {
//       dispatch(onDispatch.setActiveFilter(newActiveFilter))
//     }
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           className={cn(
//             'h-10 w-auto justify-between text-sm font-normal text-gray-500',
//             {
//               'text-muted-foreground': activeFilters.length === 0,
//             },
//           )}
//         >
//           <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
//           <div className="text-sm font-normal">Filters</div>
//           <ChevronDown strokeWidth={2.5} size={14} />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-[160px]">
//         {filterOptions.map((option) => {
//           const isDefaultFilter = defaultFilters.includes(option.value)

//           return isDefaultFilter ? (
//             <DropdownMenuItem
//               key={option.value}
//               onSelect={() => handleFilterChange(option.value)}
//               className="text-sm"
//             >
//               <div className="flex gap-2 items-center">
//                 <Lock size={14} className="text-gray-400" />
//                 <span>{option.label === 'All' ? 'All' : option.label}</span>
//                 <span className="text-xs text-muted-foreground">
//                   ({option.count})
//                 </span>
//               </div>
//             </DropdownMenuItem>
//           ) : (
//             <DropdownMenuCheckboxItem
//               key={option.value}
//               checked={activeFilters.includes(option.value)}
//               onCheckedChange={(checked) =>
//                 handleFilterChange(option.value, checked)
//               }
//               className="text-sm"
//             >
//               <div className="flex gap-2 items-center">
//                 <span>{option.label}</span>
//                 <span className="text-xs text-muted-foreground">
//                   ({option.count})
//                 </span>
//               </div>
//             </DropdownMenuCheckboxItem>
//           )
//         })}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// export default FilterDropdown

'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { RootState } from '@/store/store'
import { ChevronDown, Funnel, Lock } from 'lucide-react'

// Generic FilterOptionState to support different filter value types
export interface FilterOptionState<T extends string> {
  label: string
  value: T
  textColor: string
  border: string
  background: string
  icon: string
}

interface FilterDropdownProps<T extends string> {
  filterOptions: (FilterOptionState<T> & { count: number })[]
  activeFilters: T[]
  defaultFilters: T[] // Non-removable filters
  sliceName: 'appointment' | 'customer' | 'service' | 'faq' // Add more slice names as needed
  onDispatch: {
    setActiveFilter: (value: T) => any
    setActiveFilters: (filters: T[]) => any
  }
}

const FilterDropdown = <T extends string>({
  filterOptions,
  activeFilters,
  defaultFilters,
  sliceName,
  onDispatch,
}: FilterDropdownProps<T>) => {
  const dispatch = useDispatch()
  const { activeFilter } = useSelector((state: RootState) => state[sliceName])

  const handleFilterChange = (value: T, checked?: boolean) => {
    const isDefaultFilter = defaultFilters.includes(value)

    if (isDefaultFilter) {
      // For default filters, only set activeFilter
      dispatch(onDispatch.setActiveFilter(value))
      return
    }

    // Handle non-default filters
    const newFilters = checked
      ? [...activeFilters, value]
      : activeFilters.filter((filter) => filter !== value)

    dispatch(onDispatch.setActiveFilters(newFilters))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-10 w-auto justify-between text-sm font-normal text-gray-500',
            {
              'text-muted-foreground': activeFilters.length === 0,
            },
          )}
        >
          <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
          <div className="text-sm font-normal">Filters</div>
          <ChevronDown strokeWidth={2.5} size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[160px]">
        {filterOptions.map((option) => {
          const isDefaultFilter = defaultFilters.includes(option.value)

          return isDefaultFilter ? (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleFilterChange(option.value)}
              className="text-sm"
            >
              <div className="flex gap-2 items-center">
                <Lock size={14} className="text-gray-400" />
                <span>{option.label === 'All' ? 'All' : option.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({option.count})
                </span>
              </div>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={activeFilters.includes(option.value)}
              onCheckedChange={(checked) =>
                handleFilterChange(option.value, checked)
              }
              className="text-sm"
            >
              <div className="flex gap-2 items-center">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({option.count})
                </span>
              </div>
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FilterDropdown
