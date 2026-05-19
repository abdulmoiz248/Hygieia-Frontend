// PatientReportsSection.tsx

"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Flag,
  Loader2,
  MessageSquareWarning,
  ShieldAlert,
  X,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  useProviderReports,
  type ProviderReport,
} from "@/hooks/admin/reports/useProviderReports"

import { useWarnWorker } from "@/hooks/admin/reports/useWarnProvider"

import { adminSuccess, adminError } from "@/toasts/AdminToasts"

import { createPortal } from "react-dom"

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function timeAgoShort(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()

  const mins = Math.floor(diff / 60000)

  if (mins < 60) return `${mins}m ago`

  const hrs = Math.floor(mins / 60)

  if (hrs < 24) return `${hrs}h ago`

  const days = Math.floor(hrs / 24)

  if (days < 30) return `${days}d ago`

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function statusConfig(status: ProviderReport["status"]) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      }

    case "reviewed":
      return {
        label: "Reviewed",
        color: "bg-soft-blue/10 text-soft-blue border-soft-blue/20",
      }

    case "resolved":
      return {
        label: "Resolved",
        color: "bg-mint-green/10 text-mint-green border-mint-green/20",
      }

    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-600 border-gray-200",
      }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Warn Modal
// ─────────────────────────────────────────────────────────────────────────────

interface WarnModalProps {
  workerId: string
  workerName: string
  reportId: string
  onClose: () => void
}

function WarnModal({
  workerId,
  workerName,
  reportId,
  onClose,
}: WarnModalProps) {
  const [message, setMessage] = useState("")

  const { mutate: warn, isPending } = useWarnWorker()

  const handleSubmit = () => {
    if (!message.trim()) return

    warn(
      {
        reportedProviderId: workerId,
        reportId,
        adminNotes: message.trim(),
      },
      {
        onSuccess: () => {
          adminSuccess(`Warning issued to ${workerName}.`)
          onClose()
        },

        onError: (err: Error) => {
          adminError(err.message || "Failed to issue warning.")
        },
      }
    )
  }

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-soft-coral), oklch(0.55 0.28 15))",
          }}
        />

        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.96 0.06 10)" }}
            >
              <ShieldAlert
                className="w-5 h-5"
                style={{ color: "var(--color-soft-coral)" }}
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
                Issue Official Warning
              </h2>

              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">
                To: <span className="font-medium">{workerName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div
            className="flex gap-3 p-3.5 rounded-xl border border-[var(--color-soft-coral)]/20"
            style={{ background: "oklch(0.98 0.02 10)" }}
          >
            <AlertTriangle
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: "var(--color-soft-coral)" }}
            />

            <p className="text-xs text-[var(--color-cool-gray)] leading-relaxed">
              This warning will be officially recorded and sent to the
              provider.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">
              Warning Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue and expected behaviour change…"
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none transition-all
                bg-gray-50 border border-gray-200
                focus:bg-white focus:border-[var(--color-soft-coral)] focus:ring-2 focus:ring-[var(--color-soft-coral)]/15
                placeholder:text-gray-400"
            />

            <p className="text-[11px] text-[var(--color-cool-gray)]/70 mt-1 pl-0.5">
              {message.trim().length} / 500 characters
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-[var(--color-cool-gray)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending || !message.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] shadow-sm disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))",
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Warning
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  if (typeof document === "undefined") return null

  return createPortal(modal, document.body)
}

// ─────────────────────────────────────────────────────────────────────────────
// Report Card
// ─────────────────────────────────────────────────────────────────────────────

interface ReportCardProps {
  report: ProviderReport
  onWarn: (reportId: string) => void
}

