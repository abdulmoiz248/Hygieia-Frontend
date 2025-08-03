import { configureStore } from "@reduxjs/toolkit"
import profileReducer from "@/types/patient/profileSlice"
import notificationsReducer from '@/types/patient/notificationSlice'
import fitnessReducer from '@/types/patient/fitnessSlice'
import medicineReducer from '@/types/patient/medicineSlice'
import appointmentsReducer from '@/types/patient/appointmentsSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    notifications:notificationsReducer,
    fitness:fitnessReducer,
    medicine:medicineReducer,
    appointments: appointmentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
