import type { Metadata } from "next"
import LabLayout from "@/components/lab-tech/LabLayout"
import ReactQueryProvider from "@/Providers/BlogsQueryProvider"

export const metadata: Metadata = {
  title: "Pathologist | Hygieia",
  description:
    "Comprehensive Pathologist dashboard for managing health records and more.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <LabLayout>{children}</LabLayout>
    </ReactQueryProvider>
  )
}
