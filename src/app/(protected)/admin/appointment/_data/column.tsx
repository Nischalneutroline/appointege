// pages/users.tsx
'use client'

import { TableColumn } from '@/components/table/data-table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Pill } from '@/components/ui/pill'
import { getInitials } from '@/lib/utils'
import {
  openAppointmentDeleteForm,
  openAppointmentEditForm,
  openAppointmentViewForm,
} from '@/store/slices/appointmentSlice'
import { RootState } from '@/store/store'

import {
  Ellipsis,
  Eye,
  MoreVertical,
  Pencil,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Appointment } from '../_types/appointment'
import { Service } from '../../service/_types/service'
import { formatAppointmentDateTime } from '@/lib/date-time-format'
import { User } from '../../customer/_types/customer'
import { getRandomColor } from '@/lib/color'

export interface AppointmentWithService extends Appointment {
  service?: Service
  user?: User
}

// Color for the Customer Name
// const getRandomColor = () => {
//   const colors = [
//     '#93c5fd', // blue-300
//     '#86efac', // green-300
//     '#d8b4fe', // purple-300
//     '#f9a8d4', // pink-300
//     '#a5b4fc', // indigo-300
//     '#fde047', // yellow-300
//     '#fca5a5', // red-300
//     '#5eead4', // teal-300
//   ]
//   return colors[Math.floor(Math.random() * colors.length)]
// }

