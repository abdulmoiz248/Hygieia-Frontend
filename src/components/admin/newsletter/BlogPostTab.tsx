"use client"

import { useState } from "react"
import { BookOpen, RefreshCw, Rss, Send } from "lucide-react"
import { HtmlPreview } from "./HtmlPreview"
import { ResultBanner } from "./ResultBanner"
import { useGenerateBlogNewsletter } from "@/hooks/admin/newsletters/useGenerateBlogNewsletter"
import { useSendBlogNewsletter } from "@/hooks/admin/newsletters/useSendBlogNewsletter"
import type { BlogSendResult, SendResult } from "@/types/admin/newsletter.types"

interface BlogPostTabProps {
  subscriberCount: number
}

export function BlogPostTab({ subscriberCount }: BlogPostTabProps) {
  const [blogpostId, setBlogpostId] = useState("")
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const [blogMeta, setBlogMeta] = useState<BlogSendResult["blogpost"] | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [sendResult, setSendResult] = useState<SendResult | null>(null)

  const generateMutation = useGenerateBlogNewsletter()
  const sendMutation = useSendBlogNewsletter()

  const handleGenerate = async () => {
    if (!blogpostId.trim()) return
    setSendResult(null)
    const result = await generateMutation.mutateAsync({ blogpostId: blogpostId.trim() }).catch(() => null)
    if (result) {
      setGeneratedHtml(result.html)
      setBlogMeta(result.blogpost)
    }
  }

  const handleSend = async () => {
    if (!generatedHtml) return
    const result = await sendMutation.mutateAsync({ blogpostId: blogpostId.trim() }).catch(() => null)
    if (result) setSendResult(result)
  }

  return (
    <div className="space-y-5">

      {/* ── Step 1: Input ── */}
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
        />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-[var(--color-soft-coral)]" />
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
              Blog Post Newsletter
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
              style={{ background: "oklch(0.96 0.06 10)", color: "var(--color-soft-coral)" }}
            >
              AI-converted
            </span>
          </div>

          <p className="text-xs text-[var(--color-cool-gray)] leading-relaxed">
            Enter a blog post ID and the AI will automatically convert it into a newsletter
            format. Preview it before sending to all {subscriberCount} subscribers.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-dark-slate-gray)] mb-1.5">
              Blog Post ID
            </label>
            <input
              value={blogpostId}
              onChange={(e) => setBlogpostId(e.target.value)}
              placeholder="e.g. 9a5d2f1a-9bc7-4c52-8214-1f03e11faa01"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-coral)] outline-none text-sm bg-gray-50 font-mono placeholder:text-[var(--color-cool-gray)] placeholder:font-sans"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={!blogpostId.trim() || generateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
            >
              {generateMutation.isPending ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating…</>
              ) : (
                <><Rss className="w-4 h-4" /> Generate Newsletter</>
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

      {/* ── Step 3: Send ── */}
      {generatedHtml && (
        <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
          <div
            className="h-1.5 w-full"
            style={{ background: "linear-gradient(90deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
          />
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[var(--color-soft-coral)]" />
                <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
                  Send Newsletter
                </h2>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "oklch(0.96 0.06 10)", color: "var(--color-soft-coral)" }}
              >
                {subscriberCount} recipients
              </span>
            </div>

            {/* Blog post meta */}
            {blogMeta && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/20 bg-gray-50">
                <BookOpen className="w-4 h-4 text-[var(--color-soft-coral)] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-dark-slate-gray)] truncate">
                    {blogMeta.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-cool-gray)] mt-0.5">
                    {blogMeta.category}
                  </p>
                </div>
              </div>
            )}

            {sendResult && (
              <ResultBanner result={sendResult} onClose={() => setSendResult(null)} />
            )}

            {!sendResult && (
              <button
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
              >
                {sendMutation.isPending ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
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
