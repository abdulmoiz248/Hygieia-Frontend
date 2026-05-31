"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, CalendarClock, Clock, FileText, Plus, Sparkles } from "lucide-react"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { listFeedbackForms, FeedbackForm } from "@/api/feedback.api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Loader from "@/components/loader/loader"
import { format } from "date-fns"

export default function FeedbackFormsPage() {
  const router = useRouter()
  const { adminId } = useAdminStore()
  const [forms, setForms] = useState<FeedbackForm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (adminId) {
      loadForms()
    }
  }, [adminId])

  const loadForms = async () => {
    try {
      setLoading(true)
      const data = await listFeedbackForms(adminId!)
      setForms(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getFormStatus = (form: FeedbackForm) => {
    const expDate = form.expiresAt ? new Date(form.expiresAt) : null
    const isValidDate = expDate && !isNaN(expDate.getTime())
    if (!isValidDate) return { label: "No expiry", tone: "secondary" as const, expired: false }

    const expired = expDate < new Date()
    return {
      label: expired ? "Expired" : `Active until ${format(expDate as Date, "MMM d, yyyy")}`,
      tone: expired ? ("destructive" as const) : ("default" as const),
      expired,
    }
  }

  const activeForms = forms.filter((form) => !getFormStatus(form).expired).length
  const expiredForms = forms.filter((form) => getFormStatus(form).expired).length

  if (loading) return <Loader />

  return (
    <div className="min-h-screen px-6 pb-6 space-y-6 bg-[var(--color-snow-white)] fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
        <div>
          <h1 className="text-3xl font-bold pb-1 text-soft-coral">Feedback Forms</h1>

          <span
            className="text-base font-semibold mt-0.5 block"
            style={{
              background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Build surveys, track targeting, and review patient responses
          </span>

          <p className="text-sm text-[var(--color-cool-gray)] mt-1">
            Manage feedback forms from a clean, centralized dashboard.
          </p>
        </div>

        <Button onClick={() => router.push("/admin/feedback/create")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 self-start sm:self-auto" style={{ background: "var(--gradient-primary)" }}>
          <Plus className="h-4 w-4" /> Create Form
        </Button>
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card className="border-white/50 bg-white/70 shadow-sm backdrop-blur">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total forms</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold text-soft-blue">{forms.length}</span>
                <FileText className="h-5 w-5 text-soft-blue" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/50 bg-white/70 shadow-sm backdrop-blur">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Active forms</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold text-mint-green">{activeForms}</span>
                <CalendarClock className="h-5 w-5 text-mint-green" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/50 bg-white/70 shadow-sm backdrop-blur">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Expired forms</p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold text-soft-coral">{expiredForms}</span>
                <Clock className="h-5 w-5 text-soft-coral" />
              </div>
            </CardContent>
          </Card>
      </div>

      {forms.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-soft-blue/10 p-4">
              <FileText className="h-8 w-8 text-soft-blue" />
            </div>
            <CardTitle className="mt-5 text-2xl">No forms created yet</CardTitle>
            <CardDescription className="mt-2 max-w-md">
              Create your first feedback form to gather patient insights and track response quality.
            </CardDescription>
            <Button onClick={() => router.push("/admin/feedback/create")} className="mt-6 bg-soft-blue hover:bg-mint-green">
              <Plus className="mr-2 h-4 w-4" /> Create Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {forms.map((form) => {
            const status = getFormStatus(form)

            return (
              <Card
                key={form._id}
                className="group cursor-pointer overflow-hidden border-border/60 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
                onClick={() => router.push(`/admin/feedback/${form._id}/results`)}
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral" />
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-soft-blue/10 to-mint-green/10 ring-1 ring-soft-blue/10">
                        <FileText className="h-5 w-5 text-soft-blue" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="line-clamp-1 text-lg transition-colors group-hover:text-soft-blue">
                            {form.title}
                          </CardTitle>
                          {status.expired ? (
                            <span className="rounded-full bg-soft-coral/10 px-2 py-0.5 text-[11px] font-medium text-soft-coral">
                              Expired
                            </span>
                          ) : (
                            <span className="rounded-full bg-mint-green/10 px-2 py-0.5 text-[11px] font-medium text-mint-green">
                              Active
                            </span>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                          {form.description}
                        </CardDescription>
                      </div>
                    </div>

                    <ArrowUpRight className="mt-1 h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-soft-blue" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-soft-blue/20 bg-soft-blue/5 text-soft-blue">
                      {form.questions.length} questions
                    </Badge>
                    <Badge variant={status.tone}>{status.label}</Badge>
                  </div>

                  <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className={`h-4 w-4 ${status.expired ? "text-soft-coral" : "text-soft-blue"}`} />
                      <span className={status.expired ? "font-medium text-soft-coral" : "text-foreground"}>
                        {status.expired
                          ? `Expired ${form.expiresAt && !isNaN(new Date(form.expiresAt).getTime()) ? format(new Date(form.expiresAt), "MMM d, yyyy h:mm a") : ""}`
                          : status.label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-mint-green" />
                      <span>Open results to review patient responses and trends</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
