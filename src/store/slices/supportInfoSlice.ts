import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosApi } from '@/lib/baseUrl'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import {
  AvailabilityType,
  BusinessTimeType,
  HolidayType,
  WeekDays,
} from '@/app/(protected)/admin/business-settings/_types/types'

// Define the day type for TypeScript
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

// Type for time range (e.g., ["09:00 AM", "05:00 PM"])
export type TimeRange = [string, string]

// Type for business hours (e.g., { Mon: [["09:00 AM", "05:00 PM"]] })

// First, let's define the TimeSlot interface
interface TimeSlot {
  id: string
  type: BusinessTimeType // Adjust the types as needed
  businessAvailabilityId: string
  startTime: string
  endTime: string
}

// Update the BusinessAvailability interface
interface BusinessAvailability {
  id?: string
  businessId?: string | null
  weekDay: WeekDays
  type: AvailabilityType // Adjust based on your actual types
  supportBusinessDetailId?: string
  timeSlots: TimeSlot[]
}

// Update the Holiday interface
interface Holiday {
  id?: string
  businessId?: string | null
  holiday: WeekDays
  type: HolidayType // Adjust based on your actual types
  date: string // or Date if you prefer to parse it
  supportBusinessDetailId?: string
}

// Update the main SupportInfo interface
export interface SupportInfo {
  id: string
  supportBusinessName: string
  supportEmail: string
  supportPhone: string
  supportGoogleMap: string
  supportAddress: string
  businessId?: string
  supportAvailability: BusinessAvailability[]
  supportHoliday: Holiday[]
}

// Update the state interface
export interface SupportInfoState {
  supportDetail: SupportInfo | null // Changed to null for initial state
  isLoading: boolean
  error: string | null
  success: boolean
  message: string | null
  isSubmitting: boolean
}

// Update the initial state
const initialState: SupportInfoState = {
  isLoading: false,
  error: null,
  supportDetail: null, // Changed to null since we'll set it when data is loaded
  success: false,
  message: null,
  isSubmitting: false,
}
// Thunks
export const fetchSupportDetailsById = createAsyncThunk(
  'supportInfo/fetchSupportDetailsById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get(`/api/support-business-detail/${id}`)
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to fetch tickets')
    }
  },
)
export const fetchSupportDetails = createAsyncThunk(
  'supportInfo/fetchSupportDetails',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.get('/api/support-business-detail')
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to fetch tickets')
    }
  },
)

export const createSupportInfo = createAsyncThunk(
  'supportInfo/createSupportInfo',
  async (supportInfo: Omit<SupportInfo, 'id'>, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.post(
        '/api/support-business-detail',
        supportInfo,
      )
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to create ticket')
    }
  },
)

export const updateSupportInfo = createAsyncThunk(
  'supportInfo/updateSupportInfo',
  async (
    { id, ...updates }: Partial<SupportInfo> & { id: string },
    { rejectWithValue },
  ) => {
    try {
      console.log('Updating support info:', { id, ...updates })
      const { data } = await axiosApi.put(
        `/api/support-business-detail/${id}`,
        { ...updates },
      )
      return data
    } catch (error) {
      const err = error as AxiosError
      return rejectWithValue(err.response?.data || 'Failed to update ticket')
    }
  },
)

const supportInfoSlice = createSlice({
  name: 'supportInfo',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportDetailsById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSupportDetailsById.fulfilled, (state, action) => {
        state.isLoading = false
        state.supportDetail = action.payload
        state.success = true
        state.message = 'Support info fetched successfully'
      })
      .addCase(fetchSupportDetailsById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error('Failed to fetch support info')
      })

      .addCase(createSupportInfo.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(createSupportInfo.fulfilled, (state, action) => {
        const newSupportInfo = action.payload.supportInfo
        state.isSubmitting = false
        state.supportDetail = newSupportInfo
        state.success = true
        state.message = 'Support info created successfully'

        toast.success('Support info created successfully')
      })
      .addCase(createSupportInfo.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
        toast.error('Failed to create support info')
      })

      .addCase(updateSupportInfo.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(updateSupportInfo.fulfilled, (state, action) => {
        const updatedSupportInfo = action.payload.supportInfo
        state.isSubmitting = false
        const index: number | any =
          state.supportDetail?.supportAvailability.findIndex(
            (item) => item.id === updatedSupportInfo.id,
          )
        if (index !== -1 && state.supportDetail) {
          state.supportDetail.supportAvailability[index] = updatedSupportInfo
        }
        state.success = true
        state.message = 'Support info updated successfully'
        toast.success('Support info updated successfully')
      })
      .addCase(updateSupportInfo.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
        toast.error('Failed to update support info')
      })
  },
})

export const { clearError } = supportInfoSlice.actions

export default supportInfoSlice.reducer
