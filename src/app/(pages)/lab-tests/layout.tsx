import type { Metadata } from "next"
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer"
import LabTestProviders from "@/components/lab-tests/labTestProvider"

export const metadata: Metadata = {
  title: "Lab Tests | Hygieia",
  description: "Browse, book, and manage diagnostic lab tests with clear instructions, pricing, and secure results.",
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LabTestProviders>
          <Navbar />
          {children}
          <Footer />
        </LabTestProviders>
      </body>
    </html>
  )
}
