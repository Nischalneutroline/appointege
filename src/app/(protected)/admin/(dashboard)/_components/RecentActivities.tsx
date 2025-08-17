import React from 'react'
import RecentActivity from './RecentActivity'
import { ArrowRight, Calendar, UserPlus } from 'lucide-react'
import ViewAll from './ViewAll'

const RecentActivities = () => {
  return (
    <div className="divide-y divide-[#E5E7EB] flex flex-col gap-4">
      <RecentActivity
        icon={<Calendar className="w-5 h-5" />}
        header="New Appointment Booked"
        userName="Sandiya Thapa"
        timeAgo="2 min ago"
        actionText="Booked dental cleaning"
        type="appoinment"
        date="01:00pm"
      />
      <RecentActivity
        icon={<UserPlus className="w-5 h-5" />}
        header="New Customer added"
        userName="Emma Johnson"
        timeAgo="15 min ago"
        actionText="Added contact information and preferences"
        type="customer"
      />

      {/* View all activity */}
      <ViewAll text="View all activity" route="/admin/notifications" />
    </div>
  )
}

export default RecentActivities
