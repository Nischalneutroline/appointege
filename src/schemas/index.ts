// import { UserRoles } from "@prisma/client"
import * as z from 'zod'

// SCHEMAS
// Settings
// LOGIN
export const SettingSchema = z
  .object({
    name: z.optional(
      z.string().min(3, { message: 'Minimum 3 characters required!' }),
    ),
    email: z.optional(z.string().email({ message: 'Email is Required!' })),
    isTwoFactorEnabled: z.optional(z.boolean()),
    password: z.optional(
      z
        .string()
        .min(5, { message: 'Password must be at least 5 characters long!' }),
    ),
    newPassword: z.optional(
      z
        .string()
        .min(5, {
          message: 'New Password must be at least 5 characters long!',
        }),
    ),
    role: z.enum(['USER', 'ADMIN']),
    emailVerified: z.optional(z.null()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }
      if (data.newPassword && !data.password) {
        return false
      }
      return true
    },
    { message: 'New password is required!', path: ['newPassword'] },
  )

// ------------- LOGIN
export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is Required!' }),
  password: z.string().min(1, { message: 'Password is required!' }),
  code: z.optional(z.string()),
})

// Infer the type from the Zod schema
export type LoginSchemaType = z.infer<typeof LoginSchema>

// ------------- SIGN UP
export const SignupSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required!' })
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Invalid email format!' }),
    name: z.string().min(3, { message: 'Minimum 3 characters required!' }),
    // phone: z
    //   .string()
    //   .min(10, {
    //     message: "Phone number must be at least 10 characters long!",
    //   })
    //   .optional(),
    // password: z
    //   .string()
    //   .min(5, { message: "Password must be at least 5 characters long!" }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must contain at least one number',
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: 'Password must contain at least one special character',
      }),
    password1: z.string().min(5, {
      message: 'Password must be at least 5 characters long!',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password1) {
      ctx.addIssue({
        path: ['password1'], // Points to the `password1` field
        message: 'Passwords must match!',
        code: 'custom',
      })
    }
  })

// Infer type for signup schema
export type SignupSchemaType = z.infer<typeof SignupSchema>

// ------------ RESET PASSWORD
export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required!' }),
})

export type ResetSchemaType = z.infer<typeof ResetSchema>

// ------------ New PASSWORD Schema
export const NewPasswordSchema = z
  .object({
    password: z.string().min(3, {
      message: 'Password must be at least 3 characters long!',
    }),
    password1: z.string().min(3, {
      message: 'Password must be at least 3 characters long!',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password1) {
      ctx.addIssue({
        path: ['password1'], // Points to the `password1` field
        message: 'Passwords must match!',
        code: 'custom',
      })
    }
  })

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>
