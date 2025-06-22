// Sample data
export interface Appointment {
  id: number
  name: string
  email?: string
  phone?: string
  initials: string
  color: string
  service: string
  date: string
  time: string
  type: string
  status: string
  address?: string
}
;[]

export const appointments: Appointment[] = [
  {
    id: 12344,
    name: 'Alex Johnson',
    initials: 'AJ',
    color: '#8B5CF6',
    service: 'Dental Cleaning',
    date: '2025-05-23',
    time: '10:00 AM',
    type: 'Physical',
    status: 'Scheduled',
  },
  {
    id: 12345,
    name: 'Spike Williams',
    initials: 'SW',
    color: '#06B6D4',
    service: 'Physical Therapy',
    date: '2025-05-22',
    time: '11:00 AM',
    type: 'Physical',
    status: 'Missed',
  },
  {
    id: 12346,
    name: 'Patrick Thompson',
    initials: 'PT',
    color: '#EC4899',
    service: 'Product Demo',
    date: '2025-05-21',
    time: '12:00 PM',
    type: 'Virtual',
    status: 'Canceled',
  },
  {
    id: 12347,
    name: 'Dustin Brooks',
    initials: 'DB',
    color: '#6366F1',
    service: 'Health Consulting',
    date: '2025-05-24',
    time: '2:00 PM',
    type: 'Virtual',
    status: 'Scheduled',
  },
  {
    id: 12348,
    name: 'Hunter Bradley',
    initials: 'HB',
    color: '#10B981',
    service: 'Doctor Consulting',
    date: '2025-05-20',
    time: '1:00 PM',
    type: 'Physical',
    status: 'Completed',
  },
  {
    id: 12349,
    name: 'John Treble',
    initials: 'JT',
    color: '#10B981',
    service: 'Doctor Consulting',
    date: '2025-05-20',
    time: '1:00 PM',
    type: 'Physical',
    status: 'Completed',
  },
  {
    id: 12350,
    name: 'John Doe',
    initials: 'JD',
    color: '#10B981',
    service: 'Doctor Consulting',
    date: '2025-05-20',
    time: '1:00 PM',
    type: 'Physical',
    status: 'Completed',
  },
]
