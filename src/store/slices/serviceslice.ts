// initial State

import { AxiosResponseType } from '@/app/(protected)/admin/customer/_types/customer'
import { Service } from '@/app/(protected)/admin/service/_types/service'
import { getBaseUrl } from '@/lib/baseUrl'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

interface RejectError {
  error: string | null
  message: string | null
}

interface ServiceOptions {
  value: string
  label: string
}
export interface ServiceState {
  serviceOptions: ServiceOptions[]
  services: Service[]
  isLoading: boolean
  currentService: Service | null
  isFormOpen: boolean
  formMode: 'create' | 'edit' | 'view' | 'delete' | null
  error: string | null // Specific type instead of 'any'
  message: string | null
  success: boolean
}

const initialState: ServiceState = {
  services: [],
  serviceOptions: [],
  isLoading: false,
  currentService: null,
  isFormOpen: false,
  formMode: null,
  error: null,
  message: null,
  success: false,
}

// Async actions
const fetchServices = createAsyncThunk<
  Service[],
  void,
  { rejectValue: RejectError }
>('service/fetchServices', async (_, { rejectWithValue }) => {
  try {
    console.log('Fetching services in thunk...')
    const response = (await api.get('/api/service')) as AxiosResponseType<
      Service[]
    >
    console.log('fetchServices: Full response =', response)
    const { data, success, error, message } = response.data

    if (success && Array.isArray(data)) {
      return data
    }
    return rejectWithValue({
      error: error || 'Failed to fetch services',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    // Open form in create mode
    openAppointmentCreateForm: (state) => {
      state.isFormOpen = true
      state.formMode = 'create'
      state.currentService = null
    },

    // Open form in edit mode
    openAppointmentEditForm: (state, action: PayloadAction<Service>) => {
      state.isFormOpen = true
      state.formMode = 'edit'
      state.currentService = action.payload
    },

    // Open form in view mode
    openAppointmentViewForm: (state, action: PayloadAction<Service>) => {
      state.isFormOpen = false
      state.formMode = 'view'
      state.currentService = action.payload
    },

    // Open modal in delete mode
    openAppointmentDeleteForm: (state, action: PayloadAction<Service>) => {
      state.isFormOpen = false
      state.formMode = 'delete'
      state.currentService = action.payload
    },

    // Close form
    closeAppointmentForm: (state) => {
      state.isFormOpen = false
      state.formMode = null
      state.currentService = null
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.message = null
        state.success = false
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.services = action.payload
        state.error = null
        state.message = null
        state.success = true

        // add service options
        state.serviceOptions = action.payload.map((service) => ({
          value: service.id,
          label: service.title,
        }))
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.error || 'Failed to fetch services'
        state.message = action.payload?.message || null
        state.success = false
      })
  },
})

// Actions
export const {
  openAppointmentCreateForm,
  openAppointmentEditForm,
  openAppointmentViewForm,
  closeAppointmentForm,
  openAppointmentDeleteForm,
} = serviceSlice.actions

// Async Action
export { fetchServices }

// Reducer
export default serviceSlice.reducer
