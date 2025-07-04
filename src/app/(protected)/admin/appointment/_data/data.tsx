// import { Appointment, appointments } from '@/data/appointment'
// import { CalendarDays, CircleCheckBig, Clock, Users } from 'lucide-react'

// export enum AppointmentFilterLabel {
//   TODAY = 'Today',
//   UPCOMING = 'Upcoming',
//   COMPLETED = 'Completed',
//   CANCELLED = 'Cancelled',
//   MISSED = 'Missed',
//   ALL = 'All',
// }
// export enum AppointmentFilterValue {
//   TODAY = 'today',
//   UPCOMING = 'upcoming',
//   COMPLETED = 'completed',
//   CANCELLED = 'cancelled',
//   MISSED = 'missed',
//   ALL = 'all',
// }

// export interface FilterAppoinmentState {
//   label: AppointmentFilterLabel
//   value: AppointmentFilterValue
//   textColor: string
//   count: number
//   data: Appointment[]
//   border: string
//   background: string
//   icon: React.ReactNode
// }

// // Calculate counts for filter tabs
// export const filterOptions: FilterAppoinmentState[] = [
//   {
//     label: AppointmentFilterLabel.TODAY,
//     value: AppointmentFilterValue.TODAY,
//     textColor: '#103064',
//     count: appointments.filter(
//       (apt: Appointment) => apt.date === new Date().toISOString().split('T')[0],
//     ).length,
//     data: appointments.filter(
//       (apt: Appointment) => apt.date === new Date().toISOString().split('T')[0],
//     ),
//     border: '#DCE9F9',
//     background: '#E9F1FD',
//     icon: <CalendarDays className="text-[#1C55B2]" size={24} />,
//   },
//   {
//     label: AppointmentFilterLabel.UPCOMING,
//     value: AppointmentFilterValue.UPCOMING,
//     textColor: '#4C3000',
//     count: appointments.filter(
//       (apt: Appointment) => new Date(apt.date) > new Date(),
//     ).length,
//     data: appointments.filter(
//       (apt: Appointment) => new Date(apt.date) > new Date(),
//     ),
//     border: '#FFF3CD',
//     background: '#FFF6E6',
//     icon: <Clock className="text-[#4C3000]" size={24} />,
//   },
//   {
//     label: AppointmentFilterLabel.COMPLETED,
//     value: AppointmentFilterValue.COMPLETED,
//     textColor: '#0F5327',
//     count: appointments.filter((apt: Appointment) => apt.status === 'Completed')
//       .length,
//     data: appointments.filter((apt: Appointment) => apt.status === 'Completed'),
//     border: '#E6F4EC',
//     background: '#E9F9EF',
//     icon: <CircleCheckBig className="text-[#0F5327]" size={24} />,
//   },
//   {
//     label: AppointmentFilterLabel.ALL,
//     value: AppointmentFilterValue.ALL,
//     textColor: '#103064',
//     data: appointments,
//     count: appointments.length,
//     border: '#E9DFFF',
//     background: '#F0EBFB',
//     icon: <Users className="text-[#2D155B]" size={24} />,
//   },
// ]
import {
  CalendarDays,
  CircleCheckBig,
  Clock,
  Delete,
  PhoneMissed,
  Users,
} from 'lucide-react'
import {
  Appointment,
  AppointmentStatus,
} from '@/app/(protected)/admin/appointment/_types/appointment'
import { Service } from '../../service/_types/service'

export type AppointmentFilterLabel =
  | 'Today'
  | 'Upcoming'
  | 'Completed'
  | 'Cancelled'
  | 'Missed'
  | 'All'

export type AppointmentFilterValue =
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'cancelled'
  | 'missed'
  | 'all'

export interface FilterData<T> {
  textColor: string
  count: number
  data: T[]
  border: string
  background: string
  icon: React.ReactNode
}

export interface FilterAppoinmentState extends FilterData<Appointment> {
  label: AppointmentFilterLabel
  value: AppointmentFilterValue
}

