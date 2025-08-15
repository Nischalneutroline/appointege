import { Clock } from 'lucide-react'
import React from 'react'

const RecentActivity = ({
  header,
  icon,
  userName,
  timeAgo,
  type,
  actionText,
  date,
}: {
  header: string
  icon: React.ReactNode
  userName: string
  timeAgo: string
  type: string
  actionText: string
  date?: string
}) => {
  return (
    <div className="p-2 flex items-center gap-4">
      <div className="text-[#2672EF] rounded-full p-[6px] shadow">{icon}</div>

      <div className="flex-1 flex flex-col gap-1">
        {/* Header and user name */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-base">{header}</h3>
          <p className="text-sm">{userName}</p>
        </div>
        {/* Action and date */}
        <div className="space-y-1">
          <p className="text-xs text-gray-500">{actionText}</p>
          {date && (
            <div className="flex items-center gap-1">
              <div className="flex gap-1 items-center">
                <span className="text-[#92ABF3]">
                  <Clock className="size-3" />
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {date}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs ml-auto">
        <span className="text-gray-500">{timeAgo}</span>
      </div>
    </div>
  )
}

export default RecentActivity
