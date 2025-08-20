'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

type Step = 'email' | 'otp' | 'newPassword' | 'success'

export default function ResetPassword() {
  const [currentStep, setCurrentStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password: string) => password.length >= 6

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!email) {
    setError('Email is required.')
    return
  }
  if (!validateEmail(email)) {
    setError('Please enter a valid email.')
    return
  }

  setError('')
  setIsLoading(true)

  try {
    const res = await api.post('/auth/request-password-reset', { email })
    if (res.data.success) {
      setCurrentStep('otp')
      setCountdown(60)
      localStorage.setItem('resetEmail', email)
    } else {
      setError(res.data.message || 'Failed to send reset OTP')
    }
  } catch (err) {
    console.log(err)
    setError('Something went wrong. Try again.')
  } finally {
    setIsLoading(false)
  }
}


 const handleOtpSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!otp || otp.length !== 6) {
    setError('Please enter a valid 6-digit OTP.')
    return
  }

  setError('')
  setIsLoading(true)

  try {
    const email = localStorage.getItem('resetEmail')
    const res = await api.post('/auth/verify-reset-otp', { email, otp })
    if (res.data.success) {
      setCurrentStep('newPassword')
    } else {
      setError(res.data.message || 'Invalid OTP. Please try again.')
    }
  } catch (err) {
    console.log(err)
    setError('Something went wrong. Try again.')
  } finally {
    setIsLoading(false)
  }
}


const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!newPassword || !confirmPassword) {
    setError('Both password fields are required.')
    return
  }
  if (!validatePassword(newPassword)) {
    setError('Password must be at least 6 characters long.')
    return
  }
  if (newPassword !== confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  setError('')
  setIsLoading(true)

  try {
    const email = localStorage.getItem('resetEmail')
    const res = await api.post('/auth/reset-password', { 
      email, 
      otp, 
      newPassword 
    })
    if (res.data.success) {
      setCurrentStep('success')
      localStorage.removeItem('resetEmail')
    } else {
      setError(res.data.message)
    }
  } catch (err) {
    console.log(err)
    setError('Something went wrong. Try again.')
  } finally {
    setIsLoading(false)
  }
}

 

  // Email Step
  if (currentStep === 'email') {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center bg-gradient-to-b from-mint-green via-snow-white to-mint-green p-4">
        <Card className="w-full max-w-md bg-dark-slate-gray backdrop-blur-md border-0 shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-snow-white tracking-tight animate-slide-in-right">
              Reset Password
            </CardTitle>
            <p className="text-sm text-mint-green animate-slide-in-right delay-100">
              Enter your email to receive an OTP for password reset
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative animate-slide-in-right delay-200">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-snow-white" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-cool-gray text-white placeholder:text-cool-gray focus:ring-2 focus:ring-snow-white"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-soft-coral bg-white/10 px-3 py-2 rounded-md">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-soft-blue hover:bg-blue-600 text-white animate-slide-in-right delay-300 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-snow-white animate-slide-in-right delay-400">
              Remember your password?{' '}
              <Link
                href="/login"
                className="text-soft-blue hover:text-blue-300 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                <ArrowLeft className="inline h-3 w-3 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // OTP Verification Step
  if (currentStep === 'otp') {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center bg-gradient-to-b from-mint-green via-snow-white to-mint-green p-4">
        <Card className="w-full max-w-md bg-dark-slate-gray backdrop-blur-md border-0 shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto mb-4 w-16 h-16 bg-soft-blue/20 rounded-full flex items-center justify-center animate-pulse">
              <Shield className="h-8 w-8 text-soft-coral" />
            </div>
            <CardTitle className="text-2xl font-bold text-snow-white tracking-tight animate-slide-in-right">
              Verify OTP
            </CardTitle>
            <p className="text-sm text-mint-green animate-slide-in-right delay-100">
              Enter the 6-digit code sent to {email}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="relative animate-slide-in-right delay-200">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest bg-white/5 border-cool-gray text-white placeholder:text-cool-gray focus:ring-2 focus:ring-snow-white"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-soft-coral bg-white/10 px-3 py-2 rounded-md">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-soft-blue hover:bg-blue-600 text-white animate-slide-in-right delay-300 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>

           

            <div className="mt-2 text-center text-sm text-snow-white animate-slide-in-right delay-500">
              <button
                onClick={() => setCurrentStep('email')}
                className="text-soft-blue hover:text-blue-300 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                <ArrowLeft className="inline h-3 w-3 mr-1" />
                Change Email
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // New Password Step
  if (currentStep === 'newPassword') {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center bg-gradient-to-b from-mint-green via-snow-white to-mint-green p-4">
        <Card className="w-full max-w-md bg-dark-slate-gray backdrop-blur-md border-0 shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-snow-white tracking-tight animate-slide-in-right">
              Create New Password
            </CardTitle>
            <p className="text-sm text-mint-green animate-slide-in-right delay-100">
              Choose a strong password for your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative animate-slide-in-right delay-200">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-snow-white" />
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-cool-gray text-white placeholder:text-cool-gray focus:ring-2 focus:ring-snow-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-cool-gray hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative animate-slide-in-right delay-300">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-snow-white" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-cool-gray text-white placeholder:text-cool-gray focus:ring-2 focus:ring-snow-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-cool-gray hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-soft-coral bg-white/10 px-3 py-2 rounded-md">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="text-xs text-snow-white animate-slide-in-right delay-400">
                Password must be at least 9 characters long
              </div>

              <Button
                type="submit"
                className="w-full bg-soft-blue hover:bg-blue-600 text-white animate-slide-in-right delay-500 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success Step
  return (
    <div className="min-h-screen pt-14 flex items-center justify-center bg-gradient-to-b from-mint-green via-snow-white to-mint-green p-4">
      <Card className="w-full max-w-md bg-dark-slate-gray backdrop-blur-md border-0 shadow-xl animate-fade-in">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-snow-white tracking-tight animate-slide-in-right">
            Password Updated!
          </CardTitle>
          <p className="text-sm text-mint-green animate-slide-in-right delay-100">
            Your password has been successfully updated
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-sm text-cool-gray animate-slide-in-right delay-200">
              <p>You can now login with your new password.</p>
            </div>
            
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-soft-blue hover:bg-blue-600 text-white animate-slide-in-right delay-300 flex items-center justify-center gap-2"
            >
              Login Again
            </Button>

            <div className="text-center text-sm text-snow-white animate-slide-in-right delay-400">
              Need help?{' '}
              <Link
                href="/contact"
                className="text-soft-blue hover:text-blue-300 transition-colors duration-300 underline-offset-4 hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}