import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'
import {
  PrismaClient,
  AvailabilityType,
  HolidayType,
  BusinessTimeType,
} from '@prisma/client'
import { getBusinessDetailByOwnerId } from '@/db/businessDetail'
import { axiosApi } from '@/lib/baseUrl'
import { toast } from 'sonner'
import { WeekDays } from '@/app/(protected)/admin/service/_types/service'

const prisma = new PrismaClient()

// Define a constant for all weekdays in order for reliable sorting
export const allWeekDays: WeekDay[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
]

// Define a reusable Zod enum for weekdays
const weekDayEnum = z.enum(allWeekDays)
export type WeekDay = z.infer<typeof weekDayEnum>

// ──────────────────────────────────────────────────────────────────────────
// SCHEMAS & TYPES
// ──────────────────────────────────────────────────────────────────────────

// Schema for the core data needed for API submission. It does NOT include UI-specific fields.
export const businessAvailabilityFormSchema = z.object({
  timezone: z.string().min(1, 'Time zone is required'),
  holidays: z.array(weekDayEnum),
  businessAvailability: z.array(weekDayEnum),
  businessDays: z.record(
    weekDayEnum,
    z.array(z.tuple([z.string(), z.string()])),
  ),
  breakHours: z.record(weekDayEnum, z.array(z.tuple([z.string(), z.string()]))),
})

// Extended schema for the form's UI state. It includes `from` and `to` for the day selector.
export const businessAvailabilityFormSchemaExtended =
  businessAvailabilityFormSchema.extend({
    from: weekDayEnum.optional(),
    to: weekDayEnum.optional(),
  })

export const serviceAvailabilityFormSchema = z.object({
  serviceAvailability: z.array(weekDayEnum),
  serviceDays: z.record(
    weekDayEnum,
    z.array(z.tuple([z.string(), z.string()])),
  ),
  isServiceVisible: z.boolean(),
  isPricingEnabled: z.boolean(),
})

// Type for API-bound data
export type BusinessAvailabilityFormValues = z.infer<
  typeof businessAvailabilityFormSchema
>
// Type for the full form state, including UI fields
export type BusinessAvailabilityFormValuesExtended = z.infer<
  typeof businessAvailabilityFormSchemaExtended
>
export type ServiceAvailabilityFormValues = z.infer<
  typeof serviceAvailabilityFormSchema
>

// Prisma-aligned interfaces
interface BusinessTime {
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

export enum BusinessTab {
  BusinessDetail = 'Business Detail',
  BusinessAvailability = 'Business Availability',
  ServiceAvailability = 'Service Availability',
}

export const weekdayMap: { [key: string]: string } = {
  Mon: 'MONDAY',
  MONDAY: 'Mon',
  Tue: 'TUESDAY',
  TUESDAY: 'Tue',
  Wed: 'WEDNESDAY',
  WEDNESDAY: 'Wed',
  Thu: 'THURSDAY',
  THURSDAY: 'Thu',
  Fri: 'FRIDAY',
  FRIDAY: 'Fri',
  Sat: 'SATURDAY',
  SATURDAY: 'Sat',
  Sun: 'SUNDAY',
  SUNDAY: 'Sun',
}

// ──────────────────────────────────────────────────────────────────────────
// STATE DEFINITION
// ──────────────────────────────────────────────────────────────────────────

interface BusinessState {
  businesses: BusinessDetail[]
  selectedBusiness: BusinessDetail | null
  businessData:
    | (Partial<BusinessDetail> & {
        // The form state now uses the EXTENDED type to hold from/to
        businessAvailabilityForm?: BusinessAvailabilityFormValuesExtended
        serviceAvailabilityForm?: ServiceAvailabilityFormValues
      })
    | null
  activeTab: BusinessTab
  loading: boolean
  hasFetched: boolean
  error: string | null
}

const initialState: BusinessState = {
  businesses: [],
  selectedBusiness: null,
  businessData: null,
  activeTab: BusinessTab.BusinessDetail,
  loading: false,
  hasFetched: false,
  error: null,
  message: null,
  success: false,
}

// ──────────────────────────────────────────────────────────────────────────
// ASYNC THUNKS
// ──────────────────────────────────────────────────────────────────────────

export const fetchBusinessByOwnerId = createAsyncThunk(
  'business/fetchBusinessByOwnerId',
  async (ownerId: string, { rejectWithValue }) => {
    try {
      const businesses = await getBusinessDetailByOwnerId(ownerId)
      return businesses
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch business',
      )
    }
  },
)

