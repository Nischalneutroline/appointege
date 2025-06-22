// redux Toolkit store for tracking mobile hamburger menu
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// initial state
interface NavState {
  mobileNavCollapse: boolean
  desktopNavCollapse: boolean
  isMobileSidebarOpen: boolean
}

const initialState: NavState = {
  mobileNavCollapse: false,
  desktopNavCollapse: false,
  isMobileSidebarOpen: false,
}

// create slice
const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    toggleMobileNav(state) {
      state.mobileNavCollapse = !state.mobileNavCollapse
    },
    toggleDesktopNav(state) {
      state.desktopNavCollapse = !state.desktopNavCollapse
    },
    toggleMobileSidebar(state) {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen
    },
    closeMobileSidebar(state) {
      state.isMobileSidebarOpen = false
    },
    setMobileSidebar(state, action: PayloadAction<boolean>) {
      state.isMobileSidebarOpen = action.payload
    },
  },
})

export const {
  toggleMobileNav,
  toggleDesktopNav,
  toggleMobileSidebar,
  closeMobileSidebar,
  setMobileSidebar,
} = navSlice.actions
export default navSlice.reducer
