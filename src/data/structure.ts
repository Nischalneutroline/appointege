// User
interface Address {
  street: string
  city: string
  country: string
  zipCode: string
}

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

interface User {
  email: string // Required
  password: string // Required
  name: string // Required
  phone?: string // Optional
  role: Role // Required
  isActive?: boolean // Optional, defaults to true
  address?: Address // Optional
}
const userDummy = {
  email: 'john.doe@example.com',
  password: 'SecurePass123!',
  name: 'John Doe',
  phone: '+1234567890',
  role: 'USER',
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA',
    zipCode: '10001',
  },
}

// -- Service

interface Service {
  title: string // Required
  description: string // Required
  estimatedDuration: number // Required (in minutes)
  status?: Status // Optional, defaults to ACTIVE
  serviceAvailability?: ServiceAvailability[] // Optional
  resourceId?: string // Optional (if linked to a resource)
}

interface ServiceAvailability {
  weekDay: WeekDays // Required
  timeSlots?: ServiceTime[] // Optional
}

interface ServiceTime {
  startTime: string // Required (ISO 8601 Date string)
  endTime: string // Required (ISO 8601 Date string)
}

enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Also used in business days
enum WeekDays {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

const serviceDummy = {
  title: 'Premium Car Wash',
  description:
    'A thorough interior and exterior cleaning service for your vehicle.',
  estimatedDuration: 90,
  status: 'ACTIVE',
  serviceAvailability: [
    {
      weekDay: 'MONDAY',
      timeSlots: [
        {
          startTime: '2025-04-01T08:00:00Z',
          endTime: '2025-04-01T10:00:00Z',
        },
        {
          startTime: '2025-04-01T14:00:00Z',
          endTime: '2025-04-01T16:00:00Z',
        },
      ],
    },
    {
      weekDay: 'FRIDAY',
      timeSlots: [
        {
          startTime: '2025-04-05T10:00:00Z',
          endTime: '2025-04-05T12:00:00Z',
        },
      ],
    },
  ],
}

// ----- Reminder
// Enum for Reminder Types
export enum ReminderType {
  REMINDER = 'REMINDER',
  FOLLOW_UP = 'FOLLOW_UP',
  CANCELLATION = 'CANCELLATION',
  MISSED = 'MISSED',
  CUSTOM = 'CUSTOM',
}

// Enum for Notification Methods
export enum NotificationMethod {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
}

// Interface for Reminder Offset
export interface ReminderOffset {
  sendOffset: number // Time offset in minutes
  scheduledAt: string // ISO 8601 DateTime string (e.g., "2025-04-02T10:00:00Z")
  sendBefore: boolean // True if sending before appointment, false if after
}

// Interface for Notification
export interface Notification {
  method: NotificationMethod // SMS, EMAIL, or PUSH
}

// Interface for Reminder
export interface Reminder {
  id?: string
  type: ReminderType // Type of the reminder (e.g., REMINDER, FOLLOW_UP)
  title: string // Title of the reminder
  description?: string // Optional description of the reminder
  message?: string // Optional custom message for the reminder
  services: string[] // List of service IDs associated with the reminder
  notifications: Notification[] // List of notifications for the reminder
  reminderOffset: ReminderOffset[] // List of offsets to define when reminders are sent
}

const reminderDummy = {
  type: 'REMINDER',
  title: 'Appointment Reminder',
  description: 'Reminder for your upcoming service appointment.',
  message: 'Your car wash appointment is scheduled for tomorrow at 10:00 AM.',
  services: ['srv_abc123'],
  notifications: [
    {
      method: 'EMAIL',
    },
    {
      method: 'SMS',
    },
  ],
  reminderOffset: [
    {
      sendOffset: 1440,
      scheduledAt: '2025-04-06T12:34:56.789Z',
      sendBefore: true,
    },
    {
      sendOffset: 30,
      scheduledAt: '2025-04-03T09:30:00Z',
      sendBefore: true,
    },
  ],
}

// -- Appointment
// Enum for Appointment Status
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  CANCELLED = 'CANCELLED',
  FOLLOW_UP = 'FOLLOW_UP',
}

// Interface for Appointment
export interface Appointment {
  id?: string
  customerName: string // Required field for the person being booked
  email: string // Required email of the person being booked
  phone: string // Required phone number of the person being booked
  status: AppointmentStatus // Required Appointment Status
  userId?: string // Optional: If the logged-in user is booking for themselves
  bookedById?: string // Optional: Tracks the user who booked for someone else
  serviceId: string // Required: Service ID
  selectedDate: string // Required: ISO string for the appointment date
  selectedTime: string // Required: ISO string for the appointment time
  message?: string // Optional: Message from the user
  isForSelf: boolean // Required: Indicates if the appointment is for the logged-in user or someone else
  createdById: string // Required: ID of the user who created the appointment
  resourceId?: string // Optional: Resource ID for the appointment
}

