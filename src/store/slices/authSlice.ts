// store/authSlice.ts
import { signOut } from 'next-auth/react'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Define user interface based on NextAuth session
interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | null
  businessDetailId?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunk for signing out using NextAuth's signOut
export const logOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await signOut({ redirectTo: '/login' })
      return null
    } catch (error) {
      console.error('Sign out error:', error)
      return rejectWithValue('Failed to sign out')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(
      state,
      action: PayloadAction<{ user: User | null; isLoading: boolean }>,
    ) {
      state.user = action.payload.user
      state.isAuthenticated = !!action.payload.user
      state.isLoading = action.payload.isLoading
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logOut.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(logOut.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logOut.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setSession, clearError } = authSlice.actions
export default authSlice.reducer
