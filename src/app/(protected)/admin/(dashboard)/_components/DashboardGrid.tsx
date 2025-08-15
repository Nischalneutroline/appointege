import React from 'react'
import ColSpan from './ColSpan'
import { Bell, CalendarDays, ChartPie, Clock } from 'lucide-react'
import RecentActivities from './RecentActivities'

const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-12 gap-4 ">
      {/* Recent Activity col 4 */}
      <div className="col-span-12 md:col-span-8 lg:col-span-4">
        <ColSpan header="Recent Activity" icon={<Clock className="w-5 h-5" />}>
          <RecentActivities />
        </ColSpan>
      </div>

      {/* Service Distribution col 4 */}
      <div className="col-span-12 md:col-span-8 lg:col-span-4">
        <ColSpan
          header="Service Distribution"
          icon={<ChartPie className="w-5 h-5" />}
        />
      </div>

      {/* Today's Appointments col 8 */}
      <div className="col-span-12 md:col-span-8 lg:col-span-8">
        <ColSpan
          header="Today's Appointments"
          icon={<CalendarDays className="w-5 h-5" />}
        />
      </div>

      {/* Notification col 4, positioned in row 1, last column for md and lg */}
      <div className="col-span-12 md:col-span-4 lg:col-span-4 md:row-start-1 lg:row-start-1 md:col-start-9 lg:col-start-9">
        <ColSpan header="Notifications" icon={<Bell className="w-5 h-5" />} />
      </div>
    </div>
  )
}

export default DashboardGrid
