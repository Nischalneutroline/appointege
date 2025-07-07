import { Appointment } from '../../appointment/_types/appointment'

export const DEFAULT_CUSTOMER_FILTERS_VALUES: CustomerFilterValue[] = [
  'guest',
  'member',
  'all',
]

export type CustomerFilterLabel =
  | 'Active'
  | 'Inactive'
  | 'All'
  | 'Guest'
  | 'Member'
export type CustomerFilterValue =
  | 'active'
  | 'inactive'
  | 'all'
  | 'guest'
  | 'member'

export interface CustomerData {
  textColor: string
  count: number
  data: User[]
  border: string
  background: string
  icon: React.ReactNode
}

export interface FilterCustomerState extends CustomerData {
  label: CustomerFilterLabel
  value: CustomerFilterValue
}

export interface Address {
  street: string
  city: string
  country: string
  zipCode: string
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  GUEST = 'GUEST',
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
}

export interface User {
  id: string
  email: string // Required
  password: string // Required
  name: string // Required
  phone?: string // Optional
  role: Role // Required
  isActive?: boolean // Optional, defaults to true
  address?: Address // Optional
  createdAt: string
  lastActive: string
  updatedAt: string
  color?: string
  status?: CustomerStatus[]
  appointments?: Appointment[]
}

// Define the data structure for creating/updating customers
export interface PostCustomerData {
  id?: string // Optional for create, required for update
  email: string
  password?: string // Optional for update
  name: string
  phone?: string
  role: Role
  isActive?: boolean
  address?: Address
}

export interface ApiReturnType<T = any> {
  data?: T
  success: boolean
  message?: string
  error?: string
}
export interface AxiosResponseType<T> {
  data: { success: boolean; error?: string; message?: string; data: T }
}