// Handle Action Button Compnent
function AppointmentActions({ row }: { row: AppointmentWithService }) {
  const dispatch = useDispatch()

  const handleViewClick = () => {
    dispatch(openAppointmentViewForm({ ...row }))
  }

  const handleEditClick = () => {
    dispatch(openAppointmentEditForm({ ...row }))
  }

  const handleDeleteClick = () => {
    dispatch(openAppointmentDeleteForm({ ...row }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <Ellipsis size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
        <DropdownMenuItem
          className="group/view text-gray-500 hover:bg-gray-50 gap-0"
          onClick={handleViewClick}
        >
          <Eye className="mr-4 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
          <div className=" group-hover/view:text-[#2563EB]">View</div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleEditClick}
          className="group/edit text-gray-500 hover:bg-gray-50 gap-0"
        >
          <SquarePen className="mr-4 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
          <div className="group-hover/edit:text-[#10B981]">Edit</div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDeleteClick}
          className="group/delete text-gray-500 hover:bg-gray-50 gap-0"
        >
          <Trash2 className="mr-4 h-4 w-4 group-hover/delete:text-red-500 text-red-500" />
          <div className="group-hover/delete:text-red-500">Delete</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Appointment Table Column
export const columns: TableColumn<AppointmentWithService>[] = [
  {
    header: 'Id',
    accessor: 'id',
    render: (value, row, index) => {
      return <div className="font-medium text-sm">{index + 1}</div>
    },
  },
  {
    header: 'Customer',
    accessor: 'customerName',
    render: (value, row, index) => {
      const initials = (row.customerName || '')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)

      return (
        <div className="flex gap-2 items-center">
          <div
            className={`h-8 w-8 flex items-center justify-center rounded-[4px] `}
            style={{
              backgroundColor: row.color || getRandomColor(),
              color: 'white',
            }}
          >
            <span className="text-xs font-semibold">{initials}</span>
          </div>
          <span>{row.customerName}</span>
        </div>
      )
    },
  },
  {
    header: 'Service',
    accessor: 'service',
    render: (value, row, index) => {
      return <span>{row.service?.title}</span>
    },
  },
  {
    header: 'Date',
    accessor: 'selectedDate',
    render: (value, row, index) => {
      if (!row.selectedDate) return <span>-</span>
      const { formattedDate } = formatAppointmentDateTime(row.selectedDate)
      return <span>{formattedDate}</span>
    },
  },
  {
    header: 'Time',
    accessor: 'selectedDate',
    render: (value, row, index) => {
      if (!row.selectedDate) return <span>-</span>
      const { formattedTime } = formatAppointmentDateTime(row.selectedDate)
      return <span>{formattedTime}</span>
    },
  },
  {
    header: 'Duration',
    accessor: 'service',
    render: (value, row, index) => {
      const service = row.service
      return <span>{service?.estimatedDuration} min</span>
    },
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (value, row, index) => {
      const status = row.status
      if (status === 'COMPLETED') {
        return (
          <Pill variant="success" withDot>
            {status}
          </Pill>
        )
      }
      if (status === 'MISSED') {
        return (
          <Pill variant="destructive" withDot>
            {status}
          </Pill>
        )
      }
      if (status === 'CANCELLED') {
        return (
          <Pill variant="default" withDot>
            {status}
          </Pill>
        )
      }
      if (status === 'SCHEDULED') {
        return (
          <Pill variant="warning" withDot>
            {status}
          </Pill>
        )
      }
    },
  },
  {
    header: 'Action',
    accessor: 'id',
    render: (value, row, index) => {
      return <AppointmentActions row={row} />
    },
  },
]

// Utility function to generate random color

// Schema for Appointment Table Data
// type AppointmentColumnSchema = {
//   id: number
//   name: string
//   service: string
//   color: string
//   date: string
//   time: string
//   type: string
//   status: string
// }

// // selected the scervice based on the serviceID
// const selectedService = (serviceId: string) => {
//   const { services } = useSelector((state: RootState) => state.servcie)
//   const service = services.find((service: any) => service.id === serviceId)
//   return service?.title || 'Unknown Service'
// }

// // Appointment Table Column
// export const columns: TableColumn<AppointmentColumnSchema>[] = [
//   {
//     header: 'ID',
//     accessor: 'id',
//     render: (
//       value: string | number,
//       row: AppointmentColumnSchema,
//       index: number,
//     ) => {
//       return <div className="font-medium text-sm">{index + 1}</div>
//     },
//   },
//   {
//     header: 'Name',
//     accessor: 'name',
// render: (
//   value: string | number,
//   row: AppointmentColumnSchema,
//   index: number,
// ) => {
//   const initials = (row.name || '')
//     .split(' ')
//     .map((n) => n[0])
//     .join('')
//     .toUpperCase()
//     .substring(0, 2)

//   return (
//     <div className="flex gap-2 items-center">
//       <div
//         className={`h-8 w-8 flex items-center justify-center rounded-[4px] `}
//         style={{ backgroundColor: row.color }}
//       >
//         <span className="text-xs font-semibold text-white">{initials}</span>
//       </div>
//       <span>{row.name}</span>
//     </div>
//   )
// },
//   },
//   {
//     header: 'Service',
//     accessor: 'service',
//     render: (
//       value: string | number,
//       row: AppointmentColumnSchema,
//       index: number,
//     ) => {
//       // Your render logic here
//       return <span>{row.service?.}</span> // Example return
//     },
//   },
//   { header: 'Date', accessor: 'date' },
//   { header: 'Time', accessor: 'time' },
//   { header: 'Type', accessor: 'type' },
//   {
//     header: 'Status',
//     accessor: 'status',
// render: (status) => {
//   if (status === 'Completed') {
//     return (
//       <Pill variant="success" withDot>
//         {status}
//       </Pill>
//     )
//   }
//   if (status === 'Missed') {
//     return (
//       <Pill variant="destructive" withDot>
//         {status}
//       </Pill>
//     )
//   }
//   if (status === 'Canceled') {
//     return (
//       <Pill variant="default" withDot>
//         {status}
//       </Pill>
//     )
//   }
//   if (status === 'Scheduled') {
//     return (
//       <Pill variant="warning" withDot>
//         {status}
//       </Pill>
//     )
//   }
// },
//   },
//   {
//     header: 'Action',
//     accessor: 'id',
//     render: (value: string | number, row: AppointmentColumnSchema) => {
//       return <AppointmentActions row={row} />
//     },
//   },
// ]

// export default function UsersPage() {
//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">User Table</h1>
//       <Table data={users} columns={columns} rowKey="id" />
//     </div>
//   );
// }
