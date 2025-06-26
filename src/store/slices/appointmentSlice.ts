// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import axios, { AxiosError } from 'axios'
// import { getBaseUrl } from '@/lib/baseUrl'
// import {
//   Appointment,
//   AppointmentStatus,
//   AxioxResponseType,
//   PostAppoinmentData,
// } from '@/app/(protected)/admin/appointment/_types/appointment'
// import { AppointmentFilterValue } from '@/app/(protected)/admin/appointment/_data/data'
// import { toast } from 'sonner'

// // Utility function for date comparison
// const isSameDay = (date1: Date, date2: Date): boolean => {
//   return (
//     date1.getFullYear() === date2.getFullYear() &&
//     date1.getMonth() === date2.getMonth() &&
//     date1.getDate() === date2.getDate()
//   )
// }

// const api = axios.create({
//   baseURL: getBaseUrl(),
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// interface RejectError {
//   error: any | null
//   message: string | null
// }

// interface AppointmentState {
//   appointments: Appointment[]
//   filteredAppointments: Appointment[]
//   isLoading: boolean
//   isRefreshing: boolean // Added for refresh UI feedback
//   hasFetched: boolean
//   currentAppointment: Appointment | null
//   isFormOpen: boolean
//   formMode: 'create' | 'edit' | 'view' | 'delete' | null
//   error: string | null
//   message: string | null
//   success: boolean
//   activeFilter: AppointmentFilterValue
// }

// const initialState: AppointmentState = {
//   appointments: [],
//   filteredAppointments: [],
//   isLoading: false,
//   isRefreshing: false,
//   hasFetched: false,
//   currentAppointment: null,
//   isFormOpen: false,
//   formMode: null,
//   error: null,
//   message: null,
//   success: false,
//   activeFilter: 'today',
// }

// // Helper function to filter appointments based on activeFilter
// const filterAppointments = (
//   appointments: Appointment[],
//   activeFilter: AppointmentFilterValue,
// ): Appointment[] => {
//   if (!Array.isArray(appointments)) {
//     console.warn('appointments is not an array:', appointments)
//     return []
//   }

//   return appointments.filter((item) => {
//     const isValidDate =
//       typeof item.selectedDate === 'string' &&
//       !isNaN(new Date(item.selectedDate).getTime())
//     const validStatuses = [
//       AppointmentStatus.SCHEDULED,
//       AppointmentStatus.COMPLETED,
//       AppointmentStatus.CANCELLED,
//       AppointmentStatus.MISSED,
//     ]
//     const isValidStatus = validStatuses.includes(
//       item.status as AppointmentStatus,
//     )

//     switch (activeFilter) {
//       case 'today':
//         return isValidDate && isSameDay(new Date(item.selectedDate), new Date())
//       case 'upcoming':
//         return isValidStatus && item.status === AppointmentStatus.SCHEDULED
//       case 'completed':
//         return isValidStatus && item.status === AppointmentStatus.COMPLETED
//       case 'cancelled':
//         return isValidStatus && item.status === AppointmentStatus.CANCELLED
//       case 'missed':
//         return isValidStatus && item.status === AppointmentStatus.MISSED
//       case 'all':
//         return true
//       default:
//         return true
//     }
//   })
// }

// // Async thunks
// const fetchAppointments = createAsyncThunk<
//   Appointment[],
//   boolean, // isManualRefresh
//   { rejectValue: RejectError }
// >(
//   'appointment/fetchAppointments',
//   async (isManualRefresh, { rejectWithValue }) => {
//     try {
//       console.log('Fetching appointments in thunk...', { isManualRefresh })
//       const response = (await api.get('/api/appointment')) as AxioxResponseType<
//         Appointment[]
//       >
//       const { data, success, errorDetail, message } = response.data
//       if (success && Array.isArray(data)) {
//         const normalizedData = data.map((appt) => ({
//           ...appt,
//           selectedDate: appt.selectedDate,
//           status: appt.status,
//         }))
//         if (isManualRefresh) {
//           const toastMessage = normalizedData.length
//             ? `Fetched ${normalizedData.length} appointments.`
//             : 'No appointments found'
//           toast.success(toastMessage, { id: 'fetch-appointments' })
//         }
//         return normalizedData
//       }
//       if (isManualRefresh) {
//         toast.error(message || 'Failed to fetch appointments', {
//           id: 'fetch-appointments',
//           duration: 3000,
//           description: 'Please check the server or try again later.',
//         })
//       }
//       return rejectWithValue({
//         error: errorDetail || 'Failed to fetch appointments',
//         message: message || null,
//       })
//     } catch (error: any) {
//       const errorMsg =
//         error instanceof AxiosError && error.response?.data?.message
//           ? error.response.data.message
//           : 'An unknown error occurred'
//       if (isManualRefresh) {
//         toast.error(errorMsg, {
//           id: 'fetch-appointments',
//           duration: 3000,
//           description: 'Please check the server or try again later.',
//         })
//       }
//       return rejectWithValue({
//         error: error.message,
//         message: errorMsg,
//       })
//     }
//   },
// )

