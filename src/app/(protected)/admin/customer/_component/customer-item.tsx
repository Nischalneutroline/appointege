import React from 'react'
import {
  Calendar,
  Clock,
  Ellipsis,
  Eye,
  Mail,
  MapPin,
  Phone,
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

import { useDispatch, useSelector } from 'react-redux'
import { formatAppointmentDateTime } from '@/lib/date-time-format'
import { getRandomColor } from '@/lib/color'
import { User } from '../_types/customer'
import { RootState } from '@/store/store'
import {
  ACTIVE_DURATION_DAYS,
  MS_PER_DAY,
  openCustomerDeleteForm,
  openCustomerEditForm,
  openCustomerViewForm,
} from '@/store/slices/customerSlice'

const CustomerItem = ({ item }: { item: User }) => {
  const dispatch = useDispatch()
  const { activeFilter } = useSelector((state: RootState) => state.customer)

  // Determine status based on activeFilter and lastActive
  const timeDiffMs = item.lastActive
    ? Date.now() - new Date(item.lastActive).getTime()
    : Number.MAX_SAFE_INTEGER
  const isUserActive =
    item.lastActive &&
    !isNaN(new Date(item.lastActive).getTime()) &&
    timeDiffMs <= ACTIVE_DURATION_DAYS * MS_PER_DAY
  const status =
    activeFilter === 'active' || activeFilter === 'inactive'
      ? isUserActive
        ? 'ACTIVE'
        : 'INACTIVE'
      : item.role === 'USER'
        ? 'MEMBER'
        : item.role === 'GUEST'
          ? 'GUEST'
          : 'UNKNOWN'

  // Status variants and colors
  const statusVariants = {
    ACTIVE: 'success',
    INACTIVE: 'warning',
    MEMBER: 'success',
    GUEST: 'warning',
    UNKNOWN: 'default',
  } as const
  const variant = statusVariants[status as keyof typeof statusVariants]

  return (
    <div className="  relative flex w-full h-24 items-center px-5 py-4 gap-3 border-[1px] border-[#DCE9F9] rounded-[8px] bg-white cursor-pointer">
      <div
        className="h-13 w-13 text-lg font-semibold text-white flex items-center justify-center rounded-[8px]"
        style={{ backgroundColor: item.color || getRandomColor() }}
      >
        {getInitials(item.name)}
      </div>
      {/* Details */}
      <div className="w-full flex flex-col gap-1 ">
        {/* Name */}
        <div className="flex w-full justify-between pr-8 md:pr-20">
          <div className="text-[#111827] font-semibold text-lg  capitalize">
            {item.name}
          </div>
          <Pill variant={variant} withDot>
            {status}
          </Pill>
        </div>
        {/* Description */}
        {/* Service  Name*/}
        <div className="flex  gap-2 text-base font-normal leading-[100%]">
          <div className="text-[#6B7280] flex gap-1 items-center">
            <Mail size={14} strokeWidth={2.5} color="#a3b9f5" />
            {item?.email}
          </div>
          <div className="text-[#6B7280] flex gap-1 items-center">
            <Phone size={14} strokeWidth={2.5} color="#a3b9f5" />
            {item?.phone}
          </div>
        </div>
        {/* Date amd Time */}
        {/* <div className=" flex gap-4 text-sm font-normal leading-[100%]">
            <div className="flex gap-2">
              <Calendar size={14} strokeWidth={2.5} color="#4e7dff" />
              <div className="text-[#6B7280]">{formattedDate}</div>
            </div>
            <div className="flex gap-2">
              <Clock size={14} strokeWidth={2.6} color="#4e7dff" />
              <div className="text-[#6B7280]">
                {formattedTime} ({item?.service?.estimatedDuration} min)
              </div>
            </div>
          </div> */}
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
              className="group/view text-gray-500 hover:bg-gray-50 gap-0"
              onClick={() => dispatch(openCustomerViewForm({ ...item }))}
            >
              <Eye className="mr-4 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
              <div className="group-hover/view:text-[#2563EB]">View</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => dispatch(openCustomerEditForm({ ...item }))}
              className="group/edit text-gray-500 hover:bg-gray-50 gap-0"
            >
              <SquarePen className="mr-4 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
              <div className="group-hover/edit:text-[#10B981]">Edit</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => dispatch(openCustomerDeleteForm({ ...item }))}
              className="group/delete text-gray-500 hover:bg-gray-50 gap-0"
            >
              <Trash2 className="mr-4 h-4 w-4 group-hover/delete:text-red-500 text-red-500" />
              <div className="group-hover/delete:text-red-500">Delete</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default CustomerItem
