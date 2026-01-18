'use client'
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock,  AlertCircle, Loader2, Check, X } from 'lucide-react'
import {  useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleLoginButton from '@/components/oAuth/GoogleLoginButton'
import api from '@/lib/axios'



const Signup = () => {
 
  
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

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

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    if ( !email || !password) {
      setError('All fields are required.')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email.')
      return
    }
    setLoading(true)
   try {
  const res = await api.post(`auth/register`, { email, password })
  if (res.data.message) {  
    localStorage.setItem('email', email)
    router.push(`/otp`)
  } else {
    setError(res.data.message || 'Registration failed')
  }
} catch (err: any) {
  console.log(err)
  setError(err?.response?.data?.message || 'Something went wrong.')
} finally {
  setLoading(false)
}

  }

  return (
     <div className="min-h-screen pt-14 flex items-center justify-center bg-gradient-to-b from-mint-green via-snow-white to-mint-green p-4">
            <Card className="w-full max-w-md bg-dark-slate-gray backdrop-blur-md border-0 shadow-xl animate-fade-in">
               <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-snow-white animate-slide-in-right">
              Create an Account
            </CardTitle>
            <p className="text-sm text-mint-green animate-slide-in-right delay-100">
              Sign up to start managing your health journey
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative animate-slide-in-right delay-300">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-snow-white pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-snow-white"
                />
              </div>
              <div className="space-y-2 animate-slide-in-right delay-400">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-snow-white pointer-events-none" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-snow-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {password && !allChecksMet && (
                  <div className="bg-white/5 border border-gray-700 rounded-lg p-3 space-y-2">
                    <p className="text-xs text-gray-300 font-medium mb-2">Password Requirements:</p>
                    
                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.length ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )}
                      <span className={passwordChecks.length ? "text-green-400" : "text-gray-400"}>
                        At least 8 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.uppercase ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )}
                      <span className={passwordChecks.uppercase ? "text-green-400" : "text-gray-400"}>
                        One uppercase letter (A-Z)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.lowercase ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )}
                      <span className={passwordChecks.lowercase ? "text-green-400" : "text-gray-400"}>
                        One lowercase letter (a-z)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.number ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )}
                      <span className={passwordChecks.number ? "text-green-400" : "text-gray-400"}>
                        One number (0-9)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.special ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )}
                      <span className={passwordChecks.special ? "text-green-400" : "text-gray-400"}>
                        One special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-white/10 px-3 py-2 rounded-md">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !allChecksMet || !email}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white animate-slide-in-right delay-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
    <>
      <Loader2 className='h-4 w-4 animate-spin' /> Creating Account...
    </>
  ) : (
    "Create Account"
  )}
              </Button>
            </form>
           
           <GoogleLoginButton/>
          <div className="mt-4 text-center text-sm text-snow-white animate-slide-in-right delay-500">
              Already Have Account?{' '}
              <Link
                href={`/login`}
                className="text-soft-blue hover:text-blue-300 transition-colors duration-300"
              >
                Login
              </Link>
            </div>
        
          </CardContent>
        </Card>
        
      </div>
    
  )
}

export default Signup
