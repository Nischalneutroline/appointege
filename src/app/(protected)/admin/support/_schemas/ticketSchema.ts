import { z } from 'zod'
import { Priority, Role, TicketCategory, TicketStatus } from '../_types/types'


// Ticket schema validation with Zod
export const ticketSchema = z.object({
  id: z.string().optional(),
  userType: z.enum([Role.USER, Role.ADMIN, Role.SUPERADMIN]), // Enum validation for user type
  subject: z.string().min(1, 'Subject is required'), // Subject validation
  ticketDescription: z.string().min(1, 'Ticket description is required'), // Description validation
  category: z.enum([
    TicketCategory.TECHNICAL,
    TicketCategory.BILLING,
    TicketCategory.ACCOUNT,
    TicketCategory.GENERAL,
    TicketCategory.SUPPORT,
    TicketCategory.SECURITY,
    TicketCategory.MAINTENANCE,
    TicketCategory.FEEDBACK,
  ]), // Category validation
  priority: z.enum([
    Priority.LOW,
    Priority.MEDIUM,
    Priority.HIGH,
    Priority.URGENT,
  ]), // Priority validation
  status: z.enum([
    TicketStatus.OPEN,
    TicketStatus.IN_PROGRESS,
    TicketStatus.RESOLVED,
    TicketStatus.CLOSED,
  ]), // Status validation
  assignedTo: z.string().optional(), // Optional assignedTo field
  resolutionDescription: z.string().optional(), // Optional resolution description
  proofFiles: z.string().optional(), // Optional proof files
  initiatedById: z.string().optional(), // Optional initiatedById field
  userId: z.string(), // User ID associated with the ticket
})
