import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { getBaseUrl } from '@/lib/baseUrl'
import { toast } from 'sonner'
import { CustomerFilterValue } from '@/app/(protected)/admin/customer/_data/data'
import {
  CustomerStatus,
  PostCustomerData,
  Role,
  User,
} from '@/app/(protected)/admin/customer/_types/customer'
import { getRandomAvatarColor } from '@/utils/randomColor.util'
import { AxioxResponseType } from '@/types/shared'

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

interface RejectError {
  error: any | null
  message: string | null
}

interface CustomerCounts {
  guest: number
  member: number
  active: number
  inactive: number
  all: number
}

export interface FilterOptionState {
  label: string
  value: CustomerFilterValue
  textColor: string
  border: string
  background: string
  icon: string
}

interface CustomerState {
  customers: User[]
  filteredCustomers: User[]
  counts: CustomerCounts
  filterOptions: FilterOptionState[]
  isLoading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  currentCustomer: User | null
  isFormOpen: boolean
  customerFormMode: 'create' | 'edit' | 'view' | 'delete' | null
  error: string | null
  message: string | null
  success: boolean
  activeFilter: CustomerFilterValue
  activeFilters: CustomerFilterValue[]
}

const initialState: CustomerState = {
  customers: [],
  filteredCustomers: [],
  counts: {
    guest: 0,
    member: 0,
    active: 0,
    inactive: 0,
    all: 0,
  },
  filterOptions: [
    {
      label: 'Guest',
      value: 'guest',
      textColor: '#0F5327',
      border: '#E6F4EC',
      background: '#E9F9EF',
      icon: 'UserRoundMinus',
    },
    {
      label: 'Member',
      value: 'member',
      textColor: '#7F1D1D',
      border: '#FEE2E2',
      background: '#FEF2F2',
      icon: 'UserRoundPlus',
    },
    {
      label: 'Active',
      value: 'active',
      textColor: '#103064',
      border: '#DCE9F9',
      background: '#E9F1FD',
      icon: 'ShieldUser',
    },
    {
      label: 'Inactive',
      value: 'inactive',
      textColor: '#4C3000',
      border: '#FFF3CD',
      background: '#FFF6E6',
      icon: 'UserCog',
    },
    {
      label: 'All',
      value: 'all',
      textColor: '#103064',
      border: '#E9DFFF',
      background: '#F0EBFB',
      icon: 'UsersRound',
    },
  ],
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
  activeFilters: ['guest', 'member', 'all'],
}

export const ACTIVE_DURATION_DAYS = 60 // Configurable active duration in days
export const ACTIVE_DURATION_MS = ACTIVE_DURATION_DAYS * 24 * 60 * 60 * 1000 // Convert to milliseconds
export const MS_PER_DAY = 24 * 60 * 60 * 1000 // Milliseconds per day

export const filterCustomers = (
  customers: User[],
  activeFilter: CustomerFilterValue,
): { filtered: User[]; counts: CustomerCounts } => {
  if (!Array.isArray(customers)) {
    console.warn('customers is not an array:', customers)
    return {
      filtered: [],
      counts: {
        guest: 0,
        member: 0,
        active: 0,
        inactive: 0,
        all: 0,
      },
    }
  }

  console.log(
    'filterCustomers: Current time =',
    new Date(Date.now()).toISOString(),
  )
  console.log('filterCustomers: Input customers =', customers)
  console.log('filterCustomers: Active filter =', activeFilter)

  const counts: CustomerCounts = {
    guest: 0,
    member: 0,
    active: 0,
    inactive: 0,
    all: customers.length,
  }

  const validStatuses = [Role.GUEST, Role.USER]

  const filtered = customers
    .map((item) => {
      const timeDiffMs = item.lastActive
        ? Date.now() - new Date(item.lastActive).getTime()
        : Number.MAX_SAFE_INTEGER // Use max value if lastActive is missing
      const timeDiffDays = timeDiffMs / MS_PER_DAY

      const isUserActive =
        item.lastActive &&
        !isNaN(new Date(item.lastActive).getTime()) &&
        timeDiffMs <= ACTIVE_DURATION_MS

      const isValidStatus = validStatuses.includes(item.role)

      const statuses: CustomerStatus[] = []

      console.log(
        `Customer ${item.id}: lastActive=${item.lastActive}, isUserActive=${isUserActive}, timeDiff=${timeDiffDays.toFixed(2)} days, role=${item.role}`,
      )

      if (isUserActive) {
        counts.active += 1
        statuses.push(CustomerStatus.ACTIVE)
      } else {
        counts.inactive += 1
        statuses.push(CustomerStatus.INACTIVE)
      }

      if (isValidStatus && item.role === Role.GUEST) {
        counts.guest += 1
        statuses.push(CustomerStatus.GUEST)
      }
      if (isValidStatus && item.role === Role.USER) {
        counts.member += 1
        statuses.push(CustomerStatus.MEMBER)
      }

      console.log(`Customer ${item.id}: statuses=`, statuses)

      return { ...item, status: statuses }
    })
    .filter((item) => {
      const isValidStatus = validStatuses.includes(item.role)
      switch (activeFilter) {
        case 'active':
          return item.status?.includes(CustomerStatus.ACTIVE) // No role restriction
        case 'inactive':
          return item.status?.includes(CustomerStatus.INACTIVE) // No role restriction
        case 'guest':
          return isValidStatus && item.role === Role.GUEST
        case 'member':
          return isValidStatus && item.role === Role.USER
        case 'all':
          return true
        default:
          return true
      }
    })

  console.log('filterCustomers: Filtered customers =', filtered)
  console.log('filterCustomers: Counts =', counts)

  return { filtered, counts }
}

