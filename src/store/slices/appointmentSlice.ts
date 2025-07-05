// export default appointmentSlice.reducer
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { getBaseUrl } from '@/lib/baseUrl'
import {
  Appointment,
  AppointmentStatus,
  AxioxResponseType,
  PostAppoinmentData,
} from '@/app/(protected)/admin/appointment/_types/appointment'
import { AppointmentFilterValue } from '@/app/(protected)/admin/appointment/_data/data'
import { toast } from 'sonner'
import { isSameDay } from 'date-fns'
import { getRandomAvatarColor } from '@/utils/randomColor.util'

// Utility function for date comparison

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

interface RejectError {
  error: any | null
  message: string | null
}

interface AppointmentCounts {
  today: number
  upcoming: number
  completed: number
  cancelled: number
  missed: number
  all: number
}

export interface FilterOptionState {
  label: string
  value: AppointmentFilterValue
  textColor: string
  border: string
  background: string
  icon: string // Changed from LucideIcon to string
}

interface AppointmentState {
  appointments: Appointment[]
  filteredAppointments: Appointment[]
  counts: AppointmentCounts
  filterOptions: FilterOptionState[]
  isLoading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  currentAppointment: Appointment | null
  isFormOpen: boolean
  appoinmentFormMode: 'create' | 'edit' | 'view' | 'delete' | null
  error: string | null
  message: string | null
  success: boolean
  activeFilter: AppointmentFilterValue
  activeFilters: AppointmentFilterValue[]
}

const initialState: AppointmentState = {
  appointments: [],
  filteredAppointments: [],
  counts: {
    today: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    missed: 0,
    all: 0,
  },
  filterOptions: [
    {
      label: 'Today',
      value: 'today',
      textColor: '#103064',
      border: '#DCE9F9',
      background: '#E9F1FD',
      icon: 'CalendarDays',
    },
    {
      label: 'Upcoming',
      value: 'upcoming',
      textColor: '#4C3000',
      border: '#FFF3CD',
      background: '#FFF6E6',
      icon: 'Clock',
    },
    {
      label: 'Completed',
      value: 'completed',
      textColor: '#0F5327',
      border: '#E6F4EC',
      background: '#E9F9EF',
      icon: 'CircleCheckBig',
    },
    {
      label: 'Cancelled',
      value: 'cancelled',
      textColor: '#7F1D1D',
      border: '#FEE2E2',
      background: '#FEF2F2',
      icon: 'Delete',
    },
    {
      label: 'Missed',
      value: 'missed',
      textColor: '#6B7280',
      border: '#E5E7EB',
      background: '#F3F4F6',
      icon: 'PhoneMissed',
    },
    {
      label: 'All',
      value: 'all',
      textColor: '#103064',
      border: '#E9DFFF',
      background: '#F0EBFB',
      icon: 'Users',
    },
  ],
  isLoading: false,
  isRefreshing: false,
  hasFetched: false,
  currentAppointment: null,
  isFormOpen: false,
  appoinmentFormMode: null,
  error: null,
  message: null,
  success: false,
  activeFilter: 'today',
  activeFilters: ['today', 'upcoming', 'completed', 'all'],
}

export const filterAppointments = (
  appointments: Appointment[],
  activeFilter: AppointmentFilterValue,
): { filtered: Appointment[]; counts: AppointmentCounts } => {
  if (!Array.isArray(appointments)) {
    console.warn('appointments is not an array:', appointments)
    return {
      filtered: [],
      counts: {
        today: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
        missed: 0,
        all: 0,
      },
    }
  }

  console.log('filterAppointments: Input appointments =', appointments)
  console.log('filterAppointments: Active filter =', activeFilter)

  const counts: AppointmentCounts = {
    today: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    missed: 0,
    all: appointments.length,
  }

  const validStatuses = [
    AppointmentStatus.SCHEDULED,
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.MISSED,
  ]

  const filtered = appointments.filter((item) => {
    const isValidDate =
      typeof item.selectedDate === 'string' &&
      !isNaN(new Date(item.selectedDate).getTime())
    const isValidStatus = validStatuses.includes(item.status)

    if (isValidDate && isSameDay(new Date(item.selectedDate), new Date())) {
      counts.today += 1
    }
    if (isValidStatus && item.status === AppointmentStatus.SCHEDULED) {
      counts.upcoming += 1
    }
    if (isValidStatus && item.status === AppointmentStatus.COMPLETED) {
      counts.completed += 1
    }
    if (isValidStatus && item.status === AppointmentStatus.CANCELLED) {
      counts.cancelled += 1
    }
    if (isValidStatus && item.status === AppointmentStatus.MISSED) {
      counts.missed += 1
    }

    switch (activeFilter) {
      case 'today':
        return isValidDate && isSameDay(new Date(item.selectedDate), new Date())
      case 'upcoming':
        return isValidStatus && item.status === AppointmentStatus.SCHEDULED
      case 'completed':
        return isValidStatus && item.status === AppointmentStatus.COMPLETED
      case 'cancelled':
        return isValidStatus && item.status === AppointmentStatus.CANCELLED
      case 'missed':
        return isValidStatus && item.status === AppointmentStatus.MISSED
      case 'all':
        return true
      default:
        return true
    }
  })

  console.log('filterAppointments: Filtered result =', filtered)
  console.log('filterAppointments: Counts =', counts)
  return { filtered, counts }
}

