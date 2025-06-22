import { Appointment, appointments } from '@/data/appointment'
import { CalendarDays, CircleCheckBig, Clock, Users } from 'lucide-react'

export interface FilterOption {
  label: string
  value: string
  textColor: string
  count: number
  data: Appointment[]
  border: string
  background: string
  icon: React.ReactNode
}

// Calculate counts for filter tabs
export const filterOptions: FilterOption[] = [
  {
    label: 'Today',
    value: 'today',
    textColor: '#103064',
    count: appointments.filter(
      (apt: Appointment) => apt.date === new Date().toISOString().split('T')[0],
    ).length,
    data: appointments.filter(
      (apt: Appointment) => apt.date === new Date().toISOString().split('T')[0],
    ),
    border: '#DCE9F9',
    background: '#E9F1FD',
    icon: <CalendarDays className="text-[#1C55B2]" size={24} />,
  },
  {
    label: 'Upcoming',
    value: 'upcoming',
    textColor: '#4C3000',
    count: appointments.filter(
      (apt: Appointment) => new Date(apt.date) > new Date(),
    ).length,
    data: appointments.filter(
      (apt: Appointment) => new Date(apt.date) > new Date(),
    ),
    border: '#FFF3CD',
    background: '#FFF6E6',
    icon: <Clock className="text-[#4C3000]" size={24} />,
  },
  {
    label: 'Completed',
    value: 'completed',
    textColor: '#0F5327',
    count: appointments.filter((apt: Appointment) => apt.status === 'Completed')
      .length,
    data: appointments.filter((apt: Appointment) => apt.status === 'Completed'),
    border: '#E6F4EC',
    background: '#E9F9EF',
    icon: <CircleCheckBig className="text-[#0F5327]" size={24} />,
  },
  {
    label: 'All Appointments',
    value: 'all',
    textColor: '#103064',
    data: appointments,
    count: appointments.length,
    border: '#E9DFFF',
    background: '#F0EBFB',
    icon: <Users className="text-[#2D155B]" size={24} />,
  },
]

export const filterCustomerOptions: FilterOption[] = [
  {
    label: 'Member',
    value: 'member',
    textColor: '#103064',
    count: appointments.filter(
      (apt: Appointment) => apt.date === new Date().toISOString().split('T')[0],
    ).length,
    data: appointments.filter(
      (apt: Appointment) => apt.date === new Date().toISOString().split('T')[0],
    ),
    border: '#DCE9F9',
    background: '#E9F1FD',
    icon: <CalendarDays className="text-[#1C55B2]" size={24} />,
  },
  {
    label: 'Guest',
    value: 'guest',
    textColor: '#4C3000',
    count: appointments.filter(
      (apt: Appointment) => new Date(apt.date) > new Date(),
    ).length,
    data: appointments.filter(
      (apt: Appointment) => new Date(apt.date) > new Date(),
    ),
    border: '#FFF3CD',
    background: '#FFF6E6',
    icon: <Clock className="text-[#4C3000]" size={24} />,
  },
  {
    label: 'All',
    value: 'all',
    textColor: '#103064',
    data: appointments,
    count: appointments.length,
    border: '#E9DFFF',
    background: '#F0EBFB',
    icon: <Users className="text-[#2D155B]" size={24} />,
  },
]
