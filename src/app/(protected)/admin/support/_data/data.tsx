import { FilterOptionState } from '@/store/slices/ticketSlice'
import { TicketItem } from '@/store/slices/ticketSlice'

export const createFilterOptions = (ticekts: TicketItem[]) => {
  const filters: FilterOptionState[] = [
    {
      label: 'New',
      value: 'OPEN',
      textColor: '#0F5327',
      border: '#E6F4EC',
      background: '#E9F9EF',
      icon: 'Eye',
      count: ticekts.filter((ticket) => ticket.status === 'OPEN').length,
    },

    {
      label: 'Working',
      value: 'IN_PROGRESS',
      textColor: '#7F1D1D',
      border: '#FEE2E2',
      background: '#FEF2F2',
      icon: 'EyeOff',
      count: ticekts.filter((ticket) => ticket.status === 'IN_PROGRESS').length,
    },
    // {
    //   label: 'Resolved',
    //   value: 'Resolved',
    //   textColor: '#7F1D1D',
    //   border: '#FEE2E2',
    //   background: '#FEF2F2',
    //   icon: 'EyeOff',
    //   count: ticekts.filter((ticket) => ticket.status === 'RESOLVED').length,
    // },
    {
      label: 'Closed',
      value: 'CLOSED',
      textColor: '#7F1D1D',
      border: '#FEE2E2',
      background: '#FEF2F2',
      icon: 'EyeOff',
      count: ticekts.filter((ticket) => ticket.status === 'CLOSED').length,
    },
  ]
  return filters
}
