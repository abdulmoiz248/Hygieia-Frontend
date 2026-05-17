"use client"

import { useState, useMemo } from "react"
import {
  ShieldAlert,
  Search,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquareWarning,
  X,
  Loader2,
  FileX,
  User,
} from "lucide-react"
import { useProviderReports, ProviderReport } from "@/hooks/admin/reports/useProviderReports"
import { useWarnProvider } from "@/hooks/admin/reports/useWarnProvider"
import { adminSuccess, adminError, AdminToastContainer } from "@/toasts/AdminToasts"

// ─── Warn Modal ────────────────────────────────────────────────────────────────

interface WarnModalProps {
  report: ProviderReport
  providerEmail: string
  onConfirm: (notes: string) => void
  onClose: () => void
  isPending: boolean
}

function WarnModal({ report, providerEmail, onConfirm, onClose, isPending }: WarnModalProps) {
  const [notes, setNotes] = useState("")
  const [attempted, setAttempted] = useState(false)

  const handleSubmit = () => {
    setAttempted(true)
    if (!notes.trim()) return
    onConfirm(notes.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="font-bold text-gray-800">Issue Formal Warning</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-3.5 text-sm text-amber-800 space-y-1">
            <p className="font-semibold">Provider: {providerEmail}</p>
            <p className="text-amber-700">Report reason: <span className="font-medium">{report.reason}</span></p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Admin Notes <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the warning reason and expected corrective action…"
              className={`w-full rounded-xl border px-4 py-3 text-sm resize-none outline-none transition-colors ${
                attempted && !notes.trim()
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-gray-200 focus:border-[var(--color-soft-blue)]"
              }`}
            />
            {attempted && !notes.trim() && (
              <p className="text-xs text-red-500 mt-1">Admin notes are required.</p>
            )}
          </div>

          <p className="text-xs text-gray-400">
            The provider will receive a formatted notification without revealing the complainant's identity.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            Issue Warning
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Report Card ───────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:  { label: "Pending",  icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
  reviewed: { label: "Reviewed", icon: CheckCircle2,  color: "text-blue-600",   bg: "bg-blue-50 border-blue-200"  },
  resolved: { label: "Resolved", icon: CheckCircle2,  color: "text-green-600",  bg: "bg-green-50 border-green-200"},
}

interface ReportCardProps {
  report: ProviderReport
  providerEmail: string
  onWarn: (report: ProviderReport) => void
}

function ReportCard({ report, providerEmail, onWarn }: ReportCardProps) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.pending
  const StatusIcon = status.icon

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Main row */}
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold flex-shrink-0 mt-0.5 ${status.bg} ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-800 text-sm">{report.reason}</p>
            {report.warning_issued && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                <AlertTriangle className="w-3 h-3" />
                Warning Issued
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(report.created_at).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!report.warning_issued && (
            <button
              onClick={() => onWarn(report)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
            >
              <MessageSquareWarning className="w-3.5 h-3.5" />
              Warn
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-gray-50 space-y-3 pt-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{report.description}</p>
          </div>

          {report.admin_notes && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">Admin Notes</p>
              <p className="text-sm text-blue-800">{report.admin_notes}</p>
            </div>
          )}

          {report.evidence_urls.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Evidence</p>
              <div className="flex flex-wrap gap-2">
                {report.evidence_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Evidence {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Provider Search Panel ─────────────────────────────────────────────────────

interface ProviderSearchProps {
  value: string
  onChange: (v: string) => void
  onSearch: () => void
  isLoading: boolean
}

function ProviderSearch({ value, onChange, onSearch, isLoading }: ProviderSearchProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-700 mb-3">Enter Provider ID to load reports</p>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="e.g. f9e8d7c6-b5a4-3210-fedc-ba0987654321"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[var(--color-soft-blue)] transition-colors font-mono"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={!value.trim() || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--gradient-primary)" }}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Load
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [inputId,     setInputId]     = useState("")
  const [searchedId,  setSearchedId]  = useState<string | null>(null)
  const [warnTarget,  setWarnTarget]  = useState<ProviderReport | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "reviewed" | "resolved">("all")

  const { data, isLoading, isError, error } = useProviderReports(searchedId)
  const warnMutation = useWarnProvider()

  const filtered = useMemo(() => {
    if (!data?.reports) return []
    if (statusFilter === "all") return data.reports
    return data.reports.filter((r) => r.status === statusFilter)
  }, [data?.reports, statusFilter])

  const handleSearch = () => {
    if (inputId.trim()) setSearchedId(inputId.trim())
  }

  const handleWarn = async (notes: string) => {
    if (!warnTarget || !searchedId) return
    try {
      const res = await warnMutation.mutateAsync({
        reportedProviderId: searchedId,
        reportId: warnTarget.id,
        adminNotes: notes,
      })
      adminSuccess(res.message ?? "Warning issued successfully.")
      setWarnTarget(null)
    } catch (e) {
      adminError(e instanceof Error ? e.message : "Failed to issue warning.")
    }
  }

  return (
    <>
      <div className="min-h-screen px-6 pb-6 space-y-6 bg-[var(--color-snow-white)] fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
          <div>
            <h1 className="text-3xl font-bold pb-1 text-soft-coral flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7" />
              Reports
            </h1>
            <span
              className="text-base font-semibold mt-0.5 block"
              style={{
                background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Review patient complaints and manage provider warnings
            </span>
          </div>
        </div>

        {/* Search */}
        <ProviderSearch
          value={inputId}
          onChange={setInputId}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Results */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 gap-3 text-[var(--color-cool-gray)]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading reports…</span>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/50 p-10 text-center">
            <ShieldAlert className="w-9 h-9 mx-auto mb-3 text-red-300" />
            <p className="text-sm font-semibold text-red-600">
              {error instanceof Error ? error.message : "Failed to load reports."}
            </p>
          </div>
        )}

        {data && (
          <>
            {/* Provider Info Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-soft-blue)]/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-[var(--color-soft-blue)]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Provider</p>
                  <p className="text-sm font-semibold text-gray-800">{data.provider.email}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-100 hidden sm:block" />

              <div>
                <p className="text-xs text-gray-400 font-medium">Role</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">{data.provider.role}</p>
              </div>

              <div className="h-8 w-px bg-gray-100 hidden sm:block" />

              <div className="flex items-center gap-5">
                <div className="text-center">
                  <p className="text-2xl font-bold text-soft-coral">{data.totalReports}</p>
                  <p className="text-xs text-gray-400 font-medium">Total Reports</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-500">{data.totalWarningsIssued}</p>
                  <p className="text-xs text-gray-400 font-medium">Warnings Issued</p>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)] gap-1">
              {(["all", "pending", "reviewed", "resolved"] as const).map((s) => {
                const isActive = statusFilter === s
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all duration-200"
                    style={isActive
                      ? { background: "var(--gradient-primary)", color: "white", boxShadow: "0 2px 8px rgba(91,168,196,0.3)" }
                      : { color: "var(--color-cool-gray)" }}
                  >
                    {s === "all" ? `All (${data.totalReports})` : s}
                  </button>
                )
              })}
            </div>

            {/* Report List */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <FileX className="w-10 h-10 mx-auto mb-3 opacity-20 text-gray-400" />
                <p className="text-sm text-gray-400">No reports match this filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    providerEmail={data.provider.email}
                    onWarn={setWarnTarget}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!searchedId && !isLoading && (
          <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center">
            <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-20 text-gray-400" />
            <p className="text-sm text-gray-400">Enter a provider ID above to view their reports</p>
          </div>
        )}

        <AdminToastContainer />
      </div>

      {warnTarget && data && (
        <WarnModal
          report={warnTarget}
          providerEmail={data.provider.email}
          onConfirm={handleWarn}
          onClose={() => setWarnTarget(null)}
          isPending={warnMutation.isPending}
        />
      )}
    </>
  )
}
