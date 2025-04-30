import Link from "next/link"
import { Bot, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layouts/landing-page/navbar"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar/>

      {/* Main content */}
      <main className="flex-grow pt-14 bg-soft-blue flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 relative">
            {/* Decorative background circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2A5C82]/10 to-[#34C759]/10 rounded-full transform scale-150 blur-xl"></div>

            {/* 404 text */}
            <h1 className="text-9xl font-bold text-[#2A5C82] relative">404</h1>

            {/* Heartbeat line */}
            <div className="w-full h-12 relative">
              <svg viewBox="0 0 400 100" className="w-full h-full">
                <path
                  d="M0,50 L60,50 L80,20 L100,80 L120,20 L140,80 L160,50 L240,50 L260,20 L280,80 L300,20 L320,80 L340,50 L400,50"
                  fill="none"
                  stroke="#34C759"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>

          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on the path to wellness.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#2A5C82] hover:bg-[#234b6a] flex items-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                <span>Go to Homepage</span>
              </Link>
            </Button>

           
          </div>

          {/* Health tip */}
          <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#2A5C82] mb-2">Health Tip While You're Here</h3>
            <p className="text-gray-600">
              Taking short breaks to stand up and stretch can improve circulation and reduce strain on your eyes. Try
              the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
