// // initial State

// import { AxiosResponseType } from '@/app/(protected)/admin/customer/_types/customer'
// import { Service } from '@/app/(protected)/admin/service/_types/service'
// import { getBaseUrl } from '@/lib/baseUrl'
// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import axios, { AxiosError } from 'axios'

// const api = axios.create({
//   baseURL: getBaseUrl(),
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// interface RejectError {
//   error: string | null
//   message: string | null
// }

// interface ServiceOptions {
//   value: string
//   label: string
// }
// export interface ServiceState {
//   serviceOptions: ServiceOptions[]
//   services: Service[]
//   isLoading: boolean
//   currentService: Service | null
//   isFormOpen: boolean
//   serviceFormMode: 'create' | 'edit' | 'view' | 'delete' | null
//   error: string | null // Specific type instead of 'any'
//   message: string | null
//   success: boolean
// }

// const initialState: ServiceState = {
//   services: [],
//   serviceOptions: [],
//   isLoading: false,
//   currentService: null,
//   isFormOpen: false,
//   serviceFormMode: null,
//   error: null,
//   message: null,
//   success: false,
// }

// // Async actions
// const fetchServices = createAsyncThunk<
//   Service[],
//   void,
//   { rejectValue: RejectError }
// >('service/fetchServices', async (_, { rejectWithValue }) => {
//   try {
//     console.log('Fetching services in thunk...')
//     const response = (await axiosApi.get('/api/service')) as AxiosResponseType<
//       Service[]
//     >
//     console.log('fetchServices: Full response =', response)
//     const { data, success, error, message } = response.data

//     if (success && Array.isArray(data)) {
//       return data
//     }
//     return rejectWithValue({
//       error: error || 'Failed to fetch services',
//       message: message || null,
//     })
//   } catch (error: any) {
//     const errorMsg =
//       error instanceof AxiosError && error.response?.data?.message
//         ? error.response.data.message
//         : 'An unknown error occurred'
//     return rejectWithValue({
//       error: error.message,
//       message: errorMsg,
//     })
//   }
// })

// const serviceSlice = createSlice({
//   name: 'service',
//   initialState,
//   reducers: {
//     // Open form in create mode
//     openAppointmentCreateForm: (state) => {
//       state.isFormOpen = true
//       state.serviceFormMode = 'create'
//       state.currentService = null
//     },

//     // Open form in edit mode
//     openAppointmentEditForm: (state, action: PayloadAction<Service>) => {
//       state.isFormOpen = true
//       state.serviceFormMode = 'edit'
//       state.currentService = action.payload
//     },

//     // Open form in view mode
//     openAppointmentViewForm: (state, action: PayloadAction<Service>) => {
//       state.isFormOpen = false
//       state.serviceFormMode = 'view'
//       state.currentService = action.payload
//     },

//     // Open modal in delete mode
//     openAppointmentDeleteForm: (state, action: PayloadAction<Service>) => {
//       state.isFormOpen = false
//       state.serviceFormMode = 'delete'
//       state.currentService = action.payload
//     },

//     // Close form
//     closeAppointmentForm: (state) => {
//       state.isFormOpen = false
//       state.serviceFormMode = null
//       state.currentService = null
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchServices.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//         state.message = null
//         state.success = false
//       })
//       .addCase(fetchServices.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.services = action.payload
//         state.error = null
//         state.message = null
//         state.success = true

//         // add service options
//         state.serviceOptions = action.payload.map((service) => ({
//           value: service.id,
//           label: service.title,
//         }))
//       })
//       .addCase(fetchServices.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload?.error || 'Failed to fetch services'
//         state.message = action.payload?.message || null
//         state.success = false
//       })
//   },
// })

// // Actions
// export const {
//   openAppointmentCreateForm,
//   openAppointmentEditForm,
//   openAppointmentViewForm,
//   closeAppointmentForm,
//   openAppointmentDeleteForm,
// } = serviceSlice.actions

// // Async Action
// export { fetchServices }

// // Reducer
// export default serviceSlice.reducer

// File: @/store/slices/serviceSlice.ts
// File: @/store/slices/serviceSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { axiosApi } from '@/lib/baseUrl'
import { toast } from 'sonner'
import { Service, Status } from '@/app/(protected)/admin/service/_types/service'

interface AxioxResponseType<T> {
  data: {
    data: T
    success: boolean
    errorDetail?: string
    message?: string
  }
}

interface RejectError {
  error: any | null
  message: string | null
}

interface ServiceOptions {
  value: string
  label: string
}

interface ServiceState {
  services: Service[]
  filteredServices: Service[]
  serviceOptions: ServiceOptions[]
  isLoading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  currentService: Service | null
  isFormOpen: boolean
  serviceFormMode: 'create' | 'edit' | 'view' | 'delete' | null
  error: string | null
  message: string | null
  success: boolean
  activeFilter: 'all' | 'active' | 'inactive'
}

