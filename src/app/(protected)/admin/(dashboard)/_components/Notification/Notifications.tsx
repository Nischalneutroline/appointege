import React from 'react'
import NotificationItem from './NotificationItem'
import ViewAll from '../ViewAll'

const notifications = [
  {
    type: 'appoinment',
    status: 'PENDING',
    customerName: 'John Doe',
    selectedDate: '2023-06-01',
    selectedTime: '10:00 AM',
    service: {
      title: 'Teeth Cleaning',
      estimatedDuration: 30,
    },
    timeAgo: 'Just now',
  },
  {
    type: 'payment',
    amount: '$75.00',
    customerName: 'Sandiya Thapa',
    timeAgo: '20 min ago',
    service: {
      title: 'Teeth Cleaning',
      estimatedDuration: 30,
    },
  },
  {
    type: 'appoinment',
    status: 'MISSED',
    customerName: 'Pranab Neupane',
    selectedDate: '2023-06-01',
    selectedTime: '10:00 AM',
    service: {
      title: 'Teeth Cleaning',
      estimatedDuration: 30,
    },
    timeAgo: '2 min ago',
  },
  {
    type: 'appoinment',
    status: 'MISSED',
    customerName: 'Pratima Shrestha',
    selectedDate: '2023-06-01',
    selectedTime: '10:00 AM',
    service: {
      title: 'Teeth Cleaning',
      estimatedDuration: 30,
    },
    timeAgo: '2 min ago',
  },
]

const Notifications = () => {
  return (
    <aside className="flex flex-col gap-4">
      {notifications.map((notification, index) => (
        <NotificationItem key={index} notification={notification} />
      ))}
      <ViewAll text="View all notifications" route="/admin/notifications" />
    </aside>
  )
}

export default Notifications
