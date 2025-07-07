export const DEFAULT_SERVICE_FILTERS_VALUES: ServiceFilterValue[] = [
  'active',
  'inactive',
  'all',
]

export interface Service {
  id: string
  title: string
  description: string
  estimatedDuration: number // in minutes
  status: ServiceStatus // ACTIVE or INACTIVE
  serviceAvailability?: ServiceAvailability[]
  resourceId?: string
  createdAt: string
  updatedAt: string
  businessDetailId: string
  color?: string
}

export type ServiceFilterLabel = 'Active' | 'Inactive' | 'All'
export type ServiceFilterValue = 'active' | 'inactive' | 'all'

export interface ServiceAvailability {
  weekDay: WeekDays // SUNDAY, MONDAY, etc.
  timeSlots?: ServiceTime[]
}

export interface ServiceTime {
  startTime: string // ISO 8601 Date string
  endTime: string // ISO 8601 Date string
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum WeekDays {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}
export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