export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async (data: Partial<BusinessDetail>, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post('/api/business-detail/', data)
      return response.data
    } catch (error: any) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : 'An unknown error occurred'
      toast.error(errorMsg, {
        id: 'create-business',
        duration: 3000,
        description: errorMsg,
      })
      return rejectWithValue({ error: error.message, message: errorMsg })
    }
  },
)

export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async (
    { id, data }: { id: string; data: Partial<BusinessDetail> },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosApi.put(`/api/business-detail/${id}`, data)
      return response.data
    } catch (error: any) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : 'An unknown error occurred'
      toast.error(errorMsg, {
        id: 'update-business',
        duration: 3000,
        description: errorMsg,
      })
      return rejectWithValue({ error: error.message, message: errorMsg })
    }
  },
)

// ──────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ──────────────────────────────────────────────────────────────────────────

export const transformAvailabilityForForm = (
  availability:
    | BusinessAvailability[]
    | ServiceAvailability[]
    | null
    | undefined,
): {
  work: Record<WeekDay, [string, string][]>
  break: Record<WeekDay, [string, string][]>
} => {
  const businessHours = {
    work: {} as Record<WeekDay, [string, string][]>,
    break: {} as Record<WeekDay, [string, string][]>,
  }
  allWeekDays.forEach((day) => {
    businessHours.work[day] = []
    businessHours.break[day] = []
  })

  if (!availability) return businessHours

  availability.forEach((avail) => {
    const dayKey = weekdayMap[avail.weekDay] as WeekDay | undefined
    if (!dayKey) return
    ;(avail.timeSlots as BusinessTime[]).forEach((slot) => {
      const slotPair: [string, string] = [slot.startTime, slot.endTime]
      if (slot.type === 'BREAK') {
        businessHours.break[dayKey].push(slotPair)
      } else {
        businessHours.work[dayKey].push(slotPair)
      }
    })
  })
  return businessHours
}

export const convertFormToApiFormat = (
  formData: BusinessAvailabilityFormValues,
): { businessAvailability: BusinessAvailability[]; holidays: Holiday[] } => {
  const selectedDaysSet = new Set(formData.businessAvailability)

  const holidays: Holiday[] = allWeekDays
    .filter((day) => !selectedDaysSet.has(day as WeekDay))
    .map((day) => ({
      holiday: weekdayMap[day] as WeekDays,
      type: 'GENERAL',
      date: null,
    }))

  const businessAvailability: BusinessAvailability[] = []
  for (const day of formData.businessAvailability) {
    const apiDay = weekdayMap[day] as WeekDays
    const workSlots: BusinessTime[] = (formData.businessDays[day] || []).map(
      ([startTime, endTime]) => ({ type: 'WORK', startTime, endTime }),
    )
    const breakSlots: BusinessTime[] = (formData.breakHours[day] || []).map(
      ([startTime, endTime]) => ({ type: 'BREAK', startTime, endTime }),
    )

    if (workSlots.length > 0 || breakSlots.length > 0) {
      businessAvailability.push({
        weekDay: apiDay,
        type: 'GENERAL',
        timeSlots: [...workSlots, ...breakSlots],
      })
    }
  }
  return { businessAvailability, holidays }
}

export const convertServiceAvailabilityToApi = (
  formData: ServiceAvailabilityFormValues,
  businessId: string,
): ServiceAvailability[] => {
  const serviceAvailability: ServiceAvailability[] = []
  for (const day of formData.serviceAvailability) {
    const apiDay = weekdayMap[day] as WeekDays
    const timeSlots: ServiceTime[] = (formData.serviceDays[day] || []).map(
      ([startTime, endTime]) => ({
        type: 'WORK',
        startTime,
        endTime,
      }),
    )

    if (timeSlots.length) {
      serviceAvailability.push({
        weekDay: apiDay,
        timeSlots,
        businessDetailId: businessId,
      })
    }
  }
  return serviceAvailability
}

// ──────────────────────────────────────────────────────────────────────────
// SLICE
// ──────────────────────────────────────────────────────────────────────────

