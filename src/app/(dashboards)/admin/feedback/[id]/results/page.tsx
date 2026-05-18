"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Star, User } from "lucide-react"
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
          <div className="flex items-center space-x-2">
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
      q.options.forEach((opt: string) => counts[opt] = 0)
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/feedback")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-soft-blue">Form Results</h1>
          <p className="text-muted-foreground mt-1">{form.title}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mint-green">{totalResponses}</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Form Details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><span className="font-medium">Description:</span> {form.description}</p>
            <p><span className="font-medium">Expires at:</span> {form.expiresAt && !isNaN(new Date(form.expiresAt).getTime()) ? format(new Date(form.expiresAt), "PPP p") : "No Expiry Date"}</p>
            <p><span className="font-medium">Targeted:</span> {form.percentageOfUsers}% of users</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold text-soft-blue mt-8 mb-4 border-b pb-2">Questions Analysis</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {form.questions.map((q, index) => (
          <Card key={q.id}>
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

      <h2 className="text-xl font-semibold text-soft-blue mt-8 mb-4 border-b pb-2 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" /> Hygieia Platform Reviews
      </h2>
      <div className="grid gap-4">
        {results.length === 0 ? (
          <p className="text-muted-foreground italic">No reviews submitted yet.</p>
        ) : (
          results.map((res, i) => (
            <Card key={i}>
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
