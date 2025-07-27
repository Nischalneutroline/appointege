import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { z } from 'zod'
import {
  PrismaClient,
  WeekDays,
  AvailabilityType,
  HolidayType,
  BusinessTimeType,
} from '@prisma/client'
import {
  getBusinessDetailByOwnerId,
  createBusinessAPI,
  updateBusinessAPI,
} from '@/db/businessDetail'

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
  startTime: string // e.g., "08:00:00"
  endTime: string // e.g., "17:00:00"
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

interface BusinessDetail {
  id?: string
  name: string
  industry: string
  email: string
  phone: string
  website?: string | null
  businessRegistrationNumber: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'
  timeZone?: string | null
  businessOwner?: string | null // User ID
  createdAt: Date
  updatedAt: Date
  businessAvailability: BusinessAvailability[]
  serviceAvailability: ServiceAvailability[]
  holiday: Holiday[]
  address: {
    id: string
    street: string
    city: string
    country: string
    zipCode: string
    googleMap: string
    businessId?: string | null
    supportId?: string | null
  }[]
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
      const business = await createBusinessAPI(data)
      return business
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create business',
      )
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
      const business = await updateBusinessAPI(id, data)
      return business
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update business',
      )
    }
  },
)

// Transform availability for form
export const transformAvailabilityForForm = (
  availability: BusinessAvailability[] | ServiceAvailability[],
): {
  work: Record<string, [string, string][]>
  break?: Record<string, [string, string][]>
} => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const businessHours: {
    work: Record<string, [string, string][]>
    break?: Record<string, [string, string][]>
  } = {
    work: {},
    break: {},
  }
  days.forEach((day) => {
    businessHours.work[day] = []
    businessHours.break![day] = []
  })

  availability.forEach((avail) => {
    const dayKey = weekdayMap[avail.weekDay]
    if (!dayKey) return
    const workSlots: [string, string][] = []
    const breakSlots: [string, string][] = []

    if ('timeSlots' in avail) {
      avail.timeSlots.forEach((slot) => {
        // Extract time in HH:mm format (e.g., "08:00")
        const startTime = slot.startTime.slice(0, 5)
        const endTime = slot.endTime.slice(0, 5)
        const slotPair: [string, string] = [startTime, endTime]
        if ('type' in slot && slot.type === 'BREAK') {
          breakSlots.push(slotPair)
        } else {
          workSlots.push(slotPair)
        }
      })
    }

    const sortByStartTime = (slots: [string, string][]) =>
      slots.sort(
        (a, b) =>
          new Date(`1970-01-01 ${a[0]}`).getTime() -
          new Date(`1970-01-01 ${b[0]}`).getTime(),
      )

    businessHours.work[dayKey] = sortByStartTime(workSlots)
    if ('break' in businessHours) {
      businessHours.break![dayKey] = sortByStartTime(breakSlots)
    }
  })

  return businessHours
}

// Convert business availability form data to API format
export const convertFormToApiFormat = (
  formData: BusinessAvailabilityFormValues,
): { businessAvailability: BusinessAvailability[]; holidays: Holiday[] } => {
  const allWeekDays: string[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ]
  const selectedDaysSet = new Set(formData.businessAvailability)

  const holidays = allWeekDays
    .filter((day) => !selectedDaysSet.has(day))
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
        startTime,
        endTime,
      }),
    )
    const breakSlots: BusinessTime[] = (formData.breakHours[day] || []).map(
      ([startTime, endTime]) => ({
        type: 'BREAK' as BusinessTime['type'],
        startTime,
        endTime,
      }),
    )

    if (workSlots.length || breakSlots.length) {
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
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        serviceAvailabilityId: '',
      }),
    )

    if (timeSlots.length) {
      serviceAvailability.push({
        id: crypto.randomUUID(),
        weekDay: apiDay,
        timeSlots,
        serviceId: null, // Will be set when a service is created
        businessDetailId: businessId,
      })
    }
  }
  return serviceAvailability
}

