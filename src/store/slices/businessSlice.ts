// src/store/slices/businessDetailSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { axiosApi } from '@/lib/baseUrl'
import { toast } from 'sonner'
import { ServiceAvailability } from '../../app/(protected)/admin/service/_types/service'

export interface BusinessStep {
  id: string
  label: string
  completed: boolean
  active: boolean
  icon: IconName
}
export type IconName =
  | 'Check'
  | 'HandHeart'
  | 'BellRing'
  | 'HiOutlineSpeakerphone'

interface BusinessState {}

// Enums
export enum BusinessStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

export enum WeekDays {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum BusinessTimeType {
  WORK = 'WORK',
  BREAK = 'BREAK',
}

export enum AvailabilityType {
  GENERAL = 'GENERAL',
  SUPPORT = 'SUPPORT',
}

export enum HolidayType {
  GENERAL = 'GENERAL',
  SUPPORT = 'SUPPORT',
}

// Interfaces
export interface BusinessTime {
  id?: string
  type: BusinessTimeType
  startTime: string
  endTime: string
  businessAvailabilityId?: string
}

export interface BusinessAvailability {
  id?: string
  weekDay: WeekDays
  type: AvailabilityType
  timeSlots: BusinessTime[]
  businessId?: string
  supportBusinessDetailId?: string
}

export interface BusinessAddress {
  id?: string
  street: string
  city: string
  country: string
  state: string
  zipCode: string
  googleMap: string
  businessId?: string
  supportId?: string
}

export interface Holiday {
  id?: string
  holiday: WeekDays
  type: HolidayType
  date: string
  businessId?: string
  supportBusinessDetailId?: string
}

interface SupportBusinessDetail {
  id: string
  supportBusinessName: string
  supportEmail: string
  supportPhone: string
  supportGoogleMap?: string
  supportAddress: string
  supportAvailability: BusinessAvailability[]
  supportHoliday: Holiday[]
  businessId: string
  isLoading: false
  isSaving: false
  error: null
  message: null
  success: false
}

export interface BusinessDetail {
  id?: string
  name: string
  industry: string
  email: string
  phone: string
  website?: string
  businessType: string
  businessRegistrationNumber: string
  status: BusinessStatus
  timeZone?: string
  address: BusinessAddress[]
  businessAvailability: BusinessAvailability[]
  serviceAvailability: ServiceAvailability[]
  supportBusinessDetail?: SupportBusinessDetail
  holiday: Holiday[]
  createdAt?: string
  updatedAt?: string
  businessOwner?: string
  resources?: any[]
  services?: any[]
}

export interface BusinessDetailFormValues {
  id?: string
  name: string
  industry: string
  email: string
  phone: string
  website: string
  status: BusinessStatus
  businessRegistrationNumber: string
  address: Array<{
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    googleMap: string
  }>
  taxId: string
  logo: string | null
}
export type TimeSlot = {
  startTime: string // ISO 8601 date string
  endTime: string // ISO 8601 date string
  type: 'WORK' | 'BREAK'
}
export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export interface BusinessAvailabilityFormValues {
  timeZone: string
  businessAvailability: WeekDay[]
  businessHours: Partial<Record<WeekDay, [string, string][]>>
  breakHours: Partial<Record<WeekDay, [string, string][]>>
  holidays: WeekDay[]
}

// State
interface BusinessDetailState {
  activeStep: string
  completedSteps: string[]
  steps: BusinessStep[]
  businessDetailForm: BusinessDetailFormValues | null
  businessAvailabilityForm: BusinessAvailabilityFormValues[] | null
  businessDetail: BusinessDetail | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  message: string | null
  success: boolean
}

const initialState: BusinessDetailState = {
  activeStep: 'business-settings',
  completedSteps: [],
  steps: [
    {
      id: 'business-settings',
      label: 'Business Settings',
      completed: false,
      active: false,
      icon: 'Check',
    },
    {
      id: 'services',
      label: 'Services',
      completed: false,
      active: false,
      icon: 'HandHeart',
    },
    {
      id: 'reminders',
      label: 'Reminders',
      completed: false,
      active: false,
      icon: 'BellRing',
    },
    {
      id: 'announcemnet',
      label: 'Announcement',
      completed: false,
      active: false,
      icon: 'HiOutlineSpeakerphone',
    },
  ],
  businessDetailForm: null,
  businessAvailabilityForm: null,
  businessDetail: null,
  isLoading: false,
  isSaving: false,
  error: null,
  message: null,
  success: false,
}

// Helper function to transform API response
const transformBusinessDetail = (data: any): BusinessDetail => ({
  id: data.id,
  name: data.name,
  industry: data.industry,
  email: data.email,
  phone: data.phone,
  website: data.website,
  businessType: data.businessType,
  businessRegistrationNumber: data.businessRegistrationNumber,
  serviceAvailability: data.serviceAvailability || [],
  status: data.status as BusinessStatus,
  timeZone: data.timeZone,
  address: data.address || [],
  businessAvailability: data.businessAvailability || [],
  holiday: data.holiday || [],
  supportBusinessDetail: data.supportBusinessDetail || [],
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  businessOwner: data.businessOwner,
  resources: data.resources || [],
  services: data.services || [],
})

// Async Thunks
export const fetchBusinessDetail = createAsyncThunk<
  BusinessDetail,
  string,
  { rejectValue: { error: string; message: string } }
>('businessSettings/fetch', async (businessId, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<{ data: any }>(
      `/api/business-detail/${businessId}`,
    )
    return transformBusinessDetail(response.data.data)
  } catch (error) {
    const err = error as AxiosError<{ error: string; message: string }>
    return rejectWithValue({
      error: 'Failed to fetch business details',
      message: err.response?.data?.message || 'An error occurred',
    })
  }
})
export const createBusinessDetail = createAsyncThunk<
  BusinessDetail,
  { data: Partial<BusinessDetail> },
  { rejectValue: { error: string; message: string } }
