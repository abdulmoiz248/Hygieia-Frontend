// app/layout.tsx
import type { Metadata } from "next"
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer"

export const metadata: Metadata = {
  title: " Appointment Review | Hygieia",
  description:
    "Review your appointment details and provide feedback about your experience with the healthcare provider.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
 
    <>
      <Navbar />
      {children}
      <Footer />  

    </>
  )
}
