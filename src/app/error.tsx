"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Bot, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layouts/landing-page/navbar"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
    <Navbar/>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-16 bg-soft-blue">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            {/* Error icon */}
            <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Something Went Wrong</h1>

            <div className="flex items-center justify-center mb-4">
              <div className="h-1 w-16 bg-gradient-to-r from-[#2A5C82] to-[#34C759] rounded-full"></div>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            We apologize for the inconvenience. Our system encountered an unexpected error.
            {error.digest && <span className="block mt-2 text-sm text-gray-500">Error ID: {error.digest}</span>}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => reset()} className="bg-[#34C759] hover:bg-[#2cb74e] flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>

            <Button asChild className="bg-[#2A5C82] hover:bg-[#234b6a] flex items-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </Link>
            </Button>
          </div>

          {/* Health tip */}
          <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#2A5C82] mb-2">Wellness Reminder</h3>
            <p className="text-gray-600">
              Moments of frustration are good opportunities to practice deep breathing. Try inhaling slowly for 4
              counts, holding for 4, and exhaling for 6 counts to help reduce stress.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