// Interface for Resource (simplified version for reference)

const dummyAppointment = {
  customerName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  status: 'SCHEDULED', // Required
  userId: 'user123', // Optional (if booking for themselves)
  bookedById: 'user456', // Optional (if someone else booked)
  serviceId: 'srv789', // Required
  selectedDate: '2025-04-10T10:00:00Z', // Required (ISO date string)
  selectedTime: '2025-04-10T10:00:00Z', // Required (ISO time string)
  message: 'Looking forward to the service!', // Optional
  isForSelf: true, // Required
  createdById: 'user123', // Required (ID of the user who created the appointment)
  resourceId: 'res987', // Optional (if relevant)
}

// -- Anouncement
// Enum for Showon
export enum Showon {
  BANNER = 'BANNER',
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  ALL = 'ALL',
}

// Enum for TargetAudience
export enum TargetAudience {
  ALL = 'ALL',
  APPOINTED_USERS = 'APPOINTED_USERS',
  CANCELLED_USERS = 'CANCELLED_USERS',
}

// Enum for ExpirationDuration
export enum ExpirationDuration {
  ONE_DAY = 'ONE_DAY',
  THREE_DAYS = 'THREE_DAYS',
  SEVEN_DAYS = 'SEVEN_DAYS',
  THIRTY_DAYS = 'THIRTY_DAYS',
  NEVER = 'NEVER',
}

// Interface for AnnouncementOrOffer
export interface AnnouncementOrOffer {
  id?: string | undefined
  title: string // Required field for the title of the announcement or offer
  description?: string // Optional: Description of the announcement or offer
  message?: string // Optional: Custom message for the announcement or offer
  audience: TargetAudience // Required: Target audience for the announcement
  isImmediate: boolean // Required: Indicates if the announcement or offer is immediate
  scheduledAt: string // Required: ISO string for the scheduled date and time
  showOn: Showon // Required: Where the announcement should show (e.g., banner, push notification, email)
  expiredAt: ExpirationDuration // Required: Expiration duration or "never"
}

const dumyAnnouncment = {
  title: 'Special Offer: 20% Off All Services!', // Required
  description: 'Get 20% off on all our services for a limited time.', // Optional
  message: "Use code '20OFF' to claim your discount.", // Optional
  audience: 'ALL', // Required (Target audience)
  isImmediate: true, // Required (If the offer is immediate)
  scheduledAt: '2025-04-10T10:00:00Z', // Required (Scheduled date/time in ISO format)
  showOn: 'BANNER', // Required (Where the offer will show, e.g., on a banner)
  expiredAt: 'THIRTY_DAYS', // Required (Expiration duration or "never")
}

// -- Business Detaila and Support
// Enum for Business Status
export enum BusinessStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

// Can be used in service weekdays as enum is same

// // Enum for WeekDays (General)
// export enum WeekDays {
//   MONDAY = "MONDAY",
//   TUESDAY = "TUESDAY",
//   WEDNESDAY = "WEDNESDAY",
//   THURSDAY = "THURSDAY",
//   FRIDAY = "FRIDAY",
//   SATURDAY = "SATURDAY",
//   SUNDAY = "SUNDAY",
// }

// Enum for AvailabilityType
export enum AvailabilityType {
  GENERAL = 'GENERAL',
  SUPPORT = 'SUPPORT',
}

// Enum for HolidayType
export enum HolidayType {
  GENERAL = 'GENERAL',
  SUPPORT = 'SUPPORT',
}

// Interface for BusinessTime (Working hours)
export interface BusinessTime {
  startTime: string // ISO string for start time
  endTime: string // ISO string for end time
}

// Interface for BusinessAvailability (Business availability)
export interface BusinessAvailability {
  weekDay: WeekDays // Day of the week
  type: AvailabilityType // Either GENERAL or SUPPORT
  timeSlots: BusinessTime[] // List of working hours for that day
}

// Interface for Holiday (Holidays for business)
export interface Holiday {
  holiday: WeekDays // Day of the week
  type: HolidayType // Either GENERAL or SUPPORT
  date?: string // Optional specific date for holiday (if needed)
}

// Interface for BusinessAddress (Address for branches of the business)
export interface BusinessAddress {
  street: string
  city: string
  country: string
  zipCode: string
  googleMap: string // Google Map URL for the address
}

