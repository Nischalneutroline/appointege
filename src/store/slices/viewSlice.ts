import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ViewState {
  viewMode: string
}

const initialState: ViewState = {
  viewMode: 'card',
}

const createViewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewState>) {
      state.viewMode = action.payload.viewMode
    },
  },
})

export const { setViewMode } = createViewSlice.actions
export default createViewSlice.reducer
