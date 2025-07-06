// import React from 'react'
// import { Appointment } from '@/data/appointment'
// import {
//   Calendar,
//   Clock,
//   Ellipsis,
//   Eye,
//   Mail,
//   MapPin,
//   Phone,
//   SquarePen,
//   Trash2,
// } from 'lucide-react'
// import { Pill } from '@/components/ui/pill'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { getInitials } from '@/lib/utils'
// import {
//   openAppointmentDeleteForm,
//   openAppointmentEditForm,
//   openAppointmentViewForm,
// } from '@/store/slices/appointmentSlice'
// import { useDispatch } from 'react-redux'

// import { formatAppointmentDateTime } from '@/lib/date-time-format'
// import { getRandomColor } from '@/lib/color'
// import { Role, User } from '../_types/customer'

// const CustomerCard = ({ item }: { item: User }) => {
//   const dispatch = useDispatch()
//   // Dynmaic Status Variants
//   const statusVariants = {
//     [Role.USER]: 'success',
//     // Role.ADMIN: 'destructive',
//     // Role.SUPERADMIN: 'default',
//     [Role.GUEST]: 'warning',
//   } as const
//   const variant =
//     statusVariants[item.role as keyof typeof statusVariants] || 'default'
//   // OnClick Function for View Action
//   const handleViewClick = () => {
//     // dispatch(openAppointmentViewForm({ ...item }))
//   }
//   // OnClick Function for Edit Action
//   const handleEditClick = () => {
//     // dispatch(openAppointmentEditForm({ ...item }))
//   }
//   // OnClick Function for Delete Action
//   const handleDeleteClick = () => {
//     // dispatch(openAppointmentDeleteForm({ ...item }))
//   }

//   // Date formatting
//   const { updatedFormattedDate, updatedFormattedTime } =
//     formatAppointmentDateTime(item.updatedAt)
//   const { createdAtFormattedDate, createdAtFormattedTime } =
//     formatAppointmentDateTime(item.createdAt)
//   const { lastActiveFormattedDate, lastActiveFormattedTime } =
//     formatAppointmentDateTime(item.lastActiveAt)

//   return (
//     <div className="relative flex w-full items-center px-4 py-4 gap-3 border-[1px] border-[#DCE9F9] rounded-[8px]  bg-white cursor-pointer">
//       <div
//         className="h-16 w-16 text-lg font-semibold text-white flex items-center justify-center rounded-[8px] "
//         style={{ backgroundColor: item.color || getRandomColor() }}
//       >
//         {getInitials(item.name)}
//       </div>
//       <div className="w-full flex flex-col gap-1">
//         <div className="flex w-full justify-between pr-8 md:pr-20">
//           <div className="text-[#111827] font-semibold text-sm">
//             {item.name}
//           </div>
//           <Pill variant={variant} withDot>
//             {item.role}
//           </Pill>
//         </div>
//         <div className="flex flex-col gap-2">
//           <div className="flex gap-4 text-sm font-normal leading-[100%]">
//             <div className="flex gap-2">
//               <Mail size={14} strokeWidth={2.5} color="#92AAF3" />

//               <div className="text-[#6B7280]">{item?.email}</div>
//             </div>

//             {item.phone && (
//               <div className="flex gap-2">
//                 <Phone size={14} strokeWidth={2.5} color="#92AAF3" />

//                 <div className="font-medium text-[#78818C]">{item.phone}</div>
//               </div>
//             )}
//           </div>
//           <div className="flex gap-4 text-sm font-normal leading-[100%]">
//             <div className="flex gap-2">
//               <Calendar size={14} strokeWidth={2.5} color="#4e7dff" />
//               <div className="text-[#6B7280]">{lastActiveFormattedDate}</div>
//             </div>
//             <div className="flex gap-2">
//               <Clock size={14} strokeWidth={2.6} color="#4e7dff" />
//               <div className="text-[#6B7280]">{lastActiveFormattedTime}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="absolute top-4 right-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
//               <Ellipsis size={16} />
//             </button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="">
//             <DropdownMenuItem
//               className="group/view text-gray-500 hover:bg-gray-50 gap-0"
//               onClick={handleViewClick}
//             >
//               <Eye className="mr-4 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
//               <div className=" group-hover/view:text-[#2563EB]">View</div>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={handleEditClick}
//               className="group/edit text-gray-500 hover:bg-gray-50 gap-0"
//             >
//               <SquarePen className="mr-4 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
//               <div className="group-hover/edit:text-[#10B981]">Edit</div>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={handleDeleteClick}
//               className="group/delete text-gray-500 hover:bg-gray-50 gap-0"
//             >
//               <Trash2 className="mr-4 h-4 w-4 group-hover/delete:text-red-500 text-red-500" />
//               <div className="group-hover/delete:text-red-500">Delete</div>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   )
// }

