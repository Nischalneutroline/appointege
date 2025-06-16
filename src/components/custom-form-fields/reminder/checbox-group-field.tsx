// "use client"

// import { useFormContext } from "react-hook-form"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form"
// import { Label } from "@/components/ui/label"
// import { LucideIcon } from "lucide-react"
// import { string } from "zod"

// interface CheckboxGroupFieldProps {
//   name: string
//   label: string
//   options: string[{ string; string }]
//   className?: string
//   icon?: LucideIcon
// }

// const CheckboxGroupField = ({
//   name,
//   label,
//   options,
//   className,
//   icon: Icon,
// }: CheckboxGroupFieldProps) => {
//   const { control, setValue, watch } = useFormContext()

//   const toggleCheckbox = (value: string) => {
//     const current = watch(name)
//     if (current.includes(value)) {
//       setValue(
//         name,
//         current.filter((v: string) => v !== value)
//       )
//     } else {
//       setValue(name, [...current, value])
//     }
//   }

//   console.log(options, "options")

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={() => (
//         <FormItem className={className}>
//           <div className="flex gap-1">
//             {Icon && <Icon className="size-4 text-gray-500" />}
//             <FormLabel>{label}</FormLabel>
//           </div>
//           <div className="flex flex-col md:flex-row flex-wrap gap-4">
//             {options?.map((option) => (
//               <div key={option} className="flex items-center gap-2">
//                 <FormControl>
//                   <Checkbox
//                     id={option}
//                     checked={watch(name).includes(option)}
//                     onCheckedChange={() => toggleCheckbox(option)}
//                   />
//                 </FormControl>
//                 <Label htmlFor={option}>{option}</Label>
//               </div>
//             ))}
//           </div>
//         </FormItem>
//       )}
//     />
//   )
// }

// export default CheckboxGroupField

"use client"

import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { LucideIcon } from "lucide-react"

interface CheckboxGroupFieldProps {
  name: string
  label: string
  options: Array<string | { label: string; value: string }>
  className?: string
  icon?: LucideIcon
}

const CheckboxGroupField = ({
  name,
  label,
  options,
  className,
  icon: Icon,
}: CheckboxGroupFieldProps) => {
  const { control, setValue, watch } = useFormContext()
  const values = watch(name) || []

  const toggleCheckbox = (value: string) => {
    const newValues = values.includes(value)
      ? values.filter((v: string) => v !== value)
      : [...values, value]
    setValue(name, newValues)
  }

  console.log("CheckboxGroupField: options =", options)

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <div className="flex gap-1">
            {Icon && <Icon className="size-4 text-gray-500" />}
            <FormLabel>{label}</FormLabel>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap gap-4">
            {options?.map((option) => {
              const value = typeof option === "string" ? option : option.value
              const displayLabel =
                typeof option === "string" ? option : option.label

              return (
                <div key={value} className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      id={`${name}-${value}`}
                      checked={values.includes(value)}
                      onCheckedChange={() => toggleCheckbox(value)}
                    />
                  </FormControl>
                  <Label htmlFor={`${name}-${value}`}>{displayLabel}</Label>
                </div>
              )
            })}
          </div>
        </FormItem>
      )}
    />
  )
}

export default CheckboxGroupField
