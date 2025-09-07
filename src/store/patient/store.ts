import { configureStore } from "@reduxjs/toolkit"
import profileReducer from "@/types/patient/profileSlice"
import notificationsReducer from '@/types/patient/notificationSlice'
import fitnessReducer from '@/types/patient/fitnessSlice'
import medicineReducer from '@/types/patient/medicineSlice'
import appointmentsReducer from '@/types/patient/appointmentsSlice'
import labTestsReducer from '@/types/patient/labTestsSlice'
import medicalRecordsReducer from '@/types/patient/medicalRecordsSlice'
import chatSliceReducer from '@/types/patient/ChatSlice'
import dietReducer from '@/types/patient/dietSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    notifications:notificationsReducer,
    fitness:fitnessReducer,
    medicine:medicineReducer,
    appointments: appointmentsReducer,
    labTests:labTestsReducer,
    medicalRecords:medicalRecordsReducer,
     chat: chatSliceReducer,
      diet: dietReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
