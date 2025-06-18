import React from 'react'
import { Appointment } from '@/data/appointment'
import {
  Calendar,
  Clock,
  Ellipsis,
  Eye,
  MapPin,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { Pill } from '@/components/ui/pill'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/utils'

const AppointmentCard = ({ item }: { item: Appointment }) => {
  const statusVariants = {
    'Follow Up': 'warning',
    Completed: 'success',
    Missed: 'destructive',
    Canceled: 'default',
    Scheduled: 'secondary',
  } as const

  const variant =
    statusVariants[item.status as keyof typeof statusVariants] || 'default'

  return (
    <div className="relative flex w-full items-center px-4 py-4 gap-3 border-[1px] border-[#DCE9F9] rounded-[8px]  bg-white">
      <div
        className="h-16 w-16 text-lg font-semibold text-white flex items-center justify-center rounded-[8px] "
        style={{ backgroundColor: item.color }}
      >
        {getInitials(item.name)}
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="flex w-full justify-between pr-20">
          <div className="text-[#111827] font-semibold text-sm">
            {item.name}
          </div>
          <Pill variant={variant} withDot>
            {item.status}
          </Pill>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 text-sm font-normal leading-[100%]">
            <div className="text-[#6B7280]">{item.service}</div>
            <div className="flex gap-2">
              <MapPin size={14} strokeWidth={2.5} color="#92AAF3" />

              <div className="font-medium text-[#78818C]">Physical</div>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-normal leading-[100%]">
            <div className="flex gap-2">
              <Calendar size={14} strokeWidth={2.5} color="#4e7dff" />
              <div className="text-[#6B7280]">{item.date}</div>
            </div>
            <div className="flex gap-2">
              <Clock size={14} strokeWidth={2.6} color="#4e7dff" />
              <div className="text-[#6B7280]">{item.time} (30 min)</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <Ellipsis size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem
              className="group/view text-gray-500 hover:bg-gray-50"
              onClick={() => console.log('Clicked Edit', item.id)}
            >
              <Eye className="mr-1 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
              <div className="group-hover/view:text-[#2563EB]">View</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('Clicked Edit', item.id)}
              className="group/edit text-gray-500 hover:bg-gray-50"
            >
              <SquarePen className="mr-2 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
              <div className="group-hover/edit:text-[#10B981]">Edit</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('Clicked Delete', item.id)}
              className="group/delete text-gray-500 hover:bg-gray-50"
            >
              <Trash2 className="mr-2 h-4 w-4 group-hover/delete:text-red-500 text-red-500" />
              <div className="group-hover/delete:text-red-500">Delete</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default AppointmentCard
