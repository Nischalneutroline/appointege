import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosApi } from '@/lib/baseUrl'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

// Types
export type TicketFilterValue =
  | 'ALL'
  | 'OPEN'
  | 'RESOLVED'
  | 'IN_PROGRESS'
  | 'CLOSED'

export interface TicketItem {
  id?: string
  userType: string
  customerName: string
  email: string
  subject: string
  ticketDescription: string
  category: string
  priority: string
  status: string
  assignedTo: string | null
  resolutionDescription: string | null
  proofFiles: string | null
  initiatedById: string
  userId: string
  createdAt?: string
  updatedAt?: string
}


export interface TicketFormData extends Partial<TicketItem> {}

interface TicketState {
  tickets: TicketItem[]
  userTickets: TicketItem[]
  adminTickets: TicketItem[]
  filteredTickets: TicketItem[]
  isLoading: boolean
  isSubmitting: boolean
  count: string | null
  activeFilter: TicketFilterValue
  activeFilters: TicketFilterValue[]
  searchQuery: string
  isTicketFormOpen: boolean
  currentTicket: TicketFormData | null
  ticketFormMode: 'create' | 'edit' | 'view' | 'delete'
  success: boolean
  message: string | null
  error: string | null
  counts: Record<TicketFilterValue, number>
}

const initialState: TicketState = {
  tickets: [],
  userTickets: [],
  adminTickets: [],
  filteredTickets: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  count: null,
  activeFilter: 'OPEN',
  activeFilters: ['OPEN', 'RESOLVED', 'IN_PROGRESS', 'CLOSED'],
  searchQuery: '',
  isTicketFormOpen: false,
  currentTicket: null,
  ticketFormMode: 'create',
  success: false,
  message: null,
  counts: {
    ALL: 0,
    OPEN: 0,
    RESOLVED: 0,
    IN_PROGRESS: 0,
    CLOSED: 0,
  },
}

const applyFilters = (
  tickets: TicketItem[],
  filters: TicketFilterValue[],
  query: string,
) => {
  return tickets.filter((ticket) => {
    const matchesSearch =
      !query ||
      ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
      ticket.priority.toLowerCase().includes(query.toLowerCase())

    const matchesCategory =
      filters.includes('ALL') ||
      filters.includes(ticket.status.toUpperCase() as TicketFilterValue)

    return matchesSearch && matchesCategory
  })
}

// Thunks
export const fetchTickets = createAsyncThunk(
  'ticket/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get('/api/ticket')
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to fetch tickets')
    }
  },
)

export const createTicket = createAsyncThunk(
  'ticket/createTicket',
  async (ticket: Omit<TicketItem, 'id'>, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.post('/api/ticket', ticket)
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to create ticket')
    }
  },
)

export const updateTicket = createAsyncThunk(
  'ticket/updateTicket',
  async (
    { id, ...updates }: Partial<TicketFormData> & { id: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axiosApi.put(`/api/ticket/${id}`, updates)
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to update ticket')
    }
  },
)

export const deleteTicket = createAsyncThunk(
  'ticket/deleteTicket',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.delete(`/api/ticket/${id}`)
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to delete ticket')
    }
  },
)

// Slice
const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setActiveFilter(state, action: PayloadAction<TicketFilterValue>) {
      state.activeFilter = action.payload
      state.activeFilters = [action.payload]
      state.filteredTickets = applyFilters(
        state.userTickets,
        [action.payload],
        state.searchQuery,
      )
    },
    setActiveFilters(state, action: PayloadAction<TicketFilterValue[]>) {
      state.activeFilters = action.payload
      state.filteredTickets = applyFilters(
        state.userTickets,
        action.payload,
        state.searchQuery,
      )
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
      state.filteredTickets = applyFilters(
        state.userTickets,
        state.activeFilters,
        action.payload,
      )
    },
    openTicketForm(
      state,
      action: PayloadAction<{
        ticket: TicketFormData | null
        mode: 'create' | 'edit' | 'view'
      }>,
    ) {
      state.isTicketFormOpen = true
      state.currentTicket = action.payload.ticket
      state.ticketFormMode = action.payload.mode
    },
    closeTicketForm(state) {
      state.isTicketFormOpen = false
      state.currentTicket = null
      state.ticketFormMode = 'create'
    },
    clearError(state) {
      state.error = null
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        const allTickets = action.payload as TicketItem[]
        state.isLoading = false
        state.tickets = allTickets
        state.userTickets = allTickets.filter((t) => t.userType === 'USER')
        state.adminTickets = allTickets.filter((t) => t.userType === 'ADMIN')
        state.filteredTickets = applyFilters(
          state.userTickets,
          state.activeFilters,
          state.searchQuery,
        )
        state.counts.ALL = allTickets.length
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error('Failed to fetch tickets')
      })

      .addCase(createTicket.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        const newTicket = action.payload.ticket
        state.isSubmitting = false
        state.tickets.push(newTicket)
        if (newTicket.userType === 'USER') state.userTickets.push(newTicket)
        else state.adminTickets.push(newTicket)
        state.filteredTickets = applyFilters(
          state.userTickets,
          state.activeFilters,
          state.searchQuery,
        )
        state.counts.ALL += 1
        state.counts[newTicket.status as TicketFilterValue] += 1
        state.isTicketFormOpen = false
        toast.success('Ticket created successfully')
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
        toast.error('Failed to create ticket')
      })

      .addCase(updateTicket.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        const updatedTicket = action.payload.ticket
        state.isSubmitting = false
        const index = state.tickets.findIndex((t) => t.id === updatedTicket.id)
        if (index !== -1) {
          const oldStatus = state.tickets[index].status
          state.tickets[index] = updatedTicket
          if (oldStatus !== updatedTicket.status) {
            state.counts[oldStatus as TicketFilterValue] -= 1
            state.counts[updatedTicket.status as TicketFilterValue] += 1
          }
        }
        state.userTickets = state.tickets.filter((t) => t.userType === 'USER')
        state.adminTickets = state.tickets.filter((t) => t.userType === 'ADMIN')
        state.filteredTickets = applyFilters(
          state.userTickets,
          state.activeFilters,
          state.searchQuery,
        )
        state.currentTicket = null
        state.isTicketFormOpen = false
        toast.success('Ticket updated successfully')
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
        toast.error('Failed to update ticket')
      })

      .addCase(deleteTicket.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        const id = action.meta.arg
        const deletedTicket = state.tickets.find((t) => t.id === id)
        state.isSubmitting = false
        if (deletedTicket) {
          state.tickets = state.tickets.filter((t) => t.id !== id)
          state.userTickets = state.tickets.filter((t) => t.userType === 'USER')
          state.adminTickets = state.tickets.filter(
            (t) => t.userType === 'ADMIN',
          )
          state.counts[deletedTicket.status as TicketFilterValue] -= 1
          state.counts.ALL -= 1
        }
        state.filteredTickets = applyFilters(
          state.userTickets,
          state.activeFilters,
          state.searchQuery,
        )
        toast.success('Ticket deleted successfully')
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
        toast.error('Failed to delete ticket')
      })
  },
})

export const {
  setActiveFilter,
  setActiveFilters,
  setSearchQuery,
  openTicketForm,
  closeTicketForm,
  clearError,
} = ticketSlice.actions

export default ticketSlice.reducer
