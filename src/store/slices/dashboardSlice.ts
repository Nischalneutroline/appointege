import { DashboardFilterValue } from '@/app/(protected)/admin/(dashboard)/_types/dashboard'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DashboardState {
  activeFilter: DashboardFilterValue
}

const initialState: DashboardState = {
  activeFilter: 'today', // Default to 'today'
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveFilter(
      state,
      action: PayloadAction<{ activeFilter: DashboardFilterValue }>,
    ) {
      state.activeFilter = action.payload.activeFilter
    },
  },
})

export const { setActiveFilter } = dashboardSlice.actions
export default dashboardSlice.reducer
