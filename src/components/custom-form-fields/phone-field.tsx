// // export default PhoneField
// 'use client'

// // Importing necessary dependencies
// import { useController, useFormContext } from 'react-hook-form'
// import {
//   getCountries,
//   getCountryCallingCode,
//   parsePhoneNumberWithError as parsePhoneNumber,
// } from 'libphonenumber-js'
// import en from 'react-phone-number-input/locale/en.json'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { cn } from '@/lib/utils'
// import { LucideIcon, ChevronDown, ChevronUp } from 'lucide-react'
// import { useState, useMemo, useEffect, useRef } from 'react'

// // Defining interfaces for props and country options
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

// /**
//  * Sub-component for selecting a country with a searchable dropdown
//  */
// const CountrySelect = ({
//   selectedCountryCode,
//   onChange,
//   disabled,
//   error,
//   countryOptions,
// }: {
//   selectedCountryCode?: string
//   onChange: (code: string) => void
//   disabled?: boolean
//   error?: boolean
//   countryOptions: CountryOption[]
// }) => {
//   // State for search input and dropdown visibility
//   const [search, setSearch] = useState('')
//   const [isOpen, setIsOpen] = useState(false)
//   // Refs for focus and click-outside detection
//   const searchInputRef = useRef<HTMLInputElement>(null)
//   const dropdownRef = useRef<HTMLDivElement>(null)

//   // Filter countries based on search input
//   const filteredCountries = useMemo(() => {
//     return countryOptions.filter(
//       (country) =>
//         country.name.toLowerCase().includes(search.toLowerCase()) ||
//         country.dialCode.includes(search) ||
//         country.code.toLowerCase().includes(search.toLowerCase()), // Include country code (e.g., "NP")
//     )
//   }, [search, countryOptions])

//   // Find the selected country for rendering in trigger
//   const selectedCountry = countryOptions.find(
//     (c) => c.code === selectedCountryCode,
//   )

//   // Handle click-outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false)
//         setSearch('')
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   // Focus search input when dropdown opens
//   useEffect(() => {
//     if (isOpen && searchInputRef.current) {
//       searchInputRef.current.focus()
//     }
//   }, [isOpen])

//   // Handle country selection
//   const handleSelectCountry = (code: string) => {
//     onChange(code)
//     setIsOpen(false)
//     setSearch('')
//   }

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Trigger button */}
//       <button
//         type="button"
//         className={cn(
//           'flex items-center gap-1 px-3 py-2 border rounded-md min-w-max text-sm',
//           error && 'border-red-400',
//           disabled && 'bg-gray-50 opacity-50 cursor-not-allowed',
//           isOpen && 'ring-2 ring-blue-500',
//         )}
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//         disabled={disabled}
//       >
//         {selectedCountry ? (
//           <div className="flex items-center gap-1">
//             <img
//               src={selectedCountry.flag}
//               alt={`${selectedCountry.name} flag`}
//               className="w-5 h-3"
//             />
//             <span className="min-w-max">{selectedCountry.code}</span>
//           </div>
//         ) : (
//           'Select country'
//         )}
//         {isOpen ? (
//           <ChevronUp className="w-4 h-4 ml-1" />
//         ) : (
//           <ChevronDown className="w-4 h-4 ml-1" />
//         )}
//       </button>

//       {/* Dropdown content */}
//       {isOpen && (
//         <div className="absolute z-20 w-[240px] mt-1 bg-background border rounded-md shadow-lg max-h-[300px] overflow-y-auto">
//           {/* Sticky search input */}
//           <div className="sticky top-0 z-10 bg-background px-2 py-1 border-b">
//             <Input
//               ref={searchInputRef}
//               type="text"
//               placeholder="Search country, code, or dial code..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="text-sm"
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' && filteredCountries.length > 0) {
//                   handleSelectCountry(filteredCountries[0].code)
//                 } else if (e.key === 'Escape') {
//                   setIsOpen(false)
//                   setSearch('')
//                 }
//               }}
//             />
//           </div>
//           {/* Country list */}
//           {filteredCountries.length === 0 ? (
//             <div className="px-3 py-2 text-sm text-gray-500">
//               No countries found
//             </div>
//           ) : (
//             filteredCountries.map((country) => (
//               <button
//                 key={country.code}
//                 type="button"
//                 className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
//                 onClick={() => handleSelectCountry(country.code)}
//               >
//                 <img
//                   src={country.flag}
//                   alt={`${country.name} flag`}
//                   className="w-5 h-3"
//                 />
//                 {country.name} ({country.dialCode})
//               </button>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// /**
//  * Sub-component for phone number input
//  */
// const PhoneInput = ({
//   value,
//   onChange,
//   placeholder,
//   error,
//   selectedCountry,
//   disabled,
// }: {
//   value: string
//   onChange: (value: string) => void
//   placeholder?: string
//   error?: boolean
//   selectedCountry?: CountryOption | null
//   disabled?: boolean
// }) => {
//   return (
//     // Phone number input field
//     <Input
//       type="text"
//       value={value}
//       onChange={(e) => {
//         let input = e.target.value
//         // Ensure single space separator
//         if (selectedCountry && !input.includes(' ')) {
//           const parts = input.split(selectedCountry.dialCode)
//           if (parts.length > 1) {
//             input = `${selectedCountry.dialCode} ${parts[1].trim()}`
//           }
//         }
//         // Normalize spaces
//         input = input.replace(/\s+/g, ' ').trim()
//         onChange(input)
//       }}
//       placeholder={placeholder}
//       disabled={disabled}
//       className={cn(
//         'w-full',
//         error && 'border-red-400',
//         disabled && 'bg-gray-50 opacity-50 cursor-not-allowed',
//       )}
//     />
//   )
// }

