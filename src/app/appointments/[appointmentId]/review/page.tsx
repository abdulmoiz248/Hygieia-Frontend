"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { AlertCircle, CheckCircle2, Heart, Loader2, Sparkles, Star } from "lucide-react"

import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type ProviderRole = "doctor" | "nutritionist"

type ApiErrorResponse = {
  message?: string
}

const hasAlreadyReviewedSignal = (statusCode?: number, message?: string): boolean => {
  const normalized = (message ?? "").toLowerCase()

  return (
    statusCode === 409 ||
    /already\s+reviewed/.test(normalized) ||
    /duplicate|unique/.test(normalized) ||
    /internal\s+server\s+error/.test(normalized)
  )
}

const normalizeProviderRole = (value: string | null): ProviderRole | "" => {
  if (value === "doctor" || value === "nutritionist") {
    return value
  }

  return ""
}

const titleCase = (value: ProviderRole | ""): string => {
  if (!value) {
    return "Provider"
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function AppointmentReviewPage() {
  const params = useParams<{ appointmentId: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const appointmentId = useMemo(() => {
    const raw = params?.appointmentId

    if (Array.isArray(raw)) {
      return raw[0] ?? ""
    }

    return raw ?? ""
  }, [params])

  const providerRole = normalizeProviderRole(searchParams.get("providerRole"))

  const [patientId, setPatientId] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    setPatientId(localStorage.getItem("id") ?? "")
  }, [])

  const isFormValid = Number.isInteger(rating) && rating >= 1 && rating <= 5 && review.trim().length > 0
  const isSubmitDisabled = !isFormValid || isSubmitting || isSubmitted || alreadyReviewed || !patientId

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!appointmentId) {
      setErrorMessage("Invalid review link. Appointment ID is missing.")
      return
    }

    if (!patientId) {
      setErrorMessage("Please log in to submit your review.")
      return
    }

    if (!isFormValid) {
      setErrorMessage("Please select a rating and write your review.")
      return
    }

    setErrorMessage("")
    setIsSubmitting(true)

    try {
      await api.post(`/appointments/${appointmentId}/review`, {
        patientId,
        rating: Math.trunc(rating),
        review: review.trim(),
      })

      setIsSubmitted(true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        const data = error.response?.data as ApiErrorResponse | undefined
        const backendMessage = data?.message?.trim() ?? ""

        if (hasAlreadyReviewedSignal(statusCode, backendMessage)) {
          setAlreadyReviewed(true)
          setErrorMessage("This appointment has already been reviewed.")
          return
        }

        if (backendMessage) {
          setErrorMessage(backendMessage)
          return
        }
      }

      setErrorMessage("Unable to submit review right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!appointmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b p-10  from-mint-green via-snow-white to-mint-green">
        <Card className="w-full max-w-xl">
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <h1 className="text-2xl font-semibold">Invalid review link</h1>
            <p className="text-sm text-muted-foreground">
              The appointment ID is missing from this URL.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b p-10  from-mint-green via-snow-white to-mint-green">
        <Card className="w-full max-w-xl border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-mint-green" />
            <h1 className="text-2xl font-semibold text-dark-slate-gray">Review submitted successfully</h1>
            <p className="text-sm text-cool-gray">
              Thank you for sharing your feedback. It helps us improve care quality.
            </p>
            <Button
              onClick={() => router.push("/patient/appointments")}
              className="bg-soft-blue text-snow-white hover:bg-soft-blue/90"
            >
              Go to appointment history
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b p-10  from-mint-green via-snow-white to-mint-green">
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-soft-coral">How was your experience?</h1>
            <p className="text-base text-cool-gray">
              Leave a review for this {titleCase(providerRole)} appointment.
            </p>
          </div>
          <Card className="border-0 shadow-2xl bg-white/85 backdrop-blur-sm rounded-2xl">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-3 rounded-xl bg-soft-blue/10 p-4 border border-soft-blue/20">
                <Sparkles className="h-5 w-5 text-soft-blue mt-0.5" />
                <p className="text-sm text-dark-slate-gray">
                  Your review is shared publicly on the provider profile and helps other patients choose better care.
                </p>
              </div>

              {alreadyReviewed && (
                <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800 text-sm">
                  This appointment has already been reviewed.
                </div>
              )}

              {!patientId && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
                  Please log in first, then open this review link again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3 text-center">
                  <Label className="text-lg font-semibold text-dark-slate-gray">Rate your overall experience</Label>
                  <div className="flex items-center justify-center gap-1" role="radiogroup" aria-label="Appointment rating">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const active = (hoverRating || rating) >= starValue

                      return (
                        <button
                          key={starValue}
                          type="button"
                          role="radio"
                          aria-checked={rating === starValue}
                          aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
                          className="rounded-full p-1 transition-transform hover:scale-110"
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starValue)}
                          disabled={alreadyReviewed || isSubmitting}
                        >
                          <Star
                            className={cn("h-9 w-9 transition-colors", active ? "fill-amber-400 text-amber-400" : "text-cool-gray/50")}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="review-text" className="text-lg font-medium text-dark-slate-gray">
                    Tell us more about your experience
                  </Label>
                  <Textarea
                    id="review-text"
                    placeholder="Share your feedback in a few words..."
                    rows={6}
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    disabled={alreadyReviewed || isSubmitting}
                    className="text-base border-2 border-cool-gray/30 focus:border-soft-blue focus:ring-soft-blue/20 focus:ring-4 transition-all duration-200 resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700 text-sm">{errorMessage}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-soft-blue text-snow-white hover:bg-soft-blue/90 py-6 text-lg"
                  disabled={isSubmitDisabled}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting your review...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Submit Review
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
