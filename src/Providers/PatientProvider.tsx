'use client'
import { store } from "@/store/patient/store"
import { Provider } from "react-redux"
export function PatientProvider({ children }: { children: React.ReactNode }) {
  return (
     <Provider store={store}>
    
         {children}
       
         </Provider>
  )
}
