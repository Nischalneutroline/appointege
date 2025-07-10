import { z } from 'zod'

// Zod schema for Address
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
})
export type Address = z.infer<typeof addressSchema>

// Zod schema for Role (Enum)
export const roleSchema = z.enum(['USER', 'ADMIN', 'SUPER_ADMIN', 'GUEST'])

// Zod schema for User
export const userSchema = z.object({
  // id: z.string().optional(),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
  name: z.string().min(1, 'Name is required'),
  role: roleSchema,
  phone: z.string().optional(),
  // role: roleSchema,
  isActive: z.boolean().optional(), // Optional, defaults to true
  address: addressSchema.optional(), // Optional address
  businessId: z.string().optional(), // Optional business ID
})
