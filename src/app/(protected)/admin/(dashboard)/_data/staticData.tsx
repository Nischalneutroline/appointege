import {
  Calendar,
  User,
  Wrench,
  Clock,
  Users,
  CalendarDays,
} from 'lucide-react'

export const dashboardCardData = [
  {
    count: 24,
    label: 'Total Appointments',
    icon: <CalendarDays size={16} color="#1C55B2" />,
    subText: '-3 from yesterday',
    backgroundColor: '#E9F1FD',
    borderColor: '#DCE9F9',
    textColor: '#3b4656',
    isDown: true,
  },
  {
    count: 10,
    label: 'Total Customer',
    icon: <Users size={16} color="#6B4300" />,
    subText: '+12 this week',
    backgroundColor: '#FFF6E6',
    borderColor: '#FFF3CD',
    textColor: '#3f3b32',
    isDown: false,
  },
  {
    count: 5,
    label: 'Active Services',
    icon: <Wrench size={16} color="#0F5327" />,
    subText: 'All Operational',
    backgroundColor: '#E9F9EF',
    borderColor: '#E6F4EC',
    textColor: '#323c36',
    isDown: false,
  },
  {
    count: 5,
    label: 'Available Slots',
    icon: <Clock size={16} color="#2D155B" />,
    subText: '-1 hour remaining', // Indicates a decrease
    backgroundColor: '#F0EBFB',
    borderColor: '#E5E7EB',
    textColor: '#3b3545',
    isDown: true,
  },
]
