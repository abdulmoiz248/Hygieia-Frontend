"use client"

import { BookOpen, CheckCircle2, AlertCircle, Clock, Loader2, Mail, Rss, Users } from "lucide-react"
import { useSentNewsletters } from "@/hooks/admin/newsletters/useSentNewsletters"
import { formatDate } from "@/lib/admin/blog-helpers"
import type { SentNewsletterItem } from "@/hooks/admin/newsletters/useSentNewsletters"

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** For blogpost type, the title is the subject line minus the trailing site suffix */
function extractTitle(item: SentNewsletterItem): string {
  if (item.type === "blogpost") {
    // e.g. "Why Modern Healthcare Needs AI More Than Ever - Hygieia Blog"
    return item.subject.replace(/\s*[-–|]\s*Hygieia.*$/i, "").trim()
  }
  return item.subject
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function HistoryRow({ item }: { item: SentNewsletterItem }) {
  const allSent  = item.failed_count === 0
  const isBlog   = item.type === "blogpost"
  const title    = extractTitle(item)

  return (
    <div className="flex items-start gap-4 px-4 py-4 rounded-xl border border-[var(--color-cool-gray)]/15 bg-gray-50 hover:bg-white hover:shadow-sm transition-all">

      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isBlog
            ? "oklch(0.96 0.06 10)"
            : "oklch(0.95 0.05 210)",
        }}
      >
        {isBlog
          ? <BookOpen className="w-4 h-4 text-[var(--color-soft-coral)]" />
          : <Rss      className="w-4 h-4 text-[var(--color-soft-blue)]"  />
        }
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-1.5">

        {/* Title + type badge */}
        <div className="flex items-start gap-2 flex-wrap">
          <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)] leading-snug">
            {title}
          </p>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 mt-0.5"
            style={
              isBlog
                ? { background: "oklch(0.96 0.06 10)",   color: "var(--color-soft-coral)" }
                : { background: "oklch(0.95 0.05 210)",  color: "var(--color-soft-blue)"  }
            }
          >
            {isBlog ? "Blog Post" : "Manual"}
          </span>
        </div>

        {/* Subject line (only for manual — blog title IS the subject) */}
        {!isBlog && (
          <p className="text-xs text-[var(--color-cool-gray)] flex items-center gap-1.5">
            <Mail className="w-3 h-3 flex-shrink-0" />
            {item.subject}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center flex-wrap gap-3">

          {/* Delivery status */}
          <span className={`flex items-center gap-1 text-xs font-medium ${allSent ? "text-[var(--color-mint-green)]" : "text-[var(--color-soft-coral)]"}`}>
            {allSent
              ? <CheckCircle2 className="w-3.5 h-3.5" />
              : <AlertCircle  className="w-3.5 h-3.5" />
            }
            {allSent ? "All delivered" : `${item.failed_count} failed`}
          </span>

          <span className="w-px h-3 bg-gray-200" />

          {/* Counts */}
          <span className="flex items-center gap-1 text-xs text-[var(--color-cool-gray)]">
            <Users className="w-3 h-3" />
            {item.sent_count} / {item.recipient_count} sent
          </span>

          <span className="w-px h-3 bg-gray-200" />

          {/* Date */}
          <span className="flex items-center gap-1 text-xs text-[var(--color-cool-gray)]">
            <Clock className="w-3 h-3" />
            {formatDate(item.created_at, "long")}
          </span>

        </div>
      </div>
    </div>
  )
}

// ─── Tab ──────────────────────────────────────────────────────────────────────

export function SentHistoryTab() {
  const { data, isLoading } = useSentNewsletters()

  const items = data?.items ?? []

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">

        {/* Accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-soft-coral))" }}
        />

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-soft-blue)]" />
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
              Sent History
            </h2>
          </div>
          {items.length > 0 && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "oklch(0.95 0.05 210)", color: "var(--color-soft-blue)" }}
            >
              {items.length} sent
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-[var(--color-cool-gray)]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs">Loading history…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-[var(--color-cool-gray)]">
              <Mail className="w-8 h-8 opacity-20" />
              <p className="text-sm">No newsletters sent yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* newest first */}
              {[...items]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((item) => (
                  <HistoryRow key={item.id} item={item} />
                ))
              }
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
