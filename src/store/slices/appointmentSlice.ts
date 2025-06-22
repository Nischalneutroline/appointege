import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Appointment } from '@/data/appointment'
import { appointments } from '@/data/appointment'

interface AppointmentState {
  appointments: Appointment[]
  currentAppointment: Appointment | null
  isFormOpen: boolean
  formMode: 'create' | 'edit' | 'view' | 'delete' | null
}

// Get initial state from your data file
const initialState: AppointmentState = {
  appointments: [...appointments],
  currentAppointment: null,
  isFormOpen: false,
  formMode: null,
}

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
      state.isFormOpen = true
      state.formMode = 'view'
      state.currentAppointment = action.payload
    },

    // Open modal in delete mode
    openAppointmentDeleteForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.formMode = 'delete'
      state.currentAppointment = action.payload
    },

    // Close form
    closeAppointmentForm: (state) => {
      state.isFormOpen = false
      state.formMode = null
      state.currentAppointment = null
    },

    // // Add new appointment
    // addAppointment: (state, action: PayloadAction<Omit<Appointment, 'id'>>) => {
    //   const newId = Math.max(0, ...state.appointments.map((a) => a.id)) + 1
    //   state.appointments.push({
    //     id: newId,
    //     ...action.payload,
    //   })
    //   state.isFormOpen = false
    // },

    // // Update existing appointment
    // updateAppointment: (state, action: PayloadAction<Appointment>) => {
    //   const index = state.appointments.findIndex(
    //     (a) => a.id === action.payload.id,
    //   )
    //   if (index !== -1) {
    //     state.appointments[index] = action.payload
    //   }
    //   state.isFormOpen = false
    // },

    // // Delete appointment
    // deleteAppointment: (state, action: PayloadAction<number>) => {
    //   state.appointments = state.appointments.filter(
    //     (a) => a.id !== action.payload,
    //   )
    // },

    // Set current appointment (for view/edit)
    setCurrentAppointment: (
      state,
      action: PayloadAction<Appointment | null>,
    ) => {
      state.currentAppointment = action.payload
    },
  },
})

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

export default appointmentSlice.reducer
