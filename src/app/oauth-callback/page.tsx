'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const OAuthCallbackPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('token', token)
      router.push('/patient/dashboard')
    } else {
      router.push('/patient/login') // fallback if no token
    }
  }, [searchParams, router])

  return <p className="text-center text-white">Logging you in via Google...</p>
}

export default OAuthCallbackPage