>('businessSettings/create', async ({ data }, { rejectWithValue }) => {
  console.log('creating the business detail')
  try {
    const response = await axiosApi.post<{ data: any }>(
      `/api/business-detail`,
      data,
    )

    toast.success('Business details created successfully')
    return response.data.data
  } catch (error) {
    const err = error as AxiosError<{ error: string; message: string }>
    toast.error(
      err.response?.data?.message || 'Failed to create business details',
    )
    return rejectWithValue({
      error: 'Failed to create business details',
      message: err.response?.data?.message || 'An error occurred',
    })
  }
})

export const updateBusinessDetail = createAsyncThunk<
  BusinessDetail,
  { id: string; data: Partial<BusinessDetail> },
  { rejectValue: { error: string; message: string } }
>('businessSettings/update', async ({ id, data }, { rejectWithValue }) => {
  console.log('updating the business detail')
  try {
    const response = await axiosApi.put<{ data: any }>(
      `/api/business-detail/${id}`,
      data,
    )
    toast.success('Business details updated successfully')
    return transformBusinessDetail(response.data.data)
  } catch (error) {
    const err = error as AxiosError<{ error: string; message: string }>
    toast.error(
      err.response?.data?.message || 'Failed to update business details',
    )
    return rejectWithValue({
      error: 'Failed to update business details',
      message: err.response?.data?.message || 'An error occurred',
    })
  }
})

// Support Business Detail Thunk
export const updateSupportBusinessDetail = createAsyncThunk<
  SupportBusinessDetail,
  { id: string; data: Partial<SupportBusinessDetail> },
  { rejectValue: { error: string; message: string } }
>('supportBusiness/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosApi.put<{ data: SupportBusinessDetail }>(
      `/api/support-business-detail/${id}`,
      data,
    )
    toast.success('Support business details updated successfully')
    return response.data.data
  } catch (error) {
    const err = error as AxiosError<{ error: string; message: string }>
    toast.error(
      err.response?.data?.message ||
        'Failed to update support business details',
    )
    return rejectWithValue({
      error: 'Failed to update support business details',
      message: err.response?.data?.message || 'An error occurred',
    })
  }
})

export const createSupportBusinessDetail = createAsyncThunk<
  SupportBusinessDetail,
  { data: Partial<SupportBusinessDetail> },
  { rejectValue: { error: string; message: string } }
>('supportBusiness/create', async ({ data }, { rejectWithValue }) => {
  try {
    console.log('Sending data:', JSON.stringify(data, null, 2)) // Log the data being sent
    const response = await axiosApi.post<{ data: SupportBusinessDetail }>(
      `/api/support-business-detail`,
      data,
    )
    console.log('Response:', response.data) // Log the successful response
    toast.success('Support business details created successfully')
    return response.data.data
  } catch (error) {
    console.error('Error details:', {
      error,
      response: (error as any).response?.data,
      status: (error as any).response?.status,
      headers: (error as any).response?.headers,
    })
    const err = error as AxiosError<{ error: string; message: string }>
    const errorMessage =
      err.response?.data?.message || 'Failed to create support business details'
    toast.error(errorMessage)
    return rejectWithValue({
      error: 'Failed to create support business details',
      message: errorMessage,
    })
  }
})