const fetchCustomers = createAsyncThunk<
  User[],
  boolean,
  { rejectValue: RejectError }
>('customer/fetchCustomers', async (isManualRefresh, { rejectWithValue }) => {
  try {
    console.log('Fetching customers in thunk...', { isManualRefresh })
    const response = (await api.get('/api/user')) as AxioxResponseType<User[]>
    const { data, success, errorDetail, message } = response.data
    console.log('fetchCustomers: Response data =', data)
    if (success && Array.isArray(data)) {
      const normalizedData = data.map((customer) => ({
        ...customer,
        color: getRandomAvatarColor(),
      }))
      if (isManualRefresh) {
        const toastMessage = normalizedData.length
          ? `Fetched ${normalizedData.length} customers.`
          : 'No customers found'
        toast.success(toastMessage, { id: 'fetch-customers' })
      }
      return normalizedData
    }
    if (isManualRefresh) {
      toast.error(message || 'Failed to fetch customers', {
        id: 'fetch-customers',
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
        id: 'fetch-customers',
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
  PostCustomerData,
  { rejectValue: RejectError }
>('customer/storeCreateCustomer', async (customerData, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/user', customerData)
    console.log('storeCreateCustomer: Response data =', response)
    const { data, success, errorDetail, message } = response.data

    if (success && data) {
      toast.success(message || 'Customer created successfully', {
        id: 'create-customer',
      })
      return {
        ...data,
        color: getRandomAvatarColor(),
      }
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
  { id: string; data: PostCustomerData },
  { rejectValue: RejectError }
>('customer/updateCustomer', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/user/${id}`, data)
    const { data: responseData, success, errorDetail, message } = response.data
    if (success && responseData) {
      toast.success(message || 'Customer updated successfully', {
        id: 'update-customer',
      })
      return {
        ...responseData,
        color: responseData.color || getRandomAvatarColor(),
      }
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
    const response = await api.delete(`/api/user/${id}`)
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
    setActiveFilter: (state, action: PayloadAction<CustomerFilterValue>) => {
      state.activeFilter = action.payload
      const { filtered, counts } = filterCustomers(
        state.customers,
        action.payload,
      )
      console.log({ filtered, counts })

      state.filteredCustomers = filtered
      state.counts = counts
    },
    setActiveFilters: (state, action: PayloadAction<CustomerFilterValue[]>) => {
      state.activeFilters = action.payload
      state.activeFilter = action.payload.length > 0 ? action.payload[0] : 'all'
      const { filtered, counts } = filterCustomers(
        state.customers,
        state.activeFilter,
      )
      state.filteredCustomers = filtered
      state.counts = counts
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
      const { filtered, counts } = filterCustomers(
        action.payload,
        state.activeFilter,
      )
      state.filteredCustomers = filtered
      state.counts = counts
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
      state.counts = {
        guest: 0,
        member: 0,
        active: 0,
        inactive: 0,
        all: 0,
      }
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
      const { filtered, counts } = filterCustomers(
        state.customers,
        state.activeFilter,
      )
      state.filteredCustomers = filtered
      state.counts = counts
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
      const { filtered, counts } = filterCustomers(
        state.customers,
        state.activeFilter,
      )
      state.filteredCustomers = filtered
      state.counts = counts
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
      const { filtered, counts } = filterCustomers(
        state.customers,
        state.activeFilter,
      )
      state.filteredCustomers = filtered
      state.counts = counts
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
  openCustomerDeleteForm,
  closeCustomerForm,
  setCurrentCustomer,
  setActiveFilter,
  setActiveFilters,
} = customerSlice.actions

export { fetchCustomers, storeCreateCustomer, updateCustomer, deleteCustomer }

export default customerSlice.reducer
