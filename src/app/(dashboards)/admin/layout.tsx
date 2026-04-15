import type { Metadata } from "next"
import { DashboardLayout } from "@/components/admin/layout/DashboardLayout"
import ReactQueryProvider from "@/Providers/ReactQueryProvider"

export const metadata: Metadata = {
  title: "Admin | Hygieia",
  description: "Admin dashboard for managing the Hygieia platform.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ReactQueryProvider>
  )
}