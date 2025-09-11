'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import GoogleLoginButton from '@/components/oAuth/GoogleLoginButton'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import Cookies from 'js-cookie'

export default  function Login() {
  


  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router=useRouter()
 

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!email || !password) {
    setError('Email and password are required.')
    return
  }
  if (!validateEmail(email)) {
    setError('Please enter a valid email.')
    return
  }

  setError('')
  setIsLoading(true)

  try {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data

    if (!data.success) {
      throw new Error(data.message || 'Login failed')
    } else {
      const role = data.role.includes('lab') ? 'lab-technician' : data.role.toLowerCase()
      
      // Store in cookies
      Cookies.set('token', data.accessToken, { expires: 7, sameSite: 'strict' })
      Cookies.set('role', role, { expires: 7, sameSite: 'strict' })
      Cookies.set('id', data.id, { expires: 7, sameSite: 'strict' })
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('id',data.id)
      localStorage.setItem('role',role)

      router.push(`/${role}/dashboard`)
    }

  } catch  {
  
    setError('Invalid Login Credentials')
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
                <Mail className="absolute left-3 top-3 h-5 w-5 text-snow-white" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-cool-gray text-white placeholder:text-cool-gray focus:ring-2 focus:ring-snow-white"
                />
              </div>
              <div className="relative animate-slide-in-right delay-300">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-snow-white" />
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
                  className="absolute right-3 top-3 text-cool-gray hover:text-white"
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
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Logging In...' : 'Login'}
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