function ReportCard({ report, onWarn }: ReportCardProps) {
  const st = statusConfig(report.status)

  return (
    <div className="p-4 rounded-xl border border-cool-gray/15 bg-white hover:shadow-sm transition-shadow">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 flex-shrink-0 mt-0.5">
          <AvatarFallback className="bg-soft-coral/10 text-soft-coral text-xs font-bold">
            P
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">
                Anonymous Patient
              </p>

              <p className="text-[11px] text-[var(--color-cool-gray)] mt-0.5">
                Identity Hidden
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${st.color}`}
              >
                {st.label}
              </span>

              <span className="text-[10px] text-[var(--color-cool-gray)]">
                {timeAgoShort(report.created_at)}
              </span>

              {report.warning_issued && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-soft-coral/10 text-soft-coral border-soft-coral/20">
                  Warning Issued
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold text-[var(--color-soft-coral)] flex items-center gap-1">
              <Flag className="w-3 h-3" />
              {report.reason}
            </p>

            {report.description && (
              <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed">
                {report.description}
              </p>
            )}
          </div>

          {!report.warning_issued && (
            <div className="mt-4">
              <Button
                size="sm"
                onClick={() => onWarn(report.id)}
                className="rounded-xl"
              >
                <ShieldAlert className="w-4 h-4 mr-1" />
                Issue Warning
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

interface PatientReportsSectionProps {
  workerId: string
  workerName: string
}

export function PatientReportsSection({
  workerId,
  workerName,
}: PatientReportsSectionProps) {
  const [showWarnModal, setShowWarnModal] = useState(false)

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  const {
    data,
    isPending,
    isError,
    refetch,
  } = useProviderReports(workerId)

  const reports = data?.reports ?? []

  const total = data?.totalReports ?? 0

  const totalWarnings = data?.totalWarningsIssued ?? 0

  const pendingCount = reports.filter(
    (r) => r.status === "pending"
  ).length

  return (
    <>
      <Card className="hover-lift border-soft-coral/20 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className=" border-b border-soft-coral/10 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-soft-coral flex items-center gap-2 text-base">
              <MessageSquareWarning className="w-5 h-5" />

              Patient Reports

              {!isPending && total > 0 && (
                <span className="ml-1 text-xs font-semibold bg-soft-coral/10 text-soft-coral border border-soft-coral/20 px-2 py-0.5 rounded-full">
                  {total}
                </span>
              )}

              {!isPending && pendingCount > 0 && (
                <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pendingCount} pending
                </span>
              )}

              {!isPending && totalWarnings > 0 && (
                <span className="text-xs font-semibold bg-soft-coral/10 text-soft-coral border border-soft-coral/20 px-2 py-0.5 rounded-full">
                  {totalWarnings} warnings
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {isPending && (
            <div className="flex items-center justify-center py-10 gap-3 text-[var(--color-cool-gray)]">
              <Loader2 className="w-5 h-5 animate-spin text-soft-coral" />

              <span className="text-sm">
                Loading patient reports…
              </span>
            </div>
          )}

          {isError && !isPending && (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-[var(--color-cool-gray)]">
              <AlertTriangle className="w-8 h-8 text-soft-coral/50" />

              <p className="text-sm">
                Failed to load reports.
              </p>

              <button
                onClick={() => refetch()}
                className="text-xs text-soft-blue underline underline-offset-2 mt-1"
              >
                Retry
              </button>
            </div>
          )}

          {!isPending && !isError && reports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-[var(--color-cool-gray)]">
              <CheckCircle2 className="w-8 h-8 text-mint-green/60" />

              <p className="text-sm font-medium text-[var(--color-dark-slate-gray)]">
                No patient reports
              </p>

              <p className="text-xs text-[var(--color-cool-gray)]">
                This provider has a clean record.
              </p>
            </div>
          )}

          {!isPending && reports.length > 0 && (
            <div className="space-y-3">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onWarn={(reportId) => {
                    setSelectedReportId(reportId)
                    setShowWarnModal(true)
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showWarnModal && selectedReportId && (
        <WarnModal
          workerId={workerId}
          workerName={workerName}
          reportId={selectedReportId}
          onClose={() => {
            setShowWarnModal(false)
            setSelectedReportId(null)
          }}
        />
      )}
    </>
  )
}