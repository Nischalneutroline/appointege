import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosApi } from '@/lib/baseUrl'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

import {
  BusinessAvailability,
  Holiday,
} from '@/app/(protected)/admin/business-settings/_types/types'

// ──────────────────────────────────────────────────────────────────────────
// Support Information Interface
// ──────────────────────────────────────────────────────────────────────────
export interface SupportInfo {
  id: string
  supportBusinessName: string
  supportEmail: string
  supportPhone: string
  supportGoogleMap: string
  supportAddress: string
  businessId?: string
  supportAvailability: BusinessAvailability[]
  supportHoliday: Holiday[]
}

export interface SupportInfoState {
  supportDetail: SupportInfo | null
  isLoading: boolean
  hasFetched: boolean
  error: string | null
  success: boolean
  message: string | null
  isSubmitting: boolean
}

// ──────────────────────────────────────────────────────────────────────────
// FAQ Interface
// ──────────────────────────────────────────────────────────────────────────

export type FaqFilterValue = 'all' | 'public' | 'private'
export interface FAQItem {
  id?: string
  question: string
  answer: string
  isActive: boolean
  order: number | null
  createdAt: string
  updatedAt: string
  category: FaqFilterValue
  createdById: string
  lastUpdatedById: string
}

export interface FilterOptionState {
  label: string
  value: FaqFilterValue
  textColor: string
  border: string
  background: string
  icon: string
}

interface FAQCounts {
  all: number
  public: number
  private: number
}

interface FAQState {
  faqs: FAQItem[]
  filteredFaqs: FAQItem[]
  isLoading: boolean
  hasFetched: boolean
  isSubmitting: boolean
  filterOptions: FilterOptionState[]
  counts: FAQCounts
  activeFilter: FaqFilterValue | null
  activeFilters: FaqFilterValue[]
  searchQuery: string
  isFaqFormOpen: boolean
  currentFaq: FAQItem | null
  faqFormMode: 'create' | 'edit' | 'delete' | null
  success: boolean
  message: string | null
  error: string | null
}
// ──────────────────────────────────────────────────────────────────────────
// Ticket Interface
// ──────────────────────────────────────────────────────────────────────────
export type TicketFilterValue =
  | 'ALL'
  | 'OPEN'
  | 'RESOLVED'
  | 'IN_PROGRESS'
  | 'CLOSED'

