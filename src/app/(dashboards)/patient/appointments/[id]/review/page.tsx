"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Star, Heart, CheckCircle, Calendar, User, MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { mockAppointments } from "@/mocks/data"
import type { Appointment } from "@/types"

function StarRating({ rating, onRatingChange, hoverRating, onHoverChange }: any) {
  const ratingLabels = ["Terrible", "Poor", "Average", "Good", "Excellent"]

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="group transition-all duration-200 hover:scale-110"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange(star)}
            onMouseLeave={() => onHoverChange(0)}
          >
            <Star
              className={cn(
                "transition-all duration-200",
                (hoverRating || rating) >= star
                  ? "fill-amber-400 text-amber-400 drop-shadow-lg"
                  : "fill-gray-200 text-gray-300 hover:fill-amber-200 hover:text-amber-200",
              )}
              size={40}
            />
          </button>
        ))}
      </div>
      {(hoverRating || rating) > 0 && (
        <div className="text-center">
          <p className="text-lg font-semibold text-soft-blue">{ratingLabels[(hoverRating || rating) - 1]}</p>
          <p className="text-sm text-cool-gray">{hoverRating || rating} out of 5 stars</p>
        </div>
      )}
    </div>
  )
}

function ReviewForm({ appointment }: { appointment: Appointment }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log({
      appointmentId: appointment.id,
      rating,
      title,
      comment,
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
const router=useRouter()
    setTimeout(() => {
      setIsSubmitted(false)
      router.push('/patient/dashboard')
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen   flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-soft-coral mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-soft-coral mb-2">Thank You!</h2>
              <p className="text-cool-gray">Your review has been submitted successfully.</p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-amber-400">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-soft-coral mb-2">How was your experience?</h1>
          <p className="text-lg text-cool-gray">Your feedback helps us provide better service</p>
        </div>

        <Card className="mb-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-soft-blue">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{appointment.date} @ {appointment.time}</span>
              </div>
              <div className="flex items-center gap-2 text-cool-gray">
                <User className="w-5 h-5 text-soft-blue" />
                <span>{appointment.doctor.name}</span>
              </div>
              <div className="flex items-center gap-2 text-cool-gray">
                <Sparkles className="w-4 h-4 text-soft-blue" />
                <span>{appointment.doctor.specialty} • {appointment.doctor.experience} yrs</span>
              </div>
              <div className="text-sm text-cool-gray">
               <span className="text-soft-blue"> Location: </span> {appointment.doctor.location} <span className="text-soft-coral"> • Fee:</span> ${appointment.doctor.consultationFee} 
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(Math.round(appointment.doctor.rating))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs text-dark-slate-gray">({appointment.doctor.rating})</span>
              </div>
            </div>
            <Image
              src={appointment.doctor.avatar || ""}
              alt={appointment.doctor.name}
              width={80}
              height={80}
              className="rounded-full object-cover border border-soft-blue shadow-md"
            />
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center">
                <Label className="text-xl font-semibold text-soft-coral mb-6 block">
                  Rate your overall experience
                </Label>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  hoverRating={hoverRating}
                  onHoverChange={setHoverRating}
                />
              </div>

             

              <div className="space-y-3">
                <Label htmlFor="comment" className="text-lg font-medium text-soft-blue">
                  Tell us more about your experience
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Share your thoughts about the doctor, staff, or service..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  required
                  className="text-lg border-2 border-gray-200 focus:border-soft-blue focus:ring-soft-blue/20 focus:ring-4 transition-all duration-200 resize-none"
                />
                <p className="text-sm text-cool-gray">{comment.length}/500 characters</p>
              </div>

              <Button
                type="submit"
                className={cn(
                  "w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 transform",
                  "bg-gradient-to-r from-soft-blue to-mint-green hover:from-soft-blue/90 hover:to-mint-green/90",
                  "text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                )}
                disabled={isSubmitting || rating === 0 || comment.trim().length === 0}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting your review...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Submit Review</span>
                  </div>
                )}
              </Button>

              {rating === 0 && (
                <p className="text-center text-soft-coral font-medium">Please select a star rating to continue</p>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-cool-gray">Your review will help improve our healthcare service</p>
        </div>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const params = useParams()
  const appointmentId = Array.isArray(params.id) ? params.id[0] : params.id || ""
  const appointment = mockAppointments.find((a) => a.id === appointmentId && a.status === "completed")

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center p-6">
        <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-soft-coral mb-4">Appointment Not Found</h2>
            <p className="text-cool-gray">
              No completed appointment found for ID <span className="font-semibold">{appointmentId}</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <ReviewForm appointment={appointment} />
}
