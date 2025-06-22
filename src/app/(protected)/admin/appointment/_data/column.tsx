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
import {
  Ellipsis,
  Eye,
  MoreVertical,
  Pencil,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { useDispatch } from 'react-redux'
function AppointmentActions({ row }: { row: AppointmentColumnSchema }) {
  const dispatch = useDispatch()

  const handleViewClick = () => {
    dispatch(
      openAppointmentViewForm({ ...row, initials: getInitials(row.name) }),
    )
  }

  const handleEditClick = () => {
    dispatch(
      openAppointmentEditForm({ ...row, initials: getInitials(row.name) }),
    )
  }

  const handleDeleteClick = () => {
    dispatch(
      openAppointmentDeleteForm({ ...row, initials: getInitials(row.name) }),
    )
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
          className="group/view text-gray-500 hover:bg-gray-50"
          onClick={handleViewClick}
        >
          <Eye className="mr-1 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
          <div className="group-hover/view:text-[#2563EB]">View</div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleEditClick}
          className="group/edit text-gray-500 hover:bg-gray-50"
        >
          <SquarePen className="mr-2 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
          <div className="group-hover/edit:text-[#10B981]">Edit</div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDeleteClick}
          className="group/delete text-gray-500 hover:bg-gray-50"
        >
          <Trash2 className="mr-2 h-4 w-4 group-hover/delete:text-red-500 text-red-500" />
          <div className="group-hover/delete:text-red-500">Delete</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
// Utility function to generate random color
const getRandomColor = () => {
  const colors = [
    'bg-blue-300',
    'bg-green-300',
    'bg-purple-300',
    'bg-pink-300',
    'bg-indigo-300',
    'bg-yellow-300',
    'bg-red-300',
    'bg-teal-300',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Schema for Appointment Table Data
type AppointmentColumnSchema = {
  id: number
  name: string
  service: string
  color: string
  date: string
  time: string
  type: string
  status: string
}

// Appointment Table Column
export const columns: TableColumn<AppointmentColumnSchema>[] = [
  {
    header: 'ID',
    accessor: 'id',
    render: (
      value: string | number,
      row: AppointmentColumnSchema,
      index: number,
    ) => {
      return <div className="font-medium text-sm">{index + 1}</div>
    },
  },
  {
    header: 'Name',
    accessor: 'name',
    render: (
      value: string | number,
      row: AppointmentColumnSchema,
      index: number,
    ) => {
      const initials = (row.name || '')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)

      return (
        <div className="flex gap-2 items-center">
          <div
            className={`h-8 w-8 flex items-center justify-center rounded-[4px] `}
            style={{ backgroundColor: row.color }}
          >
            <span className="text-xs font-semibold text-white">{initials}</span>
          </div>
          <span>{row.name}</span>
        </div>
      )
    },
  },
  { header: 'Service', accessor: 'service' },
  { header: 'Date', accessor: 'date' },
  { header: 'Time', accessor: 'time' },
  { header: 'Type', accessor: 'type' },
  {
    header: 'Status',
    accessor: 'status',
    render: (status) => {
      if (status === 'Completed') {
        return (
          <Pill variant="success" withDot>
            {status}
          </Pill>
        )
      }
      if (status === 'Missed') {
        return (
          <Pill variant="destructive" withDot>
            {status}
          </Pill>
        )
      }
      if (status === 'Canceled') {
        return (
          <Pill variant="default" withDot>
            {status}
          </Pill>
        )
      }
      if (status === 'Scheduled') {
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
    render: (value: string | number, row: AppointmentColumnSchema) => {
      return <AppointmentActions row={row} />
    },
  },
]

// export default function UsersPage() {
//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">User Table</h1>
//       <Table data={users} columns={columns} rowKey="id" />
//     </div>
//   );
// }