export interface AppointmentServiceState extends Appointment {
  service?: Service
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// export const createFilterOptions = (
//   appointments: Appointment[],
// ): FilterAppoinmentState[] => {
//   const validStatuses = [
//     AppointmentStatus.SCHEDULED,
//     AppointmentStatus.COMPLETED,
//     AppointmentStatus.CANCELLED,
//     AppointmentStatus.MISSED,
//   ]
//   return [
//     {
//       label: 'Today',
//       value: 'today',
//       textColor: '#103064',
//       count: appointments.filter(
//         (apt) =>
//           typeof apt.selectedDate === 'string' &&
//           !isNaN(new Date(apt.selectedDate).getTime()) &&
//           isSameDay(new Date(apt.selectedDate), new Date()),
//       ).length,
//       data: appointments.filter(
//         (apt) =>
//           typeof apt.selectedDate === 'string' &&
//           !isNaN(new Date(apt.selectedDate).getTime()) &&
//           isSameDay(new Date(apt.selectedDate), new Date()),
//       ),
//       border: '#DCE9F9',
//       background: '#E9F1FD',
//       icon: <CalendarDays className="text-[#1C55B2]" size={24} />,
//     },
//     {
//       label: 'Upcoming',
//       value: 'upcoming',
//       textColor: '#4C3000',
//       count: appointments.filter(
//         (apt) =>
//           validStatuses.includes(apt.status as AppointmentStatus) &&
//           apt.status === AppointmentStatus.SCHEDULED,
//       ).length,
//       data: appointments.filter(
//         (apt) =>
//           validStatuses.includes(apt.status as AppointmentStatus) &&
//           apt.status === AppointmentStatus.SCHEDULED,
//       ),
//       border: '#FFF3CD',
//       background: '#FFF6E6',
//       icon: <Clock className="text-[#4C3000]" size={24} />,
//     },
//     {
//       label: 'Completed',
//       value: 'completed',
//       textColor: '#0F5327',
//       count: appointments.filter(
//         (apt) =>
//           validStatuses.includes(apt.status as AppointmentStatus) &&
//           apt.status === AppointmentStatus.COMPLETED,
//       ).length,
//       data: appointments.filter(
//         (apt) =>
//           validStatuses.includes(apt.status as AppointmentStatus) &&
//           apt.status === AppointmentStatus.COMPLETED,
//       ),
//       border: '#E6F4EC',
//       background: '#E9F9EF',
//       icon: <CircleCheckBig className="text-[#0F5327]" size={24} />,
//     },
//     {
//       label: 'Cancelled',
//       value: 'cancelled',
//       textColor: '#7F1D1D',
//       count: appointments.filter(
//         (apt) =>
//           validStatuses.includes(apt.status as AppointmentStatus) &&
//           apt.status === AppointmentStatus.CANCELLED,
//       ).length,
//       data: appointments.filter(
//         (apt) =>
//           validStatuses.includes(apt.status as AppointmentStatus) &&
//           apt.status === AppointmentStatus.CANCELLED,
//       ),
//       border: '#FEE2E2',
//       background: '#FEF2F2',
//       icon: <Delete className="text-[#7F1D1D]" size={24} />,
//     },
//     {
//       label: 'Missed',
//       value: 'missed',
//       textColor: '#6B7280',
//       count: appointments.filter(
//         (apt) =>
//           validStatuses.includes(apt.status as AppointmentStatus) &&
//           apt.status === AppointmentStatus.MISSED,
//       ).length,
//       data: appointments.filter(
//         (apt) =>
//           validStatuses.includes(apt.status as AppointmentStatus) &&
//           apt.status === AppointmentStatus.MISSED,
//       ),
//       border: '#E5E7EB',
//       background: '#F3F4F6',
//       icon: <PhoneMissed className="text-[#6B7280]" size={24} />,
//     },
//     {
//       label: 'All',
//       value: 'all',
//       textColor: '#103064',
//       count: appointments.length,
//       data: appointments,
//       border: '#E9DFFF',
//       background: '#F0EBFB',
//       icon: <Users className="text-[#2D155B]" size={24} />,
//     },
//   ]
// }
