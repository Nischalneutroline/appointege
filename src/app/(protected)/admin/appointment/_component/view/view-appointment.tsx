// 'use client'

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
import { CalendarDays, Mail, Phone, ShieldUser, UserRound } from 'lucide-react'
import { Pill } from '@/components/ui/pill'
import { closeAppointmentForm } from '@/store/slices/appointmentSlice'
import { getRandomColor } from '@/lib/color'
import { formatAppointmentDateTime } from '@/lib/date-time-format'

interface ViewAppointmentProps {
  open: boolean
  onChange: (open: boolean) => void
}

const ViewAppointment = ({ open, onChange }: ViewAppointmentProps) => {
  const dispatch = useDispatch()

  const { currentAppointment } = useSelector(
    (state: RootState) => state.appointment,
  )

  const { services } = useSelector((state: RootState) => state.service)

  const statusVariants = {
    COMPLETED: 'success',
    MISSED: 'destructive',
    CANCELED: 'default',
    SCHEDULED: 'warning',
  } as const
  const variant =
    statusVariants[currentAppointment?.status as keyof typeof statusVariants] ||
    'default'

  // Date formatting
  const { formattedDate, formattedTime } = formatAppointmentDateTime(
    currentAppointment?.selectedDate,
  )
  const { formattedDate: lastUpdatedDate, formattedTime: lastUpdatedTime } =
    formatAppointmentDateTime(currentAppointment?.updatedAt)

  if (!currentAppointment) return null

  const service = services.find((s) => s.id === currentAppointment?.serviceId)
  console.log(services, 'service')

  return (
    <Dialog onOpenChange={onChange} open={open}>
      <DialogContent className="max-w-md md:max-w-2xl max-h-[80dvh] overflow-y-auto px-4 sm:px-6">
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
              className="h-12 w-12 text-lg font-semibold text-white flex items-center justify-center rounded-[8px]"
              style={{
                backgroundColor: currentAppointment.color || getRandomColor(),
              }}
            >
              {getInitials(currentAppointment.customerName)}
            </div>
            <div className="flex-1 flex-col justify-center items-center">
              <div className="text-[#2563EB] text-base font-semibold">
                {currentAppointment.customerName}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-1 items-center">
                  <Mail className="w-4 h-4" />
                  <div className="text-sm font-normal">
                    {currentAppointment.email || 'alex.j@gmail.com'}
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <Phone className="w-3.5 h-3.5" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
                {/* Service */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Service</div>
                  <div className="text-sm font-normal">{service?.title}</div>
                </div>
                {/* Type */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Type</div>
                  <div className="text-sm font-normal">Physical</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
                {/* Date */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Date</div>
                  <div className="text-sm font-normal">{formattedDate}</div>
                </div>
                {/* Time */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Time</div>
                  <div className="text-sm font-normal">{formattedTime}</div>
                </div>
              </div>
              {/* Customer Note */}
              <div className="flex flex-col w-full text-[#111827]">
                <div className="text-sm font-semibold">Customer Note</div>
                <div className="text-sm font-normal text-[#B57200]">
                  {currentAppointment?.message}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
                {/* Booked for */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Booked for</div>
                  <div className="text-sm font-normal">
                    {currentAppointment.isForSelf ? 'Self' : 'Other'}
                  </div>
                </div>
                {/* Created by */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Created by</div>
                  <div className="text-sm font-normal">
                    {currentAppointment?.createdById}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
                {/* Date */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Date</div>
                  <div className="text-sm font-normal">{formattedDate}</div>
                </div>
                {/* Last Updated */}
                <div className="w-full flex flex-col items-start text-[#111827]">
                  <div className="text-sm font-semibold">Last Updated</div>
                  <div className="text-sm font-normal">
                    {lastUpdatedDate} {lastUpdatedTime}
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
                <div className="text-sm font-normal">
                  {currentAppointment?.message}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row justify-center mt-6">
          <Button
            type="button"
            onClick={() => {
              dispatch(closeAppointmentForm())
              onChange(false)
            }}
            variant="default"
            className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewAppointment

// 'use client'

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { getInitials } from '@/lib/utils'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/store/store'
// import { CalendarDays, Mail, Phone, ShieldUser, UserRound } from 'lucide-react'
// import { Pill } from '@/components/ui/pill'
// import { closeAppointmentForm } from '@/store/slices/appointmentSlice'
// import { getRandomColor } from '@/lib/color'
// import { formatAppointmentDateTime } from '@/lib/date-time-format'

// interface ViewAppointmentProps {
//   open: boolean
//   onChange: (open: boolean) => void
// }

// const ViewAppointment = ({ open, onChange }: ViewAppointmentProps) => {
//   const dispatch = useDispatch()
//   const { currentAppointment } = useSelector(
//     (state: RootState) => state.appointment,
//   )
//   const { services } = useSelector((state: RootState) => state.service)

//   const statusVariants = {
//     COMPLETED: 'success',
//     MISSED: 'destructive',
//     CANCELED: 'default',
//     SCHEDULED: 'warning',
//   } as const
//   const variant =
//     statusVariants[currentAppointment?.status as keyof typeof statusVariants] ||
//     'default'

//   // Date formatting
//   const { formattedDate, formattedTime } = formatAppointmentDateTime(
//     currentAppointment?.selectedDate,
//   )
//   const { formattedDate: lastUpdatedDate, formattedTime: lastUpdatedTime } =
//     formatAppointmentDateTime(currentAppointment?.updatedAt)

//   if (!currentAppointment) return null

//   const service = services.find((s) => s.id === currentAppointment?.serviceId)

//   return (
//     <Dialog onOpenChange={onChange} open={open}>
//       <DialogContent className="max-w-md md:max-w-2xl max-h-[80dvh] overflow-y-auto space-y-4 px-4 sm:px-6">
//         <DialogHeader className="gap-2 text-center">
//           <DialogTitle className="text-blue-700 text-xl md:text-2xl font-semibold">
//             Appointment Details
//           </DialogTitle>
//           <DialogDescription className="text-sm text-muted-foreground">
//             View appointment details
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex flex-col gap-6">
//           {/* Customer Information */}
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center text-blue-700 font-medium text-base gap-2">
//               <UserRound className="w-5 h-5" />
//               Customer Information
//             </div>
//             <div className="flex items-center border border-blue-200 rounded-[8px] p-4 bg-[#eff5ff] hover:bg-[#e6edff] transition-colors duration-200">
//               <div
//                 className="h-12 w-12 text-lg font-semibold text-white flex items-center justify-center rounded-[8px]"
//                 style={{
//                   backgroundColor:
//                     currentAppointment?.color || getRandomColor(),
//                 }}
//               >
//                 {getInitials(currentAppointment.customerName)}
//               </div>
//               <div className="flex-1 ml-3 flex flex-col gap-1">
//                 <div className="text-blue-700 text-base font-semibold">
//                   {currentAppointment.customerName}
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600">
//                   <div className="flex gap-1 items-center">
//                     <Mail className="w-4 h-4 text-blue-500" />
//                     <span>
//                       {currentAppointment.email || 'alex.j@gmail.com'}
//                     </span>
//                   </div>
//                   <div className="flex gap-1 items-center">
//                     <Phone className="w-4 h-4 text-blue-500" />
//                     <span>{currentAppointment.phone || '+9779818275115'}</span>
//                   </div>
//                 </div>
//               </div>
//               <Pill
//                 variant={variant}
//                 withDot
//                 className="text-xs font-medium px-2 py-1"
//               >
//                 {currentAppointment.status}
//               </Pill>
//             </div>
//           </div>

//           {/* Appointment Information */}
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center text-blue-700 font-medium text-base gap-2">
//               <CalendarDays className="w-5 h-5" />
//               Appointment Information
//             </div>
//             <div className="flex flex-col border border-blue-200 rounded-[8px] p-4 bg-[#eff5ff] hover:bg-[#e6edff] transition-colors duration-200 gap-3">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Service
//                   </span>
//                   <span className="text-sm text-gray-600">
//                     {service?.title || 'N/A'}
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Type
//                   </span>
//                   <span className="text-sm text-gray-600">Physical</span>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Date
//                   </span>
//                   <span className="text-sm text-gray-600">{formattedDate}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Time
//                   </span>
//                   <span className="text-sm text-gray-600">{formattedTime}</span>
//                 </div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-sm font-semibold text-gray-700">
//                   Customer Note
//                 </span>
//                 <span className="text-sm text-yellow-600">
//                   {currentAppointment?.message || 'No note provided'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Booking Details */}
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center text-blue-700 font-medium text-base gap-2">
//               <UserRound className="w-5 h-5" />
//               Booking Details
//             </div>
//             <div className="flex flex-col border border-blue-200 rounded-[8px] p-4 bg-[#eff5ff] hover:bg-[#e6edff] transition-colors duration-200 gap-3">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Booked for
//                   </span>
//                   <span className="text-sm text-gray-600">
//                     {currentAppointment.isForSelf ? 'Self' : 'Other'}
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Created by
//                   </span>
//                   <span className="text-sm text-gray-600">
//                     {currentAppointment?.createdById || 'N/A'}
//                   </span>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Date
//                   </span>
//                   <span className="text-sm text-gray-600">{formattedDate}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Last Updated
//                   </span>
//                   <span className="text-sm text-gray-600">
//                     {lastUpdatedDate} {lastUpdatedTime}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Admin's Note */}
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center text-blue-700 font-medium text-base gap-2">
//               <ShieldUser className="w-5 h-5" />
//               For Admin
//             </div>
//             <div className="flex flex-col border border-blue-200 rounded-[8px] p-4 bg-[#eff5ff] hover:bg-[#e6edff] transition-colors duration-200">
//               <span className="text-sm font-semibold text-gray-700">
//                 Admin's Note
//               </span>
//               <span className="text-sm text-gray-600">
//                 {currentAppointment?.message || 'No admin note provided'}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col gap-3 md:flex-row justify-center mt-6">
//           <Button
//             type="button"
//             onClick={() => {
//               dispatch(closeAppointmentForm())
//               onChange(false)
//             }}
//             variant="default"
//             className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-all duration-200 hover:scale-105"
//           >
//             Done
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default ViewAppointment