export interface TicketFilterOptionState {
  label: string
  value: TicketFilterValue
  textColor: string
  border: string
  background: string
  icon: string
}

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
  nestedTab: string
  isLoading: boolean
  isSubmitting: boolean
  filterOptions: TicketFilterOptionState[]
  activeFilter: TicketFilterValue
  activeFilters: TicketFilterValue[]
  searchQuery: string
  isTicketFormOpen: boolean
  currentTicket: TicketFormData | null
  ticketFormMode: 'create' | 'edit' | 'view' | 'delete'
  success: boolean
  message: string | null
  error: string | null
  counts: {
    user: Record<TicketFilterValue, number>
    admin: Record<TicketFilterValue, number>
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Overall Support State
// ──────────────────────────────────────────────────────────────────────────
// interface ActiveFilters {
//   'Customer'
// }

interface SupportState {
  supportInfo: SupportInfoState
  faq: FAQState
  ticket: TicketState
  activeFilter: string | null
  activeFilters: string[]
  // Fix count type
  counts: null
  nestedTab: 'faq' | 'ticket'
}

// Update the initial state
const initialState: SupportState = {
  activeFilter: null,
  activeFilters: [],
  counts: null,
  nestedTab: 'faq',
  supportInfo: {
    isLoading: false,
    hasFetched: false,
    error: null,
    supportDetail: null,
    success: false,
    message: null,
    isSubmitting: false,
  },
  faq: {
    faqs: [],
    filteredFaqs: [],
    isLoading: false,
    hasFetched: false,
    isSubmitting: false,
    counts: {
      all: 0,
      public: 0,
      private: 0,
    },
    filterOptions: [
      {
        label: 'All',
        value: 'all',
        textColor: '#103064',
        border: '#E9DFFF',
        background: '#F0EBFB',
        icon: 'Users',
      },
      {
        label: 'Public',
        value: 'public',
        textColor: '#0F5327',
        border: '#E6F4EC',
        background: '#E9F9EF',
        icon: 'Eye',
      },
      {
        label: 'Private',
        value: 'private',
        textColor: '#7F1D1D',
        border: '#FEE2E2',
        background: '#FEF2F2',
        icon: 'EyeOff',
      },
    ],
    activeFilter: 'all',
    activeFilters: ['all', 'public', 'private'],
    searchQuery: '',
    isFaqFormOpen: false,
    currentFaq: null,
    faqFormMode: 'create',
    success: false,
    message: null,
    error: null,
  },
  ticket: {
    tickets: [],
    userTickets: [],
    adminTickets: [],
    nestedTab: 'user',
    filteredTickets: [],
    filterOptions: [
      {
        label: 'All',
        value: 'ALL',
        textColor: '#103064',
        border: '#E9DFFF',
        background: '#F0EBFB',
        icon: 'Users',
      },
      {
        label: 'New',
        value: 'OPEN',
        textColor: '#0F5327',
        border: '#E6F4EC',
        background: '#E9F9EF',
        icon: 'Eye',
      },
      {
        label: 'In Progress',
        value: 'IN_PROGRESS',
        textColor: '#7F1D1D',
        border: '#FEE2E2',
        background: '#FEF2F2',
        icon: 'EyeOff',
      },
      {
        label: 'Resolved',
        value: 'RESOLVED',
        textColor: '#7F1D1D',
        border: '#FEE2E2',
        background: '#FEF2F2',
        icon: 'EyeOff',
      },
      {
        label: 'Closed',
        value: 'CLOSED',
        textColor: '#7F1D1D',
        border: '#FEE2E2',
        background: '#FEF2F2',
        icon: 'EyeOff',
      },
    ],
    isLoading: false,
    isSubmitting: false,
    error: null,
    activeFilter: 'ALL',
    activeFilters: ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    searchQuery: '',
    isTicketFormOpen: false,
    currentTicket: null,
    ticketFormMode: 'create',
    success: false,
    message: null,
    counts: {
      user: {
        ALL: 0,
        OPEN: 0,
        RESOLVED: 0,
        IN_PROGRESS: 0,
        CLOSED: 0,
      },
      admin: {
        ALL: 0,
        OPEN: 0,
        RESOLVED: 0,
        IN_PROGRESS: 0,
        CLOSED: 0,
      },
    },
  },
}

// ──────────────────────────────────────────────────────────────────────────
// Support InformationThunks
// ──────────────────────────────────────────────────────────────────────────

export const fetchSupportDetailsById = createAsyncThunk(
  'supportInfo/fetchSupportDetailsById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get(`/api/support-business-detail/${id}`)
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to fetch tickets')
    }
  },
)
export const fetchSupportDetails = createAsyncThunk(
  'supportInfo/fetchSupportDetails',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get('/api/support-business-detail')
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to fetch tickets')
    }
  },
)

export const createSupportInfo = createAsyncThunk(
  'supportInfo/createSupportInfo',
  async (supportInfo: Omit<SupportInfo, 'id'>, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.post(
        '/api/support-business-detail',
        supportInfo,
      )
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to create ticket')
    }
  },
)

export const updateSupportInfo = createAsyncThunk(
  'supportInfo/updateSupportInfo',
  async (
    { id, ...updates }: Partial<SupportInfo> & { id: string },
    { rejectWithValue },
  ) => {
    try {
      console.log('Updating support info:', { id, ...updates })
      const { data } = await axiosApi.put(
        `/api/support-business-detail/${id}`,
        { ...updates },
      )
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to update ticket')
    }
  },
)

// ──────────────────────────────────────────────────────────────────────────
// FAQ Thunks
// ──────────────────────────────────────────────────────────────────────────

