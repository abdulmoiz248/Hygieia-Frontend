"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Suspense } from "react"
import {
  X, Megaphone, Stethoscope, Salad, FlaskConical,
  Users, Globe, UserCircle, AlertCircle, CheckCircle2, Send,
} from "lucide-react"

import AdminWelcomeSection from "@/components/admin/dashboard/AdminWelcomeSection"
import AdminStatsCards     from "@/components/admin/dashboard/AdminStatsCards"
import AdminRecentActivity from "@/components/admin/dashboard/AdminRecentActivity"
import AdminQuickActions   from "@/components/admin/dashboard/AdminQuickActions"
import AdminChartsSection  from "@/components/admin/dashboard/AdminChartsSection"
import { useAnnouncement } from "@/hooks/admin/newsletters/useAnnouncement"
import { adminError }      from "@/toasts/AdminToasts"
import type { AnnouncementTarget } from "@/hooks/admin/newsletters/useAnnouncement"

// ─── Motion variants ──────────────────────────────────────────────────────────

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0  },
}

// ─── Announcement target options ──────────────────────────────────────────────

interface TargetOption {
  value:       AnnouncementTarget
  label:       string
  description: string
  icon:        React.ElementType
  color:       string
  bg:          string
}

const TARGET_OPTIONS: TargetOption[] = [
  {
    value: "doctor", label: "Doctors", description: "All registered doctors",
    icon: Stethoscope, color: "var(--color-soft-blue)", bg: "oklch(0.95 0.05 210)",
  },
  {
    value: "nutritionist", label: "Nutritionists", description: "All nutritionists",
    icon: Salad, color: "var(--color-mint-green)", bg: "oklch(0.95 0.04 178)",
  },
  {
    value: "pathologist", label: "Pathologists", description: "All lab technicians",
    icon: FlaskConical, color: "oklch(0.55 0.15 270)", bg: "oklch(0.96 0.04 270)",
  },
  {
    value: "all_workers", label: "All Workers", description: "Doctors, nutritionists & pathologists",
    icon: Users, color: "var(--color-soft-coral)", bg: "oklch(0.96 0.06 10)",
  },
  {
    value: "patient", label: "Patients", description: "All registered patients",
    icon: UserCircle, color: "oklch(0.50 0.14 300)", bg: "oklch(0.96 0.04 300)",
  },
  {
    value: "all_users", label: "All Users", description: "Every user on the platform",
    icon: Globe, color: "oklch(0.45 0.12 240)", bg: "oklch(0.95 0.04 240)",
  },
]

// ─── Announcement slide-over panel ───────────────────────────────────────────

