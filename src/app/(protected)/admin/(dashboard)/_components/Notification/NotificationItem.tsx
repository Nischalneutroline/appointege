import { CircleAlert, CircleCheckBig, Clock } from 'lucide-react'
import React from 'react'

// Function to determine the appropriate icon based on notification type and status
const findIcon = (notification: { type: string; status?: string }) => {
  if (notification.type === 'appoinment' && notification.status === 'PENDING') {
    return <Clock className="size-5 text-[#2672EF]" />
  }
  if (notification.type === 'appoinment' && notification.status === 'MISSED') {
    return <CircleAlert className="size-5 text-[#EF4444]" />
  }
  if (notification.type === 'payment') {
    return <CircleCheckBig className="size-5 text-[#10B981]" />
  }
  // Default icon if no conditions match
  return null
}

const findHeader = (notification: any) => {
  if (notification.type === 'appoinment' && notification.status === 'PENDING') {
    return 'Upcoming Appoinment'
  }
  if (notification.type === 'appoinment' && notification.status === 'MISSED') {
    return 'Missed Appoinment'
  }
  if (notification.type === 'payment') {
    return 'Payment Received'
  }
  // Default icon if no conditions match
  return null
}

const formatText = (notification: any) => {
  if (notification.type === 'appoinment' && notification.status === 'PENDING') {
    return `${notification.customerName} booked an appoinment for ${notification.service.title} at ${notification.selectedTime}`
  }
  if (notification.type === 'appoinment' && notification.status === 'MISSED') {
    return `${notification.customerName} missed an appoinment for ${notification.service.title} at ${notification.selectedTime}`
  }
  if (notification.type === 'payment') {
    return `${notification.customerName} paid ${notification.amount} for ${notification.service.title}`
  }
  // Default icon if no conditions match
  return null
}

const NotificationItem = ({ notification }: { notification: any }) => {
  return (
    <div className="flex  gap-2 p-3 border border-[#E5E7EB] bg-[#F8F9FA] rounded-md">
      {/* Icon */}
      <div className="mt-2">{findIcon(notification)}</div>
      {/* Content */}
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-base">{findHeader(notification)}</h2>
        <p className="text-sm text-[#6B7280]">{formatText(notification)}</p>
        <p className="text-xs text-[#6B7280]">{notification.timeAgo}</p>
      </div>
    </div>
  )
}

export default NotificationItem