const businessSlice = createSlice({
  name: 'business',
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
      action: PayloadAction<BusinessAvailabilityFormValuesExtended>, // Accepts the extended form data
    ) {
      // Use zod parse to strip out `from` and `to` before converting for the API format
      const apiSafeData = businessAvailabilityFormSchema.parse(action.payload)
      const { businessAvailability, holidays } =
        convertFormToApiFormat(apiSafeData)

      state.businessData = {
        ...state.businessData,
        // Save the full form payload (including from/to) to Redux state
        businessAvailabilityForm: action.payload,
        // Update the top-level business data properties as before
        timeZone: action.payload.timezone,
        holiday: holidays,
        businessAvailability,
      }
    },
    setServiceAvailabilityForm(
      state,
      action: PayloadAction<ServiceAvailabilityFormValues>,
    ) {
      state.businessData = {
        ...state.businessData,
        serviceAvailabilityForm: action.payload,
        serviceAvailability: convertServiceAvailabilityToApi(
          action.payload,
          state.selectedBusiness?.id || '',
        ),
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
    builder
      .addCase(fetchBusinessByOwnerId.pending, (state) => {
        state.loading = true
        state.hasFetched = false
        state.error = null
      })
      .addCase(fetchBusinessByOwnerId.fulfilled, (state, action) => {
        state.loading = false
        state.hasFetched = true
        state.businesses = action.payload
        state.selectedBusiness =
          action.payload.length > 0 ? action.payload[0] : null
      })
      .addCase(fetchBusinessByOwnerId.rejected, (state, action) => {
        state.loading = false
        state.hasFetched = true
        state.error = (action.payload as string) || 'Failed to fetch business'
      })
      .addCase(createBusiness.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        const newBusiness = action.payload.data as BusinessDetail
        state.businesses.push(newBusiness)
        state.selectedBusiness = newBusiness

        const { work: businessWork, break: breakHours } =
          transformAvailabilityForForm(newBusiness.businessAvailability)
        const { work: serviceWork } = transformAvailabilityForForm(
          newBusiness.serviceAvailability,
        )

        const availableDays = (newBusiness.businessAvailability || []).map(
          (avail) => weekdayMap[avail.weekDay] as WeekDay,
        )
        const sortedDays = allWeekDays.filter((d) => availableDays.includes(d))

        state.businessData = {
          ...newBusiness,
          businessAvailabilityForm: {
            timezone: newBusiness.timeZone || 'UTC',
            holidays: (newBusiness.holiday || []).map(
              (h) => weekdayMap[h.holiday] as WeekDay,
            ),
            businessAvailability: sortedDays,
            businessDays: businessWork,
            breakHours,
            from: sortedDays.length > 0 ? sortedDays[0] : undefined,
            to:
              sortedDays.length > 0
                ? sortedDays[sortedDays.length - 1]
                : undefined,
          },
          serviceAvailabilityForm: {
            serviceAvailability: (newBusiness.serviceAvailability || []).map(
              (avail) => weekdayMap[avail.weekDay] as WeekDay,
            ),
            serviceDays: serviceWork,
            isServiceVisible: true,
            isPricingEnabled: false,
          },
        }
        state.loading = false
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.error =
          (action.payload as any)?.message || 'Failed to create business'
        state.loading = false
      })
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        const updatedBusiness = action.payload.data as BusinessDetail
        state.businesses = state.businesses.map((business) =>
          business.id === updatedBusiness.id ? updatedBusiness : business,
        )
        state.selectedBusiness = updatedBusiness

        const { work: businessWork, break: breakHours } =
          transformAvailabilityForForm(updatedBusiness.businessAvailability)
        const { work: serviceWork } = transformAvailabilityForForm(
          updatedBusiness.serviceAvailability,
        )

        const availableDays = (updatedBusiness.businessAvailability || []).map(
          (avail) => weekdayMap[avail.weekDay] as WeekDay,
        )
        const sortedDays = allWeekDays.filter((d) => availableDays.includes(d))

        state.businessData = {
          ...updatedBusiness,
          businessAvailabilityForm: {
            timezone: updatedBusiness.timeZone || 'UTC',
            holidays: (updatedBusiness.holiday || []).map(
              (h) => weekdayMap[h.holiday] as WeekDay,
            ),
            businessAvailability: sortedDays,
            businessDays: businessWork,
            breakHours,
            from: sortedDays.length > 0 ? sortedDays[0] : undefined,
            to:
              sortedDays.length > 0
                ? sortedDays[sortedDays.length - 1]
                : undefined,
          },
          serviceAvailabilityForm: {
            serviceAvailability: (
              updatedBusiness.serviceAvailability || []
            ).map((avail) => weekdayMap[avail.weekDay] as WeekDay),
            serviceDays: serviceWork,
            isServiceVisible:
              state.businessData?.serviceAvailabilityForm?.isServiceVisible ??
              true,
            isPricingEnabled:
              state.businessData?.serviceAvailabilityForm?.isPricingEnabled ??
              false,
          },
        }
        state.loading = false
      })
      .addCase(updateBusiness.rejected, (state, action) => {
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
