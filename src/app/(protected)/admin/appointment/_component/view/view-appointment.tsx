// src/app/(protected)/admin/appointment/_component/view-appointment.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import {
  Calendar,
  CalendarDays,
  Mail,
  Phone,
  ShieldUser,
  UserRound,
} from 'lucide-react'
import { Pill } from '@/components/ui/pill'
import { format } from 'date-fns'
import { closeAppointmentForm } from '@/store/slices/appointmentSlice'

interface ViewAppointmentProps {
  open: boolean
  onChange: (open: boolean) => void
}

const ViewAppointment = ({ open, onChange }: ViewAppointmentProps) => {
  const dispatch = useDispatch()

  const { currentAppointment } = useSelector(
    (state: RootState) => state.appointment,
  )

  if (!currentAppointment) return null

  const statusVariants = {
    Completed: 'success',
    Missed: 'destructive',
    Canceled: 'default',
    Scheduled: 'warning',
  } as const

  const variant =
    statusVariants[currentAppointment.status as keyof typeof statusVariants] ||
    'default'

  return (
    <Dialog onOpenChange={onChange} open={open}>
      <DialogContent className="md:max-w-2xl overflow-y-scroll">
        <DialogHeader className="gap-0">
          <DialogTitle className="flex justify-center text-blue-700 text-xl">
            Appointment Details
          </DialogTitle>
          <DialogDescription className="flex justify-center text-sm text-muted-foreground">
            View appointment details
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center text-muted-foreground gap-4">
          {/* Customer Information */}
          <div className="w-full flex border border-[#E6E6EA] rounded-[8px] p-3 gap-3">
            <div
              className="h-12 w-12 text-lg font-semibold text-white flex items-center justify-center rounded-[8px] "
              style={{ backgroundColor: currentAppointment.color }}
            >
              {getInitials(currentAppointment.name)}
            </div>
            <div className=" flex-1 flex-col justify-center items-center">
              <div className="text-[#2563EB] text-base font-semibold">
                {currentAppointment.name}
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <Mail className="w-4 h-4" />
                  <div className="text-sm font-normal">
                    {currentAppointment.email || 'alex.j@gmail.com'}
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <Phone className="w-3.5 h-3.5 " />
                  <div className="text-sm font-normal">
                    {currentAppointment.phone || '+9779818275115'}
                  </div>
                </div>
              </div>
            </div>
            <Pill variant={variant} withDot>
              {currentAppointment.status}
            </Pill>
          </div>
          {/* Appointment Information */}
          <div className="w-full flex flex-col justify-start gap-2">
            <div className="flex items-center text-[#2563EB] font-medium text-base gap-2">
              <CalendarDays className="w-5 h-5" />
              Appointment Information
            </div>
            <div className="w-full flex flex-col border border-[#E6E6EA] rounded-[8px] p-3 gap-3">
              <div className="flex w-full items-center ">
                {/* Service */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Service</div>
                  <div className=" text-sm font-normal">
                    {currentAppointment.service}
                  </div>
                </div>
                {/* Type */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Type</div>
                  <div className=" text-sm font-normal">
                    {currentAppointment.type}
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center ">
                {/* Date */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Date</div>
                  <div className=" text-sm font-normal">
                    {currentAppointment.date}
                  </div>
                </div>
                {/* Time */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Time</div>
                  <div className=" text-sm font-normal">
                    {currentAppointment.time}
                  </div>
                </div>
              </div>
              {/* Customer Note */}
              <div className="flex flex-col w-full text-[#111827]">
                <div className="text-sm font-semibold">Customer Note</div>
                <div className=" text-sm font-normal text-[#B57200]">
                  Patient has sensitivity to cold. Please use warm water during
                  cleaning.
                </div>
              </div>
            </div>
          </div>
          {/* Booking Details */}
          <div className="w-full flex flex-col justify-start gap-2">
            <div className="flex items-center text-[#2563EB] font-medium text-base gap-2">
              <UserRound className="w-5 h-5" />
              Booking Details
            </div>
            <div className="w-full flex flex-col border border-[#E6E6EA] rounded-[8px] p-3 gap-3">
              <div className="flex w-full items-center ">
                {/* Service */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Booked for</div>
                  <div className=" text-sm font-normal">Self</div>
                </div>
                {/* Type */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Created by</div>
                  <div className=" text-sm font-normal">Dr. Shara Willson</div>
                </div>
              </div>
              <div className="flex w-full items-center ">
                {/* Date */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Date</div>
                  <div className=" text-sm font-normal">
                    {format(new Date(currentAppointment.date), 'MMM d, yyyy')}
                  </div>
                </div>
                {/* Time */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Last Updated</div>
                  <div className=" text-sm font-normal">
                    {format(new Date(currentAppointment.date), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Admin's Note */}

          <div className="w-full flex flex-col justify-start gap-2">
            <div className="flex items-center text-[#2563EB] font-medium text-base gap-2">
              <ShieldUser className="w-5 h-5" />
              For Admin
            </div>
            <div className="w-full flex border border-[#E6E6EA] rounded-[8px] p-3 gap-3">
              <div className="w-full flex flex-col items-start text-[#111827]">
                <div className="text-sm font-semibold">Admin's Note</div>
                <div className=" text-sm font-normal">
                  Patient has sensitivity to cold. Please use warm water during
                  cleaning.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row justify-center mt-6">
          <Button
            type="button"
            onClick={() => dispatch(closeAppointmentForm())}
            variant="default"
            className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
            // disabled={isLoadingServices || isLoadingAppointment || isSubmitting}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewAppointment
