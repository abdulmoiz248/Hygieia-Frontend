import type { Metadata } from "next"
import LabLayout from "@/components/lab-tech/LabLayout"

export const metadata: Metadata = {
  title: "Lab Technician | Hygieia",
  description:
    "Comprehensive Lab Technician dashboard for managing health records and more.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LabLayout >{children}</LabLayout>
}
