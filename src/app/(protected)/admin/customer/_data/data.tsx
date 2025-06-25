import { Role, User } from '../_types/customer'
import { CalendarDays, Clock, Users } from 'lucide-react'

export type CustomerLabel = 'Member' | 'Guest' | 'All'
export type CustomerValue = 'member' | 'guest' | 'all'

export interface CustomerData {
  textColor: string
  count: number
  data: User[]
  border: string
  background: string
  icon: React.ReactNode
}

export interface FilterCustomerState extends CustomerData {
  label: CustomerLabel
  value: CustomerValue
}

export const filterCustomerOptions = (
  customer: User[],
): FilterCustomerState[] => {
  return [
    {
      label: 'Member',
      value: 'member',
      textColor: '#103064',
      count: customer.filter((apt: User) => apt.role === Role.USER).length,
      data: customer.filter((apt: User) => apt.role === Role.USER),
      border: '#DCE9F9',
      background: '#E9F1FD',
      icon: <CalendarDays className="text-[#1C55B2]" size={24} />,
    },
    {
      label: 'Guest',
      value: 'guest',
      textColor: '#4C3000',
      count: customer.filter((apt: User) => apt.role === Role.GUEST).length,
      data: customer.filter((apt: User) => apt.role === Role.GUEST),
      border: '#FFF3CD',
      background: '#FFF6E6',
      icon: <Clock className="text-[#4C3000]" size={24} />,
    },
    {
      label: 'All',
      value: 'all',
      textColor: '#103064',
      data: customer,
      count: customer.length,
      border: '#E9DFFF',
      background: '#F0EBFB',
      icon: <Users className="text-[#2D155B]" size={24} />,
    },
  ]
}

