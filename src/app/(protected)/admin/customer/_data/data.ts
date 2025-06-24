// export type CustomerLabel = 'Member' | 'Guest' | 'All'
// export type CustomerValue = 'member' | 'guest' | 'all'

// export interface FilterCustomerState {
//   label: CustomerLabel
//   value: CustomerValue
//   textColor: string
//   count: number
//   data: Appointment[]
//   border: string
//   background: string
//   icon: React.ReactNode
// }
// export const filterCustomerOptions: FilterCustomerState[] = [
//   {
//     label: 'Member',
//     value: 'member',
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
//     label: 'Guest',
//     value: 'guest',
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
//     label: 'All',
//     value: 'all',
//     textColor: '#103064',
//     data: appointments,
//     count: appointments.length,
//     border: '#E9DFFF',
//     background: '#F0EBFB',
//     icon: <Users className="text-[#2D155B]" size={24} />,
//   },
// ]
