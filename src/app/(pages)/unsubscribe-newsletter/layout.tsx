import type { Metadata } from "next"
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer"

export const metadata: Metadata = {
  title: "Hygieia | Unsubscribe",
  description: "Manage your newsletter subscription preferences.",
}

export default function UnsubscribeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
