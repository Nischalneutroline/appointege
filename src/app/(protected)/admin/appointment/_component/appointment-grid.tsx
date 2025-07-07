import { Pill } from '@/components/ui/pill'
import { getInitials } from '@/lib/utils'
import {
  openAppointmentDeleteForm,
  openAppointmentEditForm,
  openAppointmentViewForm,
} from '@/store/slices/appointmentSlice'

import {
  Calendar,
  Clock,
  Ellipsis,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  PhoneCall,
  SquarePen,
  Trash2,
} from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
// import { AppointmentWithService } from '../_data/column'
import { formatAppointmentDateTime } from '@/lib/date-time-format'
import { getRandomColor } from '@/lib/color'
import { Appointment } from '../_types/appointment'

const AppointmentGrid = ({ item }: { item: Appointment }) => {
  const dispatch = useDispatch()
  const statusVariants = {
    COMPLETED: 'success',
    MISSED: 'destructive',
    CANCELED: 'default',
    SCHEDULED: 'warning',
  } as const

  const variant =
    statusVariants[item.status as keyof typeof statusVariants] || 'default'

  // Date formatting
  const { formattedDate, formattedTime } = formatAppointmentDateTime(
    item.selectedDate,
  )

  return (
    <div className="w-full flex flex-col items-stretch bg-white rounded-[10px] border-[1px] border-[#DCE9F9] gap-4 ">
      <div className="flex flex-col px-6 pt-6 gap-5">
        {/* Header: Name */}
        <div className="flex flex-col gap-3 ">
          <div className="flex gap-2 items-center ">
            <div
              className="h-full w-10 p-1.5 font-semibold text-white flex items-center justify-center rounded-[8px] "
              style={{ backgroundColor: item.color || getRandomColor() }}
            >
              <div className="text-lg leading-[71.694%]">
                {getInitials(item.customerName)}
              </div>
            </div>
            <div className="h-full flex flex-col">
              <div className="text-[16px] font-medium text-[#111827]">
                {item.customerName}
              </div>
              <div className="flex gap-2 text-xs font-normal">
                <div className="text-[#78818C]">{item?.service?.title}</div>
                <div className="flex gap-1 items-center justify-center">
                  <div className="flex w-full h-full justify-center items-center">
                    <MapPin size={14} strokeWidth={2.5} color="#92ABF3" />
                  </div>
                  <div className="text-[#78818C]">Physical</div>
                </div>
              </div>
            </div>
          </div>
          <Pill variant={variant} withDot>
            {item.status}
          </Pill>
        </div>
        {/* Date and Time */}
        <div className="flex flex-col gap-1.5 text-xs font-medium text-[#111827]">
          <div className="flex gap-2">
            <div className="flex items-center justify-center">
              <Calendar
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                color="#92AAF3"
              />
            </div>
            <div className="">{formattedDate}</div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center justify-center">
              <Clock
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                color="#92AAF3"
              />
            </div>
            <div>
              {item.selectedTime}{' '}
              <span className=" font-light">
                ({item?.service?.estimatedDuration} min)
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex w-full h-10 justify-between items-center text-[#6B7280] text-sm">
        <div className="w-full flex border-t-[1px] border-r-[1px] border-[#DCE9F9] justify-center p-3 cursor-pointer">
          {/* View */}
          <div
            className="flex-1 flex justify-center  items-center "
            onClick={() => {
              dispatch(openAppointmentViewForm(item))
            }}
          >
            <Eye className="mr-1 h-3.5 w-3.4 " />
            <div>View</div>
          </div>
        </div>

        {/* Edit */}
        <div className="w-full flex border-t-[1px]  border-[#DCE9F9] justify-center p-3 cursor-pointer">
          <div
            className="flex-1 flex justify-center  items-center "
            onClick={() => {
              dispatch(openAppointmentEditForm(item))
            }}
          >
            <SquarePen className="mr-2 h-3.5 w-3.5" />
            <div>Edit</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentGrid
