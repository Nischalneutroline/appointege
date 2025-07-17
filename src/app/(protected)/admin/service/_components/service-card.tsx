import { Pill } from '@/components/ui/pill'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  openServiceViewForm,
  openServiceEditForm,
} from '@/store/slices/serviceslice' // Adjust slice import as needed
import { Calendar, Clock, Eye, SquarePen } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { getRandomColor } from '@/lib/color'
import { Service, ServiceStatus } from '../_types/service'
import Image from 'next/image'
import { truncateDescription } from '@/utils/truncateSentence'
import { formatAvailability } from '@/utils/formatAvailability'

const ServiceCard = ({ item }: { item: Service }) => {
  const dispatch = useDispatch()

  const statusVariants = {
    [ServiceStatus.ACTIVE]: 'success',
    [ServiceStatus.INACTIVE]: 'warning',
  } as const

  const variant =
    statusVariants[item.status as keyof typeof statusVariants] || 'default'

  return (
    <div className="w-full flex flex-col items-stretch bg-white rounded-[10px] border-[1px] border-[#DCE9F9] gap-4">
      <div className="flex flex-col px-4 pt-4 gap-5">
        {/* Header: Name */}
        <div className="flex flex-col gap-2">
          <div className="relative w-full h-38">
            {/* Set explicit height for the container */}
            <Image
              src="https://plus.unsplash.com/premium_photo-1681966962522-546f370bc98e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Service Image"
              fill // Use fill to take full container size
              className="object-cover rounded-md rounded-b-none" // Ensure image covers container
            />
          </div>
        </div>
        <div className="h-full flex flex-col">
          <div className="w-full flex items-center justify-between">
            <span className="text-lg font-medium text-[#111827]">
              {item.title || 'Dental Examination'}
            </span>
            <Pill variant={variant} withDot>
              {item.status || 'ACTIVE'}
            </Pill>
          </div>
          <div className="flex gap-2 text-xs font-normal">
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
          </div>
        </div>

        {/* Duration and Availability */}
        <div className="flex flex-col gap-1.5 text-xs font-medium text-[#111827]">
          {/* Availability: Monday, Wednesday */}
          <div className="flex gap-2">
            <div className="flex items-center justify-center">
              <Calendar
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                color="#92AAF3"
              />
            </div>
            <div>
              {formatAvailability(item.serviceAvailability) ||
                'Monday, Wednesday'}
            </div>
          </div>
          {/* Duration */}
          <div className="flex gap-2">
            <div className="flex items-center justify-center">
              <Clock
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                color="#92AAF3"
              />
            </div>
            <div className="font-semibold">
              {item.estimatedDuration
                ? `${item.estimatedDuration}min`
                : '30 min'}
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex w-full h-10 justify-between items-center text-[#6B7280] text-sm">
        <div className="w-full flex border-t-[1px] border-r-[1px] border-[#DCE9F9] justify-center p-3 cursor-pointer">
          {/* View */}
          <div
            className="flex-1 flex justify-center items-center"
            onClick={() => {
              dispatch(openServiceViewForm(item))
            }}
          >
            <Eye className="mr-1 h-3.5 w-3.5" />
            <div>View</div>
          </div>
        </div>

        {/* Edit */}
        <div className="w-full flex border-t-[1px] border-[#DCE9F9] justify-center p-3 cursor-pointer">
          <div
            className="flex-1 flex justify-center items-center"
            onClick={() => {
              dispatch(openServiceEditForm(item))
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

export default ServiceCard
