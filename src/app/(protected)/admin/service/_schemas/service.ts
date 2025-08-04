// src/features/service/schemas/schema.ts
import { z } from 'zod'
import { ServiceStatus, WeekDays } from '../_types/service'
export const serviceSchema = z.object({
  title: z.string().min(1, 'Service name is required'),
  description: z.string(),
  estimatedDuration: z.number().min(0, 'Duration must be a positive number'),
  serviceAvailability: z.array(
    z.object({
      weekDay: z.enum([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ]),
      timeSlots: z
        .array(
          z.object({
            startTime: z.string(),
            endTime: z.string(),
          }),
        )
        .optional(),
    }),
  ),
  businessDetailId: z.string().min(1, 'Business ID is required'),
  status: z.enum([ServiceStatus.ACTIVE, ServiceStatus.INACTIVE]),
  message: z.string().optional(),
  image: z.string().optional(),
})
