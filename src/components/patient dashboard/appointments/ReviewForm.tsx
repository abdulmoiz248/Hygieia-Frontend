"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Star,
  Heart,
  CheckCircle,
  Calendar,
  User,
  Sparkles,
  Monitor,
  ThumbsUp,
  LogIn,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import StarRating from "./star-rating"
import { Appointment } from "@/types/patient/appointment"

// ─── Auth helpers ────────────────────────────────────────────────────────────

type AuthStatus =
  | { state: "loading" }
  | { state: "unauthenticated" }           // no role key at all
  | { state: "incomplete"; role: string }  // role=patient but no id
  | { state: "ok"; patientId: string }

function getAuthStatus(): AuthStatus {
  try {
    const role = localStorage.getItem("role")
    const id   = localStorage.getItem("id")

    if (!role) return { state: "unauthenticated" }
    if (role === "patient" && !id) return { state: "incomplete", role }
    if (!id)   return { state: "unauthenticated" }

    return { state: "ok", patientId: id }
  } catch {
    // localStorage not available (SSR safety)
    return { state: "loading" }
  }
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface ReviewFormProps {
  appointment: Appointment
  onReviewSubmitted?: (reviewData: unknown) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ReviewForm({ appointment, onReviewSubmitted }: ReviewFormProps) {
  const router = useRouter()

  // Auth state — resolved client-side only
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ state: "loading" })

  useEffect(() => {
    setAuthStatus(getAuthStatus())
  }, [])

  // Form state
  const [rating, setRating]               = useState(0)
  const [hoverRating, setHoverRating]     = useState(0)
  const [comment, setComment]             = useState("")
  const [improvement, setImprovement]     = useState("")

  // Doctor-related questions
  const [doctorProfessionalism, setDoctorProfessionalism]   = useState("")
  const [doctorCommunication, setDoctorCommunication]       = useState("")
  const [diagnosisClarity, setDiagnosisClarity]             = useState("")
  const [treatmentExplanation, setTreatmentExplanation]     = useState("")

  // Platform-related questions
  const [bookingEase, setBookingEase]         = useState("")
  const [platformUsability, setPlatformUsability] = useState("")
  const [videoQuality, setVideoQuality]       = useState("")
  const [paymentProcess, setPaymentProcess]   = useState("")

  // Overall satisfaction
  const [overallSatisfaction, setOverallSatisfaction] = useState("")
  const [recommendPlatform, setRecommendPlatform]     = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted]   = useState(false)
  const [submitError, setSubmitError]   = useState<string | null>(null)

  // ── Submit handler ──────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    // Re-check auth at submit time (session might have been cleared)
    const currentAuth = getAuthStatus()
    if (currentAuth.state !== "ok") {
      setSubmitError(
        currentAuth.state === "incomplete"
          ? "Your session appears incomplete. Please log in again to submit your review."
          : "You must be logged in as a patient to submit a review.",
      )
      return
    }

    setIsSubmitting(true)

    const reviewData = {
      appointmentId: appointment.id,
      patientId: currentAuth.patientId,
      rating,
      comment,
      improvement,
      doctorProfessionalism,
      doctorCommunication,
      diagnosisClarity,
      treatmentExplanation,
      bookingEase,
      platformUsability,
      videoQuality,
      paymentProcess,
      overallSatisfaction,
      recommendPlatform,
      submittedAt: new Date().toISOString(),
    }

    try {
      // TODO: replace with your real API call, e.g.:
      // await api.post("/reviews", reviewData)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Review submitted:", reviewData)
      onReviewSubmitted?.(reviewData)

      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        router.push("/patient/appointments")
      }, 3000)
    } catch (err) {
      console.error("Review submission failed:", err)
      setSubmitError("Something went wrong while submitting your review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    rating > 0 &&
    comment.trim().length > 0 &&
    doctorProfessionalism &&
    doctorCommunication &&
    diagnosisClarity &&
    bookingEase &&
    platformUsability &&
    overallSatisfaction

  // ── Loading splash ──────────────────────────────────────────────────────────

  if (authStatus.state === "loading") {
    return (
      <div className="min-h-screen custom-gradient flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-soft-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Not authenticated at all ────────────────────────────────────────────────

  if (authStatus.state === "unauthenticated") {
    return (
      <div className="min-h-screen custom-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl bg-white">
          <CardContent className="p-8 text-center space-y-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-soft-coral/10 mx-auto">
              <LogIn className="w-8 h-8 text-soft-coral" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark-slate-gray mb-2">Login Required</h2>
              <p className="text-cool-gray text-sm leading-relaxed">
                You need to be logged in as a patient to leave a review.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
            <button
              onClick={() => router.back()}
              className="text-sm text-cool-gray hover:text-soft-blue underline underline-offset-2 transition-colors"
            >
              Go back
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Role is patient but no id in localStorage ───────────────────────────────

  if (authStatus.state === "incomplete") {
    return (
      <div className="min-h-screen custom-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-2xl bg-white">
          <CardContent className="p-8 text-center space-y-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark-slate-gray mb-2">Session Incomplete</h2>
              <p className="text-cool-gray text-sm leading-relaxed">
                Your session is missing required information. Please log in again to continue.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log In Again
            </Button>
            <button
              onClick={() => router.back()}
              className="text-sm text-cool-gray hover:text-soft-blue underline underline-offset-2 transition-colors"
            >
              Go back
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <div className="min-h-screen custom-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto card-blur shadow-2xl bg-white">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-soft-coral mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-dark-slate-gray mb-2">Thank You!</h2>
              <p className="text-cool-gray">Your review has been submitted successfully.</p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-amber-400 mb-4">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-soft-coral h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Main form (authStatus.state === "ok") ───────────────────────────────────

  return (
    <div className="min-h-screen custom-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-soft-coral mb-2">How was your experience?</h1>
            <p className="text-lg text-cool-gray">Your feedback helps us improve our healthcare platform</p>
          </div>

          {/* Appointment Details */}
          <Card className="mb-6 card-blur shadow-lg bg-white">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-soft-blue">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {appointment.date} @ {appointment.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-cool-gray">
                  <User className="w-5 h-5 text-soft-blue" />
                  <span className="font-semibold text-dark-slate-gray">{appointment.doctor.name}</span>
                </div>
                <div className="flex items-center gap-2 text-cool-gray">
                  <Sparkles className="w-4 h-4 text-soft-blue" />
                </div>
                <div className="text-sm text-cool-gray">
                  <span className="text-soft-coral"> • Fee:</span> ${appointment.doctor.consultationFee}
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(Math.round(appointment.doctor.rating))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs text-dark-slate-gray ml-1">({appointment.doctor.rating})</span>
                </div>
              </div>
              <Image
                src={appointment.doctor.img || "/placeholder.svg"}
                alt={appointment.doctor.name}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-soft-blue shadow-md"
              />
            </CardContent>
          </Card>

          {/* Review Form */}
          <Card className="card-blur shadow-2xl bg-white">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Overall Rating */}
                <div className="text-center">
                  <Label className="text-xl font-semibold text-dark-slate-gray mb-6 block">
                    Rate your overall experience
                  </Label>
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    hoverRating={hoverRating}
                    onHoverChange={setHoverRating}
                    size="lg"
                  />
                </div>

                {/* Doctor Experience Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-soft-coral flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Doctor Experience
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">How professional was the doctor?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Excellent", "Good", "Average", "Poor"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={doctorProfessionalism === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              doctorProfessionalism === val
                                ? "bg-soft-coral text-snow-white border-soft-coral hover:bg-soft-coral/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setDoctorProfessionalism(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">How clear was the doctor&apos;s communication?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Very Clear", "Clear", "Somewhat Clear", "Unclear"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={doctorCommunication === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              doctorCommunication === val
                                ? "bg-soft-coral text-snow-white border-soft-coral hover:bg-soft-coral/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setDoctorCommunication(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">Was the diagnosis explained clearly?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Yes, very clear", "Mostly clear", "Somewhat", "Not clear"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={diagnosisClarity === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              diagnosisClarity === val
                                ? "bg-soft-coral text-snow-white border-soft-coral hover:bg-soft-coral/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setDiagnosisClarity(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">Were treatment options well explained?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Excellent", "Good", "Fair", "Poor"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={treatmentExplanation === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              treatmentExplanation === val
                                ? "bg-soft-coral text-snow-white border-soft-coral hover:bg-soft-coral/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setTreatmentExplanation(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Experience Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-soft-coral flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Platform Experience
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">How easy was it to book the appointment?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Very Easy", "Easy", "Moderate", "Difficult"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={bookingEase === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              bookingEase === val
                                ? "bg-mint-green text-dark-slate-gray border-mint-green hover:bg-mint-green/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setBookingEase(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">How user-friendly is our platform?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Excellent", "Good", "Average", "Poor"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={platformUsability === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              platformUsability === val
                                ? "bg-mint-green text-dark-slate-gray border-mint-green hover:bg-mint-green/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setPlatformUsability(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">How was the video call quality?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Excellent", "Good", "Fair", "Poor"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={videoQuality === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              videoQuality === val
                                ? "bg-mint-green text-dark-slate-gray border-mint-green hover:bg-mint-green/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setVideoQuality(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">How smooth was the payment process?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Very Smooth", "Smooth", "Okay", "Difficult"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={paymentProcess === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              paymentProcess === val
                                ? "bg-mint-green text-dark-slate-gray border-mint-green hover:bg-mint-green/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setPaymentProcess(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overall Satisfaction */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-soft-coral flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5" />
                    Overall Satisfaction
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">Overall, how satisfied are you?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={overallSatisfaction === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              overallSatisfaction === val
                                ? "bg-soft-blue text-snow-white border-soft-blue hover:bg-soft-blue/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setOverallSatisfaction(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-soft-blue font-medium">Would you recommend our platform?</Label>
                      <div className="flex gap-2 flex-wrap">
                        {["Definitely", "Probably", "Maybe", "No"].map((val) => (
                          <Button
                            key={val}
                            type="button"
                            variant={recommendPlatform === val ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "transition-all duration-200",
                              recommendPlatform === val
                                ? "bg-soft-blue text-snow-white border-soft-blue hover:bg-soft-blue/90"
                                : "border-cool-gray text-cool-gray hover:border-soft-blue hover:text-soft-blue",
                            )}
                            onClick={() => setRecommendPlatform(val)}
                          >
                            {val}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Written Feedback */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="comment" className="text-lg font-medium text-dark-slate-gray">
                      Tell us more about your experience
                    </Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your thoughts about the doctor, platform, or overall experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      required
                      className="text-lg border-2 border-cool-gray/30 focus:border-soft-blue focus:ring-soft-blue/20 focus:ring-4 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="improvement" className="text-lg font-medium text-dark-slate-gray">
                      What could we improve? (Optional)
                    </Label>
                    <Textarea
                      id="improvement"
                      placeholder="Any suggestions for improvement..."
                      value={improvement}
                      onChange={(e) => setImprovement(e.target.value)}
                      rows={4}
                      className="text-lg border-2 border-cool-gray/30 focus:border-soft-blue focus:ring-soft-blue/20 focus:ring-4 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Submission error banner */}
                {submitError && (
                  <div className="flex items-start gap-3 rounded-xl border border-soft-coral/40 bg-soft-coral/5 px-4 py-3">
                    <AlertTriangle className="h-5 w-5 text-soft-coral shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-soft-coral font-medium">{submitError}</p>
                      <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-soft-blue hover:text-soft-blue/80 underline underline-offset-2 transition-colors"
                      >
                        <LogIn className="h-3 w-3" />
                        Go to login
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="bg-soft-blue text-snow-white hover:bg-soft-blue w-full text-xl py-7"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-snow-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting your review...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-xl" />
                      <span>Submit Review</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-cool-gray">Your review will help improve our healthcare platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}