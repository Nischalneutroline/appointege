import { Role, User } from "../_types/customer"
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
    customer : User[]
): FilterCustomerState[] => {
    const validRoles = [
        Role.USER,
        Role.GUEST,
        Role.ADMIN,
        Role.SUPERADMIN
    ]
    return [
  {
    label: 'Member',
    value: 'member',
    textColor: '#103064',
    count: customer.filter(
      (apt: User) => validRoles.includes(apt.role),
    ).length,
    data: customer.filter(
      (apt: User) => validRoles.includes(apt.role),
    ),
    border: '#DCE9F9',
    background: '#E9F1FD',
    icon: <CalendarDays className="text-[#1C55B2]" size={24} />,
  },
  {
    label: 'Guest',
    value: 'guest',
    textColor: '#4C3000',
    count: customer.filter(
      (apt: User) => validRoles.includes(apt.role),
    ).length,
    data: customer.filter(
      (apt: User) => validRoles.includes(apt.role),
    ),
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
