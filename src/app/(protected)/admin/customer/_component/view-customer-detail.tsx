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
  Mail,
  Phone,
  UserRound,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { getInitials } from '@/lib/utils'
import { CustomerStatus } from '../_types/customer'
import { getRandomColor } from '@/lib/color'
import { Pill } from '@/components/ui/pill'
import { Button } from '@/components/ui/button'
import { Appointment } from '../../appointment/_types/appointment'
import { formatAppointmentDateTime } from '@/lib/date-time-format'

interface CustomerDetailProps {
  open: boolean
  onChange: (open: boolean) => void
}

const CustomerDetail = ({ open, onChange }: CustomerDetailProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { currentCustomer } = useSelector((state: RootState) => state.customer)
  const [visibleAppointments, setVisibleAppointments] = useState(2)

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
    if (currentCustomer) {
      setIsLoaded(true)
    }
  }, [currentCustomer])

  const variant = currentCustomer?.status?.includes(CustomerStatus.MEMBER)
    ? 'MEMBER'
    : currentCustomer?.status?.includes(CustomerStatus.INACTIVE)
      ? 'GUEST'
      : currentCustomer?.status?.includes(CustomerStatus.ACTIVE)
        ? 'ACTIVE'
        : 'INACTIVE'

  const userVariant = userStatus[variant] || 'default'

  if (!isLoaded) {
    return null // Prevent rendering until data is loaded
  }

  console.log('currentCustomer', currentCustomer)

  const handleViewToggle = () => {
    if (visibleAppointments >= (currentCustomer?.appointments?.length || 0)) {
      setVisibleAppointments(2) // View Less
    } else {
      const nextVisible = visibleAppointments + 3
      setVisibleAppointments(
        nextVisible >= (currentCustomer?.appointments?.length || 0)
          ? currentCustomer?.appointments?.length || 0
          : nextVisible,
      ) // View More, cap at total length
    }
  }

  const buttonText =
    visibleAppointments >= (currentCustomer?.appointments?.length || 0)
      ? 'View Less ꜛ'
      : 'View More ꜜ'

  return (
    <Dialog onOpenChange={onChange} open={open}>
      <DialogContent className="max-w-md md:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="gap-0 bg-[#F7F7F7] h-24 p-4 -m-6">
          <DialogTitle className="flex justify-center text-blue-700 font-semibold text-2xl md:text-3xl">
            Customer Details
          </DialogTitle>
          <DialogDescription className="flex justify-center text-base text-muted-foreground">
            View the customer details
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col items-center text-muted-foreground gap-6">
            {/* Customer Information */}
            <div className="w-full flex items-center border border-[#E6E6EA] rounded-lg p-4 gap-2 ">
              <div
                className="size-12 text-xl font-semibold  text-white flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: currentCustomer?.color || getRandomColor(),
                }}
              >
                {getInitials(currentCustomer?.name || '')}
              </div>

              {/* Customer Name */}
              <div className="flex-1 text-blue-600 text-2xl font-medium capitalize">
                {currentCustomer?.name || 'User'}
              </div>

              <div className="">
                <Pill variant={userVariant} withDot className="text-lg">
                  {variant}
                </Pill>
              </div>
            </div>

            {/* Appointment Information */}
            <div className="w-full flex flex-col justify-start gap-3">
              <div className="flex items-center text-[#2563EB] font-medium text-xl gap-3">
                <Contact2Icon className="w-6 h-6" />
                Contact Information
              </div>
              {/* Appointment Detail */}
              <div className="w-full flex flex-col border border-[#E6E6EA] rounded-lg p-4 gap-4">
                <div className="flex gap-4">
                  {/* Customer Phone */}
                  <div className="flex-1 flex flex-col text-base text-gray-900">
                    <span className="font-semibold">Phone</span>
                    <span className="">
                      {currentCustomer?.phone || '+977 9818781723'}
                    </span>
                  </div>
                  {/* Customer Email */}
                  <div className="flex-1 flex flex-col text-base text-gray-900">
                    <span className="font-semibold">Email</span>
                    <span className="">
                      {currentCustomer?.email || 'example@me.com'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment History */}
            <div className="w-full flex flex-col justify-start gap-3">
              <div className="flex items-center text-[#2563EB] font-medium text-xl gap-3">
                <CalendarDays className="w-6 h-6" />
                Appointment History
              </div>
              <div className="w-full flex flex-col border border-[#E6E6EA] rounded-lg p-4 gap-4">
                {currentCustomer?.appointments?.length ? (
                  <>
                    {currentCustomer.appointments
                      .slice(0, visibleAppointments)
                      .map((appointment) => {
                        const statusVariant =
                          appointmentStatus[appointment.status] || 'default'
                        const dotSize = 'size-3'

                        return (
                          <div
                            key={appointment.id}
                            className="flex items-center gap-6 border border-[#E5E7EB] bg-[#F8F9FA] p-4 rounded-lg"
                          >
                            <div
                              className={`${dotSize} rounded-full`}
                              style={{
                                backgroundColor:
                                  statusVariant === 'success'
                                    ? '#4CAF50'
                                    : statusVariant === 'destructive'
                                      ? '#EF4444'
                                      : statusVariant === 'warning'
                                        ? '#F59E0B'
                                        : '#6B7280', // default gray
                              }}
                            ></div>

                            {/* Service and Date */}
                            <div className="flex-1 flex flex-col">
                              {/* Service */}
                              <div className="text-lg xl:text-xl font-medium text-gray-700">
                                {appointment.service?.title ||
                                  'Unknown Service'}
                              </div>
                              {/* Date and Time */}
                              <div className="text-base text-muted-foreground">
                                <span>
                                  {`${
                                    formatAppointmentDateTime(
                                      appointment.selectedDate,
                                    )?.formattedDate || 'N/A'
                                  }, ${appointment.selectedTime || 'N/A'}`}
                                </span>
                              </div>
                            </div>

                            {/* Pill Status */}
                            <Pill
                              variant={statusVariant}
                              withDot
                              className="text-base"
                            >
                              {appointment.status || 'Unknown'}
                            </Pill>
                          </div>
                        )
                      })}
                    {currentCustomer.appointments.length > 2 && (
                      <Button
                        variant="link"
                        className="text-blue-500 p-0 h-auto text-base"
                        onClick={handleViewToggle}
                      >
                        {buttonText}
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-base text-muted-foreground">
                    <span className="capitalize font-semibold">
                      {currentCustomer?.name}
                    </span>{' '}
                    has no appointments.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row justify-center mt-8">
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerDetail
