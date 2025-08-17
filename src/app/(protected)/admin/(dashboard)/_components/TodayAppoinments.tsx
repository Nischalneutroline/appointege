import React from 'react'
import TodayAppoinment from './TodayAppoinment'
import { ArrowRight } from 'lucide-react'
import ViewAll from './ViewAll'

const appoinments = [
  {
    id: 1,
    customerName: 'John Doe',
    selectedDate: '2023-06-01',
    time: '10:00 AM',
    service: {
      title: 'Teeth Cleaning',
      estimatedDuration: 30,
    },
    status: 'SCHEDULED',
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    selectedDate: '2023-06-02',
    time: '11:30 AM',
    service: {
      title: 'Root Canal',
      estimatedDuration: 30,
    },
    status: 'COMPLETED',
  },
]

const TodayAppoinments = () => {
  return (
    <div className="flex flex-col gap-4">
      {appoinments.map((item) => (
        <TodayAppoinment key={item.id} item={item} />
      ))}
      <ViewAll text="View all appoinments" route="/admin/appoinments" />
    </div>
  )
}

export default TodayAppoinments
