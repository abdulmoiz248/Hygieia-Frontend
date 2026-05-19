import type { Metadata } from "next"
import { PatientToastContainer } from "@/toasts/PatientToast"
import LabTestProviders from "@/components/lab-tests/labTestProvider"

export const metadata: Metadata = {
  title: "Lab Tests | Hygieia",
  description: "Browse, book, and manage diagnostic lab tests with clear instructions, pricing, and secure results.",
}

export default function LabTestsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LabTestProviders>
      {children}
      <PatientToastContainer />
    </LabTestProviders>
  )
}