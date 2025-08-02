import { configureStore } from "@reduxjs/toolkit"
import profileReducer from "@/types/patient/profileSlice"
import notificationsReducer from '@/types/patient/notificationSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    notifications:notificationsReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