const fetchAppointments = createAsyncThunk<
  Appointment[],
  boolean,
  { rejectValue: RejectError }
>(
  'appointment/fetchAppointments',
  async (isManualRefresh, { rejectWithValue }) => {
    try {
      console.log('Fetching appointments in thunk...', { isManualRefresh })
      const response = (await api.get('/api/appointment')) as AxioxResponseType<
        Appointment[]
      >
      const { data, success, errorDetail, message } = response.data
      console.log('fetchAppointments: Response data =', data)
      if (success && Array.isArray(data)) {
        const normalizedData = data.map((appt) => ({
          ...appt,
          selectedDate: appt.selectedDate,
          status: appt.status,
          color: appt.color || getRandomAvatarColor(),
        }))
        if (isManualRefresh) {
          const toastMessage = normalizedData.length
            ? `Fetched ${normalizedData.length} appointments.`
            : 'No appointments found'
          toast.success(toastMessage, { id: 'fetch-appointments' })
        }
        return normalizedData
      }
      if (isManualRefresh) {
        toast.error(message || 'Failed to fetch appointments', {
          id: 'fetch-appointments',
          duration: 3000,
          description: 'Please check the server or try again later.',
        })
      }
      return rejectWithValue({
        error: errorDetail || 'Failed to fetch appointments',
        message: message || null,
      })
    } catch (error: any) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : 'An unknown error occurred'
      if (isManualRefresh) {
        toast.error(errorMsg, {
          id: 'fetch-appointments',
          duration: 3000,
          description: 'Please check the server or try again later.',
        })
      }
      return rejectWithValue({
        error: error.message,
        message: errorMsg,
      })
    }
  },
)

const storeCreateAppointment = createAsyncThunk<
  Appointment,
  PostAppoinmentData,
  { rejectValue: RejectError }
>(
  'appointment/storeCreateAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/appointment', appointmentData)
      const { data, success, errorDetail, message } = response.data
      if (success && data) {
        toast.success(message || 'Appointment created successfully', {
          id: 'create-appointment',
        })
        return {
          ...data,
          selectedDate: data.selectedDate,
          status: data.status as AppointmentStatus,
          color: getRandomAvatarColor(),
        }
      }
      toast.error(message || 'Failed to create appointment', {
        id: 'create-appointment',
      })
      return rejectWithValue({
        error: errorDetail || 'Failed to create appointment',
        message: message || null,
      })
    } catch (error: any) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : 'An unknown error occurred'
      toast.error(errorMsg, { id: 'create-appointment' })
      return rejectWithValue({
        error: error.message,
        message: errorMsg,
      })
    }
  },
)

const updateAppointment = createAsyncThunk<
  Appointment,
  { id: string; data: PostAppoinmentData },
  { rejectValue: RejectError }
>(
  'appointment/updateAppointment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/appointment/${id}`, data)
      const {
        data: responseData,
        success,
        errorDetail,
        message,
      } = response.data
      if (success && responseData) {
        toast.success(message || 'Appointment updated successfully', {
          id: 'update-appointment',
        })
        return {
          ...responseData,
          selectedDate: responseData.selectedDate,
          status: responseData.status as AppointmentStatus,
          color: responseData.color || getRandomAvatarColor(),
        }
      }
      toast.error(message || 'Failed to update appointment', {
        id: 'update-appointment',
      })
      return rejectWithValue({
        error: errorDetail || 'Failed to update appointment',
        message: message || null,
      })
    } catch (error: any) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : 'An unknown error occurred'
      toast.error(errorMsg, { id: 'update-appointment' })
      return rejectWithValue({
        error: error.message,
        message: errorMsg,
      })
    }
  },
)

