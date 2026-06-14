"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Plus, ShieldCheck, Sparkles, Trash2 } from "lucide-react"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { createFeedbackForm, FeedbackQuestion, QuestionType } from "@/api/feedback.api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function CreateFeedbackFormPage() {
  const router = useRouter()
  const { adminId } = useAdminStore()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [percentageOfUsers, setPercentageOfUsers] = useState<number>(50)
  const [durationHours, setDurationHours] = useState<number>(48)
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([
    { id: "q1", type: "rating", text: "" }
  ])
  const [submitting, setSubmitting] = useState(false)

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: `q${Date.now()}`, type: "text", text: "" }
    ])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: string, field: keyof FeedbackQuestion, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (field === "type" && value === "multiple_choice" && !q.options) {
          return { ...q, [field]: value, options: [""] }
        }
        return { ...q, [field]: value }
      }
      return q
    }))
  }

  const updateOption = (qId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        const newOptions = [...q.options]
        newOptions[optionIndex] = value
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...(q.options || []), ""] }
      }
      return q
    }))
  }

  const removeOption = (qId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        return { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
      }
      return q
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminId) return

    try {
      setSubmitting(true)
      await createFeedbackForm({
        userId: adminId,
        title,
        description,
        percentageOfUsers,
        durationHours,
        questions,
      })
      toast({ title: "Success", description: "Feedback form created successfully." })
      router.push("/admin/feedback")
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create feedback form." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen px-6 pb-6 space-y-6 bg-[var(--color-snow-white)] fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
        <div>
          <h1 className="text-3xl font-bold pb-1 text-soft-coral">Create Feedback Form</h1>

          <span
            className="text-base font-semibold mt-0.5 block"
            style={{
              background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Design a patient survey with clean targeting, clear questions, and fast publishing.
          </span>
        </div>

        <Button
          onClick={() => router.push("/admin/feedback")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 self-start sm:self-auto"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Feedback
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>General information</CardTitle>
              <CardDescription>Basic details and targeting for the feedback form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Form title</Label>
                <Input
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Patient Satisfaction Survey"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please let us know how we did."
                  className="min-h-28"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage of users to target (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={percentageOfUsers}
                    onChange={(e) => setPercentageOfUsers(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Active duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    required
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-soft-blue">Questions</h2>
                <p className="text-sm text-muted-foreground">Add a mix of ratings, multiple choice, and text questions.</p>
              </div>
              <Button type="button" variant="outline" onClick={addQuestion} className="border-mint-green text-mint-green hover:bg-mint-green/10">
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </div>

            {questions.map((q, index) => (
              <Card key={q.id} className="relative overflow-hidden border-l-4 border-l-mint-green">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 text-soft-coral hover:bg-soft-coral/10 hover:text-soft-coral"
                  onClick={() => removeQuestion(q.id)}
                  disabled={questions.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="space-y-5 pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Question {index + 1}</Label>
                      <Input
                        required
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                        placeholder="Enter question text"
                      />
                    </div>
                    <div className="w-full max-w-56 space-y-2">
                      <Label>Type</Label>
                      <Select value={q.type} onValueChange={(val: QuestionType) => updateQuestion(q.id, "type", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Star Rating</SelectItem>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="text">Text Input</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {q.type === "multiple_choice" && (
                    <div className="space-y-3 rounded-2xl border bg-muted/30 p-4">
                      <Label className="text-sm text-muted-foreground">Options</Label>
                      {q.options?.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <Input
                            required
                            value={opt}
                            onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                            placeholder={`Option ${optIndex + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(q.id, optIndex)}
                            disabled={(q.options?.length || 0) <= 1}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="link" size="sm" onClick={() => addOption(q.id)} className="w-fit p-0 text-soft-blue">
                        + Add Option
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="w-full bg-soft-blue px-8 hover:bg-mint-green md:w-auto">
              {submitting ? "Creating..." : "Publish Feedback Form"}
            </Button>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-soft-blue" /> Quick tips
              </CardTitle>
              <CardDescription>Keep the survey short so patients finish it quickly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-mint-green" />
                <span>Use clear, direct question wording.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-mint-green" />
                <span>Mix rating and text questions for better context.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-mint-green" />
                <span>Target only the patients you want to hear from.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-mint-green/30 bg-mint-green/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-mint-green">
                <ShieldCheck className="h-4 w-4" /> Before publishing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Review all questions and options for spelling and clarity.</p>
              <p>Confirm the target percentage and active duration.</p>
              <p>After publishing, results will appear in the feedback dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
