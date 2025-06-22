import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Appointment } from '@/data/appointment'
import { appointments } from '@/data/appointment'

interface CusotmerState {
  cusotmers: Appointment[]
  currentCustomer: Appointment | null
  isFormOpen: boolean
  formMode: 'create' | 'edit' | 'view' | 'delete' | null
}

// Get initial state from your data file
const initialState: CusotmerState = {
  cusotmers: [...appointments],
  currentCustomer: null,
  isFormOpen: false,
  formMode: null,
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // Open form in create mode
    openCustomerCreateForm: (state) => {
      state.isFormOpen = true
      state.formMode = 'create'
      state.currentCustomer = null
    },

    // Open form in edit mode
    openCustomerEditForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.formMode = 'edit'
      state.currentCustomer = action.payload
    },

    // Open form in view mode
    openCustomerViewForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.formMode = 'view'
      state.currentCustomer = action.payload
    },

    // Open modal in delete mode
    openCustomerDeleteForm: (state, action: PayloadAction<Appointment>) => {
      state.isFormOpen = true
      state.formMode = 'delete'
      state.currentCustomer = action.payload
    },

    // Close form
    closeCustomerForm: (state) => {
      state.isFormOpen = false
      state.formMode = null
      state.currentCustomer = null
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
    setCurrentCustomer: (
      state,
      action: PayloadAction<Appointment | null>,
    ) => {
      state.currentCustomer = action.payload
    },
  },
})

export const {
  openCustomerCreateForm,
  openCustomerEditForm,
  openCustomerViewForm,
  closeCustomerForm,
  openCustomerDeleteForm,
  //   addAppointment,
  //   updateAppointment,
  //   deleteAppointment,
  //   setCurrentCustomer,
} = customerSlice.actions

export default customerSlice.reducer
