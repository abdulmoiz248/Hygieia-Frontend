"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/feedback")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-soft-blue">Create Feedback Form</h1>
          <p className="text-muted-foreground mt-1">Design a new survey to send to patients.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Basic details and targeting for the feedback form.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Form Title</Label>
              <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Patient Satisfaction Survey" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please let us know how we did." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage of Users to Target (%)</Label>
                <Input id="percentage" type="number" min="1" max="100" required value={percentageOfUsers} onChange={(e) => setPercentageOfUsers(parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Active Duration (Hours)</Label>
                <Input id="duration" type="number" min="1" required value={durationHours} onChange={(e) => setDurationHours(parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-soft-blue">Questions</h2>
            <Button type="button" variant="outline" onClick={addQuestion} className="border-mint-green text-mint-green hover:bg-mint-green/10">
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>

          {questions.map((q, index) => (
            <Card key={q.id} className="relative border-l-4 border-l-mint-green">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-soft-coral hover:bg-soft-coral/10 hover:text-soft-coral"
                onClick={() => removeQuestion(q.id)}
                disabled={questions.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6 space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <Label>Question {index + 1}</Label>
                    <Input
                      required
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                      placeholder="Enter question text"
                    />
                  </div>
                  <div className="w-1/3 space-y-2">
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
                  <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                    <Label className="text-sm text-muted-foreground">Options</Label>
                    {q.options?.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2 mb-2">
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
                    <Button type="button" variant="link" size="sm" onClick={() => addOption(q.id)} className="text-soft-blue p-0">
                      + Add Option
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} className="bg-soft-blue hover:bg-mint-green w-full md:w-auto px-8">
            {submitting ? "Creating..." : "Publish Feedback Form"}
          </Button>
        </div>
      </form>
    </div>
  )
}
