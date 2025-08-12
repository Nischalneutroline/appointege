// import { createSlice } from '@reduxjs/toolkit'

// export enum ReminderTab {
//   REMINDER = 'reminder',
//   ANNOUNCEMENT = 'announcement',
// }

// export type ReminderTabs = ReminderTab[]

// export interface FormData {
//   type: string
//   subject: string
//   description: string
//   message: string
//   service: string
//   when: string[]
//   isScheduled: boolean
//   scheduleDays: string
//   scheduleHours: string
//   scheduleMinutes: string
//   scheduleDate: string | null
//   scheduleTime: string
//   notifications: string[]
//   autoDelete: string
// }

// export interface ReminderSliceState {
//   activeTab: ReminderTab
//   activeTabs: ReminderTabs
//   formData: FormData
// }

// const initialState: ReminderSliceState = {
//   activeTab: ReminderTab.REMINDER,
//   activeTabs: [ReminderTab.REMINDER, ReminderTab.ANNOUNCEMENT],
//   formData: {
//     type: 'Upcoming',
//     subject: '',
//     description: '',
//     message:
//       'You have an appointment scheduled on {selected_appointment_date} at {selected_appointment_time} for {selected_service_name}. Please be on time. If you need to reschedule, visit your dashboard.',
//     service: '',
//     when: [],
//     isScheduled: false,
//     scheduleDays: '',
//     scheduleHours: '',
//     scheduleMinutes: '',
//     scheduleDate: null,
//     scheduleTime: '',
//     notifications: ['Email', 'SMS', 'Push Notification'],
//     autoDelete: '7 days',
//   },
// }

// export const createReminderSlice = createSlice({
//   name: 'reminder',
//   initialState,
//   reducers: {
//     setActiveTab: (state, action) => {
//       state.activeTab = action.payload
//     },
//     updateFormData: (state, action) => {
//       state.formData = { ...state.formData, ...action.payload }
//     },
//     resetFormData: (state) => {
//       state.formData = { ...initialState.formData }
//     },
//   },
// })

// export const { setActiveTab, updateFormData, resetFormData } =
//   createReminderSlice.actions
// export default createReminderSlice.reducer
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'sonner'
import { axiosApi } from '@/lib/baseUrl' // Assuming you have an axios instance configured
import { AxiosError } from 'axios'

// Assuming Reminder type based on API fetch structure
export interface Reminder {
  id: string
  type: 'REMINDER' | 'FOLLOW_UP' | 'CANCELLATION' | 'MISSED' | 'CUSTOM'
  title: string
  description: string | null
  message: string | null
  services: {
    id: string
    title: string
    description: string
    createdAt: string
    status: string
    estimatedDuration: number
    updatedAt: string
    businessDetailId: string | null
  }[]
  notifications: {
    id: string
    method: 'EMAIL' | 'SMS' | 'PUSH'
    reminderId: string
  }[]
  reminderOffset: {
    id: string
    sendOffset: number | null
    customScheduleAt: string | null
    sendBefore: boolean
    reminderId: string
  }[]
}

// Standardized API response type
interface ApiCallReturnType {
  data?: any
  success: boolean
  message?: string
  error?: string
}

// Enum for top-level tabs
export enum ReminderTab {
  REMINDER = 'reminder',
  ANNOUNCEMENT = 'announcement',
}

// Enum for reminder sub-tabs
export enum ReminderSubTab {
  REMINDER = 'Reminder',
  FOLLOW_UP = 'Follow up',
  CANCELLATION = 'Cancellation',
  MISSED = 'Missed',
  CUSTOM = 'Custom',
}

export type ReminderTabs = ReminderTab[]

// Form data interface
export interface FormData {
  type: string
  subject: string
  description: string
  message: string
  service: string
  when: string[]
  isScheduled: boolean
  scheduleDays: string
  scheduleHours: string
  scheduleMinutes: string
  scheduleDate: string | null
  scheduleTime: string
  notifications: string[]
  autoDelete: string
  customSchedules: { date: string; time: string }[] // Added to fix TS errors
}

// State interface
export interface ReminderSliceState {
  activeTab: ReminderTab
  activeTabs: ReminderTabs
  reminderTab: ReminderSubTab
  reminders: Reminder[]
  formData: FormData
  loading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  error: string | null
}

