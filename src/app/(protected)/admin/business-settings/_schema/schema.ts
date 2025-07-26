// import {
//   BusinessAddress,
//   BusinessStatus,
//   HolidayType,
//   WeekDays,
//   AvailabilityType,
//   BusinessTimeType,
// } from '../_types/types'
// import { z } from 'zod'

// /* Zod schema for BusinessTime (Working hours) */
// const businessTimeSchema = z.object({
//   startTime: z.string(),
//   endTime: z.string(),
//   type: z.nativeEnum(BusinessTimeType),
// })

// // Zod schema for BusinessAvailability (Business availability)
// const businessAvailabilitySchema = z.object({
//   weekDay: z.nativeEnum(WeekDays),
//   type: z.nativeEnum(AvailabilityType),
//   timeSlots: z.array(businessTimeSchema),
// })

// // Zod schema for Holiday (Holidays for business)
// const holidaySchema = z.object({
//   holiday: z.nativeEnum(WeekDays),
//   type: z.nativeEnum(HolidayType),
//   date: z.string().optional(),
// })

// // Zod schema for BusinessAddress
// const businessAddressSchema = z.object({
//   street: z.string(),
//   city: z.string(),
//   country: z.string(),
//   zipCode: z.string(),
//   googleMap: z.string(),
// })

// // Zod schema for BusinessDetail
// export const businessDetailSchema = z.object({
//   name: z.string(),
//   industry: z.string(),
//   email: z.string().email(),
//   phone: z.string(),
//   website: z.string().url().optional(),
//   businessRegistrationNumber: z.string(),
//   status: z.nativeEnum(BusinessStatus),
//   timeZone: z.string().optional(),
//   address: z.array(businessAddressSchema),
//   businessAvailability: z.array(businessAvailabilitySchema).optional(),
//   holiday: z.array(holidaySchema).optional(),
// businessOwner: z.string().optional(),
//   supportBusinessDetail: z
//     .object({
//       supportPhone: z.string().optional(),
//       supportEmail: z.string().optional(),
//     })
//     .optional(),
// })
import {
  BusinessAddress,
  BusinessStatus,
  HolidayType,
  WeekDays,
  AvailabilityType,
} from '../_types/types'
import { z } from 'zod'

/* Zod schema for ServiceTime (Service availability time slots) */
const serviceTimeSchema = z.object({
  id: z.string().optional(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Start time must be a valid ISO date string',
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'End time must be a valid ISO date string',
  }),
})

/* Zod schema for ServiceAvailability (Service availability) */
const serviceAvailabilitySchema = z.object({
  id: z.string().optional(),
  weekDay: z.nativeEnum(WeekDays),
  timeSlots: z.array(serviceTimeSchema),
  serviceId: z.string().optional(), // Optional, as it may not be provided during creation
})

/* Zod schema for BusinessTime (Working hours) */
const businessTimeSchema = z.object({
  id: z.string().optional(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Start time must be a valid ISO date string',
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'End time must be a valid ISO date string',
  }),
})

/* Zod schema for BusinessAvailability (Business availability) */
const businessAvailabilitySchema = z.object({
  id: z.string().optional(),
  weekDay: z.nativeEnum(WeekDays),
  type: z.nativeEnum(AvailabilityType),
  timeSlots: z.array(businessTimeSchema),
})

/* Zod schema for Holiday (Holidays for business) */
const holidaySchema = z.object({
  id: z.string().optional(),
  holiday: z.nativeEnum(WeekDays),
  type: z.nativeEnum(HolidayType),
  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Holiday date must be a valid ISO date string if provided',
    }),
})

/* Zod schema for BusinessAddress */
const businessAddressSchema = z.object({
  id: z.string().optional(),
  street: z.string(),
  city: z.string(),
  country: z.string(),
  zipCode: z.string(),
  googleMap: z.string().optional(),
})

/* Zod schema for BusinessDetail */
export const businessDetailSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  industry: z.string(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string().url().optional(),
  businessRegistrationNumber: z.string(),
  status: z.nativeEnum(BusinessStatus),
  address: z.array(businessAddressSchema),
  businessAvailability: z.array(businessAvailabilitySchema),
  businessOwner: z.string(),
  holiday: z.array(holidaySchema),
  serviceAvailability: z.array(serviceAvailabilitySchema).optional(), // Add serviceAvailability
  supportBusinessDetail: z
    .object({
      supportPhone: z.string().optional(),
      supportEmail: z.string().optional(),
    })
    .optional(),
})
