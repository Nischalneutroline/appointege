import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

export type FaqFilterValue = 'all' | 'public' | 'private'

export interface FAQItem {
  id: string
  question: string
  answer: string
  category?: FaqFilterValue
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
  error: string | null
  activeFilter: FaqFilterValue
  activeFilters: FaqFilterValue[]
  searchQuery: string
  isFaqFormOpen: boolean
  currentFaq: FAQItem | null
  faqFormMode: 'create' | 'edit'
  success: boolean
}

const initialState: FAQState = {
  faqs: [],
  filteredFaqs: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  activeFilter: 'all',
  activeFilters: ['all', 'public', 'private'],
  searchQuery: '',
  isFaqFormOpen: false,
  currentFaq: null,
  faqFormMode: 'create',
  success: false,
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

// Async thunks
export const addFaq = createAsyncThunk(
  'faq/addFaq',
  async (faq: Omit<FAQItem, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      // In a real app, you would make an API call here
      // const response = await api.post('/faqs', faq)
      // return response.data

      // For demo, simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newFaq = { ...faq, id: Date.now().toString() }
      return newFaq
    } catch (error) {
      return rejectWithValue('Failed to add FAQ')
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
      // In a real app, you would make an API call here
      // const response = await api.put(`/faqs/${id}`, updates)
      // return response.data

      // For demo, simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, ...updates }
    } catch (error) {
      return rejectWithValue('Failed to update FAQ')
    }
  },
)
export const storeFaq = createAsyncThunk(
  'faq/storeFaq',
  async (faq: Omit<FAQItem, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newFaq = { ...faq, id: Date.now().toString() }
      return newFaq
    } catch (error) {
      return rejectWithValue('Failed to store FAQ')
    }
  },
)

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    setFaqs(state, action: PayloadAction<FAQItem[]>) {
      state.faqs = action.payload
      state.filteredFaqs = applyFilters(
        action.payload,
        state.activeFilters,
        state.searchQuery,
      )
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
  },
  extraReducers: (builder) => {
    // Add FAQ
    builder.addCase(addFaq.pending, (state) => {
      state.isSubmitting = true
      state.error = null
    })
    builder.addCase(addFaq.fulfilled, (state, action) => {
      state.isSubmitting = false
      state.faqs = [action.payload, ...state.faqs]
      state.filteredFaqs = applyFilters(
        state.faqs,
        state.activeFilters,
        state.searchQuery,
      )
      state.isFaqFormOpen = false
    })
    builder.addCase(addFaq.rejected, (state, action) => {
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
      const index = state.faqs.findIndex((faq) => faq.id === action.payload.id)
      if (index !== -1) {
        state.faqs[index] = { ...state.faqs[index], ...action.payload }
        state.filteredFaqs = applyFilters(
          state.faqs,
          state.activeFilters,
          state.searchQuery,
        )
      }
      state.isFaqFormOpen = false
      state.currentFaq = null
    })
    builder.addCase(updateFaq.rejected, (state, action) => {
      state.isSubmitting = false
      state.error = action.payload as string
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