// const storeCreateAppointment = createAsyncThunk<
//   Appointment,
//   PostAppoinmentData,
//   { rejectValue: RejectError }
// >(
//   'appointment/storeCreateAppointment',
//   async (appointmentData, { rejectWithValue }) => {
//     try {
//       const response = await api.post('/api/appointment', appointmentData)
//       const { data, success, errorDetail, message } = response.data
//       if (success && data) {
//         toast.success(message || 'Appointment created successfully', {
//           id: 'create-appointment',
//         })
//         return {
//           ...data,
//           selectedDate: new Date(data.selectedDate),
//           status: data.status as AppointmentStatus,
//         }
//       }
//       toast.error(message || 'Failed to create appointment', {
//         id: 'create-appointment',
//       })
//       return rejectWithValue({
//         error: errorDetail || 'Failed to create appointment',
//         message: message || null,
//       })
//     } catch (error: any) {
//       const errorMsg =
//         error instanceof AxiosError && error.response?.data?.message
//           ? error.response.data.message
//           : 'An unknown error occurred'
//       toast.error(errorMsg, { id: 'create-appointment' })
//       return rejectWithValue({
//         error: error.message,
//         message: errorMsg,
//       })
//     }
//   },
// )

// const updateAppointment = createAsyncThunk<
//   Appointment,
//   { id: string; data: PostAppoinmentData },
//   { rejectValue: RejectError }
// >(
//   'appointment/updateAppointment',
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/api/appointment/${id}`, data)
//       const {
//         data: responseData,
//         success,
//         errorDetail,
//         message,
//       } = response.data
//       if (success && responseData) {
//         toast.success(message || 'Appointment updated successfully', {
//           id: 'update-appointment',
//         })
//         return {
//           ...responseData,
//           selectedDate: responseData.selectedDate,
//           status: responseData.status as AppointmentStatus,
//         }
//       }
//       toast.error(message || 'Failed to update appointment', {
//         id: 'update-appointment',
//       })
//       return rejectWithValue({
//         error: errorDetail || 'Failed to update appointment',
//         message: message || null,
//       })
//     } catch (error: any) {
//       const errorMsg =
//         error instanceof AxiosError && error.response?.data?.message
//           ? error.response.data.message
//           : 'An unknown error occurred'
//       toast.error(errorMsg, { id: 'update-appointment' })
//       return rejectWithValue({
//         error: error.message,
//         message: errorMsg,
//       })
//     }
//   },
// )

// const deleteAppointment = createAsyncThunk<
//   string,
//   string,
//   { rejectValue: RejectError }
// >('appointment/deleteAppointment', async (id, { rejectWithValue }) => {
//   try {
//     const response = await api.delete(`/api/appointment/${id}`)
//     const { success, errorDetail, message } = response.data
//     if (success) {
//       toast.success(message || 'Appointment deleted successfully', {
//         id: 'delete-appointment',
//       })
//       return id
//     }
//     toast.error(message || 'Failed to delete appointment', {
//       id: 'delete-appointment',
//     })
//     return rejectWithValue({
//       error: errorDetail || 'Failed to delete appointment',
//       message: message || null,
//     })
//   } catch (error: any) {
//     const errorMsg =
//       error instanceof AxiosError && error.response?.data?.message
//         ? error.response.data.message
//         : 'An unknown error occurred'
//     toast.error(errorMsg, { id: 'delete-appointment' })
//     return rejectWithValue({
//       error: error.message,
//       message: errorMsg,
//     })
//   }
// })

// const appointmentSlice = createSlice({
//   name: 'appointment',
//   initialState,
//   reducers: {
//     openAppointmentCreateForm: (state) => {
//       state.isFormOpen = true
//       state.formMode = 'create'
//       state.currentAppointment = null
//     },
//     openAppointmentEditForm: (state, action: PayloadAction<Appointment>) => {
//       state.isFormOpen = true
//       state.formMode = 'edit'
//       state.currentAppointment = action.payload
//     },
//     openAppointmentViewForm: (state, action: PayloadAction<Appointment>) => {
//       state.isFormOpen = true
//       state.formMode = 'view'
//       state.currentAppointment = action.payload
//     },
//     openAppointmentDeleteForm: (state, action: PayloadAction<Appointment>) => {
//       state.isFormOpen = true
//       state.formMode = 'delete'
//       state.currentAppointment = action.payload
//     },
//     closeAppointmentForm: (state) => {
//       state.isFormOpen = false
//       state.formMode = null
//       state.currentAppointment = null
//     },
//     setCurrentAppointment: (
//       state,
//       action: PayloadAction<Appointment | null>,
//     ) => {
//       state.currentAppointment = action.payload
//     },
//     setActiveFilter: (state, action: PayloadAction<AppointmentFilterValue>) => {
//       state.activeFilter = action.payload
//       state.filteredAppointments = filterAppointments(
//         state.appointments,
//         action.payload,
//       )
//     },
//   },
//   extraReducers: (builder) => {
//     // Fetch appointments
//     builder.addCase(fetchAppointments.pending, (state, action) => {
//       state.error = null
//       state.message = null
//       state.hasFetched = false
//       state[action.meta.arg ? 'isRefreshing' : 'isLoading'] = true
//     })
//     builder.addCase(fetchAppointments.fulfilled, (state, action) => {
//       state.isLoading = false
//       state.isRefreshing = false
//       state.appointments = action.payload
//       state.filteredAppointments = filterAppointments(
//         action.payload,
//         state.activeFilter,
//       )
//       state.error = null
//       state.message = null
//       state.hasFetched = true
//     })
//     builder.addCase(fetchAppointments.rejected, (state, action) => {
//       state.isLoading = false
//       state.isRefreshing = false
//       state.error = action.payload?.error || 'Failed to fetch appointments'
//       state.message = action.payload?.message || null
//       state.hasFetched = false
//       state.filteredAppointments = []
//     })
//     // Create appointment
//     builder.addCase(storeCreateAppointment.pending, (state) => {
//       state.isLoading = true
//       state.error = null
//       state.message = null
//       state.success = false
//     })
//     builder.addCase(storeCreateAppointment.fulfilled, (state, action) => {
//       state.isLoading = false
//       state.appointments.push(action.payload)
//       state.filteredAppointments = filterAppointments(
//         [
//           ...state.appointments,
//           {
//             ...action.payload,
//             selectedDate: String(action.payload.selectedDate),
//           },
//         ],
//         state.activeFilter,
//       )
//       state.error = null
//       state.message = null
//       state.success = true
//     })
//     builder.addCase(storeCreateAppointment.rejected, (state, action) => {
//       state.isLoading = false
//       state.error = action.payload?.error || 'Failed to create appointment'
//       state.message = action.payload?.message || null
//       state.success = false
//     })
//     // Update appointment
//     builder.addCase(updateAppointment.pending, (state) => {
//       state.isLoading = true
//       state.error = null
//       state.message = null
//       state.success = false
//     })
//     builder.addCase(updateAppointment.fulfilled, (state, action) => {
//       state.isLoading = false
//       state.appointments = state.appointments.map((appt) =>
//         appt.id === action.payload.id ? action.payload : appt,
//       )
//       state.filteredAppointments = filterAppointments(
//         state.appointments,
//         state.activeFilter,
//       )
//       state.error = null
//       state.message = null
//       state.success = true
//     })
//     builder.addCase(updateAppointment.rejected, (state, action) => {
//       state.isLoading = false
//       state.error = action.payload?.error || 'Failed to update appointment'
//       state.message = action.payload?.message || null
//       state.success = false
//     })
//     // Delete appointment
//     builder.addCase(deleteAppointment.pending, (state) => {
//       state.isLoading = true
//       state.error = null
//       state.message = null
//       state.success = false
//     })
//     builder.addCase(deleteAppointment.fulfilled, (state, action) => {
//       state.isLoading = false
//       state.appointments = state.appointments.filter(
//         (appt) => appt.id !== action.payload,
//       )
//       state.filteredAppointments = filterAppointments(
//         state.appointments,
//         state.activeFilter,
//       )
//       state.error = null
//       state.message = null
//       state.success = true
//       state.currentAppointment = null
//     })
//     builder.addCase(deleteAppointment.rejected, (state, action) => {
//       state.isLoading = false
//       state.error = action.payload?.error || 'Failed to delete appointment'
//       state.message = action.payload?.message || null
//       state.success = false
//     })
//   },
// })

// export const {
//   openAppointmentCreateForm,
//   openAppointmentEditForm,
//   openAppointmentViewForm,
//   closeAppointmentForm,
//   openAppointmentDeleteForm,
//   setCurrentAppointment,
//   setActiveFilter,
// } = appointmentSlice.actions

// export {
//   fetchAppointments,
//   storeCreateAppointment,
//   updateAppointment,
//   deleteAppointment,
// }

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

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

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

interface AppointmentState {
  appointments: Appointment[]
  filteredAppointments: Appointment[]
  isLoading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  currentAppointment: Appointment | null
  isFormOpen: boolean
  formMode: 'create' | 'edit' | 'view' | 'delete' | null
  error: string | null
  message: string | null
  success: boolean
  activeFilter: AppointmentFilterValue
}

const initialState: AppointmentState = {
  appointments: [],
  filteredAppointments: [],
  isLoading: false,
  isRefreshing: false,
  hasFetched: false,
  currentAppointment: null,
  isFormOpen: false,
  formMode: null,
  error: null,
  message: null,
  success: false,
  activeFilter: 'today',
}

const filterAppointments = (
  appointments: Appointment[],
  activeFilter: AppointmentFilterValue,
): Appointment[] => {
  if (!Array.isArray(appointments)) {
    console.warn('appointments is not an array:', appointments)
    return []
  }

  return appointments.filter((item) => {
    const isValidDate =
      typeof item.selectedDate === 'string' &&
      !isNaN(new Date(item.selectedDate).getTime())
    const validStatuses = [
      AppointmentStatus.SCHEDULED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.CANCELLED,
      AppointmentStatus.MISSED,
    ]
    const isValidStatus = validStatuses.includes(item.status)

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
          selectedDate: appt.selectedDate, // Keep as string
          status: appt.status,
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
      console.log('storeCreateAppointment: Response =', response)
      const { data, success, errorDetail, message } = response.data
      if (success && data) {
        toast.success(message || 'Appointment created successfully', {
          id: 'create-appointment',
        })
        return {
          ...data,
          selectedDate: data.selectedDate, // Keep as string
          status: data.status as AppointmentStatus,
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
          selectedDate: responseData.selectedDate, // Keep as string
          status: responseData.status as AppointmentStatus,
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
      error: errorDetail || 'Failed to delete appointment',
      message: message || null,
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
      state.formMode = 'create'
      state.currentAppointment = null
    },
    openAppointmentEditForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.formMode = 'edit'
      state.currentAppointment = action.payload
    },
    openAppointmentViewForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.formMode = 'view'
      state.currentAppointment = action.payload
    },
    openAppointmentDeleteForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.formMode = 'delete'
      state.currentAppointment = action.payload
    },
    closeAppointmentForm: (state) => {
      state.isFormOpen = false
      state.formMode = null
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
      state.filteredAppointments = filterAppointments(
        state.appointments,
        action.payload,
      )
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
      state.filteredAppointments = filterAppointments(
        action.payload,
        state.activeFilter,
      )
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
      state.filteredAppointments = filterAppointments(
        state.appointments,
        state.activeFilter,
      )
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
      state.filteredAppointments = filterAppointments(
        state.appointments,
        state.activeFilter,
      )
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
      state.filteredAppointments = filterAppointments(
        state.appointments,
        state.activeFilter,
      )
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
  setActiveFilter,
} = appointmentSlice.actions

export {
  fetchAppointments,
  storeCreateAppointment,
  updateAppointment,
  deleteAppointment,
}

export default appointmentSlice.reducer
