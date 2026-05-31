import type { Metadata } from "next"
import { PatientToastContainer } from "@/toasts/PatientToast"
import LabTestProviders from "@/components/lab-tests/labTestProvider"
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer";


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
      <Navbar />
      {children}
      <Footer />
      <PatientToastContainer />
    </LabTestProviders>
  )
}