// export default CustomerCard
import React from 'react'
import { User } from '../_types/customer'
import {
  Calendar,
  Clock,
  Ellipsis,
  Eye,
  Mail,
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
import { formatAppointmentDateTime } from '@/lib/date-time-format'
import { getRandomColor } from '@/lib/color'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  MS_PER_DAY,
  openCustomerDeleteForm,
  openCustomerEditForm,
  openCustomerViewForm,
} from '@/store/slices/customerSlice'
import { ACTIVE_DURATION_DAYS } from '@/store/slices/customerSlice'

const CustomerCard = ({ item }: { item: User }) => {
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

  // Action handlers
  const handleViewClick = (item: User) => {
    dispatch(openCustomerViewForm({ ...item }))
  }

  const handleEditClick = (item: User) => {
    dispatch(openCustomerEditForm({ ...item }))
  }

  const handleDeleteClick = (item: User) => {
    dispatch(openCustomerDeleteForm({ ...item }))
  }

  // Date formatting
  const {
    formattedDate: lastActiveFormattedDate,
    formattedTime: lastActiveFormattedTime,
  } = formatAppointmentDateTime(item.lastActive)

  return (
    <div className="w-full flex flex-col items-stretch bg-white rounded-[10px] border-[1px] border-[#DCE9F9] gap-4">
      <div className="flex flex-col px-6 pt-6 gap-5">
        {/* Header: Name, Email, and Phone */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            {/* Avatar */}
            <div
              className=" size-10 p-1.5 font-semibold text-white flex items-center justify-center rounded-[8px]"
              style={{ backgroundColor: item.color || getRandomColor() }}
            >
              <div className="text-lg leading-[71.694%]">
                {getInitials(item.name)}
              </div>
            </div>
            {/* Name */}
            <div className="text-lg font-semibold capitalize text-[#111827]">
              {item.name}
            </div>
          </div>
          <Pill variant={variant} withDot>
            {status}
          </Pill>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-1 text-xs font-medium ">
            <div className="flex items-center gap-2">
              <Mail size={14} strokeWidth={2.5} color="#92ABF3" />
              {item.email || 'N/A'}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} strokeWidth={2.5} color="#92ABF3" />
              {item.phone || 'N/A'}
            </div>
          </div>
        </div>

        {/* Last Active Date and Time */}
        <div className="flex  gap-1.5  text-xs   text-[#111827]/50">
          <div className="flex gap-1.5 items-center">
            {/* <Calendar
              className="h-3.5 w-3.5"
              strokeWidth={2.5}
              color="#92AAF3"
            /> */}
            <Clock className="h-3.5 w-3.5" strokeWidth={2.5} color="#92AAF3" />
            Last Active:
            <div className="">
              <span>{lastActiveFormattedDate}</span> -
              <span> {lastActiveFormattedTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full h-10 justify-between items-center text-[#6B7280] text-sm">
        <div
          className="w-full flex border-t-[1px] border-r-[1px] border-[#DCE9F9] justify-center p-3 cursor-pointer hover:bg-gray-50"
          onClick={() => handleViewClick(item)}
        >
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.4 text-[#2563EB]" />
            <span>View</span>
          </div>
        </div>
        <div
          className="w-full flex border-t-[1px] border-[#DCE9F9] justify-center p-3 cursor-pointer hover:bg-gray-50"
          onClick={() => handleEditClick(item)}
        >
          <div className="flex items-center gap-1">
            <SquarePen className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Edit</span>
          </div>
        </div>
        <div
          className="w-full flex border-t-[1px] border-l-[1px] border-[#DCE9F9] justify-center p-3 cursor-pointer hover:bg-gray-50"
          onClick={() => handleDeleteClick(item)}
        >
          <div className="flex items-center gap-1">
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
            <span>Delete</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerCard
