"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Clock, Users, FileText } from "lucide-react"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { listFeedbackForms, FeedbackForm } from "@/api/feedback.api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

  console.log(forms)

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-soft-blue">Feedback Forms</h1>
          <p className="text-muted-foreground mt-1">Manage and view patient feedback surveys.</p>
        </div>
        <Button onClick={() => router.push("/admin/feedback/create")} className="bg-soft-blue hover:bg-mint-green">
          <Plus className="mr-2 h-4 w-4" /> Create Form
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="rounded-full bg-soft-blue/10 p-4 mb-4">
            <FileText className="h-8 w-8 text-soft-blue" />
          </div>
          <CardTitle className="mb-2">No forms created yet</CardTitle>
          <CardDescription className="mb-6">Create your first feedback form to gather patient insights.</CardDescription>
          <Button onClick={() => router.push("/admin/feedback/create")} className="bg-soft-blue hover:bg-mint-green">
            <Plus className="mr-2 h-4 w-4" /> Create Form
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => {
            const expDate = form.expiresAt ? new Date(form.expiresAt) : null
            const isValidDate = expDate && !isNaN(expDate.getTime())
            const isExpired = isValidDate ? expDate < new Date() : false

            return (
              <Card
                key={form._id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/admin/feedback/${form._id}/results`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{form.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{form.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-mint-green" />
                      <span>Sent to {form.percentageOfUsers}% of patients</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-soft-coral" />
                      <span className={isExpired ? "text-soft-coral font-medium" : ""}>
                        {!isValidDate ? "No Expiry Date" : isExpired ? "Expired" : `Expires ${format(expDate as Date, "MMM d, yyyy h:mm a")}`}
                      </span>
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
