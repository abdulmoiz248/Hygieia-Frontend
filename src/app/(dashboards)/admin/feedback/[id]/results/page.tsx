"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CalendarClock, MessageSquare, Sparkles, Star, User, Users } from "lucide-react"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { getFeedbackForm, getFeedbackResults, FeedbackForm, FeedbackResult } from "@/api/feedback.api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Loader from "@/components/loader/loader"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"

export default function FeedbackResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { adminId } = useAdminStore()
  const [form, setForm] = useState<FeedbackForm | null>(null)
  const [results, setResults] = useState<FeedbackResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const unwrappedParams = use(params)

  useEffect(() => {
    if (adminId && unwrappedParams.id) {
      loadData()
    }
  }, [adminId, unwrappedParams.id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [formData, resultsData] = await Promise.all([
        getFeedbackForm(unwrappedParams.id),
        getFeedbackResults(unwrappedParams.id, adminId!)
      ])
      setForm(formData)
      setResults(resultsData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />
  if (error || !form) return <div className="p-6 text-center text-red-500">{error || "Form not found"}</div>

  // Calculate aggregates
  const totalResponses = results.length
  const averageRatingQuestions = form.questions.filter((q) => q.type === "rating")
  const targetedPercentage = typeof form.percentageOfUsers === "number" ? form.percentageOfUsers : null
  const showTargeting = targetedPercentage !== null

  const expDate = form.expiresAt ? new Date(form.expiresAt) : null
  const isValidDate = expDate && !isNaN(expDate.getTime())
  const isExpired = isValidDate ? expDate < new Date() : false

  const renderQuestionResults = (q: any) => {
    if (totalResponses === 0) return <p className="text-sm text-muted-foreground">No responses yet.</p>

    if (q.type === "rating") {
      let sum = 0
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      results.forEach(r => {
        const val = r.answers[q.id]
        if (typeof val === "number") {
          sum += val
          counts[val] = (counts[val] || 0) + 1
        }
      })
      const average = (sum / totalResponses).toFixed(1)

      return (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-soft-blue">{average}</span>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`h-5 w-5 ${Number(average) >= star ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({totalResponses} reviews)</span>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = counts[star]
              const percent = (count / totalResponses) * 100
              return (
                <div key={star} className="flex items-center text-sm">
                  <span className="w-12">{star} Stars</span>
                  <Progress value={percent} className="h-2 mx-3 flex-1" />
                  <span className="w-12 text-right">{percent.toFixed(0)}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    if (q.type === "multiple_choice") {
      const counts: Record<string, number> = {}
      q.options.forEach((opt: string) => {
        counts[opt] = 0
      })
      results.forEach(r => {
        const val = r.answers[q.id]
        if (val) counts[val] = (counts[val] || 0) + 1
      })

      return (
        <div className="space-y-3">
          {q.options.map((opt: string) => {
            const count = counts[opt]
            const percent = totalResponses > 0 ? (count / totalResponses) * 100 : 0
            return (
              <div key={opt} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{opt}</span>
                  <span className="font-medium">{count} ({percent.toFixed(0)}%)</span>
                </div>
                <Progress value={percent} className="h-2" />
              </div>
            )
          })}
        </div>
      )
    }

    if (q.type === "text") {
      const textAnswers = results.map(r => r.answers[q.id]).filter(Boolean)
      return (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {textAnswers.map((txt, i) => (
            <div key={i} className="bg-muted p-3 rounded-md text-sm border">
              {txt}
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen px-6 pb-6 space-y-6 bg-[var(--color-snow-white)] fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
        <div>
          <h1 className="text-3xl font-bold pb-1 text-soft-coral">Form Results</h1>

          <span
            className="text-base font-semibold mt-0.5 block"
            style={{
              background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {form.title}
          </span>

          <p className="text-sm text-[var(--color-cool-gray)] mt-1">
            Review response patterns and patient comments for this survey.
          </p>
        </div>

        <Button
          onClick={() => router.push("/admin/feedback")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 self-start sm:self-auto"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Feedback
        </Button>
      </div>

      <div className={`mt-2 grid gap-4 md:grid-cols-2 ${showTargeting ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
          <Card className="border-white/50 bg-white/70 shadow-sm backdrop-blur">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total responses</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold text-mint-green">{totalResponses}</span>
                <MessageSquare className="h-5 w-5 text-mint-green" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/50 bg-white/70 shadow-sm backdrop-blur">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Questions</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold text-soft-blue">{form.questions.length}</span>
                <Sparkles className="h-5 w-5 text-soft-blue" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/50 bg-white/70 shadow-sm backdrop-blur">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Rating questions</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold text-amber-500">{averageRatingQuestions.length}</span>
                <Star className="h-5 w-5 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          {showTargeting && (
            <Card className="border-white/50 bg-white/70 shadow-sm backdrop-blur">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Targeting</p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-3xl font-bold text-foreground">{`${targetedPercentage}%`}</span>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Form details</CardTitle>
          <CardDescription>Overview of the survey configuration and targeting.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
          <div>
            <p className="text-muted-foreground">Description</p>
            <p className="mt-1 font-medium text-foreground">{form.description}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expiry</p>
            <p className={`mt-1 font-medium ${isExpired ? "text-soft-coral" : "text-foreground"}`}>
              {isValidDate ? format(expDate as Date, "PPP p") : "No expiry date"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className={`mt-1 font-medium ${isExpired ? "text-soft-coral" : "text-mint-green"}`}>
              {isValidDate ? (isExpired ? "Expired" : "Active") : "Not scheduled"}
            </p>
          </div>
          {showTargeting && (
            <div>
              <p className="text-muted-foreground">Targeted patients</p>
              <p className="mt-1 font-medium text-foreground">{`${targetedPercentage}% of patients`}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-soft-blue">Questions analysis</h2>
          <p className="text-sm text-muted-foreground">Review response patterns for each survey question.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {form.questions.map((q, index) => (
          <Card key={q.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-semibold leading-tight">
                {index + 1}. {q.text}
              </CardTitle>
              <CardDescription className="capitalize text-xs">{q.type.replace('_', ' ')}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderQuestionResults(q)}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-soft-blue" />
        <h2 className="text-xl font-semibold text-soft-blue">Hygieia platform reviews</h2>
      </div>

      <div className="grid gap-4">
        {results.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="rounded-full bg-soft-blue/10 p-4">
                <MessageSquare className="h-8 w-8 text-soft-blue" />
              </div>
              <p className="mt-4 text-lg font-medium">No reviews submitted yet</p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Once patients start responding, their free-text feedback will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          results.map((res, i) => (
            <Card key={i} className="border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-soft-blue/10 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                    <User className="h-5 w-5 text-soft-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-gray-900">{res.userEmail}</p>
                      <span className="text-xs text-muted-foreground">
                        {res.submittedAt && !isNaN(new Date(res.submittedAt).getTime()) 
                          ? format(new Date(res.submittedAt), "MMM d, yyyy") 
                          : "No Date"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{res.hygieiaReview}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
