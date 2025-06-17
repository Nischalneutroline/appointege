// // components/custom/phone-field.tsx
// 'use client'

// import { useController, useFormContext } from 'react-hook-form'
// import { PhoneInput } from 'react-international-phone'
// import 'react-international-phone/style.css'
// import { Label } from '@/components/ui/label'
// import { cn } from '@/lib/utils'
// import { LucideIcon, PhoneCall } from 'lucide-react'

// interface PhoneFieldProps {
//   name: string
//   label?: string
//   placeholder?: string
//   className?: string
//   icon?: LucideIcon
//   disabled?: boolean
// }

// const PhoneField = ({
//   name,
//   label,
//   className,
//   placeholder,
//   icon: Icon,
//   disabled,
// }: PhoneFieldProps) => {
//   const { control } = useFormContext()
//   const {
//     field: { onChange, value },
//     fieldState: { error },
//   } = useController({ name, control })

//   return (
//     <div className={cn('space-y-2', className)}>
//       <div className="flex gap-2">
//         {Icon && <Icon className="size-4 text-gray-500" />}
//         {label && <Label htmlFor={name}>{label}</Label>}
//       </div>
//       <PhoneInput
//         defaultCountry="np"
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         inputClassName={cn(
//           'w-full h-10 px-12 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
//         )}
//       />
//       {error && <p className="text-xs text-red-500">{error.message}</p>}
//     </div>
//   )
// }

// export default PhoneField

// 'use client'

// import { useController, useFormContext } from 'react-hook-form'
// import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
// import en from 'react-phone-number-input/locale/en.json' // For country names
// import { Label } from '@/components/ui/label'
// import { cn } from '@/lib/utils'
// import { LucideIcon, ChevronDown } from 'lucide-react'
// import { useState, useMemo, useRef, useEffect } from 'react'

// interface PhoneFieldProps {
//   name: string
//   label?: string
//   placeholder?: string
//   className?: string
//   icon?: LucideIcon
//   disabled?: boolean
// }

// interface CountryOption {
//   code: string
//   name: string
//   dialCode: string
//   flag: string
// }

// const PhoneField = ({
//   name,
//   label,
//   className,
//   placeholder,
//   icon: Icon,
//   disabled,
// }: PhoneFieldProps) => {
//   const { control } = useFormContext()
//   const {
//     field: { onChange, value },
//     fieldState: { error },
//   } = useController({ name, control })

//   const [isOpen, setIsOpen] = useState(false)
//   const [search, setSearch] = useState('')
//   const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
//     null,
//   )
//   const [phoneNumber, setPhoneNumber] = useState('')
//   const dropdownRef = useRef<HTMLDivElement>(null)

//   const preferredCountries = ['US', 'GB', 'CA', 'AU', 'NP']

//   // Generate country options
//   const countryOptions = useMemo(() => {
//     const countries = getCountries().map((code) => ({
//       code,
//       name: en[code] || code,
//       dialCode: `+${getCountryCallingCode(code)}`,
//       flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`,
//     }))

//     // Sort: preferred countries first, then others alphabetically
//     const preferred = countries.filter((c) =>
//       preferredCountries.includes(c.code),
//     )
//     const others = countries
//       .filter((c) => !preferredCountries.includes(c.code))
//       .sort((a, b) => a.name.localeCompare(b.name))
//     return [...preferred, ...others]
//   }, [])

//   // Filter countries based on search
//   const filteredCountries = useMemo(() => {
//     return countryOptions.filter(
//       (country) =>
//         country.name.toLowerCase().includes(search.toLowerCase()) ||
//         country.dialCode.includes(search),
//     )
//   }, [search, countryOptions])

//   // Handle country selection
//   const handleCountrySelect = (country: CountryOption) => {
//     setSelectedCountry(country)
//     setIsOpen(false)
//     setSearch('')
//     const newValue = country.dialCode + phoneNumber.replace(/^\+\d+/, '')
//     setPhoneNumber(newValue)
//     onChange(newValue)
//   }

//   // Handle phone number input
//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const input = e.target.value
//     setPhoneNumber(input)
//     onChange(input)
//   }

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   // Initialize default country (Nepal)
//   useEffect(() => {
//     if (!selectedCountry && !value) {
//       const defaultCountry = countryOptions.find((c) => c.code === 'NP')
//       if (defaultCountry) {
//         setSelectedCountry(defaultCountry)
//         setPhoneNumber(defaultCountry.dialCode)
//         onChange(defaultCountry.dialCode)
//       }
//     }
//   }, [selectedCountry, value, countryOptions, onChange])

//   return (
//     <div className={cn('space-y-2', className)}>
//       <div className="flex gap-2 items-center">
//         {Icon && <Icon className="size-4 text-gray-500" />}
//         {label && (
//           <Label htmlFor={name} className="text-sm font-medium">
//             {label}
//           </Label>
//         )}
//       </div>
//       <div className="flex items-center gap-2">
//         <div className="relative w-48" ref={dropdownRef}>
//           <div
//             className={cn(
//               'flex items-center h-10 px-3 py-2 text-sm border rounded-md shadow-sm cursor-pointer',
//               error && 'border-red-500',
//               disabled && 'bg-gray-100 cursor-not-allowed opacity-50',
//             )}
//             onClick={() => !disabled && setIsOpen(!isOpen)}
//           >
//             {selectedCountry ? (
//               <div className="flex items-center w-full">
//                 <img
//                   src={selectedCountry.flag}
//                   alt={`${selectedCountry.name} flag`}
//                   className="w-5 h-3 mr-2"
//                 />
//                 <span>{selectedCountry.dialCode}</span>
//               </div>
//             ) : (
//               <span className="text-gray-500">Select country</span>
//             )}
//             <ChevronDown className="size-4 ml-auto text-gray-500" />
//           </div>
//           {isOpen && !disabled && (
//             <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
//               <input
//                 type="text"
//                 placeholder="Search country or code..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full h-10 px-3 py-2 text-sm border-b rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <ul className="max-h-60 overflow-y-auto">
//                 {filteredCountries.length === 0 ? (
//                   <li className="px-3 py-2 text-sm text-gray-500">
//                     No countries found
//                   </li>
//                 ) : (
//                   filteredCountries.map((country) => (
//                     <li
//                       key={country.code}
//                       onClick={() => handleCountrySelect(country)}
//                       className={cn(
//                         'flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-blue-50',
//                         selectedCountry?.code === country.code && 'bg-blue-100',
//                       )}
//                     >
//                       <img
//                         src={country.flag}
//                         alt={`${country.name} flag`}
//                         className="w-5 h-3 mr-2"
//                       />
//                       {country.name} ({country.dialCode})
//                     </li>
//                   ))
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>
//         <input
//           type="tel"
//           value={phoneNumber}
//           onChange={handlePhoneChange}
//           placeholder={placeholder}
//           disabled={disabled}
//           className={cn(
//             'w-full h-10 px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
//             error && 'border-red-500',
//             disabled && 'bg-gray-100 cursor-not-allowed',
//           )}
//         />
//       </div>
//       {error && <p className="text-xs text-red-500">{error.message}</p>}
//     </div>
//   )
// }

// export default PhoneField

// 'use client'

// import { useController, useFormContext } from 'react-hook-form'
// import {
//   getCountries,
//   getCountryCallingCode,
//   parsePhoneNumber,
// } from 'libphonenumber-js'
// import en from 'react-phone-number-input/locale/en.json'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Input } from '@/components/ui/input'
// import { cn } from '@/lib/utils'
// import { LucideIcon } from 'lucide-react'
// import { useState, useMemo, useEffect } from 'react'

// interface PhoneFieldProps {
//   name: string
//   label?: string
//   placeholder?: string
//   className?: string
//   icon?: LucideIcon
//   disabled?: boolean
// }

// interface CountryOption {
//   code: string
//   name: string
//   dialCode: string
//   flag: string
// }

// const PhoneField = ({
//   name,
//   label,
//   className,
//   placeholder,
//   icon: Icon,
//   disabled,
// }: PhoneFieldProps) => {
//   const { control } = useFormContext()
//   const {
//     field: { onChange, value },
//     fieldState: { error },
//   } = useController({ name, control })

//   const [search, setSearch] = useState('')
//   const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
//     null,
//   )
//   const [phoneNumber, setPhoneNumber] = useState('')
//   const preferredCountries = ['US', 'GB', 'CA', 'AU', 'NP']

//   // Generate country options
//   const countryOptions = useMemo(() => {
//     const countries = getCountries().map((code) => ({
//       code,
//       name: en[code] || code,
//       dialCode: `+${getCountryCallingCode(code)}`,
//       flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`,
//     }))
//     const preferred = countries.filter((c) =>
//       preferredCountries.includes(c.code),
//     )
//     const others = countries
//       .filter((c) => !preferredCountries.includes(c.code))
//       .sort((a, b) => a.name.localeCompare(b.name))
//     return [...preferred, ...others]
//   }, [])

//   // Filter countries based on search
//   const filteredCountries = useMemo(() => {
//     return countryOptions.filter(
//       (country) =>
//         country.name.toLowerCase().includes(search.toLowerCase()) ||
//         country.dialCode.includes(search),
//     )
//   }, [search, countryOptions])

//   // Handle country selection
//   const handleCountrySelect = (countryCode: string) => {
//     const country = countryOptions.find((c) => c.code === countryCode)
//     if (country) {
//       setSelectedCountry(country)
//       const cleanNumber = phoneNumber.replace(/^\+\d+|-/, '') // Remove old code and dash
//       const newValue = `${country.dialCode}-${cleanNumber}`
//       setPhoneNumber(newValue)
//       onChange(newValue.replace('-', '')) // Store without dash
//     }
//   }

//   // Handle phone number input
//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let input = e.target.value
//     // Ensure dash is maintained
//     if (selectedCountry && !input.includes('-')) {
//       const parts = input.split(selectedCountry.dialCode)
//       if (parts.length > 1) {
//         input = `${selectedCountry.dialCode}-${parts[1]}`
//       }
//     }
//     setPhoneNumber(input)
//     onChange(input.replace('-', '')) // Store without dash
//   }

//   // Initialize default country and handle edit mode
//   useEffect(() => {
//     if (value && !selectedCountry) {
//       try {
//         const parsed = parsePhoneNumber(value as string)
//         if (parsed && parsed.country) {
//           const country = countryOptions.find((c) => c.code === parsed.country)
//           if (country) {
//             setSelectedCountry(country)
//             setPhoneNumber(`${country.dialCode}-${parsed.nationalNumber}`)
//             return
//           }
//         }
//       } catch (err) {
//         console.error('Phone number parsing error:', err)
//       }
//     }
//     if (!selectedCountry && !value) {
//       const defaultCountry = countryOptions.find((c) => c.code === 'NP')
//       if (defaultCountry) {
//         setSelectedCountry(defaultCountry)
//         setPhoneNumber(defaultCountry.dialCode)
//         onChange(defaultCountry.dialCode)
//       }
//     }
//   }, [value, selectedCountry, countryOptions, onChange])

//   return (
//     <div className={cn('space-y-2', className)}>
//       <div className="flex gap-2 items-center">
//         {Icon && <Icon className="size-4 text-gray-500" />}
//         {label && (
//           <Label htmlFor={name} className="text-sm font-medium">
//             {label}
//           </Label>
//         )}
//       </div>
//       <div className="flex items-center gap-2">
//         <Select
//           value={selectedCountry?.code}
//           onValueChange={handleCountrySelect}
//           disabled={disabled}
//         >
//           <SelectTrigger
//             className={cn(
//               'w-48',
//               error && 'border-red-500',
//               disabled && 'bg-gray-100 opacity-50',
//             )}
//           >
//             <SelectValue>
//               {selectedCountry ? (
//                 <div className="flex items-center">
//                   <img
//                     src={selectedCountry.flag}
//                     alt={`${selectedCountry.name} flag`}
//                     className="w-5 h-3 mr-2"
//                   />
//                   {selectedCountry.dialCode}
//                 </div>
//               ) : (
//                 'Select country'
//               )}
//             </SelectValue>
//           </SelectTrigger>
//           <SelectContent>
//             <Input
//               type="text"
//               placeholder="Search country or code..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="mx-2 my-1 w-[calc(100%-16px)]"
//             />
//             {filteredCountries.length === 0 ? (
//               <div className="px-3 py-2 text-sm text-gray-500">
//                 No countries found
//               </div>
//             ) : (
//               filteredCountries.map((country) => (
//                 <SelectItem key={country.code} value={country.code}>
//                   <div className="flex items-center">
//                     <img
//                       src={country.flag}
//                       alt={`${country.name} flag`}
//                       className="w-5 h-3 mr-2"
//                     />
//                     {country.name} ({country.dialCode})
//                   </div>
//                 </SelectItem>
//               ))
//             )}
//           </SelectContent>
//         </Select>
//         <Input
//           type="tel"
//           value={phoneNumber}
//           onChange={handlePhoneChange}
//           placeholder={placeholder}
//           disabled={disabled}
//           className={cn(
//             'w-full',
//             error && 'border-red-500',
//             disabled && 'bg-gray-100 opacity-50',
//           )}
//         />
//       </div>
//       {error && <p className="text-xs text-red-500">{error.message}</p>}
//     </div>
//   )
// }

// export default PhoneField
'use client'

// Importing necessary dependencies
import { useController, useFormContext } from 'react-hook-form'
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberWithError as parsePhoneNumber,
} from 'libphonenumber-js'
import en from 'react-phone-number-input/locale/en.json'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { LucideIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'

// Defining interfaces for props and country options
interface PhoneFieldProps {
  name: string
  label?: string
  placeholder?: string
  className?: string
  icon?: LucideIcon
  disabled?: boolean
}

interface CountryOption {
  code: string
  name: string
  dialCode: string
  flag: string
}

/**
 * Sub-component for selecting a country with a searchable dropdown
 */
const CountrySelect = ({
  selectedCountryCode,
  onChange,
  disabled,
  error,
  countryOptions,
}: {
  selectedCountryCode?: string
  onChange: (code: string) => void
  disabled?: boolean
  error?: boolean
  countryOptions: CountryOption[]
}) => {
  // State for search input and dropdown visibility
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  // Refs for focus and click-outside detection
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter countries based on search input
  const filteredCountries = useMemo(() => {
    return countryOptions.filter(
      (country) =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.dialCode.includes(search) ||
        country.code.toLowerCase().includes(search.toLowerCase()), // Include country code (e.g., "NP")
    )
  }, [search, countryOptions])

  // Find the selected country for rendering in trigger
  const selectedCountry = countryOptions.find(
    (c) => c.code === selectedCountryCode,
  )

  // Handle click-outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Handle country selection
  const handleSelectCountry = (code: string) => {
    onChange(code)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        className={cn(
          'flex items-center gap-1 px-3 py-2 border rounded-md min-w-max text-sm',
          error && 'border-red-400',
          disabled && 'bg-gray-50 opacity-50 cursor-not-allowed',
          isOpen && 'ring-2 ring-blue-500',
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedCountry ? (
          <div className="flex items-center gap-1">
            <img
              src={selectedCountry.flag}
              alt={`${selectedCountry.name} flag`}
              className="w-5 h-3"
            />
            <span className="min-w-max">{selectedCountry.code}</span>
          </div>
        ) : (
          'Select country'
        )}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div className="absolute z-20 w-[240px] mt-1 bg-background border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
          {/* Sticky search input */}
          <div className="sticky top-0 z-10 bg-background px-2 py-1 border-b">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search country, code, or dial code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredCountries.length > 0) {
                  handleSelectCountry(filteredCountries[0].code)
                } else if (e.key === 'Escape') {
                  setIsOpen(false)
                  setSearch('')
                }
              }}
            />
          </div>
          {/* Country list */}
          {filteredCountries.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No countries found
            </div>
          ) : (
            filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                onClick={() => handleSelectCountry(country.code)}
              >
                <img
                  src={country.flag}
                  alt={`${country.name} flag`}
                  className="w-5 h-3"
                />
                {country.name} ({country.dialCode})
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Sub-component for phone number input
 */
const PhoneInput = ({
  value,
  onChange,
  placeholder,
  error,
  selectedCountry,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  selectedCountry?: CountryOption | null
  disabled?: boolean
}) => {
  return (
    // Phone number input field
    <Input
      type="text"
      value={value}
      onChange={(e) => {
        let input = e.target.value
        // Ensure single space separator
        if (selectedCountry && !input.includes(' ')) {
          const parts = input.split(selectedCountry.dialCode)
          if (parts.length > 1) {
            input = `${selectedCountry.dialCode} ${parts[1].trim()}`
          }
        }
        // Normalize spaces
        input = input.replace(/\s+/g, ' ').trim()
        onChange(input)
      }}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'w-full',
        error && 'border-red-400',
        disabled && 'bg-gray-50 opacity-50 cursor-not-allowed',
      )}
    />
  )
}

/**
 * Main PhoneField component integrating country selection and phone input
 */
const PhoneField = ({
  name,
  label,
  className,
  placeholder,
  icon: Icon,
  disabled,
}: PhoneFieldProps) => {
  // Form context and controller from React Hook Form
  const { control } = useFormContext()
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control })

  // State for selected country and phone number
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null,
  )
  const [phoneNumber, setPhoneNumber] = useState('')

  // Preferred countries to prioritize in dropdown
  const preferredCountries = ['US', 'GB', 'CA', 'AU', 'NP']

  // Generate country options with flags and dial codes
  const countryOptions = useMemo(() => {
    const countries = getCountries().map((code) => ({
      code,
      name: en[code] || code,
      dialCode: `+${getCountryCallingCode(code)}`,
      flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`,
    }))
    const preferred = countries.filter((c) =>
      preferredCountries.includes(c.code),
    )
    const others = countries
      .filter((c) => !preferredCountries.includes(c.code))
      .sort((a, b) => a.name.localeCompare(b.name))
    return [...preferred, ...others]
  }, [])

  // Handle country selection
  const handleCountrySelect = (countryCode: string) => {
    const country = countryOptions.find((c) => c.code === countryCode)
    if (country) {
      setSelectedCountry(country)
      // Remove old dial code and spaces
      const cleanNumber = phoneNumber.replace(/^\+\d+\s*/, '').trim()
      const newValue = cleanNumber
        ? `${country.dialCode} ${cleanNumber}`
        : country.dialCode
      setPhoneNumber(newValue)
      onChange(newValue) // Store with space
    }
  }

  // Handle phone number input changes
  const handlePhoneChange = (input: string) => {
    setPhoneNumber(input)
    onChange(input) // Store with space
  }

  // Initialize default country and handle edit mode
  useEffect(() => {
    if (value && !selectedCountry) {
      const input = value as string
      // Try splitting by space to get country code
      const parts = input.split(' ')
      if (parts.length > 1) {
        const dialCode = parts[0]
        const country = countryOptions.find((c) => c.dialCode === dialCode)
        if (country) {
          setSelectedCountry(country)
          setPhoneNumber(input) // Keep space separator
          return
        }
      }
      // Fallback to parsing with libphonenumber-js
      try {
        const parsed = parsePhoneNumber(input)
        if (parsed && parsed.country) {
          const country = countryOptions.find((c) => c.code === parsed.country)
          if (country) {
            setSelectedCountry(country)
            setPhoneNumber(`${country.dialCode} ${parsed.nationalNumber}`)
            return
          }
        }
      } catch (err) {
        console.error('Phone number parsing error:', err)
      }
    }
    // Set default country (Nepal) if no value
    if (!selectedCountry && !value) {
      const defaultCountry = countryOptions.find((c) => c.code === 'NP')
      if (defaultCountry) {
        setSelectedCountry(defaultCountry)
        setPhoneNumber(defaultCountry.dialCode)
        onChange(defaultCountry.dialCode)
      }
    }
  }, [value, selectedCountry, countryOptions, onChange])

  return (
    // Main container for phone field
    <div className={cn('space-y-2', className)}>
      {/* Label and icon */}
      <div className="flex gap-2 items-center">
        {Icon && <Icon className="size-4 text-gray-500" />}
        {label && (
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
          </Label>
        )}
      </div>
      {/* Country select and phone input */}
      <div className="flex items-center gap-2">
        <CountrySelect
          selectedCountryCode={selectedCountry?.code}
          onChange={handleCountrySelect}
          disabled={disabled}
          error={!!error}
          countryOptions={countryOptions}
        />
        <PhoneInput
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          error={!!error}
          selectedCountry={selectedCountry}
          disabled={disabled}
        />
      </div>
      {/* Error message */}
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  )
}

export default PhoneField
