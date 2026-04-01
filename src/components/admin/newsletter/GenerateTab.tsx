"use client"

import { useState } from "react"
import {
  AlertCircle, Loader2, RefreshCw, Send, Sparkles, XCircle,
} from "lucide-react"
import { HtmlPreview } from "./HtmlPreview"
import { ResultBanner } from "./ResultBanner"
import { BASE_URL, MOCK_USER_ID } from "@/lib/admin/constants"
import { escapeHtml, unescapeHtml } from "@/helpers/generateNewsletter"
import type { SendResult } from "@/types/admin/newsletter.types"

interface GenerateTabProps {
  subscriberCount: number
}

export function GenerateTab({ subscriberCount }: GenerateTabProps) {
  const [idea, setIdea] = useState("")
  const [subject, setSubject] = useState("")
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [genLoading, setGenLoading] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const [genError, setGenError] = useState("")
  const [sendError, setSendError] = useState("")
  const [sendResult, setSendResult] = useState<SendResult | null>(null)

  const handleGenerate = async () => {
    if (!idea.trim()) return
    setGenLoading(true)
    setGenError("")
    setGeneratedHtml(null)
    setSendResult(null)

    try {
      const res = await fetch(`${BASE_URL}/generate-newsletter-html`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), userId: MOCK_USER_ID }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Generation failed")
      setGeneratedHtml(unescapeHtml(data.data?.html ?? ""))
    } catch (e: any) {
      setGenError(e.message || "Failed to generate newsletter. Check your connection.")
    } finally {
      setGenLoading(false)
    }
  }

  const handleSend = async () => {
    if (!generatedHtml || !subject.trim()) return
    setSendLoading(true)
    setSendError("")
    setSendResult(null)

    try {
      const res = await fetch(`${BASE_URL}/send-newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: escapeHtml(generatedHtml),
          subject: subject.trim(),
          userId: MOCK_USER_ID,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Send failed")
      setSendResult(data.data)
    } catch (e: any) {
      setSendError(e.message || "Failed to send newsletter. Check your connection.")
    } finally {
      setSendLoading(false)
    }
  }

  const canSend = !!generatedHtml && subject.trim().length > 0 && !sendLoading

  return (
    <div className="space-y-5">

      {/* ── Step 1: Input ── */}
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))" }}
        />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[var(--color-soft-blue)]" />
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
              AI Newsletter Generator
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-dark-slate-gray)] mb-1.5">
              Newsletter Idea / Topic
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={3}
              placeholder="e.g. Weekly health tips about maintaining a balanced diet and exercise routine..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none text-sm resize-none bg-gray-50 placeholder:text-[var(--color-cool-gray)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-dark-slate-gray)] mb-1.5">
              Email Subject Line
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Hygieia Weekly Health Newsletter — March Edition"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none text-sm bg-gray-50 placeholder:text-[var(--color-cool-gray)]"
            />
          </div>

          {genError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[oklch(0.96_0.06_10)] text-xs text-[var(--color-soft-coral)]">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {genError}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={!idea.trim() || genLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)" }}
            >
              {genLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate HTML</>
              )}
            </button>

            {generatedHtml && !genLoading && (
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium border border-[var(--color-cool-gray)]/30 text-[var(--color-cool-gray)] hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Recreate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Step 2: Preview ── */}
      {generatedHtml && (
        <HtmlPreview
          html={generatedHtml}
          show={showPreview}
          onToggle={() => setShowPreview((p) => !p)}
        />
      )}

      {/* ── Step 3: Send ── */}
      {generatedHtml && (
        <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{ background: "linear-gradient(90deg, var(--color-mint-green), oklch(0.60 0.14 170))" }}
          />
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[var(--color-mint-green)]" />
                <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
                  Send to Subscribers
                </h2>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "oklch(0.95 0.04 178)", color: "var(--color-mint-green)" }}
              >
                {subscriberCount} recipients
              </span>
            </div>

            {!subject.trim() && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Please add a subject line above before sending.
              </div>
            )}

            {sendError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[oklch(0.96_0.06_10)] text-xs text-[var(--color-soft-coral)]">
                <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {sendError}
              </div>
            )}

            {sendResult && (
              <ResultBanner result={sendResult} onClose={() => setSendResult(null)} />
            )}

            {!sendResult && (
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))",
                }}
              >
                {sendLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="w-4 h-4" /> Send to All Subscribers</>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