// Transform DB data for form
export const transformBusinessDataForForms = (
  data: any,
): Partial<BusinessDetail> & {
  businessAvailabilityForm?: BusinessAvailabilityFormValues
} => {
  const businessDays = data.businessAvailability
    ?.map((avail: any) => weekdayMap[avail.weekDay])
    ?.filter((day: string) =>
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(day),
    ) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  const holidays = data.holiday
    ? data.holiday.map((h: any) => weekdayMap[h.holiday] || h.holiday)
    : ['Sat', 'Sun']

  const businessAvailabilityForm: BusinessAvailabilityFormValues = {
    timezone: data.timeZone || 'UTC',
    holidays,
    businessAvailability: businessDays,
    businessDays: transformAvailabilityForForm(data.businessAvailability || [])
      .work,
    breakHours:
      transformAvailabilityForForm(data.businessAvailability || []).break || {},
  }

  return {
    id: data.id || '',
    name: data.name || '',
    industry: data.industry || '',
    email: data.email || '',
    phone: data.phone || '',
    website: data.website || null,
    businessRegistrationNumber: data.businessRegistrationNumber || '',
    status: data.status || 'PENDING',
    timeZone: data.timeZone || null,
    businessOwner: data.businessOwner || null,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    businessAvailability: data.businessAvailability || [],
    serviceAvailability: data.serviceAvailability || [],
    holiday: data.holiday || [],
    address: data.address || [],
    businessAvailabilityForm,
  }
}

// Create slice
const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    updateSelectedBusiness(state, action: PayloadAction<BusinessDetail>) {
      state.selectedBusiness = action.payload
      state.businessData = transformBusinessDataForForms(action.payload)
    },
    setBusinessDetail(state, action: PayloadAction<Partial<BusinessDetail>>) {
      state.businessData = { ...state.businessData, ...action.payload }
      state.selectedBusiness = {
        ...state.selectedBusiness,
        ...action.payload,
      } as BusinessDetail
    },
    setBusinessAvailabilityForm(
      state,
      action: PayloadAction<BusinessAvailabilityFormValues>,
    ) {
      state.businessData = {
        ...state.businessData,
        businessAvailabilityForm: action.payload,
        timeZone: action.payload.timezone,
        holidays: convertFormToApiFormat(action.payload).holidays,
        businessAvailability: convertFormToApiFormat(action.payload)
          .businessAvailability,
      }
    },
    setActiveTab(
      state,
      action: PayloadAction<
        'Business Detail' | 'Business Availability' | 'Service Availability'
      >,
    ) {
      state.activeTab = action.payload
    },
    resetBusinessData(state) {
      state.businessData = null
      state.selectedBusiness = null
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
        state.businessData =
          action.payload.length > 0
            ? transformBusinessDataForForms(action.payload[0])
            : null
        state.hasFetched = true
        state.error = null
        state.loading = false
      })
      .addCase(fetchBusinessByOwnerId.rejected, (state, action) => {
        state.businesses = []
        state.selectedBusiness = null
        state.businessData = null
        state.hasFetched = true
        state.error = (action.payload as string) || 'Failed to fetch business'
        state.loading = false
      })
      .addCase(createBusiness.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.businesses = [action.payload, ...state.businesses]
        state.selectedBusiness = action.payload
        state.businessData = transformBusinessDataForForms(action.payload)
        state.loading = false
        state.error = null
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to create business'
      })
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.businesses = state.businesses.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        )
        state.selectedBusiness = action.payload
        state.businessData = transformBusinessDataForForms(action.payload)
        state.loading = false
        state.error = null
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to update business'
      })
  },
})

export const {
  updateSelectedBusiness,
  setBusinessDetail,
  setBusinessAvailabilityForm,
  setActiveTab,
  resetBusinessData,
} = businessSlice.actions
export default businessSlice.reducer