const initialState: ServiceState = {
  services: [],
  filteredServices: [],
  serviceOptions: [],
  isLoading: false,
  isRefreshing: false,
  hasFetched: false,
  currentService: null,
  isFormOpen: false,
  serviceFormMode: null,
  error: null,
  message: null,
  success: false,
  activeFilter: 'all',
}

const generateServiceOptions = (services: Service[]): ServiceOptions[] => {
  return services.map((service) => ({
    value: service.id,
    label: service.title,
  }))
}

const filterServices = (
  services: Service[],
  activeFilter: ServiceState['activeFilter'],
): Service[] => {
  if (!Array.isArray(services)) {
    console.warn('services is not an array:', services)
    return []
  }

  return services.filter((item) => {
    switch (activeFilter) {
      case 'active':
        return item.status === Status.ACTIVE
      case 'inactive':
        return item.status === Status.INACTIVE
      case 'all':
        return true
      default:
        return true
    }
  })
}

const fetchServices = createAsyncThunk<
  Service[],
  boolean,
  { rejectValue: RejectError }
>('service/fetchServices', async (isManualRefresh, { rejectWithValue }) => {
  try {
    console.log('Fetching services in thunk...', { isManualRefresh })
    const response = (await axiosApi.get('/api/service')) as AxioxResponseType<
      Service[]
    >
    console.log('fetchServices: Full response =', response)
    const { data, success, errorDetail, message } = response.data
    console.log('fetchServices: Response data =', data)
    if (success && Array.isArray(data)) {
      if (isManualRefresh) {
        const toastMessage = data.length
          ? `Fetched ${data.length} services.`
          : 'No services found'
        toast.success(toastMessage, { id: 'fetch-services' })
      }
      return data
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
  Service,
  { rejectValue: RejectError }
>('service/storeCreateService', async (serviceData, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post('/api/service', serviceData)
    console.log('storeCreateService: Response =', response)
    const { data, success, errorDetail, message } = response.data
    if (success && data) {
      toast.success(message || 'Service created successfully', {
        id: 'create-service',
      })
      return data
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
  { id: string; data: Service },
  { rejectValue: RejectError }
>('service/updateService', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosApi.put(`/api/service/${id}`, data)
    const { data: responseData, success, errorDetail, message } = response.data
    if (success && responseData) {
      toast.success(message || 'Service updated successfully', {
        id: 'update-service',
      })
      return responseData
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
    const response = await axiosApi.delete(`/api/service/${id}`)
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
    setActiveFilter: (
      state,
      action: PayloadAction<ServiceState['activeFilter']>,
    ) => {
      state.activeFilter = action.payload
      state.filteredServices = filterServices(state.services, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state, action) => {
        state.error = null
        state.message = null
        state.hasFetched = false
        state[action.meta.arg ? 'isRefreshing' : 'isLoading'] = true
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.isRefreshing = false
        state.services = action.payload
        state.filteredServices = filterServices(
          action.payload,
          state.activeFilter,
        )
        state.serviceOptions = generateServiceOptions(action.payload)
        state.error = null
        state.message = null
        state.hasFetched = true
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false
        state.isRefreshing = false
        state.error = action.payload?.error || 'Failed to fetch services'
        state.message = action.payload?.message || null
        state.hasFetched = false
        state.filteredServices = []
        state.serviceOptions = []
      })
      .addCase(storeCreateService.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.message = null
        state.success = false
      })
      .addCase(storeCreateService.fulfilled, (state, action) => {
        state.isLoading = false
        state.services.push(action.payload)
        state.filteredServices = filterServices(
          state.services,
          state.activeFilter,
        )
        state.serviceOptions = generateServiceOptions(state.services)
        state.error = null
        state.message = null
        state.success = true
      })
      .addCase(storeCreateService.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.error || 'Failed to create service'
        state.message = action.payload?.message || null
        state.success = false
      })
      .addCase(updateService.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.message = null
        state.success = false
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false
        state.services = state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service,
        )
        state.filteredServices = filterServices(
          state.services,
          state.activeFilter,
        )
        state.serviceOptions = generateServiceOptions(state.services)
        state.error = null
        state.message = null
        state.success = true
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.error || 'Failed to update service'
        state.message = action.payload?.message || null
        state.success = false
      })
      .addCase(deleteService.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.message = null
        state.success = false
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false
        state.services = state.services.filter(
          (service) => service.id !== action.payload,
        )
        state.filteredServices = filterServices(
          state.services,
          state.activeFilter,
        )
        state.serviceOptions = generateServiceOptions(state.services)
        state.error = null
        state.message = null
        state.success = true
        state.currentService = null
      })
      .addCase(deleteService.rejected, (state, action) => {
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
  closeServiceForm,
  openServiceDeleteForm,
  setCurrentService,
  setActiveFilter,
} = serviceSlice.actions

export { fetchServices, storeCreateService, updateService, deleteService }

export default serviceSlice.reducer
