// 'use client'

// import { format, addDays, startOfToday } from 'date-fns'
// import { CalendarIcon, LucideIcon } from 'lucide-react'
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from '@/components/ui/popover'
// import { Button } from '@/components/ui/button'
// import { Calendar } from '@/components/ui/calendar'
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from '@/components/ui/form'
// import { cn } from '@/lib/utils'
// import { useFormContext } from 'react-hook-form'

// interface DatePickerFieldProps {
//   name: string
//   label: string
//   placeholder?: string
//   disabled?: boolean
//   minDate?: Date
//   maxDate?: Date
//   icon?: LucideIcon
//   className?: string // Fixed: Changed from LucideIcon to string
//   buttonClassName?: string
// }

// const DatePickerField = ({
//   name,
//   label,
//   placeholder = 'Pick a date',
//   disabled,
//   minDate = startOfToday(),
//   maxDate = addDays(new Date(), 30),
//   icon: Icon,
//   className,
//   buttonClassName,
// }: DatePickerFieldProps) => {
//   const { control } = useFormContext()

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className={cn('flex flex-col', className)}>
//           <div className="flex items-center">
//             {/* {Icon && <Icon className="size-4 text-gray-500" />} */}
//             <FormLabel>{label}</FormLabel>
//           </div>
//           <Popover>
//             <PopoverTrigger asChild>
//               <FormControl className="p-[12px]">
//                 <Button
//                   variant="outline"
//                   className={cn(
//                     'w-full justify-start text-left font-normal ',
//                     !field.value && 'text-muted-foreground',
//                     buttonClassName,
//                   )}
//                   disabled={disabled}
//                 >
//                   {field.value ? (
//                     format(field.value, 'PPP')
//                   ) : (
//                     <span>{placeholder}</span>
//                   )}
//                   {Icon && <Icon className="ml-auto h-4 w-4 opacity-50" />}
//                 </Button>
//               </FormControl>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 mode="single"
//                 selected={field.value}
//                 onSelect={(date) => field.onChange(date)}
//                 disabled={(date) =>
//                   !!disabled || date < minDate || date > maxDate
//                 }
//                 initialFocus
//               />
//             </PopoverContent>
//           </Popover>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   )
// }

// export default DatePickerField

'use client'

import { format, addDays, startOfToday } from 'date-fns'
import { CalendarIcon, LucideIcon } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'

interface DatePickerFieldProps {
  name: string
  label: string
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  icon?: LucideIcon
  className?: string
  buttonClassName?: string
}

const DatePickerField = ({
  name,
  label,
  placeholder = 'Pick a date',
  disabled,
  minDate = startOfToday(),
  maxDate = addDays(new Date(), 30),
  icon: Icon = CalendarIcon,
  className,
  buttonClassName,
}: DatePickerFieldProps) => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          <div className="flex items-center gap-2">
            {/* {Icon && <Icon className="size-4 text-gray-500" />} */}
            <FormLabel>{label}</FormLabel>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground',
                    'hover:bg-transparent hover:border-[#A4CCFF] hover:text-none', // Prevent hover changes
                    buttonClassName,
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <Icon className="ml-auto h-4 w-4 text-gray-500" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => field.onChange(date)}
                disabled={(date) =>
                  !!disabled || date < minDate || date > maxDate
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default DatePickerField