export const applyFilters = (
  faqs: FAQItem[],
  activeFilters: FaqFilterValue[],
  searchQuery: string,
): { filtered: FAQItem[]; counts: Record<FaqFilterValue, number> } => {
  const counts: Record<FaqFilterValue, number> = {
    all: faqs.length,
    public: 0,
    private: 0,
  }

  const lowerSearch = searchQuery.toLowerCase()

  const filtered = faqs.filter((faq) => {
    const question = faq.question.toLowerCase()
    const answer = faq.answer.toLowerCase()
    const category = faq.category as FaqFilterValue

    const matchesSearch =
      !searchQuery ||
      question.includes(lowerSearch) ||
      answer.includes(lowerSearch)

    const matchesCategory =
      activeFilters.includes('all') || activeFilters.includes(category)

    if (Object.keys(counts).includes(category)) {
      counts[category] += 1
    }

    return matchesSearch && matchesCategory
  })

  return { filtered, counts }
}

export const createFaq = createAsyncThunk(
  'faq/createFaq',
  async (faq: Omit<FAQItem, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post('/api/faq', faq)
      return response.data // Remove .data here if your API response is not nested
    } catch (error) {
      //   toast.error(e as string)
      return rejectWithValue({
        error: 'Failed to create FAQ',
        message: 'Error',
      })
    } finally {
      toast.success('FAQ created successfully')
    }
  },
)
export const updateFaq = createAsyncThunk(
  'faq/updateFaq',
  async (
    { id, ...updates }: Partial<FAQItem> & { id: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosApi.put<{ data: FAQItem }>(
        `/api/faq/${id}`,
        updates,
      )
      toast.success('FAQ updated successfully')
      return response.data.data
    } catch (error) {
      const err = error as AxiosError<{ error: string; message: string }>
      toast.error(err.response?.data?.message || 'Failed to update FAQ')
      return rejectWithValue({
        error: 'Failed to update FAQ',
        message: err.response?.data?.message || 'An error occurred',
      })
    }
  },
)

export const fetchFaq = createAsyncThunk<
  FAQItem[],
  void,
  { rejectValue: { error: string; message: string } }
>('faq/fetchFaq', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<FAQItem[]>('/api/faq')
    return response.data
  } catch (error) {
    const err = error as AxiosError<{ error: string; message: string }>
    console.error('Error fetching FAQs:', error)
    return rejectWithValue({
      error: 'Failed to fetch FAQs',
      message: err.response?.data?.message || 'An error occurred',
    })
  }
})

export const deleteFaq = createAsyncThunk<
  string, // Return type on success (the ID)
  string, // Argument type (the ID to delete)
  {
    rejectValue: { error: string; message: string }
  }
>('faq/deleteFaq', async (id, { rejectWithValue }) => {
  try {
    // Send an empty object as the request body to match the backend's expectation
    await axiosApi.delete(`/api/faq/${id}`, { data: {} })
    toast.success('FAQ deleted successfully')
    return id
  } catch (error) {
    const err = error as AxiosError<{ error: string; message: string }>
    console.error('Error deleting FAQ:', error)
    const errorMessage = err.response?.data?.message || 'Failed to delete FAQ'
    toast.error(errorMessage)
    return rejectWithValue({
      error: 'Failed to delete FAQ',
      message: errorMessage,
    })
  }
})

// ──────────────────────────────────────────────────────────────────────────
// Ticket Thunks
// ──────────────────────────────────────────────────────────────────────────

const applyTicketFilters = (
  tickets: TicketItem[],
  filters: TicketFilterValue[],
  query: string,
) => {
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      !query ||
      ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
      ticket.priority.toLowerCase().includes(query.toLowerCase())

    const matchesCategory =
      filters.includes('ALL') ||
      filters.includes(ticket.status.toUpperCase() as TicketFilterValue)

    return matchesSearch && matchesCategory
  })

  // Calculate counts for the filtered tickets
  const counts = {
    ALL: filteredTickets.length,
    OPEN: filteredTickets.filter((t) => t.status === 'OPEN').length,
    IN_PROGRESS: filteredTickets.filter((t) => t.status === 'IN_PROGRESS').length,
    RESOLVED: filteredTickets.filter((t) => t.status === 'RESOLVED').length,
    CLOSED: filteredTickets.filter((t) => t.status === 'CLOSED').length,
  }

  return {
    filteredTickets,
    counts
  }
}

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

