import { axiosApi } from '@/lib/baseUrl'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

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

interface FAQState {
  faqs: FAQItem[]
  filteredFaqs: FAQItem[]
  isLoading: boolean
  isSubmitting: boolean
  count: string | null
  activeFilter: FaqFilterValue
  activeFilters: FaqFilterValue[]
  searchQuery: string
  isFaqFormOpen: boolean
  currentFaq: FAQItem | null
  faqFormMode: 'create' | 'edit'
  success: boolean
  message: string | null
  error: string | null
  counts: Record<FaqFilterValue, number>
}

const initialState: FAQState = {
  faqs: [],
  filteredFaqs: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  count: null,
  activeFilter: 'all',
  activeFilters: ['all', 'public', 'private'],
  searchQuery: '',
  isFaqFormOpen: false,
  currentFaq: null,
  faqFormMode: 'create',
  success: false,
  message: null,
  counts: {
    all: 0,
    public: 0,
    private: 0,
  },
}

const applyFilters = (
  faqs: FAQItem[],
  activeFilters: FaqFilterValue[],
  searchQuery: string,
) => {
  return faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      activeFilters.includes('all') ||
      activeFilters.includes(faq.category as FaqFilterValue)

    return matchesSearch && matchesCategory
  })
}

// // Async thunks
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

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    setFaqs(state, action: PayloadAction<FAQItem[]>) {
      const faqs = action.payload
      state.faqs = faqs
      state.filteredFaqs = applyFilters(
        faqs,
        state.activeFilters,
        state.searchQuery,
      )

      // Update counts
      state.counts = {
        all: faqs.length,
        public: faqs.filter((faq) => faq?.category === 'public').length,
        private: faqs.filter((faq) => faq?.category === 'private').length,
      }
    },
    setActiveFilter(state, action: PayloadAction<FaqFilterValue>) {
      state.activeFilter = action.payload
      state.activeFilters = [action.payload]
      state.filteredFaqs = applyFilters(
        state.faqs,
        [action.payload],
        state.searchQuery,
      )
    },
    setActiveFilters(state, action: PayloadAction<FaqFilterValue[]>) {
      state.activeFilters = action.payload
      state.filteredFaqs = applyFilters(
        state.faqs,
        action.payload,
        state.searchQuery,
      )
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
      state.filteredFaqs = applyFilters(
        state.faqs,
        state.activeFilters,
        action.payload,
      )
    },
    openFaqForm(
      state,
      action: PayloadAction<{ mode: 'create' | 'edit'; faq?: FAQItem }>,
    ) {
      state.isFaqFormOpen = true
      state.faqFormMode = action.payload.mode
      if (action.payload.mode === 'edit' && action.payload.faq) {
        state.currentFaq = action.payload.faq
      } else {
        state.currentFaq = null
      }
    },
    closeFaqForm(state) {
      state.isFaqFormOpen = false
      state.currentFaq = null
    },
    // addFaq: {
    //   reducer(state, action: PayloadAction<FAQItem>) {
    //     const newFaq = action.payload
    //     state.faqs.push(newFaq)
    //     state.filteredFaqs = applyFilters(
    //       state.faqs,
    //       state.activeFilters,
    //       state.searchQuery,
    //     )

    //     // Update counts
    //     state.counts.all = state.faqs.length
    //     if (newFaq.category) {
    //       state.counts[newFaq.category]++
    //     }
    //   },
    //   prepare(faq: FAQItem) {
    //     return { payload: faq }
    //   },
    // },
    // updateFaq: {
    //   reducer(state, action: PayloadAction<FAQItem>) {
    //     const updatedFaq = action.payload
    //     const index = state.faqs.findIndex((faq) => faq.id === updatedFaq.id)
    //     if (index !== -1) {
    //       const oldCategory = state.faqs[index].category
    //       state.faqs[index] = updatedFaq
    //       state.filteredFaqs = applyFilters(
    //         state.faqs,
    //         state.activeFilters,
    //         state.searchQuery,
    //       )

    //       // Update counts if category changed
    //       if (oldCategory !== updatedFaq.category) {
    //         if (oldCategory) {
    //           state.counts[oldCategory]--
    //         }
    //         if (updatedFaq.category) {
    //           state.counts[updatedFaq.category]++
    //         }
    //       }
    //     }
    //   },
    //   prepare(faq: FAQItem) {
    //     return { payload: faq }
    //   },
    // },
  },
  extraReducers: (builder) => {
    //   Fetch FAQ
    builder.addCase(fetchFaq.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchFaq.fulfilled, (state, action) => {
      state.isLoading = false
      state.faqs = action.payload
      state.filteredFaqs = action.payload
      state.success = true
    })
    builder.addCase(fetchFaq.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to fetch FAQ'
      state.message = action.payload?.message || null
      state.success = false
    })

    // Add FAQ
    builder.addCase(createFaq.pending, (state) => {
      state.isSubmitting = true
      state.error = null
    })
    builder.addCase(createFaq.fulfilled, (state, action) => {
      state.isSubmitting = false
      state.faqs = [action.payload, ...state.faqs]
      state.filteredFaqs = applyFilters(
        state.faqs,
        state.activeFilters,
        state.searchQuery,
      )
      state.isFaqFormOpen = false
    })
    builder.addCase(createFaq.rejected, (state, action) => {
      state.isSubmitting = false
      state.error = action.payload as string
    })
    // Update FAQ
    builder.addCase(updateFaq.pending, (state) => {
      state.isSubmitting = true
      state.error = null
    })
    builder.addCase(updateFaq.fulfilled, (state, action) => {
      state.isSubmitting = false
      //   const index = state.faqs.findIndex((faq) => faq.id === action.payload.id)
      //   if (index !== -1) {
      //     state.faqs[index] = { ...state.faqs[index], ...action.payload }
      //     state.filteredFaqs = applyFilters(
      //       state.faqs,
      //       state.activeFilters,
      //       state.searchQuery,
      //     )
      //   }
      state.isFaqFormOpen = false
    })
    builder.addCase(updateFaq.rejected, (state, action) => {
      state.isSubmitting = false
      state.error = action.payload as string
    })

    // Delete FAQ
    builder.addCase(deleteFaq.pending, (state) => {
      state.isSubmitting = true
      state.error = null
    })
    builder.addCase(deleteFaq.fulfilled, (state) => {
      state.isSubmitting = false

      // Update filteredFaqs
      state.filteredFaqs = applyFilters(
        state.faqs,
        state.activeFilters,
        state.searchQuery,
      )

      // Update counts
      state.counts = {
        all: state.faqs.length,
        public: state.faqs.filter((faq) => faq.category === 'public').length,
        private: state.faqs.filter((faq) => faq.category === 'private').length,
      }

      state.success = true
      state.message = 'FAQ deleted successfully'
      return fetchFaq()
    })
    builder.addCase(deleteFaq.rejected, (state, action) => {
      state.isSubmitting = false
      state.error = action.payload?.error || 'Failed to delete FAQ'
      state.message = action.payload?.message || null
      state.success = false
    })
  },
})

export const {
  setFaqs,
  setActiveFilter,
  setActiveFilters,
  setSearchQuery,
  openFaqForm,
  closeFaqForm,
} = faqSlice.actions
export default faqSlice.reducer
