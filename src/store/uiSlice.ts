import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  authFormSpacing: string
}

const initialState: UIState = {
  authFormSpacing: 'my-auto', // Default spacing
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAuthFormSpacing: (state, action: PayloadAction<string>) => {
      state.authFormSpacing = action.payload
    },
  },
})

export const { setAuthFormSpacing } = uiSlice.actions
export default uiSlice.reducer
