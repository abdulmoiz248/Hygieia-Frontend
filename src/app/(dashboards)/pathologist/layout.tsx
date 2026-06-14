// app/lab-tech/layout.tsx
import type { Metadata } from "next"
import LabLayout from "@/components/lab-tech/LabLayout"
import ReactQueryProvider from "@/Providers/ReactQueryProvider"
import AuthGuard from "@/components/auth/AuthGuard"
import LabTechProfileGuard from "@/components/auth/LabTechProfileGuard"
import DashboardSessionGuard from "@/components/auth/DashboardSessionGuard"

export const metadata: Metadata = {
  title: "Pathologist | Hygieia",
  description: "Comprehensive Pathologist dashboard for managing health records and more.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthGuard>
        <DashboardSessionGuard expectedRole="pathologist">
          <LabLayout>
            <LabTechProfileGuard>{children}</LabTechProfileGuard>
          </LabLayout>
        </DashboardSessionGuard>
      </AuthGuard>
    </ReactQueryProvider>
  )
}