// Initial state
const initialState: ReminderSliceState = {
  activeTab: ReminderTab.REMINDER,
  activeTabs: [ReminderTab.REMINDER, ReminderTab.ANNOUNCEMENT],
  reminderTab: ReminderSubTab.REMINDER,
  reminders: [],
  formData: {
    type: 'Upcoming',
    subject: '',
    description: '',
    message:
      'You have an appointment scheduled on {selected_appointment_date} at {selected_appointment_time} for {selected_service_name}. Please be on time. If you need to reschedule, visit your dashboard.',
    service: '',
    when: [],
    isScheduled: false,
    scheduleDays: '',
    scheduleHours: '',
    scheduleMinutes: '',
    scheduleDate: null,
    scheduleTime: '',
    notifications: ['EMAIL', 'SMS', 'PUSH'],
    autoDelete: '7 days',
    customSchedules: [], // Initialize empty array
  },
  loading: false,
  isRefreshing: false,
  hasFetched: false,
  error: null,
}

// ──────────────────────────────────────────────────────────────────────────
// ASYNC THUNKS
// ──────────────────────────────────────────────────────────────────────────

// Fetch all reminders
export const fetchReminders = createAsyncThunk(
  'reminder/fetchReminders',
  async (isManualRefresh: boolean = false, { getState, rejectWithValue }) => {
    const state = getState() as { reminder: ReminderSliceState }
    if (!isManualRefresh && state.reminder.hasFetched) {
      return state.reminder.reminders
    }
    try {
      const response = await axiosApi.get('/api/reminder')
      const data: ApiCallReturnType = response.data
      if (data.success && Array.isArray(data.data)) {
        const normalizedData = data.data.map((reminder: Reminder) => ({
          ...reminder,
        }))
        if (isManualRefresh) {
          const latestReminder = normalizedData[0]
          const toastMessage = normalizedData.length
            ? `Fetched ${normalizedData.length} reminders.${
                latestReminder ? ` Latest: ${latestReminder.title}` : ''
              }`
            : 'No reminders found'
          toast.success(toastMessage, { id: 'fetch-reminders' })
        }
        return normalizedData
      } else {
        const errorMessage =
          data.message || data.error || 'Failed to load reminders'
        if (isManualRefresh) {
          toast.error(errorMessage, {
            id: 'fetch-reminders',
            duration: 3000,
            description: 'Please check the server or try again later.',
          })
        }
        return rejectWithValue(errorMessage)
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to fetch reminders'
      if (isManualRefresh) {
        toast.error(errorMessage, { id: 'reminder-error' })
      }
      return rejectWithValue(errorMessage)
    }
  },
)

// Get reminder by ID
export const getReminderById = createAsyncThunk(
  'reminder/getReminderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(`/api/reminder/${id}`)
      const data: ApiCallReturnType = response.data
      if (data.success && data.data) {
        return {
          ...data.data,
          createdAt: new Date(data.data.createdAt),
          updatedAt: new Date(data.data.updatedAt),
        }
      } else {
        const errorMessage =
          data.message || data.error || 'Failed to fetch reminder'
        toast.error(errorMessage, { id: 'fetch-reminder' })
        return rejectWithValue(errorMessage)
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to fetch reminder'
      toast.error(errorMessage, { id: 'reminder-error' })
      return rejectWithValue(errorMessage)
    }
  },
)

// Create a new reminder
export const createReminder = createAsyncThunk(
  'reminder/createReminder',
  async (data: any, { rejectWithValue }) => {
    try {
      console.log('Creating reminder with data:', data) // Log data for debugging
      const response = await axiosApi.post('/api/reminder', data)
      console.log('API response:', response) // Log API response for debugging
      const result: ApiCallReturnType = response.data
      if (result.success && result.data) {
        const newReminder = {
          ...result.data,
        }
        toast.success(result.message || 'Reminder created successfully', {
          id: 'create-reminder',
        })
        return newReminder
      } else {
        const errorMessage =
          result.message || result.error || 'Failed to create reminder'
        toast.error(errorMessage, { id: 'create-reminder' })
        return rejectWithValue(errorMessage)
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to create reminder'
      toast.error(errorMessage, { id: 'reminder-error' })
      return rejectWithValue(errorMessage)
    }
  },
)

// Update an existing reminder
export const updateReminder = createAsyncThunk(
  'reminder/updateReminder',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosApi.put(`/api/reminder/${id}`, data)
      const result: ApiCallReturnType = response.data
      if (result.success && result.data) {
        const updatedReminder = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt || new Date()),
        }
        toast.success(result.message || 'Reminder updated successfully', {
          id: 'update-reminder',
        })
        return updatedReminder
      } else {
        const errorMessage =
          result.message || result.error || 'Failed to update reminder'
        toast.error(errorMessage, { id: 'update-reminder' })
        return rejectWithValue(errorMessage)
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to update reminder'
      toast.error(errorMessage, { id: 'reminder-error' })
      return rejectWithValue(errorMessage)
    }
  },
)

