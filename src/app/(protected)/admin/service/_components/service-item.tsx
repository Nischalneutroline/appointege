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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getInitials } from '@/lib/utils'

import { useDispatch } from 'react-redux'
import { getRandomColor } from '@/lib/color'
import { Service, ServiceStatus } from '../_types/service'
import {
  openServiceDeleteForm,
  openServiceEditForm,
  openServiceViewForm,
} from '@/store/slices/serviceslice'
import { truncateDescription } from '@/utils/truncateSentence'
import { formatAvailability } from '@/utils/formatAvailability'

const ServiceItem = ({ item }: { item: Service }) => {
  const dispatch = useDispatch()

  const statusVariants = {
    [ServiceStatus.ACTIVE]: 'success',
    [ServiceStatus.INACTIVE]: 'warning',
  } as const

  const variant =
    statusVariants[item.status as keyof typeof statusVariants] || 'default'

  return (
    <div className="relative flex w-full items-center px-4 py-4 gap-3 border-[1px] border-[#DCE9F9] rounded-[8px] bg-white cursor-pointer">
      <div
        className="h-16 w-16 text-lg font-semibold text-white flex items-center justify-center rounded-[8px]"
        style={{ backgroundColor: item.color || getRandomColor() }}
      >
        {getInitials(item.title)}
      </div>
      {/* Details */}
      <div className="w-full flex flex-col">
        {/* Name */}
        <div className="flex w-full justify-between pr-8 md:pr-20">
          <div className="text-[#111827] font-semibold text-sm capitalize">
            {item.title}
          </div>
          <Pill variant={variant} withDot>
            {item.status}
          </Pill>
        </div>
        {/* Description */}
        <div className="flex w-fit flex-col gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-[#6B7280] text-sm font-normal leading-[100%] cursor-pointer">
                  {truncateDescription(item.description)}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-blue-200 text-blue-900 text-sm rounded-md p-2 max-w-xs">
                <p>{item.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Date and Time */}
          <div className="flex gap-1.5 text-xs font-medium text-[#111827]">
            <div className="flex gap-2">
              <div className="flex items-center justify-center">
                <Calendar
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                  color="#92AAF3"
                />
              </div>
              <div>
                {formatAvailability(item.serviceAvailability) || 'Mon, Wed'}
              </div>
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
                {item.estimatedDuration
                  ? `${item.estimatedDuration} minutes`
                  : '30 minutes'}
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
              onClick={() => dispatch(openServiceViewForm({ ...item }))}
            >
              <Eye className="mr-4 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
              <div className="group-hover/view:text-[#2563EB]">View</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => dispatch(openServiceEditForm({ ...item }))}
              className="group/edit text-gray-500 hover:bg-gray-50 gap-0"
            >
              <SquarePen className="mr-4 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
              <div className="group-hover/edit:text-[#10B981]">Edit</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => dispatch(openServiceDeleteForm({ ...item }))}
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

export default ServiceItem
