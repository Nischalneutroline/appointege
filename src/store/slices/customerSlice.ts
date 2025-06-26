// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Appointment } from '@/data/appointment'
// import { appointments } from '@/data/appointment'
// import { User } from '@/app/(protected)/admin/customer/_types/customer'

// interface CusotmerState {
//   cusotmers: User[]
//   currentCustomer: User | null
//   isFormOpen: boolean
//   customerFormMode: 'create' | 'edit' | 'view' | 'delete' | null
// }

// // Get initial state from your data file
// const initialState: CusotmerState = {
//   cusotmers: [],
//   currentCustomer: null,
//   isFormOpen: false,
//   customerFormMode: null,
// }

// const customerSlice = createSlice({
//   name: 'customer',
//   initialState,
//   reducers: {
//     // Open form in create mode
//     openCustomerCreateForm: (state) => {
//       state.isFormOpen = true
//       state.customerFormMode = 'create'
//       state.currentCustomer = null
//     },

//     // Open form in edit mode
//     openCustomerEditForm: (state, action: PayloadAction<User>) => {
//       state.isFormOpen = true
//       state.customerFormMode = 'edit'
//       state.currentCustomer = action.payload
//     },

//     // Open form in view mode
//     openCustomerViewForm: (state, action: PayloadAction<User>) => {
//       state.isFormOpen = true
//       state.customerFormMode = 'view'
//       state.currentCustomer = action.payload
//     },

//     // Open modal in delete mode
//     openCustomerDeleteForm: (state, action: PayloadAction<User>) => {
//       state.isFormOpen = true
//       state.customerFormMode = 'delete'
//       state.currentCustomer = action.payload
//     },

//     // Close form
//     closeCustomerForm: (state) => {
//       state.isFormOpen = false
//       state.customerFormMode = null
//       state.currentCustomer = null
//     },

//     // // Add new appointment
//     // addAppointment: (state, action: PayloadAction<Omit<Appointment, 'id'>>) => {
//     //   const newId = Math.max(0, ...state.appointments.map((a) => a.id)) + 1
//     //   state.appointments.push({
//     //     id: newId,
//     //     ...action.payload,
//     //   })
//     //   state.isFormOpen = false
//     // },

//     // // Update existing appointment
//     // updateAppointment: (state, action: PayloadAction<Appointment>) => {
//     //   const index = state.appointments.findIndex(
//     //     (a) => a.id === action.payload.id,
//     //   )
//     //   if (index !== -1) {
//     //     state.appointments[index] = action.payload
//     //   }
//     //   state.isFormOpen = false
//     // },

//     // // Delete appointment
//     // deleteAppointment: (state, action: PayloadAction<number>) => {
//     //   state.appointments = state.appointments.filter(
//     //     (a) => a.id !== action.payload,
//     //   )
//     // },

//     // Set current appointment (for view/edit)
//     setCurrentCustomer: (state, action: PayloadAction<User | null>) => {
//       state.currentCustomer = action.payload
//     },
//   },
// })

// export const {
//   openCustomerCreateForm,
//   openCustomerEditForm,
//   openCustomerViewForm,
//   closeCustomerForm,
//   openCustomerDeleteForm,
//   //   addAppointment,
//   //   updateAppointment,
//   //   deleteAppointment,
//   //   setCurrentCustomer,
// } = customerSlice.actions

// export default customerSlice.reducer

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { axiosApi } from '@/lib/baseUrl'
import { toast } from 'sonner'
import { User } from '@/app/(protected)/admin/customer/_types/customer'

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

interface CustomerState {
  customers: User[]
  filteredCustomers: User[]
  isLoading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  currentCustomer: User | null
  isFormOpen: boolean
  customerFormMode: 'create' | 'edit' | 'view' | 'delete' | null
  error: string | null
  message: string | null
  success: boolean
  activeFilter: 'all' | 'active' | 'inactive'
}

const initialState: CustomerState = {
  customers: [],
  filteredCustomers: [],
  isLoading: false,
  isRefreshing: false,
  hasFetched: false,
  currentCustomer: null,
  isFormOpen: false,
  customerFormMode: null,
  error: null,
  message: null,
  success: false,
  activeFilter: 'all',
}

const filterCustomers = (
  customers: User[],
  activeFilter: CustomerState['activeFilter'],
): User[] => {
  if (!Array.isArray(customers)) {
    console.warn('customers is not an array:', customers)
    return []
  }

  return customers.filter((item) => {
    switch (activeFilter) {
      case 'active':
        return item.isActive === true
      case 'inactive':
        return item.isActive === false
      case 'all':
        return true
      default:
        return true
    }
  })
}

const fetchCustomers = createAsyncThunk<
  User[],
  boolean,
  { rejectValue: RejectError }
