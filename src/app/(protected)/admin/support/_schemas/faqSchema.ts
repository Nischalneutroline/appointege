import { z } from 'zod'

export type FaqFilterValue = 'all' | 'public' | 'private'

// Zod schema for FAQ validation
export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(3, 'Question must be at least 3 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  category: z.enum(['all', 'public', 'private']).optional(),
  // These fields will be handled by the backend or have default values
  isActive: z.boolean().default(true).optional(),
  order: z.number().optional(),
  lastUpdatedById: z.string().optional(),
  createdById: z.string().optional(),
})
