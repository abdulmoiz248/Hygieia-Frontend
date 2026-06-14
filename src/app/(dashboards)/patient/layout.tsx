// app/patient/layout.tsx
import { DashboardLayout } from "@/components/patient dashboard/dashboard-layout"
import type { Metadata } from "next"
import { PatientProvider } from "@/Providers/PatientProvider"
import { PatientToastContainer } from "@/toasts/PatientToast"
import AuthGuard from "@/components/auth/AuthGuard"
import PatientProfileGuard from "@/components/auth/PatientProfileGuard"
import DashboardSessionGuard from "@/components/auth/DashboardSessionGuard"

export const metadata: Metadata = {
  title: "Patient | Hygieia",
  description: "Comprehensive patient dashboard for managing health records, appointments, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard>
      <DashboardSessionGuard expectedRole="patient">
        <PatientProvider>
          <PatientToastContainer />
          <DashboardLayout>
            <PatientProfileGuard>{children}</PatientProfileGuard>
          </DashboardLayout>
        </PatientProvider>
      </DashboardSessionGuard>
    </AuthGuard>
  )
}
