// src/store/slices/serviceSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { getBaseUrl } from '@/lib/baseUrl'
import { toast } from 'sonner'
import { getRandomAvatarColor } from '@/utils/randomColor.util'
import { AxioxResponseType } from '@/types/shared'
import {
  Service,
  ServiceFilterLabel,
  ServiceFilterValue,
  ServiceStatus,
  WeekDays,
} from '@/app/(protected)/admin/service/_types/service'

export interface ServiceOption {
  label: string
  value: string
}

export interface PostServiceData {
  title: string // Changed from name to match NewServiceForm
  description: string
  estimatedDuration: number
  serviceAvailability: {
    weekDay: WeekDays
    timeSlots: { startTime: string; endTime: string }[]
  }[]
  businessDetailId: string
  status: ServiceStatus
  message: string
  image: string
  userId: string
}

interface RejectError {
  error: any | null
  message: string | null
}

interface ServiceCounts {
  active: number
  inactive: number
  all: number
}

export interface FilterOptionState {
  label: ServiceFilterLabel
  value: ServiceFilterValue
  textColor: string
  border: string
  background: string
  icon: string
}

interface ServiceState {
  services: Service[]
  filteredServices: Service[]
  serviceOptions: ServiceOption[]
  counts: ServiceCounts
  filterOptions: FilterOptionState[]
  isLoading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  currentService: Service | null
  isFormOpen: boolean
  serviceFormMode: 'create' | 'edit' | 'view' | 'delete' | null
  error: string | null
  message: string | null
  success: boolean
  activeFilter: ServiceFilterValue
  activeFilters: ServiceFilterValue[]
}

