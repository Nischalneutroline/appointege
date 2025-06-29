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
import {
  openAppointmentDeleteForm,
  openAppointmentEditForm,
  openAppointmentViewForm,
} from '@/store/slices/appointmentSlice'
import { useDispatch } from 'react-redux'
import { AppointmentWithService } from '../_data/column'
import { formatAppointmentDateTime } from '@/lib/date-time-format'
import { getRandomColor } from '@/lib/color'

const AppointmentCard = ({ item }: { item: AppointmentWithService }) => {
  const dispatch = useDispatch()
  // Dynmaic Status Variants
  const statusVariants = {
    COMPLETED: 'success',
    MISSED: 'destructive',
    CANCELED: 'default',
    SCHEDULED: 'warning',
  } as const
  const variant =
    statusVariants[item.status as keyof typeof statusVariants] || 'default'
  // OnClick Function for View Action
  const handleViewClick = () => {
    dispatch(openAppointmentViewForm({ ...item }))
  }
  // OnClick Function for Edit Action
  const handleEditClick = () => {
    dispatch(openAppointmentEditForm({ ...item }))
  }
  // OnClick Function for Delete Action
  const handleDeleteClick = () => {
    dispatch(openAppointmentDeleteForm({ ...item }))
  }

  // Date formatting
  const { formattedDate, formattedTime } = formatAppointmentDateTime(
    item.selectedDate,
  )

  return (
    <div className=" flex w-full items-center px-4 py-4 gap-3 border-[1px] border-[#DCE9F9] rounded-[8px]  bg-white cursor-pointer">
      <div
        className="h-16 w-16 text-lg font-semibold text-white flex items-center justify-center rounded-[8px] "
        style={{ backgroundColor: getRandomColor() }}
      >
        {getInitials(item.customerName)}
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="flex w-full justify-between pr-8 md:pr-20">
          <div className="text-[#111827] font-semibold text-sm">
            {item.customerName}
          </div>
          <Pill variant={variant} withDot>
            {item.status}
          </Pill>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 text-sm font-normal leading-[100%]">
            <div className="text-[#6B7280]">{item?.service?.title}</div>
            <div className="flex gap-2">
              <MapPin size={14} strokeWidth={2.5} color="#92AAF3" />

              <div className="font-medium text-[#78818C]">Physical</div>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-normal leading-[100%]">
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
              className="group/view text-gray-500 hover:bg-gray-50 gap-0"
              onClick={handleViewClick}
            >
              <Eye className="mr-4 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
              <div className=" group-hover/view:text-[#2563EB]">View</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleEditClick}
              className="group/edit text-gray-500 hover:bg-gray-50 gap-0"
            >
              <SquarePen className="mr-4 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
              <div className="group-hover/edit:text-[#10B981]">Edit</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteClick}
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

export default AppointmentCard