>('customer/fetchCustomers', async (isManualRefresh, { rejectWithValue }) => {
  try {
    console.log('Fetching customers in thunk...', { isManualRefresh })
    const response = (await axiosApi.get('/api/user')) as AxioxResponseType<
      User[]
    >
    const { data, success, errorDetail, message } = response.data
    console.log('fetchCustomers: Response data =', data)
    if (success && Array.isArray(data)) {
      if (isManualRefresh) {
        const toastMessage = data.length
          ? `Fetched ${data.length} customers.`
          : 'No customers found'
        toast.success(toastMessage, { id: 'fetch-customer' })
      }
      return data
    }
    if (isManualRefresh) {
      toast.error(message || 'Failed to fetch customers', {
        id: 'fetch-customer',
        duration: 3000,
        description: 'Please check the server or try again later.',
      })
    }
    return rejectWithValue({
      error: errorDetail || 'Failed to fetch customers',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    if (isManualRefresh) {
      toast.error(errorMsg, {
        id: 'fetch-customer',
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

const storeCreateCustomer = createAsyncThunk<
  User,
  User,
  { rejectValue: RejectError }
>('customer/storeCreateCustomer', async (customerData, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post('/api/user', customerData)
    console.log('storeCreateCustomer: Response =', response)
    const { data, success, errorDetail, message } = response.data
    if (success && data) {
      toast.success(message || 'Customer created successfully', {
        id: 'create-customer',
      })
      return data
    }
    toast.error(message || 'Failed to create customer', {
      id: 'create-customer',
    })
    return rejectWithValue({
      error: errorDetail || 'Failed to create customer',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    toast.error(errorMsg, { id: 'create-customer' })
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const updateCustomer = createAsyncThunk<
  User,
  { id: string; data: User },
  { rejectValue: RejectError }
>('customer/updateCustomer', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosApi.put(`/api/user/${id}`, data)
    const { data: responseData, success, errorDetail, message } = response.data
    if (success && responseData) {
      toast.success(message || 'Customer updated successfully', {
        id: 'update-customer',
      })
      return responseData
    }
    toast.error(message || 'Failed to update customer', {
      id: 'update-customer',
    })
    return rejectWithValue({
      error: errorDetail || 'Failed to update customer',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    toast.error(errorMsg, { id: 'update-customer' })
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const deleteCustomer = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectError }
>('customer/deleteCustomer', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosApi.delete(`/api/user/${id}`)
    const { success, errorDetail, message } = response.data
    if (success) {
      toast.success(message || 'Customer deleted successfully', {
        id: 'delete-customer',
      })
      return id
    }
    toast.error(message || 'Failed to delete customer', {
      id: 'delete-customer',
    })
    return rejectWithValue({
      error: errorDetail || 'Failed to delete customer',
      message: message || null,
    })
  } catch (error: any) {
    const errorMsg =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : 'An unknown error occurred'
    toast.error(errorMsg, { id: 'delete-customer' })
    return rejectWithValue({
      error: error.message,
      message: errorMsg,
    })
  }
})

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    openCustomerCreateForm: (state) => {
      state.isFormOpen = true
      state.customerFormMode = 'create'
      state.currentCustomer = null
    },
    openCustomerEditForm: (state, action: PayloadAction<User>) => {
      state.isFormOpen = true
      state.customerFormMode = 'edit'
      state.currentCustomer = action.payload
    },
    openCustomerViewForm: (state, action: PayloadAction<User>) => {
      state.isFormOpen = true
      state.customerFormMode = 'view'
      state.currentCustomer = action.payload
    },
    openCustomerDeleteForm: (state, action: PayloadAction<User>) => {
      state.isFormOpen = true
      state.customerFormMode = 'delete'
      state.currentCustomer = action.payload
    },
    closeCustomerForm: (state) => {
      state.isFormOpen = false
      state.customerFormMode = null
      state.currentCustomer = null
      state.success = false
    },
    setCurrentCustomer: (state, action: PayloadAction<User | null>) => {
      state.currentCustomer = action.payload
    },
    setActiveFilter: (
      state,
      action: PayloadAction<CustomerState['activeFilter']>,
    ) => {
      state.activeFilter = action.payload
      state.filteredCustomers = filterCustomers(state.customers, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.pending, (state, action) => {
      state.error = null
      state.message = null
      state.hasFetched = false
      state[action.meta.arg ? 'isRefreshing' : 'isLoading'] = true
    })
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.isLoading = false
      state.isRefreshing = false
      state.customers = action.payload
      state.filteredCustomers = filterCustomers(
        action.payload,
        state.activeFilter,
      )
      state.error = null
      state.message = null
      state.hasFetched = true
    })
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.isLoading = false
      state.isRefreshing = false
      state.error = action.payload?.error || 'Failed to fetch customers'
      state.message = action.payload?.message || null
      state.hasFetched = false
      state.filteredCustomers = []
    })
    builder.addCase(storeCreateCustomer.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(storeCreateCustomer.fulfilled, (state, action) => {
      state.isLoading = false
      state.customers.push(action.payload)
      state.filteredCustomers = filterCustomers(
        state.customers,
        state.activeFilter,
      )
      state.error = null
      state.message = null
      state.success = true
    })
    builder.addCase(storeCreateCustomer.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to create customer'
      state.message = action.payload?.message || null
      state.success = false
    })
    builder.addCase(updateCustomer.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.isLoading = false
      state.customers = state.customers.map((customer) =>
        customer.id === action.payload.id ? action.payload : customer,
      )
      state.filteredCustomers = filterCustomers(
        state.customers,
        state.activeFilter,
      )
      state.error = null
      state.message = null
      state.success = true
    })
    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to update customer'
      state.message = action.payload?.message || null
      state.success = false
    })
    builder.addCase(deleteCustomer.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.isLoading = false
      state.customers = state.customers.filter(
        (customer) => customer.id !== action.payload,
      )
      state.filteredCustomers = filterCustomers(
        state.customers,
        state.activeFilter,
      )
      state.error = null
      state.message = null
      state.success = true
      state.currentCustomer = null
    })
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.error || 'Failed to delete customer'
      state.message = action.payload?.message || null
      state.success = false
    })
  },
})

export const {
  openCustomerCreateForm,
  openCustomerEditForm,
  openCustomerViewForm,
  closeCustomerForm,
  openCustomerDeleteForm,
  setCurrentCustomer,
  setActiveFilter,
} = customerSlice.actions

export { fetchCustomers, storeCreateCustomer, updateCustomer, deleteCustomer }

export default customerSlice.reducer
