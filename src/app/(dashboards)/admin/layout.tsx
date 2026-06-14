import type { Metadata } from "next"
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout"
import ReactQueryProvider from "@/Providers/ReactQueryProvider"
import AuthGuard from "@/components/auth/AuthGuard"
import DashboardSessionGuard from "@/components/auth/DashboardSessionGuard"

export const metadata: Metadata = {
  title: "Admin | Hygieia",
  description: "Admin dashboard for managing the Hygieia platform.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthGuard>
        <DashboardSessionGuard expectedRole="admin">
          <DashboardLayout>{children}</DashboardLayout>
        </DashboardSessionGuard>
      </AuthGuard>
    </ReactQueryProvider>
  )
}