// Slice
const businessDetailSlice = createSlice({
  name: 'businessSettings',
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<string>) => {
      // Update all steps' active status
      state.steps = state.steps.map((step) => ({
        ...step,
        active: step.id === action.payload,
      }))
      state.activeStep = action.payload
    },
    completeStep: (state, action: PayloadAction<string>) => {
      const stepId = action.payload

      // Update the step's completed status
      state.steps = state.steps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step,
      )

      // Add to completed steps if not already present
      if (!state.completedSteps.includes(stepId)) {
        state.completedSteps.push(stepId)
      }

      // Activate the next step if exists
      const currentIndex = state.steps.findIndex((step) => step.id === stepId)
      if (currentIndex < state.steps.length - 1) {
        const nextStep = state.steps[currentIndex + 1]
        state.activeStep = nextStep.id
        state.steps = state.steps.map((step) => ({
          ...step,
          active: step.id === nextStep.id,
        }))
      }
    },
    resetBusinessDetailState: () => initialState,
    setBusinessDetail: (
      state,
      action: PayloadAction<BusinessDetail | null>,
    ) => {
      state.businessDetail = action.payload
    },
    clearBusinessDetailError: (state) => {
      state.error = null
      state.message = null
    },
    updateBusinessAvailability: (
      state,
      action: PayloadAction<BusinessAvailability[]>,
    ) => {
      if (state.businessDetail) {
        state.businessDetail.businessAvailability = action.payload
      }
    },
    updateBusinessAddress: (
      state,
      action: PayloadAction<BusinessAddress[]>,
    ) => {
      if (state.businessDetail) {
        state.businessDetail.address = action.payload
      }
    },
    updateBusinessHolidays: (state, action: PayloadAction<Holiday[]>) => {
      if (state.businessDetail) {
        state.businessDetail.holiday = action.payload
      }
    },
    updateBusinessDetailForm: (
      state,
      action: PayloadAction<BusinessDetailFormValues>,
    ) => {
      state.businessDetailForm = action.payload
    },
    updateBusinessAvailabilityForm: (
      state,
      action: PayloadAction<BusinessAvailabilityFormValues>,
    ) => {
      state.businessAvailabilityForm = [action.payload]
    },
  },
  extraReducers: (builder) => {
    // Fetch Business Detail
    builder.addCase(fetchBusinessDetail.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchBusinessDetail.fulfilled, (state, action) => {
      state.isLoading = false
      state.businessDetail = action.payload
      state.success = true
    })
    builder.addCase(fetchBusinessDetail.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to fetch business details'
      state.message = action.payload?.message || null
      state.success = false
    })
    // Create Business Detail
    builder.addCase(createBusinessDetail.pending, (state) => {
      state.isSaving = true
      state.error = null
      state.message = null
    })

    builder.addCase(
      createBusinessDetail.fulfilled,
      (state, action: PayloadAction<BusinessDetail>) => {
        state.isSaving = false
        state.businessDetail = action.payload
        state.success = true
        state.message = 'Business details created successfully'
      },
    )

    builder.addCase(createBusinessDetail.rejected, (state, action) => {
      state.isSaving = false
      state.error = action.payload?.error || 'Failed to create business details'
      state.message = action.payload?.message || 'An unexpected error occurred'
      state.success = false
      console.error('Create business detail failed:', action.error)
    })
    // Update Business Detail
    builder.addCase(updateBusinessDetail.pending, (state) => {
      state.isSaving = true
      state.error = null
    })
    builder.addCase(updateBusinessDetail.fulfilled, (state, action) => {
      state.isSaving = false
      state.businessDetail = action.payload
      state.success = true
    })
    builder.addCase(updateBusinessDetail.rejected, (state, action) => {
      state.isSaving = false
      state.error = action.payload?.error || 'Failed to update business details'
      state.message = action.payload?.message || null
      state.success = false
    })
    // Update Support Business Detail
    builder.addCase(updateSupportBusinessDetail.pending, (state) => {
      state.isSaving = true
      state.error = null
    })
    builder.addCase(updateSupportBusinessDetail.fulfilled, (state, action) => {
      if (state.businessDetail) {
        state.isSaving = false
        state.businessDetail.supportBusinessDetail = action.payload
        state.success = true
      }
    })
    builder.addCase(updateSupportBusinessDetail.rejected, (state, action) => {
      state.isSaving = false
      state.error =
        action.payload?.error || 'Failed to update support business details'
      state.message = action.payload?.message || null
      state.success = false
    })
    // Create Support Business Detail
    builder.addCase(createSupportBusinessDetail.pending, (state) => {
      state.isSaving = true
      state.error = null
      state.message = null
    })
    builder.addCase(createSupportBusinessDetail.fulfilled, (state, action) => {
      if (state.businessDetail) {
        state.isSaving = false
        state.businessDetail.supportBusinessDetail = action.payload
        state.success = true
      } else {
        state.isSaving = false
        state.error =
          action.payload?.error || 'Failed to create support business details'
        state.message = action.payload?.message || null
        state.success = false
      }
    })
    builder.addCase(createSupportBusinessDetail.rejected, (state, action) => {
      state.isSaving = false
      state.error =
        action.payload?.error || 'Failed to create support business details'
      state.message = action.payload?.message || null
      state.success = false
    })
  },
})

// Export actions
export const {
  setActiveStep,
  completeStep,
  resetBusinessDetailState,
  setBusinessDetail,
  clearBusinessDetailError,
  updateBusinessAvailability,
  updateBusinessAddress,
  updateBusinessHolidays,
  updateBusinessDetailForm,
  updateBusinessAvailabilityForm,
} = businessDetailSlice.actions

// Export the reducer
export default businessDetailSlice.reducer
