"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, FileSearch, HelpCircle, Mail, Zap, ChevronRight } from "lucide-react"
import AddWorkerModal from "@/components/admin/workers/AddWorkerModal"
import FaqFormModal   from "@/components/admin/faq/FaqFormModal"
import { useCreateFaq } from "@/hooks/admin/faq/useCreateFaq"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminSuccess, adminError } from "@/toasts/AdminToasts"
import { useCVs } from "@/hooks/admin/cv/useCVs"
import type { FaqItem } from "@/types/admin/faq"

// ─── Action card ──────────────────────────────────────────────────────────────

interface ActionCardProps {
  icon:        React.ElementType
  label:       string
  description: string
  color:       string        // CSS var token e.g. "var(--color-soft-blue)"
  bgFrom:      string        // tailwind gradient from class
  bgTo:        string        // tailwind gradient to class
  badge?:      number | null
  onClick:     () => void
}

function ActionCard({ icon: Icon, label, description, color, bgFrom, bgTo, badge, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl bg-gradient-to-br ${bgFrom} ${bgTo} hover:brightness-95 transition-all duration-200 group active:scale-[0.98]`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `color-mix(in srgb, ${color} 18%, transparent)` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate" style={{ color }}>
              {label}
            </p>
            {badge != null && badge > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: color }}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminQuickActions() {
  const router   = useRouter()
  const adminId  = useAdminStore((s) => s.adminId)

  const [showAddWorker, setShowAddWorker] = useState(false)
  const [showFaqForm,   setShowFaqForm]   = useState(false)
  const [faqForm,       setFaqForm]       = useState<Omit<FaqItem, "id">>({ question: "", answer: "" })
  const [faqAttempted,  setFaqAttempted]  = useState(false)

  const createFaqMutation = useCreateFaq()
  const { data: cvs = [] } = useCVs()
  const pendingCVCount = cvs.filter((c) => c.status === "new").length

  const handleFaqSubmit = async () => {
    setFaqAttempted(true)
    if (!faqForm.question || !faqForm.answer || !adminId) return
    try {
      await createFaqMutation.mutateAsync({ faq: faqForm, userId: adminId })
      adminSuccess("FAQ created successfully.")
      setShowFaqForm(false)
      setFaqForm({ question: "", answer: "" })
      setFaqAttempted(false)
    } catch {
      adminError("Failed to create FAQ.")
    }
  }

  const actions: ActionCardProps[] = [
    {
      icon:        UserPlus,
      label:       "Add Worker",
      description: "Register a new doctor, nutritionist or pathologist",
      color:       "var(--color-mint-green)",
      bgFrom:      "from-mint-green/10",
      bgTo:        "to-mint-green/5",
      onClick:     () => setShowAddWorker(true),
    },
    {
      icon:        FileSearch,
      label:       "Pending CVs",
      description: "Review new CV submissions awaiting action",
      color:       "var(--color-soft-coral)",
      bgFrom:      "from-soft-coral/10",
      bgTo:        "to-soft-coral/5",
      badge:       pendingCVCount,
      onClick:     () => router.push("/admin/cv?status=new"),
    },
    {
      icon:        HelpCircle,
      label:       "Create FAQ",
      description: "Add a new question to the help centre",
      color:       "var(--color-soft-blue)",
      bgFrom:      "from-soft-blue/10",
      bgTo:        "to-soft-blue/5",
      onClick:     () => { setFaqForm({ question: "", answer: "" }); setFaqAttempted(false); setShowFaqForm(true) },
    },
    {
      icon:        Mail,
      label:       "Send Newsletter",
      description: "Compose and dispatch a newsletter to subscribers",
      color:       "var(--color-cool-gray)",
      bgFrom:      "from-cool-gray/10",
      bgTo:        "to-cool-gray/5",
      onClick:     () => router.push("/admin/newsletters?tab=generate"),
    },
  ]

  return (
    <>
      <Card className="bg-white/60 border-cool-gray/15">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: "var(--color-mint-green)" }} />
            Quick Actions
          </CardTitle>
          <CardDescription>Shortcuts to common tasks</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2.5">
          {actions.map((action) => (
            <ActionCard key={action.label} {...action} />
          ))}
        </CardContent>
      </Card>

      {/* Add Worker modal */}
      {showAddWorker && (
        <AddWorkerModal onClose={() => setShowAddWorker(false)} />
      )}

      {/* Create FAQ modal */}
      {showFaqForm && (
        <FaqFormModal
          form={faqForm}
          isEditing={false}
          submitAttempted={faqAttempted}
          onChange={setFaqForm}
          onSubmit={handleFaqSubmit}
          onClose={() => setShowFaqForm(false)}
        />
      )}
    </>
  )
}