// Interface for SupportBusinessDetail (Support team details)
export interface SupportBusinessDetail {
  supportBusinessName: string
  supportEmail: string
  supportPhone: string
  supportAddress: string
  supportGoogleMap?: string
  supportAvailability: BusinessAvailability[] // Separate availability for support
  supportHoliday: Holiday[] // Separate holidays for support
}

// Interface for BusinessDetail (Main business details)
export interface BusinessDetail {
  name: string // Business name
  industry: string // Industry the business operates in
  email: string // Business email
  phone: string // Business phone number
  website?: string // Optional website link
  businessRegistrationNumber: string // Unique registration number
  status: BusinessStatus // Status of the business (Active, Pending, etc.)
  address: BusinessAddress[] // Addresses for the business branches
  businessAvailability: BusinessAvailability[] // General availability for the business
  holiday: Holiday[] // General holidays for the business
  supportBusinessDetail?: SupportBusinessDetail // Optional support business details
}

const dumyBusinessDetail = {
  id: 'business-id-123',
  name: 'Tech Solutions Pvt. Ltd.',
  industry: 'IT Services',
  email: 'contact@techsolutions.com',
  phone: '+977 1 4002000',
  website: 'https://www.techsolutions.com',
  businessRegistrationNumber: 'BRN-12345',
  status: 'ACTIVE',
  address: [
    {
      id: 'address-id-1',
      street: '123 Main Street',
      city: 'Kathmandu',
      country: 'Nepal',
      zipCode: '44600',
      googleMap: 'https://goo.gl/maps/1234xyz',
    },
    {
      id: 'address-id-2',
      street: '456 Secondary Street',
      city: 'Pokhara',
      country: 'Nepal',
      zipCode: '33700',
      googleMap: 'https://goo.gl/maps/abcd1234',
    },
  ],
  businessAvailability: [
    {
      id: 'availability-id-1',
      weekDay: 'MONDAY',
      type: 'GENERAL', // Only 'GENERAL' for Business
      timeSlots: [
        {
          id: 'time-slot-id-1',
          startTime: '2025-03-01T09:00:00Z',
          endTime: '2025-03-01T17:00:00Z',
        },
        {
          id: 'time-slot-id-2',
          startTime: '2025-03-02T09:00:00Z',
          endTime: '2025-03-02T17:00:00Z',
        },
      ],
    },
  ],
  holiday: [
    {
      id: 'holiday-id-1',
      holiday: 'SATURDAY',
      type: 'GENERAL', // Only 'GENERAL' for Business Holidays
      date: '2025-04-15T00:00:00Z',
    },
  ],
}

const supportBusinessDetail = {
  id: 'support-id-123',
  supportBusinessName: 'Tech Solutions Support',
  supportEmail: 'support@techsolutions.com',
  supportPhone: '+977 1 4002100',
  supportAddress: '789 Support Street, Kathmandu, Nepal',
  supportGoogleMap: 'https://goo.gl/maps/5678abc',
  supportAvailability: [
    {
      id: 'support-availability-id-1',
      weekDay: 'MONDAY',
      type: 'SUPPORT', // Only 'SUPPORT' for Support-specific Availability
      timeSlots: [
        {
          id: 'support-time-slot-id-1',
          startTime: '2025-03-01T08:00:00Z',
          endTime: '2025-03-01T16:00:00Z',
        },
      ],
    },
  ],
  supportHoliday: [
    {
      id: 'support-holiday-id-1',
      holiday: 'SUNDAY',
      type: 'SUPPORT', // Only 'SUPPORT' for Support Holidays
      date: '2025-04-20T00:00:00Z',
    },
  ],
  businessId: 'business-id-123', // Link to the primary business
}

// ---- FAQ
interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  isActive: boolean
  order?: number
  lastUpdatedById: string
  createdById: string
}

const dummyFAQs = [
  {
    id: '1',
    question: 'How can I reset my password?',
    answer:
      "You can reset your password by clicking on the 'Forgot Password' link on the login page and following the instructions.",
    category: 'General',
    isActive: true,
    order: 1,
    lastUpdatedById: 'user123',
    createdById: 'admin1',
  },
  {
    id: '2',
    question: 'How do I contact customer support?',
    answer:
      'You can reach our customer support team by emailing support@ourcompany.com or calling (123) 456-7890.',
    category: 'Support',
    isActive: true,
    order: 2,
    lastUpdatedById: 'user124',
    createdById: 'admin2',
  },
  {
    id: '3',
    question: 'What payment methods are accepted?',
    answer: 'We accept credit/debit cards, PayPal, and bank transfers.',
    category: 'Billing',
    isActive: true,
    order: 3,
    lastUpdatedById: 'user125',
    createdById: 'admin3',
  },
  {
    id: '4',
    question: 'Where can I view my order history?',
    answer:
      "You can view your order history by logging into your account and navigating to the 'Orders' section.",
    category: 'General',
    isActive: false, // Inactive FAQ
    order: 4,
    lastUpdatedById: 'user126',
    createdById: 'admin4',
  },
]

