'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/patient/store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ExternalLink } from 'lucide-react'

export default function FitbitConnectButton() {
  const [loading, setLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useSelector((state: RootState) => state.profile)

  useEffect(() => {
    // Check if there's an error parameter in the URL
    const error = searchParams.get('error')
    if (error) {
      setShowErrorModal(true)
      // Clean up URL by removing the error parameter
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams])

  const handleFitbitConnect = () => {
    if (!user?.email) {
      alert('Please login first')
      router.push('/login')
      return
    }

    setLoading(true)
    
    // Redirect to backend Fitbit OAuth endpoint with user email
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001'
    window.location.href = `${backendUrl}/auth/fitbit?email=${encodeURIComponent(user.email)}`
  }

  return (
    <>
      <Button
        onClick={handleFitbitConnect}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-[#00B0B9] text-white rounded-lg hover:bg-[#009DA5] transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none" 
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
              />
            </svg>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <FitbitIcon />
            <span>Connect with Fitbit</span>
          </>
        )}
      </Button>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-dark-slate-gray">
              Fitbit Account Required
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-2">
              It looks like you don&apos;t have a Fitbit account yet. Please create a Fitbit account first to connect your fitness data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowErrorModal(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                window.open('https://www.fitbit.com/global/us/home', '_blank')
                setShowErrorModal(false)
              }}
              className="w-full sm:w-auto bg-[#00B0B9] hover:bg-[#009DA5] text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Create Fitbit Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Fitbit Icon Component
function FitbitIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 18c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3-3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-9-3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-15-3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
    </svg>
  )
}
