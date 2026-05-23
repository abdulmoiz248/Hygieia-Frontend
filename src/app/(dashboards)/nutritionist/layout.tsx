// app/nutritionist/layout.tsx
import { DashboardLayout } from "@/components/nutritionist/layout/DashboardLayout"
import ReactQueryProvider from "@/Providers/ReactQueryProvider"
import type { Metadata } from "next"
import AuthGuard from "@/components/auth/AuthGuard"
import NutritionistProfileGuard from "@/components/auth/NutritionistProfileGuard"

export const metadata: Metadata = {
  title: "Nutritionist | Hygieia",
  description: "Comprehensive nutritionist dashboard for managing diet plans, client progress, and consultations.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ReactQueryProvider>
      <AuthGuard>
        <DashboardLayout>
          <NutritionistProfileGuard>{children}</NutritionistProfileGuard>
        </DashboardLayout>
      </AuthGuard>
    </ReactQueryProvider>
  )
}