import {
  BusinessAddress,
  BusinessStatus,
  HolidayType,
  WeekDays,
  AvailabilityType,
  BusinessTimeType,
} from '../_types/types'
import { z } from 'zod'

/* Zod schema for BusinessTime (Working hours) */
const businessTimeSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  type: z.nativeEnum(BusinessTimeType),
})

// Zod schema for BusinessAvailability (Business availability)
const businessAvailabilitySchema = z.object({
  weekDay: z.nativeEnum(WeekDays),
  type: z.nativeEnum(AvailabilityType),
  timeSlots: z.array(businessTimeSchema),
})

// Zod schema for Holiday (Holidays for business)
const holidaySchema = z.object({
  holiday: z.nativeEnum(WeekDays),
  type: z.nativeEnum(HolidayType),
  date: z.string().optional(),
})

// Zod schema for BusinessAddress
const businessAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string(),
  zipCode: z.string(),
  googleMap: z.string(),
})

// Zod schema for BusinessDetail
export const businessDetailSchema = z.object({
  name: z.string(),
  industry: z.string(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string().url().optional(),
  businessRegistrationNumber: z.string(),
  status: z.nativeEnum(BusinessStatus),
  timeZone: z.string().optional(),
  address: z.array(businessAddressSchema),
  businessAvailability: z.array(businessAvailabilitySchema).optional(),
  holiday: z.array(holidaySchema).optional(),
  businessOwner: z.string().optional(),
  supportBusinessDetail: z
    .object({
      supportPhone: z.string().optional(),
      supportEmail: z.string().optional(),
    })
    .optional(),
  serviceAvailability: z
    .array(
      z.object({
        weekDay: z.string(),
        timeSlots: z.array(
          z.object({
            startTime: z.string(),
            endTime: z.string(),
          }),
        ),
      }),
    )
    .optional(),
})

export const industryOptions = [
  { label: 'Salon & Spa', value: 'Beauty' },
  { label: 'Medical & Health', value: 'Medical & Health' },
  { label: 'Automotive Services', value: 'Automotive Services' },
  { label: 'Home Repair & Maintenance', value: 'Home Repair & Maintenance' },
  { label: 'Fitness & Wellness', value: 'Fitness & Wellness' },
  { label: 'Education & Training', value: 'Education & Training' },
  { label: 'Legal & Consulting', value: 'Legal & Consulting' },
  { label: 'IT Services', value: 'IT Services' },
]

const visibilityOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Suspended', value: 'SUSPENDED' },
]

export const businessDetailFormSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s&'-]+$/, 'Business name contains invalid characters'),

  industry: z
    .string({
      required_error: 'Please select an industry',
    })
    .min(1, 'Industry is required'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9+\s-]+$/, 'Please enter a valid phone number'),

  website: z.string().refine((value) => {
    if (!value) return true // Allow empty
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`)
      return true
    } catch {
      return false
    }
  }, 'Please enter a valid URL (e https://example.com)'),
  businessType: z.string().min(1, 'Business type is required'),
  city: z.string().min(1, 'City is required'),
  street: z.string().min(1, 'Street is required'),
  state: z.string().min(1, 'State is required').optional(),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  googleMap: z.string().min(1, 'Google Map is required').url(),
  registrationNumber: z
    .string()
    .min(1, 'Business registration number is required'),
  taxId: z.any().optional(),
  logo: z.any().refine((file) => file !== null, 'Business logo is required'),
})
export type BusinessDetailFormValues = z.infer<typeof businessDetailFormSchema>

// Allowed weekdays as literals
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
type WeekDay = (typeof weekDays)[number]

// Validate a single time slot tuple: [startTime, endTime]
const timeSlotSchema = z.tuple([
  z.string().min(1, 'Start time is required'),
  z.string().min(1, 'End time is required'),
])

// Validate the record of WeekDay to array of time slots
const dayHoursSchema = z
  .object({
    Mon: z.array(timeSlotSchema),
    Tue: z.array(timeSlotSchema),
    Wed: z.array(timeSlotSchema),
    Thu: z.array(timeSlotSchema),
    Fri: z.array(timeSlotSchema),
    Sat: z.array(timeSlotSchema),
    Sun: z.array(timeSlotSchema),
  })
  .partial()

// Main schema
export const businessAvailabilityFormSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'), // or use z.enum(timezoneOptions.map(o => o.value)) for stricter validation
  businessAvailability: z
    .array(z.enum(weekDays))
    .refine(
      (days) => new Set(days).size === days?.length,
      'Duplicate days are not allowed',
    ),
  businessDays: dayHoursSchema,
  breakHours: dayHoursSchema,
  holidays: z.array(z.enum(weekDays)).optional(),
})

// Infer TypeScript type from schema if needed
export type BusinessAvailabilityFormValues = z.infer<
  typeof businessAvailabilityFormSchema
>
