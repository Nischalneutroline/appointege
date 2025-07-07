import { Pill } from '@/components/ui/pill'
import { getInitials } from '@/lib/utils'
import {
  openServiceViewForm,
  openServiceEditForm,
} from '@/store/slices/serviceSlice' // Adjust slice import as needed
import { Calendar, Clock, Eye, SquarePen } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { getRandomColor } from '@/lib/color'
import { Service, ServiceStatus } from '../_types/service'

const ServiceCard = ({ item }: { item: Service }) => {
  const dispatch = useDispatch()

  const statusVariants = {
    [ServiceStatus.ACTIVE]: 'success',
    [ServiceStatus.INACTIVE]: 'warning',
  } as const

  const variant =
    statusVariants[item.status as keyof typeof statusVariants] || 'default'

  // Format availability as a comma-separated string
  const formatAvailability = (
    availability?: Service['serviceAvailability'],
  ) => {
    if (!availability || availability.length === 0) return 'Not available'
    return availability.map((avail) => avail.weekDay).join(', ')
  }

  return (
    <div className="w-full flex flex-col items-stretch bg-white rounded-[10px] border-[1px] border-[#DCE9F9] gap-4">
      <div className="flex flex-col px-6 pt-6 gap-5">
        {/* Header: Name */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <div
              className="h-full w-10 p-1.5 font-semibold text-white flex items-center justify-center rounded-[8px]"
              style={{ backgroundColor: item.color || getRandomColor() }}
            >
              <div className="text-lg leading-[71.694%]">
                {getInitials(item.title)}
              </div>
            </div>
            <div className="h-full flex flex-col">
              <div className="text-[16px] font-medium text-[#111827]">
                {item.title || 'Dental Examination'}
              </div>
              <div className="flex gap-2 text-xs font-normal">
                <div className="text-[#78818C]">
                  {item.description ||
                    'Comprehensive tooth checkup and oral health assessment.'}
                </div>
              </div>
            </div>
          </div>
          <Pill variant={variant} withDot>
            {item.status || 'ACTIVE'}
          </Pill>
        </div>
        {/* Duration and Availability */}
        <div className="flex flex-col gap-1.5 text-xs font-medium text-[#111827]">
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
