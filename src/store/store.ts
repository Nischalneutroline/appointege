// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import navReducer from './slices/navSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nav: navReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