//-- Tickets
interface Ticket {
  id: string // Unique ID for the ticket
  userType: Role // Can be "Customer" or "Admin"
  subject: string // Subject or title of the ticket
  ticketDescription: string // Detailed description of the issue or request
  category: TicketCategory // Type of issue (e.g., Technical Support, Billing)
  priority: Priority // Priority level (Low, Medium, High)
  status: TicketStatus // Status (Open, In Progress, Resolved, Closed)
  assignedTo?: string // The support agent/admin assigned to resolve the ticket (optional)
  resolutionDescription?: string // Description of how the issue was resolved (if applicable, optional)
  proofFiles?: string // Path/URL to proof files (screenshots, documents, etc., optional)
  initiatedById?: string // Foreign key for the user who initiated the ticket either admin or user, self (optional)
  userId: string // User who the ticket is created for
}

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}
enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}
enum TicketCategory {
  TECHNICAL = 'TECHNICAL', // For all technical issues, bugs, feature requests, etc.
  BILLING = 'BILLING', // For any issues related to payment, invoices, subscriptions, refunds, etc.
  ACCOUNT = 'ACCOUNT', // For account-related issues like login, profile management, or account access.
  GENERAL = 'GENERAL', // For general inquiries, customer service requests, or questions.
  SUPPORT = 'SUPPORT', // For customer support related issues that don't fit into the above categories.
  SECURITY = 'SECURITY', // For issues related to security, account breaches, data protection, etc.
  MAINTENANCE = 'MAINTENANCE', // For problems arising due to ongoing maintenance, outages, etc.
  FEEDBACK = 'FEEDBACK', // For submitting feedback or suggestions for improvement.
}
const dummyTickets = [
  {
    id: '1',
    userType: 'Customer',
    subject: 'Unable to log in',
    ticketDescription:
      'I cannot log in to my account despite entering the correct credentials.',
    category: 'ACCOUNT',
    priority: 'HIGH',
    status: 'OPEN',
    assignedTo: 'admin123',
    resolutionDescription: null, // Not resolved yet
    proofFiles: null, // No files uploaded
    initiatedById: 'user001',
    userId: 'user001',
  },
  {
    id: '2',
    userType: 'Admin',
    subject: 'Billing issue for subscription',
    ticketDescription:
      'Customer was charged twice for the same subscription. Please investigate.',
    category: 'BILLING',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignedTo: 'support001',
    resolutionDescription: null, // Not resolved yet
    proofFiles: 'http://example.com/proof/screenshot1.png', // Example proof file
    initiatedById: 'admin123',
    userId: 'customer456',
  },
  {
    id: '3',
    userType: 'Customer',
    subject: 'Feedback on new feature',
    ticketDescription:
      'I would like to provide feedback about the new search feature that was rolled out last week.',
    category: 'FEEDBACK',
    priority: 'LOW',
    status: 'RESOLVED',
    assignedTo: null, // No agent assigned (resolved without assignment)
    resolutionDescription:
      'The feedback was reviewed and is being considered for future updates.',
    proofFiles: null, // No files uploaded
    initiatedById: 'user789',
    userId: 'user789',
  },
  {
    id: '4',
    userType: 'Admin',
    subject: 'Account security breach',
    ticketDescription:
      "It seems like someone attempted to breach a user's account. Please review the logs.",
    category: 'SECURITY',
    priority: 'URGENT',
    status: 'CLOSED',
    assignedTo: 'security001',
    resolutionDescription:
      'The breach attempt was thwarted, and the user account was secured.',
    proofFiles: 'http://example.com/proof/securityLog.pdf', // Example proof file
    initiatedById: 'admin234',
    userId: 'user123',
  },
]

// -- Resources

interface Resource {
  id: string // Unique ID for the resource
  name: string // Name of the staff (e.g., Doctor, Barber, Stylist)
  role: string // Role of the staff (e.g., Doctor, Barber, Stylist)
  businessId: string // Reference to the business this staff belongs to
  business: BusinessDetail // Related BusinessDetail object

  services: Service[] // Relationship to services provided by the staff
  appointments: Appointment[] // Appointments this staff assigns/handles
}

const dummyResources = {
  id: '12345',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  address: '123 Main Street, Anytown, USA',
  isActive: true,
}