// Delete a reminder
export const deleteReminder = createAsyncThunk(
  'reminder/deleteReminder',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.delete('/api/reminder', { data: { id } })
      const result: ApiCallReturnType = response.data
      if (result.success) {
        toast.success(result.message || 'Reminder deleted successfully', {
          id: 'delete-reminder',
        })
        return id
      } else {
        const errorMessage =
          result.message || result.error || 'Failed to delete reminder'
        toast.error(errorMessage, { id: 'delete-reminder' })
        return rejectWithValue(errorMessage)
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.error
          ? error.response.data.error
          : 'Failed to delete reminder'
      toast.error(errorMessage, { id: 'reminder-error' })
      return rejectWithValue(errorMessage)
    }
  },
)

// ──────────────────────────────────────────────────────────────────────────
// SLICE
// ──────────────────────────────────────────────────────────────────────────

export const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ReminderTab>) => {
      state.activeTab = action.payload
    },
    setReminderTab: (state, action: PayloadAction<ReminderSubTab>) => {
      state.reminderTab = action.payload
    },
    updateFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    resetFormData: (state) => {
      state.formData = initialState.formData
    },
  },
  extraReducers: (builder) => {
    // Fetch Reminders
    builder
      .addCase(fetchReminders.pending, (state, action) => {
        state[action.meta.arg ? 'isRefreshing' : 'loading'] = true
        state.error = null
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.reminders = action.payload
        state.hasFetched = true
        state[action.meta.arg ? 'isRefreshing' : 'loading'] = false
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.error = action.payload as string
        state.reminders = []
        state[action.meta.arg ? 'isRefreshing' : 'loading'] = false
      })

    // Get Reminder by ID
    builder.addCase(getReminderById.rejected, (state, action) => {
      state.error = action.payload as string
    })

    // Create Reminder
    builder
      .addCase(createReminder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        state.reminders = [action.payload, ...state.reminders]
        state.loading = false
      })
      .addCase(createReminder.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })

    // Update Reminder
    builder
      .addCase(updateReminder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.map((reminder) =>
          reminder.id === action.payload.id ? action.payload : reminder,
        )
        state.loading = false
      })
      .addCase(updateReminder.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })

    // Delete Reminder
    builder
      .addCase(deleteReminder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.reminders = state.reminders.filter(
          (reminder) => reminder.id !== action.payload,
        )
        state.loading = false
      })
      .addCase(deleteReminder.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
  },
})

// ──────────────────────────────────────────────────────────────────────────
// SELECTORS
// ──────────────────────────────────────────────────────────────────────────

export const selectFilteredReminders = (state: {
  reminder: ReminderSliceState
}) => {
  const { reminders, reminderTab } = state.reminder
  if (!Array.isArray(reminders)) {
    console.warn('reminders is not an array:', reminders)
    return []
  }
  return reminders.filter((item) => {
    switch (reminderTab) {
      case ReminderSubTab.REMINDER:
        return item.type === 'REMINDER'
      case ReminderSubTab.FOLLOW_UP:
        return item.type === 'FOLLOW_UP'
      case ReminderSubTab.CANCELLATION:
        return item.type === 'CANCELLATION'
      case ReminderSubTab.MISSED:
        return item.type === 'MISSED'
      case ReminderSubTab.CUSTOM:
        return item.type === 'CUSTOM'
      default:
        return item.type === 'REMINDER'
    }
  })
}

// ──────────────────────────────────────────────────────────────────────────
// EXPORTS
// ──────────────────────────────────────────────────────────────────────────

export const { setActiveTab, setReminderTab, updateFormData, resetFormData } =
  reminderSlice.actions
export default reminderSlice.reducer