const deleteAppointment = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectError }
>('appointment/deleteAppointment', async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/api/appointment/${id}`)
    const { success, errorDetail, message } = response.data
    if (success) {
      toast.success(message || 'Appointment deleted successfully', {
        id: 'delete-appointment',
      })
      return id
    }
    toast.error(message || 'Failed to delete appointment', {
      id: 'delete-appointment',
    })
    return rejectWithValue({
      error: errorDetail || 'Failed to delete appointment | null',
      message: message,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    toast.error(errorMsg, { id: 'delete-appointment' })
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    openAppointmentCreateForm: (state) => {
      state.isFormOpen = true
      state.appoinmentFormMode = 'create'
      state.currentAppointment = null
    },
    openAppointmentEditForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.appoinmentFormMode = 'edit'
      state.currentAppointment = action.payload
    },
    openAppointmentViewForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.appoinmentFormMode = 'view'
      state.currentAppointment = action.payload
    },
    openAppointmentDeleteForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.appoinmentFormMode = 'delete'
      state.currentAppointment = action.payload
    },
    closeAppointmentForm: (state) => {
      state.isFormOpen = false
      state.appoinmentFormMode = null
      state.currentAppointment = null
      state.success = false
    },
    setCurrentAppointment: (
      state,
      action: PayloadAction<Appointment | null>,
    ) => {
      state.currentAppointment = action.payload
    },
    setActiveFilter: (state, action: PayloadAction<AppointmentFilterValue>) => {
      state.activeFilter = action.payload
      const { filtered } = filterAppointments(
        state.appointments,
        action.payload,
      )
      state.filteredAppointments = filtered
    },
    setActiveFilters: (
      state,
      action: PayloadAction<AppointmentFilterValue[]>,
    ) => {
      state.activeFilters = action.payload
      const { filtered } = filterAppointments(
        state.appointments,
        state.activeFilter,
      )
      state.filteredAppointments = filtered
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAppointments.pending, (state, action) => {
      state.error = null
      state.message = null
      state.hasFetched = false
      state[action.meta.arg ? 'isRefreshing' : 'isLoading'] = true
    })
    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      state.isLoading = false
      state.isRefreshing = false
      state.appointments = action.payload
      const { filtered, counts } = filterAppointments(
        action.payload,
        state.activeFilter,
      )
      state.filteredAppointments = filtered
      state.counts = counts
      state.error = null
      state.message = null
      state.hasFetched = true
    })
    builder.addCase(fetchAppointments.rejected, (state, action) => {
      state.isLoading = false
      state.isRefreshing = false
      state.error = action.payload?.error || 'Failed to fetch appointments'
      state.message = action.payload?.message || null
      state.hasFetched = false
      state.filteredAppointments = []
      state.counts = {
        today: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0,
        missed: 0,
        all: 0,
      }
    })
    builder.addCase(storeCreateAppointment.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(storeCreateAppointment.fulfilled, (state, action) => {
      state.isLoading = false
      state.appointments.push(action.payload)
      const { filtered, counts } = filterAppointments(
        [...state.appointments],
        state.activeFilter,
      )
      state.filteredAppointments = filtered
      state.counts = counts
      state.error = null
      state.message = null
      state.success = true
    })
    builder.addCase(storeCreateAppointment.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to create appointment'
      state.message = action.payload?.message || null
      state.success = false
    })
    builder.addCase(updateAppointment.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      state.isLoading = false
      state.appointments = state.appointments.map((appt) =>
        appt.id === action.payload.id ? action.payload : appt,
      )
      const { filtered, counts } = filterAppointments(
        state.appointments,
        state.activeFilter,
      )
      state.filteredAppointments = filtered
      state.counts = counts
      state.error = null
      state.message = null
      state.success = true
    })
    builder.addCase(updateAppointment.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to update appointment'
      state.message = action.payload?.message || null
      state.success = false
    })
    builder.addCase(deleteAppointment.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      state.isLoading = false
      state.appointments = state.appointments.filter(
        (appt) => appt.id !== action.payload,
      )
      const { filtered, counts } = filterAppointments(
        state.appointments,
        state.activeFilter,
      )
      state.filteredAppointments = filtered
      state.counts = counts
      state.error = null
      state.message = null
      state.success = true
      state.currentAppointment = null
    })
    builder.addCase(deleteAppointment.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to delete appointment'
      state.message = action.payload?.message || null
      state.success = false
    })
  },
})

export const {
  openAppointmentCreateForm,
  openAppointmentEditForm,
  openAppointmentViewForm,
  closeAppointmentForm,
  openAppointmentDeleteForm,
  setCurrentAppointment,
  setActiveFilters,
  setActiveFilter,
} = appointmentSlice.actions

export {
  fetchAppointments,
  storeCreateAppointment,
  updateAppointment,
  deleteAppointment,
}

export default appointmentSlice.reducer
