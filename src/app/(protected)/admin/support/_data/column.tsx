import { cn } from '@/lib/utils'
import { TableColumn } from '@/components/table/data-table'
import {
  deleteTicket,
  openTicketForm,
  TicketFormData,
  TicketItem,
} from '@/store/slices/ticketSlice'
import {
  ChevronDown,
  Ellipsis,
  EllipsisVertical,
  Eye,
  SquarePen,
  Trash2,
} from 'lucide-react'

import { capitalizeFirstLetter } from '@/lib/capitalize-text'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu'
// import { openTicketViewForm } from '@/store/slices/ticketSlice'

const handleEditClick = (dispatch: any, row: TicketFormData) => {
  dispatch(openTicketForm({ ticket: row, mode: 'edit' }))
}

const handleDeleteClick = (dispatch: any, row: TicketFormData) => {
  dispatch(deleteTicket(row?.id as string))
}
export const columns = (dispatch: any): TableColumn<TicketItem>[] => [
  {
    header: 'Id',
    accessor: 'id',
    render: (_, __, index) => (
      <span className="text-center font-semibold">{index + 1}</span>
    ),
  },
  {
    header: 'Issue',
    accessor: 'subject',
    render: (value: string | null | undefined) => (
      <span className="text-center font-semibold">{value}</span>
    ),
  },
  {
    header: 'Issue Date',
    accessor: 'createdAt',
    render: (value: string | null | undefined) => {
      if (!value) return <span className="text-center font-semibold">-</span>
      const date = new Date(value)
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      return <span className="text-center ">{formattedDate}</span>
    },
  },
  {
    header: 'Priority',
    accessor: 'priority',
    render: (value: string | null | undefined) => (
      <span
        className={cn(
          'px-2 py-1 text-xs font-medium rounded-full flex gap-1 w-[100px] justify-center items-center',
          value === 'URGENT' && 'bg-red-100 text-red-700',
          value === 'HIGH' && 'bg-red-50 text-red-600',
          value === 'MEDIUM' && 'bg-yellow-100 text-yellow-700',
          value === 'LOW' && 'bg-green-100 text-green-700',
        )}
      >
        {capitalizeFirstLetter(value || '')}
        <ChevronDown size={16} />
      </span>
    ),
  },
  {
    header: 'Category',
    accessor: 'category',
    render: (value: string | null | undefined) => (
      <span className="text-center">{capitalizeFirstLetter(value || '')}</span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (value: string | null | undefined) => (
      <span
        className={cn(
          'px-2 py-1 text-xs font-medium rounded-full flex gap-1 w-[100px] justify-center items-center',
          value === 'OPEN' && 'bg-blue-100 text-blue-700',
          value === 'IN_PROGRESS' && 'bg-yellow-100 text-yellow-700',
          value === 'RESOLVED' && 'bg-green-100 text-green-700',
          value === 'CLOSED' && 'bg-gray-200 text-gray-800',
        )}
      >
        {value === 'IN_PROGRESS'
          ? 'In Progress'
          : capitalizeFirstLetter(value || '')}
        <ChevronDown size={16} />
      </span>
    ),
  },
  {
    header: 'Action',
    accessor: 'id',

    render: (value, row, index) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <Ellipsis size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[130px] bg-white rounded-md shadow-lg px-2 py-3 border border-gray-200 z-50 space-y-3 "
            sideOffset={5}
          >
            <DropdownMenuItem
              onClick={() => handleEditClick(dispatch, row)}
              className="flex items-center group/edit text-gray-500 hover:bg-gray-50"
            >
              <SquarePen className="mr-4 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
              <div className="group-hover/edit:text-[#10B981]">Edit</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(dispatch, row)}
              className="flex items-center group/delete text-gray-500 hover:bg-gray-50"
            >
              <Trash2 className="mr-4 h-4 w-4 group-hover/delete:text-red-500 text-red-500" />
              <div className="group-hover/delete:text-red-500">Delete</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
