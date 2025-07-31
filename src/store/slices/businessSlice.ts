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
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { WeekDays } from '@/app/(protected)/admin/service/_types/service'

const prisma = new PrismaClient()

// Define a constant for all weekdays in order for reliable sorting
export const allWeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

interface BusinessAvailability {
  id?: string
  weekDay: WeekDays
  type: AvailabilityType
  timeSlots: BusinessTime[]
  businessId?: string | null
  supportBusinessDetailId?: string | null
}

interface ServiceTime {
  id?: string
  type: BusinessTimeType
  startTime: string
  endTime: string
  serviceAvailabilityId?: string
}

interface ServiceAvailability {
  id?: string
  weekDay: WeekDays
  timeSlots: ServiceTime[]
  serviceId?: string | null
  businessDetailId?: string | null
}

interface Holiday {
  id?: string
  holiday: WeekDays
  type: HolidayType
  date?: Date | null
  businessId?: string | null
  supportBusinessDetailId?: string | null
}

interface Address {
  id: string
  street: string
  city: string
  country: string
  state: string
  zipCode: string
  googleMap: string
  businessId?: string | null
  supportId?: string | null
}

export interface BusinessDetail {
  id?: string
  name: string
  industry: string
  email: string
  phone: string
  website?: string | null
  businessRegistrationNumber: string
  taxID: string
  businessType: 'PHYSICAL' | 'VIRTUAL' | 'ALL'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'
  timeZone?: string | null
  businessOwner?: string | null
  createdAt: Date
  updatedAt: Date
  businessAvailability: BusinessAvailability[]
  serviceAvailability: ServiceAvailability[]
  holiday: Holiday[]
  address: Address[]
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

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString)
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    if (hours === 0) hours = 12
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`
  }
  availability.forEach((avail) => {
    const dayKey = weekdayMap[avail.weekDay] as WeekDay | undefined
    if (!dayKey) return
    ;(avail.timeSlots as BusinessTime[]).forEach((slot) => {
      const slotPair: [string, string] = [
        formatTime(slot.startTime),
        formatTime(slot.endTime),
      ]
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
    setBusinessDetail(state, action: PayloadAction<Partial<BusinessDetail>>) {
      state.businessData = { ...state.businessData, ...action.payload }
      state.selectedBusiness = {
        ...(state.selectedBusiness || ({} as BusinessDetail)),
        ...action.payload,
      }
    },
    setBusinessAvailabilityForm(
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
    setActiveTab(state, action: PayloadAction<BusinessTab>) {
      state.activeTab = action.payload
    },
    resetBusinessData(state) {
      state.businessData = null
      state.selectedBusiness = null
      state.activeTab = BusinessTab.BusinessDetail
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
          (action.payload as any)?.message || 'Failed to update business'
        state.loading = false
      })
  },
})

export const {
  setBusinessDetail,
  setBusinessAvailabilityForm,
  setServiceAvailabilityForm,
  setActiveTab,
  resetBusinessData,
} = businessSlice.actions

export default businessSlice.reducer
