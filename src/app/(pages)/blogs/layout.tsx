// app/layout.tsx
import type { Metadata } from "next"
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer"
import ReactQueryProvider from "@/Providers/BlogsQueryProvider"

export const metadata: Metadata = {
  title: "Blogs | Hygieia",
  description:
    "Explore insightful health articles, AI trends in medicine, wellness tips, and expert opinions on the Hygieia Blogs page.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <Navbar />
      {children}
      <Footer />
    </ReactQueryProvider>
  )
}
