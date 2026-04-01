"use client"

import { AlertCircle, CheckCircle2, X } from "lucide-react"
import type { SendResult } from "@/types/admin/newsletter.types"

interface ResultBannerProps {
  result: SendResult
  onClose: () => void
}

export function ResultBanner({ result, onClose }: ResultBannerProps) {
  const allSent = result.failedCount === 0

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-2xl border ${
        allSent
          ? "bg-[oklch(0.95_0.04_178)] border-[var(--color-mint-green)]/40"
          : "bg-[oklch(0.96_0.06_10)] border-[var(--color-soft-coral)]/40"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          allSent ? "bg-[var(--color-mint-green)]/20" : "bg-[var(--color-soft-coral)]/20"
        }`}
      >
        {allSent ? (
          <CheckCircle2 className="w-5 h-5 text-[var(--color-mint-green)]" />
        ) : (
          <AlertCircle className="w-5 h-5 text-[var(--color-soft-coral)]" />
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">
          {result.message}
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <span className="text-xs text-[var(--color-cool-gray)]">
            ✉ Sent:{" "}
            <strong className="text-[var(--color-mint-green)]">{result.sentCount}</strong>
          </span>
          {result.failedCount > 0 && (
            <span className="text-xs text-[var(--color-cool-gray)]">
              ✗ Failed:{" "}
              <strong className="text-[var(--color-soft-coral)]">{result.failedCount}</strong>
            </span>
          )}
          <span className="text-xs text-[var(--color-cool-gray)]">
            Recipients: <strong>{result.recipientCount}</strong>
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-1.5 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
      </button>
    </div>
  )
}
