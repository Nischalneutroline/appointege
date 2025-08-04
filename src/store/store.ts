// store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import navReducer from './slices/navSlice'
import viewReducer from './slices/viewSlice'
import appointmentReducer from './slices/appointmentSlice'
import serviceReducer from './slices/serviceslice'
import customerReducer from './slices/customerSlice'
import businessReducer from './slices/businessSlice'
import faqReducer from './slices/faqSlice'
import createReminderSlice from './slices/reminderSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    nav: navReducer,
    view: viewReducer,
    appointment: appointmentReducer,
    service: serviceReducer,
    customer: customerReducer,
    business: businessReducer,
    faq: faqReducer,
    reminder: createReminderSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// To survive the whole page reload
// // store/store.ts
// import { configureStore } from '@reduxjs/toolkit'
// import businessReducer from './slices/businessSlice'
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['business'], // only persist business slice
// }

// const persistedBusinessReducer = persistReducer(persistConfig, businessReducer)

// export const store = configureStore({
//   reducer: {
//     business: persistedBusinessReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// })

// export const persistor = persistStore(store)

// export type AppDispatch = typeof store.dispatch
// export type RootState = ReturnType<typeof store.getState>
