'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import GoogleLoginButton from '@/components/oAuth/GoogleLoginButton'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

import Cookies from 'js-cookie'

// Rate limiting constants
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export default  function Login() {
  


  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)
  const router=useRouter()

  // Load rate limit data from localStorage on mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts')
    const storedLockout = localStorage.getItem('lockoutUntil')
    
    if (storedAttempts) {
      setAttemptCount(parseInt(storedAttempts))
    }
    
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout)
      if (lockoutTime > Date.now()) {
        setLockoutUntil(lockoutTime)
      } else {
        // Clear expired lockout
        localStorage.removeItem('lockoutUntil')
        localStorage.removeItem('loginAttempts')
      }
    }
  }, [])

  // Update remaining time countdown
  useEffect(() => {
    if (lockoutUntil) {
      const timer = setInterval(() => {
        const remaining = lockoutUntil - Date.now()
        if (remaining <= 0) {
          setLockoutUntil(null)
          setAttemptCount(0)
          setRemainingTime(0)
          localStorage.removeItem('lockoutUntil')
          localStorage.removeItem('loginAttempts')
        } else {
          setRemainingTime(remaining)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [lockoutUntil])

  // Password validation checks
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }
  }, [password])

  const allChecksMet = useMemo(() => {
    return Object.values(passwordChecks).every(check => check)
  }, [passwordChecks])
 
  // Format remaining time for display
  const formatRemainingTime = () => {
    const minutes = Math.floor(remainingTime / 60000)
    const seconds = Math.floor((remainingTime % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Check if user is locked out
  if (lockoutUntil && lockoutUntil > Date.now()) {
    setError(`Too many failed attempts. Please try again in ${formatRemainingTime()}.`)
    return
  }

  if (!email || !password) {
    setError('Email and password are required.')
    return
  }
  if (!validateEmail(email)) {
    setError('Please enter a valid email.')
    return
  }

  // Validate password requirements
  if (!allChecksMet) {
    setError('Invalid email or password')
    return
  }

  setError('')
  setIsLoading(true)

  try {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data.data
    console.log(res)
    if (!data.success) {
      throw new Error(data.message || 'Login failed')
    } else {
      // Reset rate limiting on successful login
      setAttemptCount(0)
      setLockoutUntil(null)
      localStorage.removeItem('loginAttempts')
      localStorage.removeItem('lockoutUntil')
      
      const role = data.role.includes('lab') ? 'pathologist' : data.role.toLowerCase()
      
      // Store in cookies
      Cookies.set('token', data.accessToken, { expires: 7, sameSite: 'strict' })
      Cookies.set('role', role, { expires: 7, sameSite: 'strict' })
      Cookies.set('id', data.id, { expires: 7, sameSite: 'strict' })
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('id',data.id)
      localStorage.setItem('role',role)

      router.push(`/${role}/dashboard`)
    }

  } catch (err: any) {
    // Increment failed attempt count
    const newAttemptCount = attemptCount + 1
    setAttemptCount(newAttemptCount)
    localStorage.setItem('loginAttempts', newAttemptCount.toString())

    // Lock out after max attempts
    if (newAttemptCount >= MAX_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_DURATION
      setLockoutUntil(lockoutTime)
      localStorage.setItem('lockoutUntil', lockoutTime.toString())
      setError(`Too many failed attempts. Account locked for 5 minutes.`)
    } else {
      const remainingAttempts = MAX_ATTEMPTS - newAttemptCount
      setError(
        `${err?.response?.data?.message || 'Invalid email or password'}. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
      )
    }
  } finally {
    setIsLoading(false)
  }
}


 
  return (
   
      <div className="min-h-screen pt-14 flex items-center justify-center bg-gradient-to-b from-mint-green via-snow-white to-mint-green p-4">
        <Card className="w-full max-w-md bg-dark-slate-gray backdrop-blur-md border-0 shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-snow-white tracking-tight animate-slide-in-right">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-mint-green animate-slide-in-right delay-100">
              Sign in to access your health dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative animate-slide-in-right delay-200">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-snow-white pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-cool-gray text-white placeholder:text-cool-gray focus:ring-2 focus:ring-snow-white"
                />
              </div>
              <div className="relative animate-slide-in-right delay-300">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-snow-white pointer-events-none" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-cool-gray text-white placeholder:text-cool-gray focus:ring-2 focus:ring-snow-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cool-gray hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-soft-coral bg-white/10 px-3 py-2 rounded-md">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-soft-blue hover:bg-blue-600 text-white animate-slide-in-right delay-400 flex items-center justify-center gap-2"
                disabled={isLoading || (lockoutUntil !== null && lockoutUntil > Date.now())}
              >
                {isLoading ? (
    <>
      <Loader2 className='h-4 w-4 animate-spin' /> Logging in...
    </>
  ) : lockoutUntil && lockoutUntil > Date.now() ? (
    `Locked (${formatRemainingTime()})`
  ) : (
    "Login"
  )}
              </Button>
            </form>

            <GoogleLoginButton/> 
            <div className="mt-4 text-center text-sm text-snow-white animate-slide-in-right delay-500">
              Don&apos;t have an account?{' '}
              <Link
                href={`/signup`}
                className="text-soft-blue hover:text-blue-300 transition-colors duration-300"
              >
                Sign up
              </Link>
            </div>
             <div className="text-center animate-slide-in-right delay-450">
              <Link
                href="/reset-password"
                className="text-sm text-soft-blue hover:text-blue-300 transition-colors duration-300"
              >
                Forgot Password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    
  )
}
