"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, AlertCircle, Check, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import api from "@/lib/axios"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function UnsubscribeNewsletterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [ok, setOk] = useState<boolean | null>(null)

  const prefilledEmail = useMemo(() => {
    return (searchParams.get("email") || searchParams.get("e") || "").trim()
  }, [searchParams])

  useEffect(() => {
    if (prefilledEmail) setEmail(prefilledEmail)
  }, [prefilledEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!isValidEmail(trimmed)) {
      setMessage("Please enter a valid email address.")
      setOk(false)
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await api.post(`/unsubscribe-newsletter`, { email: trimmed })
      const data = res.data
      setOk(true)
      setMessage(data?.message || "You have been unsubscribed.")
    } catch (err: any) {
      setOk(false)
      setMessage(err?.response?.data?.message || err?.message || "Failed to unsubscribe.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-14 flex items-center justify-center bg-gradient-to-b from-mint-green via-snow-white to-mint-green p-4">
      <Card className="w-full max-w-md bg-dark-slate-gray backdrop-blur-md border-0 shadow-xl animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-snow-white animate-slide-in-right">
            Unsubscribe from Newsletter
          </CardTitle>
          <p className="text-sm text-mint-green animate-slide-in-right delay-100">
            Enter the email you used to subscribe — we'll remove it from the list.
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
                onChange={(ev) => setEmail(ev.target.value)}
                className="pl-10 bg-white/5 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-snow-white"
                autoComplete="email"
              />
            </div>

            {message && (
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${ok ? 'bg-white/5 text-green-300' : 'bg-white/5 text-red-300'}`}>
                {ok ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <span className="truncate">{message}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white animate-slide-in-right delay-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Removing...
                </>
              ) : (
                "Unsubscribe"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-snow-white animate-slide-in-right delay-500">
            Changed your mind?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-soft-blue hover:text-blue-300 transition-colors duration-300"
            >
              Create account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
