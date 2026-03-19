"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { usePatientProfileStore } from "@/store/patient/profile-store"

function PatientBootstrap() {
  const fetchInitialProfile = usePatientProfileStore((state) => state.fetchInitialProfile)

  useEffect(() => {
    fetchInitialProfile()
  }, [fetchInitialProfile])

  return null
}

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <PatientBootstrap />
      {children}
    </QueryClientProvider>
  )
}
