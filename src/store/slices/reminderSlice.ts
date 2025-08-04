import { createSlice } from '@reduxjs/toolkit'

export enum ReminderTab {
  REMINDER = 'reminder',
  ANNOUNCEMENT = 'announcement',
}

export type ReminderTabs = ReminderTab[]

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
}

export interface ReminderSliceState {
  activeTab: ReminderTab
  activeTabs: ReminderTabs
  formData: FormData
}

const initialState: ReminderSliceState = {
  activeTab: ReminderTab.REMINDER,
  activeTabs: [ReminderTab.REMINDER, ReminderTab.ANNOUNCEMENT],
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
    notifications: ['Email', 'SMS', 'Push Notification'],
    autoDelete: '7 days',
  },
}

export const createReminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    resetFormData: (state) => {
      state.formData = { ...initialState.formData }
    },
  },
})

export const { setActiveTab, updateFormData, resetFormData } =
  createReminderSlice.actions
export default createReminderSlice.reducer
