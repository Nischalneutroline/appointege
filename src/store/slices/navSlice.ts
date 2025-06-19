// redux Toolkit store for tracking mobile hamburger menu
import { createSlice } from '@reduxjs/toolkit'

// initial state
interface NavState {
  mobileNavCollapse: boolean
  desktopNavCollapse: boolean
}

const initialState: NavState = {
  mobileNavCollapse: false,
  desktopNavCollapse: false,
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
  },
})

export const { toggleMobileNav, toggleDesktopNav } = navSlice.actions
export default navSlice.reducer
