import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Pill } from '@/components/ui/pill'
import { Appointment } from '@/data/appointment'
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

const AppointmentGrid = ({ item }: { item: Appointment }) => {
  const dispatch = useDispatch()
  const statusVariants = {
    Completed: 'success',
    Missed: 'destructive',
    Canceled: 'default',
    Scheduled: 'warning',
  } as const

  const variant =
    statusVariants[item.status as keyof typeof statusVariants] || 'default'

  return (
    // <div className="flex flex-col gap-2 rounded-[12px] h-fit border-[1px] border-[#E5E7EB] bg-white p-5 hover:scale-103 transition duration-400 shadow-md">
    //   <div className="flex justify-between ">
    //     <div
    //       className="flex items-center justify-center h-9.5 w-10  text-white font-semibold rounded-[8px]"
    //       style={{ backgroundColor: item.color }}
    //     >
    //       {getInitials(item.name)}
    //     </div>
    //     <div className="flex items-start gap-2">
    //       <Pill variant={variant} withDot>
    //         {item.status}
    //       </Pill>
    //       <div className="flex items-start h-full">
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
    //               <Ellipsis size={16} />
    //             </button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align="end" className="">
    //             <DropdownMenuItem
    //               className="group/view text-gray-500 hover:bg-gray-50"
    //               onClick={() => console.log('Clicked Edit', item)}
    //             >
    //               <Eye className="mr-1 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
    //               <div className="group-hover/view:text-[#2563EB]">View</div>
    //             </DropdownMenuItem>
    //             <DropdownMenuItem
    //               onClick={() => console.log('Clicked Edit', item)}
    //               className="group/edit text-gray-500 hover:bg-gray-50"
    //             >
    //               <SquarePen className="mr-2 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
    //               <div className="group-hover/edit:text-[#10B981]">Edit</div>
    //             </DropdownMenuItem>
    //             <DropdownMenuItem
    //               onClick={() => console.log('Clicked Delete', item)}
    //               className="group/delete text-gray-500 hover:bg-gray-50"
    //             >
    //               <Trash2 className="mr-2 h-4 w-4 group-hover/delete:text-red-500 text-red-500" />
    //               <div className="group-hover/delete:text-red-500">Delete</div>
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="flex flex-col gap-1">
    //     <div className="text-[#111827] text-lg font-semibold">{item.name}</div>

    //     <div className="flex flex-col gap-3">
    //       <div className="flex gap-4 text-center ">
    //         <div className="flex text-sm font-normal text-[#78818C]">
    //           Dental Cleaning
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <MapPin size={14} strokeWidth={2.5} color="#92AAF3" />
    //           <div className="font-medium text-sm text-[#78818C]">Physical</div>
    //         </div>
    //       </div>
    //       <div>
    //         <div className="flex items-center gap-2">
    //           <PhoneCall size={14} strokeWidth={2.5} color="#92AAF3" />
    //           <div className="text-sm font-normal text-[#78818C]">
    //             9867373778
    //           </div>
    //         </div>
    //         <div className="flex items-center gap-2">
    //           <Mail size={14} strokeWidth={2.5} color="#92AAF3" />
    //           <div className="text-sm font-normal text-[#78818C]">
    //             samrat.neutoline@gmail.com
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="flex flex-col">
    //     <div className="flex items-center gap-2">
    //       <Calendar size={14} strokeWidth={2.5} color="#92AAF3" />
    //       <div className="text-sm font-normal text-[#78818C]">2025-05-23</div>
    //     </div>
    //     <div className="flex items-center gap-2">
    //       <Clock size={14} strokeWidth={2.5} color="#92AAF3" />
    //       <div className="text-sm font-normal text-[#78818C]">
    //         10:00 AM (30 min)
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col items-stretch bg-white rounded-[10px] border-[1px] border-[#DCE9F9] gap-4 ">
      <div className="flex flex-col px-6 pt-6 gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2.5 items-center">
            <div
              className="h-10 w-10 p-1.5 font-semibold text-white flex items-center justify-center rounded-[8px] "
              style={{ backgroundColor: item.color }}
            >
              <div className="text-lg leading-[71.694%]">
                {getInitials(item.name)}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-base font-medium text-[#111827]">
                Sandiya Thapa
              </div>
              <div className="flex gap-3 text-xs font-normal">
                <div className="text-[#78818C]">Dental Cleaning</div>
                <div className="flex gap-1 items-center justify-center">
                  <div className="flex w-full h-full justify-center items-center">
                    {' '}
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
        <div className="flex flex-col gap-2 text-sm font-medium text-[#111827]">
          <div className="flex gap-2">
            <div className="flex items-center justify-center">
              <Calendar
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                color="#92AAF3"
              />
            </div>
            <div className="">Jun 05, 2025</div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center justify-center">
              <Clock
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                color="#92AAF3"
              />
            </div>
            <div>10:00 AM (30 min)</div>
          </div>
        </div>
      </div>
      <div className="flex w-full h-10 justify-between items-center text-[#6B7280] text-sm">
        <div className="w-full flex border-t-[1px] border-r-[1px] border-[#DCE9F9] justify-center p-3 cursor-pointer">
          <div
            className="flex  items-center "
            onClick={() => {
              dispatch(openAppointmentViewForm(item))
            }}
          >
            <Eye className="mr-1 h-3.5 w-3.4 " />
            <div>View</div>
          </div>
        </div>

        <div className="w-full flex border-t-[1px]  border-[#DCE9F9] justify-center p-3 cursor-pointer">
          <div
            className="flex items-center"
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
