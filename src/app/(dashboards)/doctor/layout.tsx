import { DoctorDashboardLayout } from "@/components/doctor-portal/layout/DashboardLayout"
import ReactQueryProvider from "@/Providers/ReactQueryProvider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Doctor | Hygieia",
  description:
    "Comprehensive doctor dashboard for managing patients, prescriptions, and consultations.",
}

export default function DoctorRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ReactQueryProvider>
      <DoctorDashboardLayout>{children}</DoctorDashboardLayout>
    </ReactQueryProvider>
  )
}