const initialState: ServiceState = {
  services: [],
  filteredServices: [],
  serviceOptions: [],
  counts: {
    active: 0,
    inactive: 0,
    all: 0,
  },
  filterOptions: [
    {
      label: 'Active',
      value: 'active',
      textColor: '#103064',
      border: '#DCE9F9',
      background: '#E9F1FD',
      icon: 'CalendarCheck',
    },
    {
      label: 'Inactive',
      value: 'inactive',
      textColor: '#4C3000',
      border: '#FFF3CD',
      background: '#FFF6E6',
      icon: 'CalendarX2',
    },
    {
      label: 'All',
      value: 'all',
      textColor: '#103064',
      border: '#E9DFFF',
      background: '#F0EBFB',
      icon: 'CalendarDays',
    },
  ],
  isLoading: false,
  isRefreshing: false,
  hasFetched: false,
  currentService: null,
  isFormOpen: false,
  serviceFormMode: null,
  error: null,
  message: null,
  success: false,
  activeFilter: 'active',
  activeFilters: ['all', 'active', 'inactive'],
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

export const filterServices = (
  services: Service[],
  activeFilter: ServiceFilterValue,
): { filtered: Service[]; counts: ServiceCounts } => {
  if (!Array.isArray(services)) {
    console.warn('services is not an array:', services)
    return {
      filtered: [],
      counts: {
        active: 0,
        inactive: 0,
        all: 0,
      },
    }
  }

  console.log('filterServices: Input services =', services)
  console.log('filterServices: Active filter =', activeFilter)

  const counts: ServiceCounts = {
    active: 0,
    inactive: 0,
    all: services.length,
  }

  const validStatuses = [ServiceStatus.ACTIVE, ServiceStatus.INACTIVE]

  const filtered = services.filter((item) => {
    const isValidStatus = validStatuses.includes(item.status)

    if (isValidStatus && item.status === ServiceStatus.ACTIVE) {
      counts.active += 1
    }
    if (isValidStatus && item.status === ServiceStatus.INACTIVE) {
      counts.inactive += 1
    }

    switch (activeFilter) {
      case 'active':
        return isValidStatus && item.status === ServiceStatus.ACTIVE
      case 'inactive':
        return isValidStatus && item.status === ServiceStatus.INACTIVE
      case 'all':
        return true
      default:
        return true
    }
  })

  console.log('filterServices: Filtered result =', filtered)
  console.log('filterServices: Counts =', counts)
  return { filtered, counts }
}

const fetchServices = createAsyncThunk<
  Service[],
  boolean,
  { rejectValue: RejectError }
>('service/fetchServices', async (isManualRefresh, { rejectWithValue }) => {
  try {
    console.log('Fetching services in thunk...', { isManualRefresh })
    const response = (await api.get('/api/service')) as AxioxResponseType<
      Service[]
    >

    const { data, success, errorDetail, message } = response.data
    console.log('fetchServices: Response data =', data)
    if (success && Array.isArray(data)) {
      const normalizedData = data.map((service) => ({
        ...service,
        status: service.status,
        color: service.color || getRandomAvatarColor(),
      }))
      if (isManualRefresh) {
        const toastMessage = normalizedData.length
          ? `Fetched ${normalizedData.length} services.`
          : 'No services found'
        toast.success(toastMessage, { id: 'fetch-services' })
      }
      return normalizedData
    }
    if (isManualRefresh) {
      toast.error(message || 'Failed to fetch services', {
        id: 'fetch-services',
        duration: 3000,
        description: 'Please check the server or try again later.',
      })
    }
    return rejectWithValue({
      error: errorDetail || 'Failed to fetch services',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    if (isManualRefresh) {
      toast.error(errorMsg, {
        id: 'fetch-services',
        duration: 3000,
        description: 'Please check the server or try again later.',
      })
    }
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const storeCreateService = createAsyncThunk<
  Service,
  PostServiceData,
  { rejectValue: RejectError }
>('service/storeCreateService', async (serviceData, { rejectWithValue }) => {
  console.log('storeCreateService: serviceData =', serviceData)
  try {
    const response = await api.post('/api/service', serviceData)
    const { data, success, errorDetail, message } = response.data
    if (success && data) {
      toast.success(message || 'Service created successfully', {
        id: 'create-service',
      })
      return {
        ...data,
        status: data.status as ServiceStatus,
        color: getRandomAvatarColor(),
      }
    }
    toast.error(message || 'Failed to create service', {
      id: 'create-service',
    })
    return rejectWithValue({
      error: errorDetail || 'Failed to create service',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    toast.error(errorMsg, { id: 'create-service' })
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const updateService = createAsyncThunk<
  Service,
  { id: string; data: PostServiceData },
  { rejectValue: RejectError }
>('service/updateService', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/service/${id}`, data)
    const { data: responseData, success, errorDetail, message } = response.data
    if (success && responseData) {
      toast.success(message || 'Service updated successfully', {
        id: 'update-service',
      })
      return {
        ...responseData,
        status: responseData.status as ServiceStatus,
        color: responseData.color || getRandomAvatarColor(),
      }
    }
    toast.error(message || 'Failed to update service', {
      id: 'update-service',
    })
    return rejectWithValue({
      error: errorDetail || 'Failed to update service',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    toast.error(errorMsg, { id: 'update-service' })
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const deleteService = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectError }
>('service/deleteService', async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/api/service/${id}`)
    const { success, errorDetail, message } = response.data
    if (success) {
      toast.success(message || 'Service deleted successfully', {
        id: 'delete-service',
      })
      return id
    }
    toast.error(message || 'Failed to delete service', {
      id: 'delete-service',
    })
    return rejectWithValue({
      error: errorDetail || 'Failed to delete service',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    toast.error(errorMsg, { id: 'delete-service' })
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    openServiceCreateForm: (state) => {
      state.isFormOpen = true
      state.serviceFormMode = 'create'
      state.currentService = null
    },
    openServiceEditForm: (state, action: PayloadAction<Service>) => {
      state.isFormOpen = true
      state.serviceFormMode = 'edit'
      state.currentService = action.payload
    },
    openServiceViewForm: (state, action: PayloadAction<Service>) => {
      state.isFormOpen = true
      state.serviceFormMode = 'view'
      state.currentService = action.payload
    },
    openServiceDeleteForm: (state, action: PayloadAction<Service>) => {
      state.isFormOpen = true
      state.serviceFormMode = 'delete'
      state.currentService = action.payload
    },
    closeServiceForm: (state) => {
      state.isFormOpen = false
      state.serviceFormMode = null
      state.currentService = null
      state.success = false
    },
    setCurrentService: (state, action: PayloadAction<Service | null>) => {
      state.currentService = action.payload
    },
    setActiveFilter: (state, action: PayloadAction<ServiceFilterValue>) => {
      state.activeFilter = action.payload
      const { filtered, counts } = filterServices(
        state.services,
        action.payload,
      )
      state.filteredServices = filtered
      state.counts = counts
    },
    setActiveFilters: (state, action: PayloadAction<ServiceFilterValue[]>) => {
      state.activeFilters = action.payload
      state.activeFilter = action.payload.includes(state.activeFilter)
        ? state.activeFilter
        : action.payload.length > 0
          ? action.payload[0]
          : 'active'
      const { filtered, counts } = filterServices(
        state.services,
        state.activeFilter,
      )
      state.filteredServices = filtered
      state.counts = counts
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchServices.pending, (state, action) => {
      state.error = null
      state.message = null
      state.hasFetched = false
      state[action.meta.arg ? 'isRefreshing' : 'isLoading'] = true
    })
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      state.isLoading = false
      state.isRefreshing = false
      state.services = action.payload
      state.serviceOptions = action.payload.map((service) => ({
        value: service.id,
        label: service.title,
      }))
      const { filtered, counts } = filterServices(
        action.payload,
        state.activeFilter,
      )
      state.filteredServices = filtered
      state.counts = counts
      state.error = null
      state.message = null
      state.hasFetched = true
    })
    builder.addCase(fetchServices.rejected, (state, action) => {
      state.isLoading = false
      state.isRefreshing = false
      state.error = action.payload?.error || 'Failed to fetch services'
      state.message = action.payload?.message || null
      state.hasFetched = false
      state.filteredServices = []
      state.serviceOptions = []
      state.counts = {
        active: 0,
        inactive: 0,
        all: 0,
      }
    })
    builder.addCase(storeCreateService.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(storeCreateService.fulfilled, (state, action) => {
      state.isLoading = false
      state.services.push(action.payload)
      state.serviceOptions = state.services.map((service) => ({
        value: service.id,
        label: service.title,
      }))
      const { filtered, counts } = filterServices(
        state.services,
        state.activeFilter,
      )
      state.filteredServices = filtered
      state.counts = counts
      state.error = null
      state.message = null
      state.success = true
    })
    builder.addCase(storeCreateService.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to create service'
      state.message = action.payload?.message || null
      state.success = false
    })
    builder.addCase(updateService.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(updateService.fulfilled, (state, action) => {
      state.isLoading = false
      state.services = state.services.map((service) =>
        service.id === action.payload.id ? action.payload : service,
      )
      state.serviceOptions = state.services.map((service) => ({
        value: service.id,
        label: service.title,
      }))
      const { filtered, counts } = filterServices(
        state.services,
        state.activeFilter,
      )
      state.filteredServices = filtered
      state.counts = counts
      state.error = null
      state.message = null
      state.success = true
    })
    builder.addCase(updateService.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to update service'
      state.message = action.payload?.message || null
      state.success = false
    })
    builder.addCase(deleteService.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(deleteService.fulfilled, (state, action) => {
      state.isLoading = false
      state.services = state.services.filter(
        (service) => service.id !== action.payload,
      )
      state.serviceOptions = state.services.map((service) => ({
        value: service.id,
        label: service.title,
      }))
      const { filtered, counts } = filterServices(
        state.services,
        state.activeFilter,
      )
      state.filteredServices = filtered
      state.counts = counts
      state.error = null
      state.message = null
      state.success = true
      state.currentService = null
    })
    builder.addCase(deleteService.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to delete service'
      state.message = action.payload?.message || null
      state.success = false
    })
  },
})

export const {
  openServiceCreateForm,
  openServiceEditForm,
  openServiceViewForm,
  openServiceDeleteForm,
  closeServiceForm,
  setCurrentService,
  setActiveFilter,
  setActiveFilters,
} = serviceSlice.actions

export { fetchServices, storeCreateService, updateService, deleteService }

export default serviceSlice.reducer