function AnnouncementPanel({ onClose }: { onClose: () => void }) {
  const [title,           setTitle]           = useState("")
  const [message,         setMessage]         = useState("")
  const [target,          setTarget]          = useState<AnnouncementTarget | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [result,          setResult]          = useState<{
    recipientCount: number; target: AnnouncementTarget
  } | null>(null)

  const mutation = useAnnouncement()

  const handleSubmit = async () => {
    setSubmitAttempted(true)
    if (!title.trim() || !message.trim() || !target) return
    const data = await mutation.mutateAsync({ title: title.trim(), message: message.trim(), target })
      .catch((err) => { adminError(err?.message || "Failed to send."); return null })
    if (data) setResult({ recipientCount: data.recipientCount, target: data.target })
  }

  const handleReset = () => {
    setResult(null); setTitle(""); setMessage(""); setTarget(null); setSubmitAttempted(false)
  }

  const selectedOption = TARGET_OPTIONS.find((o) => o.value === target)
  const hasError       = submitAttempted && (!title.trim() || !message.trim() || !target)

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => { if (!mutation.isPending) onClose() }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl border-l border-gray-100"
      >
        {/* Top stripe */}
        <div className="h-1 w-full flex-shrink-0" style={{
          background: result
            ? "linear-gradient(90deg, var(--color-mint-green), oklch(0.60 0.14 170))"
            : "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))",
        }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: result ? "oklch(0.95 0.04 178)" : "oklch(0.95 0.05 210)" }}>
              {result
                ? <CheckCircle2 className="w-5 h-5" style={{ color: "var(--color-mint-green)" }} />
                : <Megaphone    className="w-5 h-5" style={{ color: "var(--color-soft-blue)" }} />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
                {result ? "Announcement Sent!" : "Send Announcement"}
              </h2>
              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">
                {result ? "Notification delivered successfully" : "Push a notification to a specific audience"}
              </p>
            </div>
          </div>
          <button onClick={() => { if (!mutation.isPending) onClose() }} disabled={mutation.isPending}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mt-0.5 disabled:opacity-40">
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {result ? (
            <>
              <div className="flex gap-3 p-4 rounded-xl border border-[var(--color-mint-green)]/20"
                style={{ background: "oklch(0.97 0.03 178)" }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-mint-green)" }} />
                <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed">
                  Announcement dispatched to{" "}
                  <span className="font-semibold text-[var(--color-dark-slate-gray)]">
                    {result.recipientCount} {result.recipientCount === 1 ? "recipient" : "recipients"}
                  </span>{" "}
                  ({TARGET_OPTIONS.find((o) => o.value === result.target)?.label ?? result.target})
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleReset}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-[var(--color-cool-gray)] hover:bg-gray-50 transition-all active:scale-[0.98]">
                  Send Another
                </button>
                <button onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
                  style={{ background: "linear-gradient(135deg, var(--color-soft-blue), var(--color-mint-green))" }}>
                  Done
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Title field */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">
                  Announcement Title
                </label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. System Maintenance Tonight"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all
                    bg-gray-50 border border-gray-200 placeholder:text-gray-400
                    focus:bg-white focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15" />
              </div>

              {/* Message field */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">
                  Message
                </label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. System maintenance will start tonight at 11:00 PM UTC."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all resize-none
                    bg-gray-50 border border-gray-200 placeholder:text-gray-400
                    focus:bg-white focus:border-[var(--color-mint-green)] focus:ring-2 focus:ring-[var(--color-mint-green)]/15" />
              </div>

              {/* Target audience */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TARGET_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = target === opt.value
                    return (
                      <button key={opt.value} onClick={() => setTarget(opt.value)}
                        className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all border hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]"
                        style={isSelected
                          ? { background: opt.bg, borderColor: opt.color }
                          : { background: "white", borderColor: "#e5e7eb" }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = opt.bg
                            e.currentTarget.style.borderColor = `${opt.color}60`
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = "white"
                            e.currentTarget.style.borderColor = "#e5e7eb"
                          }
                        }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: isSelected ? opt.color : opt.bg }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? "white" : opt.color }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-tight truncate"
                            style={{ color: isSelected ? opt.color : "var(--color-dark-slate-gray)" }}>
                            {opt.label}
                          </p>
                          <p className="text-[10px] text-[var(--color-cool-gray)] leading-tight mt-0.5 truncate">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preview strip */}
              {selectedOption && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
                  style={{ background: selectedOption.bg, borderColor: `${selectedOption.color}40` }}>
                  <Send className="w-3.5 h-3.5 flex-shrink-0" style={{ color: selectedOption.color }} />
                  <p className="text-xs" style={{ color: "var(--color-dark-slate-gray)" }}>
                    Will be sent to{" "}
                    <span className="font-semibold" style={{ color: selectedOption.color }}>
                      {selectedOption.label}
                    </span>
                    {" · "}{selectedOption.description}
                  </p>
                </div>
              )}

              {/* Validation error */}
              {hasError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--color-soft-coral)]/30"
                  style={{ background: "oklch(0.98 0.02 10)" }}>
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-[var(--color-soft-coral)]" />
                  <p className="text-xs text-[var(--color-soft-coral)]">
                    {!title.trim() ? "Please add a title."
                      : !message.trim() ? "Please write a message."
                      : "Please select a target audience."}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button onClick={handleSubmit} disabled={mutation.isPending}
                className="w-full py-2.5 rounded-xl text-white font-medium shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                style={{ background: "var(--gradient-primary)" }}>
                {mutation.isPending
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Dispatching…</>
                  : <><Megaphone className="w-4 h-4" /> Send Announcement</>}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </>
  )
}

// ─── Floating FAB ─────────────────────────────────────────────────────────────

function AnnouncementFAB({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, var(--color-soft-blue), var(--color-mint-green))" }}
      title="Send Announcement"
    >
      <Megaphone className="w-6 h-6" />
    </motion.button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [announcementOpen, setAnnouncementOpen] = useState(false)

  return (
    <>
      <Suspense fallback={
        <div className="space-y-6 lg:space-y-8 w-full animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="h-48 bg-gray-200 rounded-lg" />
          <div className="h-56 bg-gray-200 rounded-lg" />
        </div>
      }>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 lg:space-y-8 w-full"
        >
          <AdminWelcomeSection />
          <AdminStatsCards />
          <AdminChartsSection />
          <motion.div variants={itemVariants} className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
            <AdminRecentActivity />
            <AdminQuickActions />
          </motion.div>
        </motion.div>
      </Suspense>

      {/* Chatbot-style FAB — opens announcement panel */}
      <AnnouncementFAB onClick={() => setAnnouncementOpen(true)} />

      {/* Slide-over with spring animation */}
      <AnimatePresence>
        {announcementOpen && (
          <AnnouncementPanel onClose={() => setAnnouncementOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
