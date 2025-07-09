'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import {
  CalendarDays,
  CircleCheckBig,
  Contact2Icon,
  Image,
  Mail,
  Phone,
  ShieldUser,
  UserRound,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { getInitials } from '@/lib/utils'
import { getRandomColor } from '@/lib/color'
import { Pill } from '@/components/ui/pill'
import { Button } from '@/components/ui/button'
import { Appointment } from '../../appointment/_types/appointment'
import { formatAppointmentDateTime } from '@/lib/date-time-format'
import { Service, ServiceStatus } from '../_types/service'
import { formatAvailability } from '@/utils/formatAvailability'

interface ViewServiceProps {
  open: boolean
  onChange: (open: boolean) => void
}

const ViewService = ({ open, onChange }: ViewServiceProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { currentService } = useSelector((state: RootState) => state.service)
  const [visibleAppointments, setVisibleAppointments] = useState(2)

  const statusVariants = {
    [ServiceStatus.ACTIVE]: 'success',
    [ServiceStatus.INACTIVE]: 'warning',
  } as const

  const variant =
    statusVariants[currentService?.status as keyof typeof statusVariants] ||
    'default'

  // Format availability as a comma-separated string

  const userStatus = {
    MEMBER: 'success',
    ACTIVE: 'success',
    GUEST: 'default',
    INACTIVE: 'warning',
  } as const

  const appointmentStatus = {
    FOLLOW_UP: 'warning',
    COMPLETED: 'success',
    MISSED: 'destructive',
    CANCELLED: 'default',
    SCHEDULED: 'warning',
  } as const

  // Dot size mapping based on appointment status severity
  // const dotSizeMap = {
  //   [appointmentStatus.COMPLETED]: 'size-4', // Largest for success
  //   [appointmentStatus.MISSED]: 'size-4', // Largest for critical
  //   [appointmentStatus.CANCELLED]: 'size-3', // Medium for neutral
  //   [appointmentStatus.SCHEDULED]: 'size-3', // Medium for pending
  //   // [appointmentStatus.FOLLOW_UP]: 'size-2', // Smallest for reminder
  // } as const

  useEffect(() => {
    if (currentService) {
      setIsLoaded(true)
    }
  }, [currentService])

  if (!isLoaded) {
    return null // Prevent rendering until data is loaded
  }

  console.log('currentService', currentService)

  return (
    <Dialog onOpenChange={onChange} open={open}>
      <DialogContent className="max-w-md md:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="gap-0 bg-[#F7F7F7] h-24 p-4 -m-6">
          <DialogTitle className="flex justify-center text-blue-700 font-semibold text-2xl md:text-3xl">
            Service Details
          </DialogTitle>
          <DialogDescription className="flex justify-center text-base text-muted-foreground">
            View the service details
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col items-center text-muted-foreground gap-6">
            {/* Customer Information */}
            <div className="w-full flex items-center border border-[#E6E6EA] rounded-lg p-4 gap-2 ">
              <div
                className="size-12 text-xl font-semibold  text-white flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: currentService?.color || getRandomColor(),
                }}
              >
                {getInitials(currentService?.title || '')}
              </div>

              {/* Customer Name */}
              <div className="flex-1 text-blue-600 text-2xl font-medium capitalize">
                {currentService?.title || 'Service Name'}
              </div>

              <div className="">
                <Pill variant={variant} withDot className="text-lg">
                  {variant}
                </Pill>
              </div>
            </div>

            {/* Appointment Information */}
            <div className="w-full flex flex-col justify-start gap-3">
              <div className="flex items-center text-[#2563EB] font-medium text-xl gap-3">
                <CalendarDays className="w-6 h-6" />
                Service Information
              </div>
              {/* Appointment Detail */}
              <div className="w-full flex flex-col border border-[#E6E6EA] rounded-lg p-4 gap-4">
                {/* 1st row */}
                <div className="flex gap-4">
                  {/* Service type */}
                  <div className="flex-1 flex flex-col text-base text-gray-900">
                    <span className="font-semibold">Service Type</span>
                    <span className="">{'Physical'}</span>
                  </div>
                  {/* Service hour */}
                  <div className="flex-1 flex flex-col text-base text-gray-900">
                    <span className="font-semibold">Service Hours</span>
                    <span className="">{'9:00 AM - 5:00 PM'}</span>
                  </div>
                </div>
                {/* 2nd row */}
                <div className="flex gap-4">
                  {/* Customer Email */}
                  <div className="flex-1 flex flex-col text-base text-gray-900">
                    <span className="font-semibold">Available Days</span>
                    <span className="">
                      <div>
                        {formatAvailability(
                          currentService?.serviceAvailability,
                        )}
                      </div>
                    </span>
                  </div>
                  {/* Duration */}
                  <div className="flex-1 flex flex-col text-base text-gray-900">
                    <span className="font-semibold">Duration</span>
                    <span className="">
                      <div>{currentService?.estimatedDuration}min</div>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment History */}
            <div className="w-full flex flex-col justify-start gap-3">
              <div className="flex items-center text-[#2563EB] font-medium text-xl gap-3">
                <Image className="w-6 h-6" />
                Service Photo
              </div>
              <div>Service photo</div>
            </div>
            {/* Service Description */}
            <div className="w-full flex flex-col justify-start gap-2">
              <div className="flex items-center text-[#2563EB] font-medium text-base gap-2">
                <ShieldUser className="w-5 h-5" />
                Service Description
              </div>
              <div className="w-full flex border border-[#E6E6EA] rounded-[8px] ">
                <div className="w-full flex flex-col items-start text-[#111827] ">
                  <div className="w-full text-sm font-semibold bg-[#F7F7F7] px-3 py-1">
                    Description
                  </div>
                  <div className="text-sm font-normal px-3 py-1">
                    {currentService?.description ||
                      'No description for this service.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row justify-center">
          <Button
            type="button"
            onClick={() => onChange(false)}
            variant="default"
            className="w-32 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200 text-base"
            aria-label="Close customer details"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewService
