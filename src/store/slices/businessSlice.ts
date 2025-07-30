import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'
import {
  PrismaClient,
  WeekDays,
  AvailabilityType,
  HolidayType,
  BusinessTimeType,
} from '@prisma/client'
import { getBusinessDetailByOwnerId } from '@/db/businessDetail'
import { axiosApi } from '@/lib/baseUrl'
import { AxiosError } from 'axios'
import { toast } from 'sonner'


const prisma = new PrismaClient()

// Define form schemas
export const businessAvailabilityFormSchema = z.object({
  timezone: z.string().min(1, 'Time zone is required'),
  holidays: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])),
  businessAvailability: z.array(
    z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
  ),
  businessDays: z.record(
    z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    z.array(z.tuple([z.string(), z.string()])),
  ),
  breakHours: z.record(
    z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    z.array(z.tuple([z.string(), z.string()])),
  ),
})

export const serviceAvailabilityFormSchema = z.object({
  serviceAvailability: z.array(
    z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
  ),
  serviceDays: z.record(
    z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    z.array(z.tuple([z.string(), z.string()])),
  ),
  isServiceVisible: z.boolean(),
  isPricingEnabled: z.boolean(),
})

export type BusinessAvailabilityFormValues = z.infer<
  typeof businessAvailabilityFormSchema
>
export type ServiceAvailabilityFormValues = z.infer<
  typeof serviceAvailabilityFormSchema
>

// Define Prisma-aligned interfaces
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

interface BusinessState {
  businesses: BusinessDetail[]
  selectedBusiness: BusinessDetail | null
  businessData:
    | (Partial<BusinessDetail> & {
        businessAvailabilityForm?: BusinessAvailabilityFormValues
        serviceAvailabilityForm?: ServiceAvailabilityFormValues
      })
    | null
  activeTab:
    | 'Business Detail'
    | 'Business Availability'
    | 'Service Availability'
  loading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  error: string | null
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

const initialState: BusinessState = {
  businesses: [],
  selectedBusiness: null,
  businessData: null,
  activeTab: 'Business Detail',
  loading: false,
  isRefreshing: false,
  hasFetched: false,
  error: null,
}

// Async thunks
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
      console.log(response, 'business post')
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

      return rejectWithValue({
        error: error.message,
        message: errorMsg,
      })
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
      console.log(response, 'business put')
      return response.data
    } catch (error: any) {
      console.log(error, 'error in updating business')
      const errorMsg =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : 'An unknown error occurred'

      toast.error(errorMsg, {
        id: 'update-business',
        duration: 3000,
        description: errorMsg,
      })

      return rejectWithValue({
        error: error.message,
        message: errorMsg,
      })
    }
  },
)

// Helper function to convert time formats if needed
const formatTimeForDB = (timeStr: string) => {
  return timeStr
}

// Transform availability for form
export const transformAvailabilityForForm = (
  availability:
    | BusinessAvailability[]
    | ServiceAvailability[]
    | null
    | undefined,
): {
  work: Record<string, [string, string][]>
  break: Record<string, [string, string][]>
} => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const businessHours: {
    work: Record<string, [string, string][]>
    break: Record<string, [string, string][]>
  } = {
    work: {},
    break: {},
  }
  days.forEach((day) => {
    businessHours.work[day] = []
    businessHours.break[day] = []
  })

  if (!availability || !Array.isArray(availability)) return businessHours

  availability.forEach((avail) => {
    const dayKey = weekdayMap[avail.weekDay]
    if (!dayKey) return

    if ('timeSlots' in avail) {
      avail.timeSlots.forEach((slot: any) => {
        const startTime = slot.startTime
        const endTime = slot.endTime
        const slotPair: [string, string] = [startTime, endTime]

        if ('type' in slot && slot.type === 'BREAK') {
          businessHours.break[dayKey].push(slotPair)
        } else {
          businessHours.work[dayKey].push(slotPair)
        }
      })
    }
  })

  return businessHours
}

// Convert business availability form data to API format
export const convertFormToApiFormat = (
  formData: BusinessAvailabilityFormValues,
): { businessAvailability: BusinessAvailability[]; holidays: Holiday[] } => {
  const selectedDaysSet = new Set(formData.businessAvailability)

  const holidays = (
    Object.keys(weekdayMap).filter((d) => d.length === 3) as string[]
  )
    .filter((day) => !selectedDaysSet.has(day as any))
    .map((day) => ({
      holiday: weekdayMap[day] as Holiday['holiday'],
      type: 'GENERAL' as Holiday['type'],
      date: null,
    }))

  const businessAvailability: BusinessAvailability[] = []
  for (const day of formData.businessAvailability) {
    const apiDay = weekdayMap[day] as BusinessAvailability['weekDay']
    const workSlots: BusinessTime[] = (formData.businessDays[day] || []).map(
      ([startTime, endTime]) => ({
        type: 'WORK' as BusinessTime['type'],
        startTime: formatTimeForDB(startTime),
        endTime: formatTimeForDB(endTime),
      }),
    )
    const breakSlots: BusinessTime[] = (formData.breakHours[day] || []).map(
      ([startTime, endTime]) => ({
        type: 'BREAK' as BusinessTime['type'],
        startTime: formatTimeForDB(startTime),
        endTime: formatTimeForDB(endTime),
      }),
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

// Convert service availability form data to API format
export const convertServiceAvailabilityToApi = (
  formData: ServiceAvailabilityFormValues,
  businessId: string,
): ServiceAvailability[] => {
  const serviceAvailability: ServiceAvailability[] = []
  for (const day of formData.serviceAvailability) {
    const apiDay = weekdayMap[day] as ServiceAvailability['weekDay']
    const timeSlots: ServiceTime[] = (formData.serviceDays[day] || []).map(
      ([startTime, endTime]) => ({
        id: crypto.randomUUID(),
        type: BusinessTimeType.WORK,
        startTime: formatTimeForDB(startTime),
        endTime: formatTimeForDB(endTime),
        serviceAvailabilityId: '',
      }),
    )

    if (timeSlots.length) {
      serviceAvailability.push({
        id: crypto.randomUUID(),
        weekDay: apiDay,
        timeSlots,
        serviceId: null,
        businessDetailId: businessId,
      })
    }
  }
  return serviceAvailability
}

// Create slice
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
      action: PayloadAction<BusinessAvailabilityFormValues>,
    ) {
      const { businessAvailability, holidays } = convertFormToApiFormat(
        action.payload,
      )
      state.businessData = {
        ...state.businessData,
        businessAvailabilityForm: action.payload,
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
          state.selectedBusiness?.id || crypto.randomUUID(),
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
        state.error = null
      })
      .addCase(fetchBusinessByOwnerId.fulfilled, (state, action) => {
        state.businesses = action.payload
        state.selectedBusiness =
          action.payload.length > 0 ? action.payload[0] : null
        state.loading = false
      })
      .addCase(fetchBusinessByOwnerId.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to fetch business'
        state.loading = false
      })
      .addCase(createBusiness.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        const newBusiness = action.payload.data as BusinessDetail
        state.businesses.push(newBusiness)
        state.selectedBusiness = newBusiness

        // Transform businessAvailability and serviceAvailability for form data
        const { work: businessWork, break: breakHours } =
          transformAvailabilityForForm(newBusiness.businessAvailability)
        const { work: serviceWork } = transformAvailabilityForForm(
          newBusiness.serviceAvailability,
        )

        state.businessData = {
          ...newBusiness,
          businessAvailabilityForm: {
            timezone: newBusiness.timeZone || 'UTC',
            holidays:
              newBusiness.holiday?.map(
                (h) =>
                  weekdayMap[
                    h.holiday
                  ] as BusinessAvailabilityFormValues['holidays'][number],
              ) || [],
            businessAvailability:
              newBusiness.businessAvailability?.map(
                (avail) =>
                  weekdayMap[
                    avail.weekDay
                  ] as BusinessAvailabilityFormValues['businessAvailability'][number],
              ) || [],
            businessDays: businessWork,
            breakHours,
          },
          serviceAvailabilityForm: {
            serviceAvailability:
              newBusiness.serviceAvailability?.map(
                (avail) =>
                  weekdayMap[
                    avail.weekDay
                  ] as ServiceAvailabilityFormValues['serviceAvailability'][number],
              ) || [],
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

        // Transform businessAvailability and serviceAvailability for form data
        const { work: businessWork, break: breakHours } =
          transformAvailabilityForForm(updatedBusiness.businessAvailability)
        const { work: serviceWork } = transformAvailabilityForForm(
          updatedBusiness.serviceAvailability,
        )

        state.businessData = {
          ...updatedBusiness,
          businessAvailabilityForm: {
            timezone: updatedBusiness.timeZone || 'UTC',
            holidays:
              updatedBusiness.holiday?.map(
                (h) =>
                  weekdayMap[
                    h.holiday
                  ] as BusinessAvailabilityFormValues['holidays'][number],
              ) || [],
            businessAvailability:
              updatedBusiness.businessAvailability?.map(
                (avail) =>
                  weekdayMap[
                    avail.weekDay
                  ] as BusinessAvailabilityFormValues['businessAvailability'][number],
              ) || [],
            businessDays: businessWork,
            breakHours,
          },
          serviceAvailabilityForm: {
            serviceAvailability:
              updatedBusiness.serviceAvailability?.map(
                (avail) =>
                  weekdayMap[
                    avail.weekDay
                  ] as ServiceAvailabilityFormValues['serviceAvailability'][number],
              ) || [],
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