// /**
//  * Main PhoneField component integrating country selection and phone input
//  */
// const PhoneField = ({
//   name,
//   label,
//   className,
//   placeholder,
//   icon: Icon,
//   disabled,
// }: PhoneFieldProps) => {
//   // Form context and controller from React Hook Form
//   const { control } = useFormContext()
//   const {
//     field: { onChange, value },
//     fieldState: { error },
//   } = useController({ name, control })

//   // State for selected country and phone number
//   const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
//     null,
//   )
//   const [phoneNumber, setPhoneNumber] = useState('')

//   // Preferred countries to prioritize in dropdown
//   const preferredCountries = ['US', 'GB', 'CA', 'AU', 'NP', 'IN', "F"]

//   // Generate country options with flags and dial codes
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

//   // Handle country selection
//   const handleCountrySelect = (countryCode: string) => {
//     const country = countryOptions.find((c) => c.code === countryCode)
//     if (country) {
//       setSelectedCountry(country)
//       // Remove old dial code and spaces
//       const cleanNumber = phoneNumber.replace(/^\+\d+\s*/, '').trim()
//       const newValue = cleanNumber
//         ? `${country.dialCode} ${cleanNumber}`
//         : country.dialCode
//       setPhoneNumber(newValue)
//       onChange(newValue) // Store with space
//     }
//   }

//   // Handle phone number input changes
//   const handlePhoneChange = (input: string) => {
//     setPhoneNumber(input)
//     onChange(input) // Store with space
//   }

//   // Initialize default country and handle edit mode
//   useEffect(() => {
//     if (value && !selectedCountry) {
//       const input = value as string
//       // Try splitting by space to get country code
//       const parts = input.split(' ')
//       if (parts.length > 1) {
//         const dialCode = parts[0]
//         const country = countryOptions.find((c) => c.dialCode === dialCode)
//         if (country) {
//           setSelectedCountry(country)
//           setPhoneNumber(input) // Keep space separator
//           return
//         }
//       }
//       // Fallback to parsing with libphonenumber-js
//       try {
//         const parsed = parsePhoneNumber(input)
//         if (parsed && parsed.country) {
//           const country = countryOptions.find((c) => c.code === parsed.country)
//           if (country) {
//             setSelectedCountry(country)
//             setPhoneNumber(`${country.dialCode} ${parsed.nationalNumber}`)
//             return
//           }
//         }
//       } catch (err) {
//         console.error('Phone number parsing error:', err)
//       }
//     }
//     // Set default country (Nepal) if no value
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
//     // Main container for phone field
//     <div className={cn('space-y-2', className)}>
//       {/* Label and icon */}
//       <div className="flex gap-2 items-center">
//         {Icon && <Icon className="size-4 text-gray-500" />}
//         {label && (
//           <Label htmlFor={name} className="text-sm font-medium">
//             {label}
//           </Label>
//         )}
//       </div>
//       {/* Country select and phone input */}
//       <div className="flex items-center gap-2">
//         <CountrySelect
//           selectedCountryCode={selectedCountry?.code}
//           onChange={handleCountrySelect}
//           disabled={disabled}
//           error={!!error}
//           countryOptions={countryOptions}
//         />
//         <PhoneInput
//           value={phoneNumber}
//           onChange={handlePhoneChange}
//           placeholder={placeholder}
//           error={!!error}
//           selectedCountry={selectedCountry}
//           disabled={disabled}
//         />
//       </div>
//       {/* Error message */}
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
  className,
}: {
  selectedCountryCode?: string
  onChange: (code: string) => void
  disabled?: boolean
  error?: boolean
  countryOptions: CountryOption[]
  className?: string
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
        country.code.toLowerCase().includes(search.toLowerCase()),
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
          disabled && 'bg-gray-50 opacity-50 cursor-not-allowed',
          isOpen && 'ring-2 ring-blue-500',
          className,
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
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  selectedCountry?: CountryOption | null
  disabled?: boolean
  className?: string
}) => {
  return (
    // Phone number input field
    <Input
      type="tel"
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
        disabled && 'bg-gray-50 opacity-50 cursor-not-allowed',
        className,
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
  const preferredCountries = ['US', 'CA', 'MX', 'NP', 'IN', 'AU', 'GB', 'FI']

  // Generate country options with flags and dial codes
  const countryOptions = useMemo(() => {
    const countries = getCountries().map((code) => ({
      code,
      name: en[code] || code,
      dialCode: `+${getCountryCallingCode(code)}`,
      flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`,
    }))
    const preferred = countries
      .filter((c) => preferredCountries.includes(c.code))
      .sort(
        (a, b) =>
          preferredCountries.indexOf(a.code) -
          preferredCountries.indexOf(b.code),
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
    <div className={cn('space-y-1')}>
      {/* Label and icon */}
      <div className="flex items-center">
        {Icon && <Icon className="size-4 text-gray-500" />}
        {label && (
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
          </Label>
        )}
      </div>
      {/* Country select and phone input */}
      <div className={cn('flex items-center rounded-sm')}>
        <CountrySelect
          selectedCountryCode={selectedCountry?.code}
          onChange={handleCountrySelect}
          disabled={disabled}
          error={!!error}
          countryOptions={countryOptions}
          // className={cn(className, ' rounded-e-none  border-r-[#474747]')}
          className={cn(
            className,
            error && 'border-red-400 border',
            ' rounded-e-none  border-r-gray-400',
          )}
        />
        <PhoneInput
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          error={!!error}
          selectedCountry={selectedCountry}
          disabled={disabled}
          className={cn(
            className,
            error && 'border-red-400 border',
            ' rounded-s-none border-l-0',
          )}
        />
      </div>
      {/* Error message */}
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  )
}

export default PhoneField
