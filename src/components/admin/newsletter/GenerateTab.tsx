"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, RefreshCw, Send, Sparkles } from "lucide-react"
import { HtmlPreview } from "./HtmlPreview"
import { ResultBanner } from "./ResultBanner"
import { useGenerateNewsletter } from "@/hooks/admin/newsletters/useGenerateNewsletter"
import { useSendNewsletter } from "@/hooks/admin/newsletters/useSendNewsletter"

interface GenerateTabProps {
  subscriberCount: number
  onSent?: () => void
}

export function GenerateTab({ subscriberCount, onSent }: GenerateTabProps) {
  const [idea, setIdea] = useState("")
  const [subject, setSubject] = useState("")
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [sendResult, setSendResult] = useState<Awaited<ReturnType<typeof useSendNewsletter>>["data"]>(null)

  const generateMutation = useGenerateNewsletter()
  const sendMutation = useSendNewsletter()

  const currentMonth = new Date().toLocaleString("default", { month: "long" })

  const handleGenerate = async () => {
    if (!idea.trim()) return
    setSendResult(null)
    const result = await generateMutation.mutateAsync({ idea: idea.trim() }).catch(() => null)
    if (result) setGeneratedHtml(result.html)
  }

  const handleSend = async () => {
    if (!generatedHtml || !subject.trim()) return
    const result = await sendMutation.mutateAsync({ html: generatedHtml, subject: subject.trim() }).catch(() => null)
    if (result) {
      setSendResult(result)
      onSent?.()
    }
  }

  const canSend = !!generatedHtml && subject.trim().length > 0 && !sendMutation.isPending

  return (
    <div className="space-y-5">

      {/* ── Step 1: Input ── */}
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))" }}
        />
        <div className="p-4 sm:p-6 space-y-4">
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
              placeholder={`e.g. Hygieia Weekly Health Newsletter — ${currentMonth} Edition`}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none text-sm bg-gray-50 placeholder:text-[var(--color-cool-gray)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={!idea.trim() || generateMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)" }}
            >
              {generateMutation.isPending ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate HTML</>
              )}
            </button>

            {generatedHtml && !generateMutation.isPending && (
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

      {/* ── Step 3: Send — compact inline footer, not a separate card ── */}
      {generatedHtml && (
        <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{ background: "linear-gradient(90deg, var(--color-mint-green), oklch(0.60 0.14 170))" }}
          />
          <div className="p-4 sm:p-5">

            {/* Success state */}
            {sendResult ? (
              <ResultBanner result={sendResult} onClose={() => setSendResult(null)} />
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Left: context */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.95 0.04 178)" }}
                  >
                    <Send className="w-4 h-4 text-[var(--color-mint-green)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)] truncate">
                      Ready to send
                    </p>
                    <p className="text-xs text-[var(--color-cool-gray)]">
                      {subscriberCount} subscribers · {subject.trim() || <span className="text-amber-500">add a subject line</span>}
                    </p>
                  </div>
                </div>

                {/* Right: warning or send button */}
                {!subject.trim() ? (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 flex-shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Subject required
                  </div>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02] flex-shrink-0 w-full sm:w-auto"
                    style={{ background: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))" }}
                  >
                    {sendMutation.isPending ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send to {subscriberCount} Subscribers</>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
