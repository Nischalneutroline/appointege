import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Appointment } from '@/data/appointment'
import { appointments } from '@/data/appointment'
// import axios from 'axios'
// import { getAppointments } from '@/app/(protected)/admin/appointment/_api_call/appointment-api-call'
import { getBaseUrl } from '@/lib/baseUrl'
// import { Appointment } from "@prisma/client"
import axios, { AxiosError, AxiosResponse } from 'axios'
import {
  Appointment,
  AxioxResponseType,
  PostAppoinmentData,
} from '@/app/(protected)/admin/appointment/_types/appointment'
import { AxiosResponseType } from '@/app/(protected)/admin/customer/_types/customer'

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

interface AppointmentState {
  appointments: Appointment[]
  loading: boolean
  currentAppointment: Appointment | null
  isFormOpen: boolean
  formMode: 'create' | 'edit' | 'view' | 'delete' | null
  error: string | null // Specific type instead of 'any'
  message: string | null
  success: boolean
}

// Get initial state from your data file
const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  currentAppointment: null,
  isFormOpen: false,
  formMode: null,
  error: null,
  message: null,
  success: false,
}

async function getAppointments(): Promise<{
  data?: Appointment[]
  success: boolean
  error?: string
  message?: string
}> {
  try {
    const {
      data: { data, success, error, message },
    } = (await api.get('/api/appointment')) as AxioxResponseType<Appointment[]>
    console.log('getAppointments: Response data =', data)
    return { data, success, message, error }
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    // console.error("getAppointments: Error fetching appointments:", {
    //   message: errorMsg,
    //   status: error.response?.status,
    //   url: error.config?.url,
    // })
    return {
      message: errorMsg,
      success: false,
      error: error.message,
    }
  }
}

// Fetch appointments
// Fetch appointments
const fetchAppointments = createAsyncThunk<
  Appointment[],
  void,
  { rejectValue: RejectError }
>('appointment/fetchAppointments', async (_, { rejectWithValue }) => {
  try {
    console.log('Fetching appointments in thunk...')
    const response = (await api.get('/api/appointment')) as AxiosResponseType<
      Appointment[]
    >
    console.log('fetchAppointments: Full response =', response)
    const { data, success, error, message } = response.data
    // console.log('fetchAppointments: Response data =', data)
    // console.log(
    //   'fetchAppointments: Success =',
    //   success,
    //   'Message =',
    //   message,
    //   'Error =',
    //   error,
    // )
    if (success && Array.isArray(data)) {
      return data
    }
    // console.error('fetchAppointments: Failed to fetch appointments:', {
    //   error,
    //   message,
    // })
    return rejectWithValue({
      error: error || 'Failed to fetch appointments',
      message: message || null,
    })
  } catch (error: any) {
    // console.error('fetchAppointments: Error fetching appointments:', error)
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

// Create Async Appoinment
const storeCreateAppointment = createAsyncThunk<
  Appointment,
  PostAppoinmentData,
  { rejectValue: RejectError }
>(
  'appointment/storeCreateAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/appointment', appointmentData)
      const { data, success, error, message } = response.data
      if (success && data) {
        return data
      } else {
        return rejectWithValue({
          error: error || 'Failed to create appointment',
          message: message || null,
        })
      }
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
  },
)

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    // Open form in create mode
    openAppointmentCreateForm: (state) => {
      state.isFormOpen = true
      state.formMode = 'create'
      state.currentAppointment = null
    },

    // Open form in edit mode
    openAppointmentEditForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.formMode = 'edit'
      state.currentAppointment = action.payload
    },

    // Open form in view mode
    openAppointmentViewForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = false
      state.formMode = 'view'
      state.currentAppointment = action.payload
    },

    // Open modal in delete mode
    openAppointmentDeleteForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = false
      state.formMode = 'delete'
      state.currentAppointment = action.payload
    },

    // Close form
    closeAppointmentForm: (state) => {
      state.isFormOpen = false
      state.formMode = null
      state.currentAppointment = null
    },

    // Set current appointment (for view/edit)
    setCurrentAppointment: (
      state,
      action: PayloadAction<Appointment | null>,
    ) => {
      state.currentAppointment = action.payload
    },
  },

  // Extra reducers for async actions
  extraReducers: (builder) => {
    // Fetch appointments
    builder.addCase(fetchAppointments.pending, (state) => {
      state.loading = true
      state.error = null
      state.appointments = [] // Optional: Clear appointments while loading
      state.message = null
    })
    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      state.loading = false
      state.appointments = action.payload
      state.error = null
      state.message = null
    })
    builder.addCase(fetchAppointments.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload?.error || 'Failed to fetch appointments'
      state.message = action.payload?.message || null
    })

    // Create appointment
    builder.addCase(storeCreateAppointment.pending, (state) => {
      state.loading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(storeCreateAppointment.fulfilled, (state, action) => {
      state.loading = false
      state.appointments.push(action.payload)
      state.error = null
      state.message = null
      state.success = true
    })
    builder.addCase(storeCreateAppointment.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload?.error || 'Failed to create appointment'
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
  //   addAppointment,
  //   updateAppointment,
  //   deleteAppointment,
  //   setCurrentAppointment,
} = appointmentSlice.actions

// Extra async actions
export {
  fetchAppointments,
  storeCreateAppointment,
  // createAppointment,
  // updateAppointment,
  // deleteAppointment,
}

export default appointmentSlice.reducer
