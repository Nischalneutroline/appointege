import React from 'react'
import ColSpan from './ColSpan'
import { Bell, CalendarDays, ChartPie, Clock } from 'lucide-react'
import RecentActivities from './RecentActivities'
import TodayAppoinments from './TodayAppoinments'
import Notifications from './Notification/Notifications'

const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Recent Activity: lg: col-span-4 row 1, md: col-span-8 row 1, mobile: col-span-12 */}
      <div className="col-span-12 md:col-span-8 lg:col-span-4 row-start-1">
        <ColSpan header="Recent Activity" icon={<Clock className="w-6 h-6" />}>
          <RecentActivities />
        </ColSpan>
      </div>

      {/* Service Distribution: lg: col-span-4 row 1, md: col-span-8 row 2, mobile: col-span-12 */}
      <div className="col-span-12 md:col-span-8 lg:col-span-4 row-start-2 md:row-start-2 lg:row-start-1">
        <ColSpan
          header="Service Distribution"
          icon={<ChartPie className="w-6 h-6" />}
        />
      </div>

      {/* Today's Appointments: lg: col-span-8 row 2, md: col-span-8 row 3, mobile: col-span-12 */}
      <div className="col-span-12 md:col-span-8 lg:col-span-8 row-start-3 md:row-start-3 lg:row-start-2">
        <ColSpan
          header="Today's Appointments"
          icon={<CalendarDays className="w-6 h-6" />}
        >
          <TodayAppoinments />
        </ColSpan>
      </div>

      {/* Notifications: lg: col-span-4 row 1-2, md: col-span-4 row 1-2 col-start-9, mobile: col-span-12 */}
      <div className="col-span-12 md:col-span-4 lg:col-span-4 row-start-4 md:row-start-1 lg:row-start-1 md:col-start-9 lg:col-start-9 row-span-2">
        <ColSpan header="Notifications" icon={<Bell className="w-6 h-6" />}>
          <Notifications />
        </ColSpan>
      </div>
    </div>
  )
}

export default DashboardGrid