// ──────────────────────────────────────────────────────────────────────────
// Support Slice Starts Here
// ──────────────────────────────────────────────────────────────────────────

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setActiveFilter(state, action: PayloadAction<string>) {
      state.activeFilter = action.payload
    },
    setActiveFilters(state, action: PayloadAction<string>) {
      state.activeFilters.push(action.payload)
    },
    setNestedTab(state, action: PayloadAction<'faq' | 'ticket'>) {
      state.nestedTab = action.payload
    },
    // ──────────────────────────────────────────────────────────────────────────
    // Support Info Reducers
    // ──────────────────────────────────────────────────────────────────────────
    clearError(state) {
      state.supportInfo.error = null
      state.supportInfo.message = null
    },

    // ──────────────────────────────────────────────────────────────────────────
    // FAQ Reducers
    // ──────────────────────────────────────────────────────────────────────────
    setFaqs(state, action: PayloadAction<FAQItem[]>) {
      const faqs = action.payload
      state.faq.faqs = faqs
      const { filtered, counts } = applyFilters(
        faqs,
        state.faq.activeFilters,
        state.faq.searchQuery,
      )
      state.faq.filteredFaqs = filtered
      state.faq.counts = counts
    },
    setActiveFAQFilter(state, action: PayloadAction<FaqFilterValue>) {
      const filter = action.payload
      state.faq.activeFilter = filter
      state.faq.activeFilters = [filter]

      // Calculate counts for all categories
      const allFaqs = state.faq.faqs
      const counts: FAQCounts = {
        all: allFaqs.length,
        public: allFaqs.filter((faq) => faq.category === 'public').length,
        private: allFaqs.filter((faq) => faq.category === 'private').length,
      }

      // Apply the current filter to get filtered results
      const { filtered } = applyFilters(
        allFaqs,
        [filter],
        state.faq.searchQuery,
      )

      state.faq.filteredFaqs = filtered
      state.faq.counts = counts
    },
    setActiveFAQFilters(state, action: PayloadAction<FaqFilterValue[]>) {
      state.faq.activeFilters = action.payload
      const { filtered, counts } = applyFilters(
        state.faq.faqs,
        action.payload,
        state.faq.searchQuery,
      )
      state.faq.filteredFaqs = filtered
      state.faq.counts = counts
    },
    setFAQSearchQuery(state, action: PayloadAction<string>) {
      state.faq.searchQuery = action.payload
      const { filtered, counts } = applyFilters(
        state.faq.faqs,
        state.faq.activeFilters,
        action.payload,
      )
      state.faq.filteredFaqs = filtered
      state.faq.counts = counts
    },
    openFaqForm(
      state,
      action: PayloadAction<{ mode: 'create' | 'edit'; faq?: FAQItem }>,
    ) {
      state.faq.isFaqFormOpen = true
      state.faq.faqFormMode = action.payload.mode
      if (action.payload.mode === 'edit' && action.payload.faq) {
        state.faq.currentFaq = action.payload.faq
      } else {
        state.faq.currentFaq = null
      }
    },
    closeFaqForm(state) {
      state.faq.isFaqFormOpen = false
      state.faq.currentFaq = null
    },
    // ──────────────────────────────────────────────────────────────────────────
    // Ticket Reducers
    // ──────────────────────────────────────────────────────────────────────────
    setActiveTicketTab(state, action: PayloadAction<'user' | 'admin'>) {
      state.ticket.nestedTab = action.payload
    },

    setActiveTicketFilter(state, action: PayloadAction<TicketFilterValue>) {
      state.ticket.activeFilter = action.payload
      state.ticket.activeFilters = [action.payload]
      const { filteredTickets, counts } = applyTicketFilters(
        state.ticket.userTickets,
        [action.payload],
        state.ticket.searchQuery,
      )
      state.ticket.filteredTickets = filteredTickets
      state.ticket.counts = {
        user: counts,
        admin: state.ticket.counts?.admin || {} as Record<TicketFilterValue, number>
      }
    },
    setActiveTicketFilters(state, action: PayloadAction<TicketFilterValue[]>) {
      state.ticket.activeFilters = action.payload
      const { filteredTickets, counts } = applyTicketFilters(
        state.ticket.userTickets,
        action.payload,
        state.ticket.searchQuery,
      )
      state.ticket.filteredTickets = filteredTickets
      state.ticket.counts = {
        user: counts,
        admin: state.ticket.counts?.admin || {} as Record<TicketFilterValue, number>
      }
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.ticket.searchQuery = action.payload
      const { filteredTickets, counts } = applyTicketFilters(
        state.ticket.userTickets,
        state.ticket.activeFilters,
        action.payload,
      )
      state.ticket.filteredTickets = filteredTickets
      state.ticket.counts = {
        user: counts,
        admin: state.ticket.counts?.admin || {} as Record<TicketFilterValue, number>
      }
    },
    openTicketForm(
      state,
      action: PayloadAction<{
        ticket: TicketFormData | null
        mode: 'create' | 'edit' | 'view'
      }>,
    ) {
      state.ticket.isTicketFormOpen = true
      state.ticket.currentTicket = action.payload.ticket
      state.ticket.ticketFormMode = action.payload.mode
    },
    closeTicketForm(state) {
      state.ticket.isTicketFormOpen = false
      state.ticket.currentTicket = null
      state.ticket.ticketFormMode = 'create'
    },
    clearTicketError(state) {
      state.ticket.error = null
      state.ticket.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ──────────────────────────────────────────────────────────────────────────
      // Support Info Builders
      // ──────────────────────────────────────────────────────────────────────────
      // Fetch Support Information
      .addCase(fetchSupportDetailsById.pending, (state) => {
        state.supportInfo.isLoading = true
        state.supportInfo.error = null
        state.supportInfo.hasFetched = false
      })
      .addCase(fetchSupportDetailsById.fulfilled, (state, action) => {
        state.supportInfo.isLoading = false
        state.supportInfo.supportDetail = action.payload
        state.supportInfo.success = true
        state.supportInfo.message = 'Support info fetched successfully'
        state.supportInfo.hasFetched = true
      })
      .addCase(fetchSupportDetailsById.rejected, (state, action) => {
        state.supportInfo.isLoading = false
        state.supportInfo.error = action.payload as string
        toast.error('Failed to fetch support info')
        state.supportInfo.hasFetched = false
      })
      // Create Support Information
      .addCase(createSupportInfo.pending, (state) => {
        state.supportInfo.isSubmitting = true
        state.supportInfo.error = null
      })
      .addCase(createSupportInfo.fulfilled, (state, action) => {
        const newSupportInfo = action.payload.supportInfo
        state.supportInfo.isSubmitting = false
        state.supportInfo.supportDetail = newSupportInfo
        state.supportInfo.success = true
        state.supportInfo.success = true
        state.supportInfo.message = 'Support info created successfully'

        toast.success('Support info created successfully')
      })
      .addCase(createSupportInfo.rejected, (state, action) => {
        state.supportInfo.isSubmitting = false
        state.supportInfo.error = action.payload as string
        toast.error('Failed to create support info')
      })
      // Update Support Information
      .addCase(updateSupportInfo.pending, (state) => {
        state.supportInfo.isSubmitting = true
        state.supportInfo.error = null
      })
      .addCase(updateSupportInfo.fulfilled, (state, action) => {
        const updatedSupportInfo = action.payload.supportInfo
        state.supportInfo.isSubmitting = false
        const index: number | any =
          state.supportInfo.supportDetail?.supportAvailability.findIndex(
            (item) => item.id === updatedSupportInfo.id,
          )
        if (index !== -1 && state.supportInfo.supportDetail) {
          state.supportInfo.supportDetail.supportAvailability[index] =
            updatedSupportInfo
        }
        state.supportInfo.success = true
        state.supportInfo.message = 'Support info updated successfully'
        toast.success('Support info updated successfully')
      })
      .addCase(updateSupportInfo.rejected, (state, action) => {
        state.supportInfo.isSubmitting = false
        state.supportInfo.error = action.payload as string
        toast.error('Failed to update support info')
      })
      // ──────────────────────────────────────────────────────────────────────────
      // Support Info Builders
      // ──────────────────────────────────────────────────────────────────────────
      //   Fetch FAQ
      .addCase(fetchFaq.pending, (state) => {
        state.faq.isLoading = true
        state.faq.error = null
        state.faq.hasFetched = false
      })
      .addCase(fetchFaq.fulfilled, (state, action) => {
        const faqs = action.payload
        state.faq.isLoading = false
        state.faq.faqs = faqs
        state.faq.filteredFaqs = faqs
        state.faq.success = true
        state.faq.hasFetched = true

        // Calculate and update counts
        state.faq.counts = {
          all: faqs.length,
          public: faqs.filter((faq) => faq.category === 'public').length,
          private: faqs.filter((faq) => faq.category === 'private').length,
        }
      })
      .addCase(fetchFaq.rejected, (state, action) => {
        state.faq.isLoading = false
        state.faq.error = action.payload?.error || 'Failed to fetch FAQ'
        state.faq.message = action.payload?.message || null
        state.faq.success = false
        state.faq.hasFetched = false
      })

      // Add FAQ
      .addCase(createFaq.pending, (state) => {
        state.faq.isSubmitting = true
        state.faq.error = null
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        const newFaq = action.payload
        const updatedFaqs = [newFaq, ...state.faq.faqs]

        state.faq.isSubmitting = false
        state.faq.faqs = updatedFaqs

        // Update filteredFaqs
        const { filtered } = applyFilters(
          updatedFaqs,
          state.faq.activeFilters,
          state.faq.searchQuery,
        )
        state.faq.filteredFaqs = filtered

        // Update counts
        state.faq.counts = {
          all: updatedFaqs.length,
          public: updatedFaqs.filter((faq) => faq.category === 'public').length,
          private: updatedFaqs.filter((faq) => faq.category === 'private')
            .length,
        }

        state.faq.isFaqFormOpen = false
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.faq.isSubmitting = false
        state.faq.error = action.payload as string
      })
      // Update FAQ
      .addCase(updateFaq.pending, (state) => {
        state.faq.isSubmitting = true
        state.faq.error = null
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.faq.isSubmitting = false
        const index = state.faq.faqs.findIndex(
          (faq) => faq.id === action.payload.id,
        )
        if (index !== -1) {
          state.faq.faqs[index] = {
            ...state.faq.faqs[index],
            ...action.payload,
          }
          const { filtered, counts } = applyFilters(
            state.faq.faqs,
            state.faq.activeFilters,
            state.faq.searchQuery,
          )
          state.faq.filteredFaqs = filtered
          state.faq.counts = counts
        }
        state.faq.isFaqFormOpen = false
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.faq.isSubmitting = false
        state.faq.error = action.payload as string
      })

      // Delete FAQ
      .addCase(deleteFaq.pending, (state) => {
        state.faq.isSubmitting = true
        state.faq.error = null
      })
      .addCase(deleteFaq.fulfilled, (state, action: PayloadAction<string>) => {
        const deletedId = action.payload

        // Get the FAQ being deleted to check its category
        const deletedFaq = state.faq.faqs.find((faq) => faq.id === deletedId)

        // Remove the deleted FAQ from the state
        const updatedFaqs = state.faq.faqs.filter((faq) => faq.id !== deletedId)

        state.faq.isSubmitting = false
        state.faq.faqs = updatedFaqs

        // Update filteredFaqs
        const { filtered } = applyFilters(
          updatedFaqs,
          state.faq.activeFilters,
          state.faq.searchQuery,
        )
        state.faq.filteredFaqs = filtered

        // Update counts based on the updated FAQs
        state.faq.counts = {
          all: updatedFaqs.length,
          public: updatedFaqs.filter((faq) => faq.category === 'public').length,
          private: updatedFaqs.filter((faq) => faq.category === 'private')
            .length,
        }
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.faq.isSubmitting = false
        state.faq.error = action.payload?.error || 'Failed to delete FAQ'
        state.faq.message = action.payload?.message || null
        state.faq.success = false
      })

      // ──────────────────────────────────────────────────────────────────────────
      // Ticket Reducers
      // ──────────────────────────────────────────────────────────────────────────
      .addCase(fetchTickets.pending, (state) => {
        state.ticket.isLoading = true
        state.ticket.error = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        const tickets = action.payload
        state.ticket.tickets = tickets

        // Separate tickets by user type
        const userTickets = tickets.filter(
          (t: TicketItem) => t.userType === 'USER',
        )
        const adminTickets = tickets.filter(
          (t: TicketItem) => t.userType === 'ADMIN',
        )

        // Store the separated tickets
        state.ticket.userTickets = userTickets
        state.ticket.adminTickets = adminTickets

        // Calculate counts for user tickets
        state.ticket.counts.user = {
          ALL: userTickets.length,
          OPEN: userTickets.filter((t: TicketItem) => t.status === 'OPEN').length,
          IN_PROGRESS: userTickets.filter(
            (t: TicketItem) => t.status === 'IN_PROGRESS',
          ).length,
          RESOLVED: userTickets.filter(
            (t: TicketItem) => t.status === 'RESOLVED',
          ).length,
          CLOSED: userTickets.filter((t: TicketItem) => t.status === 'CLOSED').length,
        }

        // Calculate counts for admin tickets
        state.ticket.counts.admin = {
          ALL: adminTickets.length,
          OPEN: adminTickets.filter((t: TicketItem) => t.status === 'OPEN').length,
          IN_PROGRESS: adminTickets.filter(
            (t: TicketItem) => t.status === 'IN_PROGRESS',
          ).length,
          RESOLVED: adminTickets.filter(
            (t: TicketItem) => t.status === 'RESOLVED',
          ).length,
          CLOSED: adminTickets.filter((t: TicketItem) => t.status === 'CLOSED').length,
        }

        // Update filtered tickets based on current view
        const currentTickets = state.ticket.nestedTab === 'user' ? userTickets : adminTickets
        const { filteredTickets } = applyTicketFilters(
          currentTickets,
          state.ticket.activeFilters,
          state.ticket.searchQuery,
        )
        state.ticket.filteredTickets = filteredTickets

        state.ticket.isLoading = false
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.ticket.isLoading = false
        state.ticket.error = action.payload as string
        toast.error('Failed to fetch tickets')
      })

      .addCase(createTicket.pending, (state) => {
        state.ticket.isSubmitting = true
        state.ticket.error = null
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        const newTicket = action.payload.ticket
        state.ticket.isSubmitting = false

        // Add to main tickets array
        state.ticket.tickets.push(newTicket)

        // Add to appropriate user type array and update counts
      })
  },
})

export const {
  setNestedTab,
  setActiveFilter,
  setActiveFilters,
  // Support Info Reducers
  // ──────────────────────────────────────────────────────────────────────────
  clearError,

  // FAQ Reducers
  // ──────────────────────────────────────────────────────────────────────────
  setFaqs,
  setActiveFAQFilter,
  setActiveFAQFilters,
  setFAQSearchQuery,
  openFaqForm,
  closeFaqForm,
  // ──────────────────────────────────────────────────────────────────────────
  // Ticket Reducers
  // ──────────────────────────────────────────────────────────────────────────
  setActiveTicketTab,
  clearTicketError,
  setActiveTicketFilter,
  setActiveTicketFilters,
  setSearchQuery,
  openTicketForm,
  closeTicketForm,
} = supportSlice.actions

export default supportSlice.reducer
