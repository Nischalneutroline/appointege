// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import navReducer from './slices/navSlice'
import viewReducer from './slices/viewSlice'
import appointmentReducer from './slices/appointmentSlice'
import serviceReducer from './slices/serviceslice'
import customerReducer from './slices/customerSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nav: navReducer,
    view: viewReducer,
    appointment: appointmentReducer,
    service: serviceReducer,
    customer: customerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
