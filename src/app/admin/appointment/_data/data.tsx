import { Appointment, appointments } from '@/data/appointment'
import { CalendarDays, CircleCheckBig, Clock, Users } from 'lucide-react'

export interface FilterOption {
  label: string
  value: string
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
    count: appointments.filter(
      (apt: Appointment) => apt.date === new Date().toISOString().split('T')[0],
    ).length,
    data: appointments.filter(
      (apt: Appointment) => apt.date === new Date().toISOString().split('T')[0],
    ),
    border: '#DCE9F9',
    background: '#F1F7FE',
    icon: <CalendarDays className="text-[#2672EF]" size={24} />,
  },
  {
    label: 'Upcoming',
    value: 'upcoming',
    count: appointments.filter(
      (apt: Appointment) => new Date(apt.date) > new Date(),
    ).length,
    data: appointments.filter(
      (apt: Appointment) => new Date(apt.date) > new Date(),
    ),
    border: '#FFF3CD',
    background: '#FFFDF5',
    icon: <Clock className="text-[#92400E]" size={24} />,
  },
  {
    label: 'Completed',
    value: 'completed',
    count: appointments.filter((apt: Appointment) => apt.status === 'Completed')
      .length,
    data: appointments.filter((apt: Appointment) => apt.status === 'Completed'),
    border: '#E6F4EC',
    background: '#F5FFFA',
    icon: <CircleCheckBig className="text-[#065F46]" size={24} />,
  },
  {
    label: 'All Appointments',
    value: 'all',
    data: appointments,
    count: appointments.length,
    border: '#E9DFFF',
    background: '#F9F6FE',
    icon: <Users className="text-[#A16EFF]" size={24} />,
  },
]