// User dummy data
export const customersData: User[] = [
  {
    id: 'cf0ccb51-521c-48f4-96f7-8b11cb4947c3',
    email: 'patrick42@hotmail.com',
    password: ')^$4KrOgy(',
    name: 'Steven Wallace',
    phone: '(728)004-9518x2939',
    role: Role.GUEST,
    isActive: false,
    address: {
      street: '0025 Gloria Parkway Apt. 465',
      city: 'Port Andrewside',
      zipCode: '84816',
      country: 'American Samoa',
    },
    createdAt: '2024-09-03T19:02:44',
    lastActiveAt: '2025-04-19T12:53:09',
    updatedAt: '2025-05-26T00:29:35',
  },
  {
    id: '897e62be-18ca-47ba-8a3a-08900d282861',
    email: 'hhickman@yahoo.com',
    password: 'S2$0NnDwv*',
    name: 'Julie Mclean',
    phone: '(694)414-5735x02321',
    role: Role.GUEST,
    isActive: true,
    address: {
      street: '00121 Nathan Bypass Apt. 853',
      city: 'Carrieberg',
      zipCode: '37722',
      country: 'Saint Kitts and Nevis',
    },
    createdAt: '2024-07-21T06:10:06',
    lastActiveAt: '2025-03-18T11:13:53',
    updatedAt: '2025-03-27T10:23:15',
  },
  {
    id: 'd9c052e7-b607-434a-978e-62d0a3c45c51',
    email: 'nicholas05@hendrix.net',
    password: '!D0DT5Beb(',
    name: 'Mr. Michael Flowers',
    role: Role.GUEST,
    isActive: true,
    createdAt: '2024-10-06T00:52:31',
    lastActiveAt: '2024-11-22T06:15:24',
    updatedAt: '2025-05-03T21:02:44',
  },
  {
    id: '515323bf-095c-4734-9ab2-c02bb71ffaa3',
    email: 'christopherevans@navarro.com',
    password: 'yB1Zain(*^',
    name: 'Heather Ruiz',
    role: Role.GUEST,
    address: {
      street: '718 Thomas Fields Suite 656',
      city: 'Port Jennifershire',
      zipCode: '71104',
      country: 'United States of America',
    },
    isActive: true,
    createdAt: '2024-09-22T15:48:15',
    lastActiveAt: '2025-03-18T02:22:57',
    updatedAt: '2025-06-21T06:28:30',
  },
  {
    id: '162b20ee-5c06-4446-8fe6-6b388ba66313',
    email: 'matthew05@holmes.com',
    password: '5X5*VRPk*i',
    name: 'Robert Avila',
    phone: '057-238-3031',
    role: Role.USER,
    isActive: false,
    address: {
      street: '70898 Johnson Roads Apt. 083',
      city: 'Mendezport',
      zipCode: '48426',
      country: 'Armenia',
    },
    createdAt: '2025-04-09T20:44:15',
    lastActiveAt: '2025-04-30T02:00:48',
    updatedAt: '2025-06-22T12:22:47',
  },
  {
    id: '79254115-7e0e-4da4-b3a8-e36beb242c3f',
    email: 'delacruzkimberly@dalton.com',
    password: '*^7XnmdXfM',
    name: 'Jason Jacobs',
    role: Role.USER,
    isActive: false,
    address: {
      street: '00121 Nathan Bypass Apt. 853',
      city: 'Carrieberg',
      zipCode: '37722',
      country: 'Saint Kitts and Nevis',
    },
    createdAt: '2025-01-31T11:46:15',
    lastActiveAt: '2025-02-16T14:33:50',
    updatedAt: '2025-05-11T08:07:57',
  },
  {
    id: '5366347b-4eb3-4019-8cea-30a0e60c96b4',
    email: 'iluna@thompson.org',
    password: 'e_h8Gy#vsQ',
    name: 'Franklin Ortega',
    phone: '+1-251-635-1023',
    role: Role.USER,
    isActive: true,
    address: {
      street: '00121 Nathan Bypass Apt. 853',
      city: 'Carrieberg',
      zipCode: '37722',
      country: 'Saint Kitts and Nevis',
    },
    createdAt: '2025-03-20T08:19:40',
    lastActiveAt: '2025-04-20T07:03:52',
    updatedAt: '2025-05-10T20:32:12',
  },
  {
    id: 'e4060db9-c7c5-44e0-9e36-55c87bafde19',
    email: 'steven22@gill.biz',
    password: 'B1b0BZiM)^',
    name: 'John Burgess',
    phone: '247-150-2646x023',
    role: Role.GUEST,
    isActive: false,
    address: {
      street: '00121 Nathan Bypass Apt. 853',
      city: 'Carrieberg',
      zipCode: '37722',
      country: 'Saint Kitts and Nevis',
    },
    createdAt: '2025-05-04T19:28:42',
    lastActiveAt: '2025-06-16T04:22:12',
    updatedAt: '2025-06-20T17:07:57',
  },
  {
    id: 'f98beab0-9dff-4132-bba7-f18c31498ce1',
    email: 'qfigueroa@yahoo.com',
    password: 'paL6qc^!)9',
    name: 'Andrew Petersen',
    role: Role.GUEST,
    isActive: true,
    address: {
      street: '00121 Nathan Bypass Apt. 853',
      city: 'Carrieberg',
      zipCode: '37722',
      country: 'Saint Kitts and Nevis',
    },
    createdAt: '2025-06-20T07:11:11',
    lastActiveAt: '2025-06-21T17:45:04',
    updatedAt: '2025-06-24T23:39:25',
  },
  {
    id: 'e56e38d2-975a-45d4-b3f6-545a2b528d36',
    email: 'jasonsmith@johnson.org',
    password: '(XPYqtlw9+',
    name: 'Beth Lewis',
    role: Role.USER,
    isActive: true,
    address: {
      street: '00121 Nathan Bypass Apt. 853',
      city: 'Carrieberg',
      zipCode: '37722',
      country: 'Saint Kitts and Nevis',
    },
    createdAt: '2024-08-01T10:40:51',
    lastActiveAt: '2024-12-26T19:07:29',
    updatedAt: '2025-03-23T06:58:27',
  },
]
