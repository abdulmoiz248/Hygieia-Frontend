"use client"

import { useEffect, useState, use } from "react"
import { getFeedbackForm, submitFeedbackForm, FeedbackForm } from "@/api/feedback.api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star, CheckCircle } from "lucide-react"
import Loader from "@/components/loader/loader"

export default function PublicFeedbackFormPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const [form, setForm] = useState<FeedbackForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [email, setEmail] = useState("")
  const [hygieiaReview, setHygieiaReview] = useState("")
  const [answers, setAnswers] = useState<Record<string, any>>({})

  useEffect(() => {
    loadForm()
  }, [unwrappedParams.id])

  const loadForm = async () => {
    try {
      setLoading(true)
      const data = await getFeedbackForm(unwrappedParams.id)
      setForm(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = (qId: string, rating: number) => {
    setAnswers(prev => ({ ...prev, [qId]: rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setFormError(null)

    if (!email) {
      setFormError("Email address is required.")
      return
    }
    if (!hygieiaReview) {
      setFormError("Hygieia review is required.")
      return
    }

    try {
      setSubmitting(true)
      await submitFeedbackForm(unwrappedParams.id, {
        userEmail: email,
        answers,
        hygieiaReview
      })
      setIsSubmitted(true)
    } catch (err: any) {
      setFormError(err?.message || "Something went wrong while submitting your feedback.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-snow-white"><Loader /></div>
  
  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow-white p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-soft-coral text-center">Form Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            {error || "This form could not be found or has expired."}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow-white p-4">
        <Card className="max-w-md w-full text-center border-none shadow-xl">
          <CardHeader className="pt-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-mint-green" />
            </div>
            <CardTitle className="text-2xl text-soft-blue">Thank You!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your feedback has been successfully submitted. We appreciate your time and input.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <Button onClick={() => window.location.href = '/'} className="bg-soft-blue hover:bg-mint-green mt-4">
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-snow-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <img src="/logo/logo.png" alt="Hygieia Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-soft-blue">{form.title}</h1>
          <p className="mt-2 text-lg text-cool-gray">{form.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div
              className="rounded-lg border border-soft-coral bg-soft-coral/10 px-4 py-3 text-sm text-soft-coral"
              role="alert"
              aria-live="polite"
            >
              {formError}
            </div>
          )}

          <Card className="shadow-md border-t-4 border-t-soft-blue">
            <CardHeader>
              <CardTitle className="text-lg">Your Information</CardTitle>
              <CardDescription>We need your email to verify your submission.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">Email Address <span className="text-soft-coral">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  placeholder="patient@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 focus:bg-white"
                />
              </div>
            </CardContent>
          </Card>

          {form.questions.map((q, index) => (
            <Card key={q.id} className="shadow-sm">
              <CardContent className="pt-6">
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  {index + 1}. {q.text}
                </Label>

                {q.type === "rating" && (
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(q.id, star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`h-8 w-8 ${answers[q.id] >= star ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
                        />
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "multiple_choice" && q.options && (
                  <RadioGroup 
                    onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                    className="space-y-3"
                  >
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <RadioGroupItem value={opt} id={`${q.id}-opt-${i}`} />
                        <Label htmlFor={`${q.id}-opt-${i}`} className="font-normal cursor-pointer">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {q.type === "text" && (
                  <Textarea 
                    placeholder="Type your answer here..." 
                    rows={4}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="bg-gray-50 focus:bg-white"
                  />
                )}
              </CardContent>
            </Card>
          ))}

          <Card className="shadow-md border-t-4 border-t-mint-green">
            <CardHeader>
              <CardTitle className="text-lg">Hygieia Experience</CardTitle>
              <CardDescription>Tell us about your overall experience with our platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="hygieiaReview" className="font-semibold">Review <span className="text-soft-coral">*</span></Label>
                <Textarea 
                  id="hygieiaReview" 
                  required 
                  placeholder="The platform was very easy to use!" 
                  rows={4}
                  value={hygieiaReview}
                  onChange={(e) => setHygieiaReview(e.target.value)}
                  className="bg-gray-50 focus:bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              size="lg" 
              disabled={submitting}
              className="bg-soft-blue hover:bg-mint-green w-full sm:w-auto px-8 text-white shadow-md transition-all hover:shadow-lg"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
