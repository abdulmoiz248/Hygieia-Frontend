// app/doctor/layout.tsx
import { DoctorDashboardLayout } from "@/components/doctor-portal/layout/DashboardLayout"
import ReactQueryProvider from "@/Providers/ReactQueryProvider"
import type { Metadata } from "next"
import AuthGuard from "@/components/auth/AuthGuard"
import DoctorProfileGuard from "@/components/auth/DoctorProfileGuard"

export const metadata: Metadata = {
  title: "Doctor | Hygieia",
  description: "Comprehensive doctor dashboard for managing patients, prescriptions, and consultations.",
}

export default function DoctorRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ReactQueryProvider>
      <AuthGuard>
        <DoctorDashboardLayout>
          <DoctorProfileGuard>{children}</DoctorProfileGuard>
        </DoctorDashboardLayout>
      </AuthGuard>
    </ReactQueryProvider>
  )
}