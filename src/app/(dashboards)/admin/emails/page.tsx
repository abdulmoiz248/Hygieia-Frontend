"use client"

import { useState } from "react"
import {
  Mail, Send, Sparkles, Users, CheckCircle2, XCircle,
  Loader2, Eye, EyeOff, RefreshCw, BookOpen,
  MailOpen, Rss, X, AlertCircle, Copy, Check,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "generate" | "blogpost" | "subscribers"

interface SendResult {
  sentCount: number
  failedCount: number
  recipientCount: number
  message: string
}

interface BlogSendResult extends SendResult {
  blogpost: { id: string; title: string; category: string }
}

interface Subscriber {
  email: string
  subscribedAt: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_SUBSCRIBERS: Subscriber[] = [
  { email: "ali.khan@gmail.com",       subscribedAt: "2026-03-01T10:00:00Z" },
  { email: "sana.mirza@outlook.com",   subscribedAt: "2026-03-05T08:30:00Z" },
  { email: "farhan.sheikh@gmail.com",  subscribedAt: "2026-03-10T14:00:00Z" },
  { email: "ayesha.malik@gmail.com",   subscribedAt: "2026-03-12T09:15:00Z" },
  { email: "usman.tariq@yahoo.com",    subscribedAt: "2026-03-15T11:00:00Z" },
  { email: "nadia.cheema@gmail.com",   subscribedAt: "2026-03-18T16:45:00Z" },
  { email: "kamran.iqbal@gmail.com",   subscribedAt: "2026-03-20T07:30:00Z" },
  { email: "mariam.tahir@outlook.com", subscribedAt: "2026-03-22T13:00:00Z" },
  { email: "zara.hussain@gmail.com",   subscribedAt: "2026-03-24T10:20:00Z" },
  { email: "bilal.raza@gmail.com",     subscribedAt: "2026-03-26T15:00:00Z" },
]

const MOCK_USER_ID = "5e3dd75b-7c38-4bf9-8a76-bc45bab74d7c"
const BASE_URL = "http://localhost:4000"

// ─── Escape helpers ───────────────────────────────────────────────────────────
// Backend returns HTML with escape sequences inside JSON strings.
// We unescape on receive and re-escape on send.

function unescapeHtml(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
}

function escapeHtml(html: string): string {
  return html
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days}d ago`
}

// ─── Stat Card — identical layout to users/CV page StatCards ─────────────────

function StatCard({
  icon: Icon,
  count,
  label,
  gradient,
  lightBg,
  color,
}: {
  icon: React.ElementType
  count: number | string
  label: string
  gradient: string
  lightBg: string
  color: string
}) {
  return (
    <div className="rounded-2xl bg-white border border-[var(--color-cool-gray)]/15 shadow-sm overflow-hidden">
      <div className="h-1.5 w-full" style={{ background: gradient }} />
      <div className="p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: lightBg }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1">
          <p className="text-3xl font-bold text-[var(--color-dark-slate-gray)] leading-none">{count}</p>
          <p className="text-sm text-[var(--color-cool-gray)] mt-1 font-medium">{label}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Result Banner ────────────────────────────────────────────────────────────

function ResultBanner({ result, onClose }: { result: SendResult; onClose: () => void }) {
  const allSent = result.failedCount === 0
  return (
    <div className={`flex items-start gap-4 p-4 rounded-2xl border ${
      allSent
        ? "bg-[oklch(0.95_0.04_178)] border-[var(--color-mint-green)]/40"
        : "bg-[oklch(0.96_0.06_10)] border-[var(--color-soft-coral)]/40"
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        allSent ? "bg-[var(--color-mint-green)]/20" : "bg-[var(--color-soft-coral)]/20"
      }`}>
        {allSent
          ? <CheckCircle2 className="w-5 h-5 text-[var(--color-mint-green)]" />
          : <AlertCircle className="w-5 h-5 text-[var(--color-soft-coral)]" />
        }
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">{result.message}</p>
        <div className="flex flex-wrap gap-3 mt-2">
          <span className="text-xs text-[var(--color-cool-gray)]">
            ✉ Sent: <strong className="text-[var(--color-mint-green)]">{result.sentCount}</strong>
          </span>
          {result.failedCount > 0 && (
            <span className="text-xs text-[var(--color-cool-gray)]">
              ✗ Failed: <strong className="text-[var(--color-soft-coral)]">{result.failedCount}</strong>
            </span>
          )}
          <span className="text-xs text-[var(--color-cool-gray)]">
            Recipients: <strong>{result.recipientCount}</strong>
          </span>
        </div>
      </div>
      <button onClick={onClose} className="p-1.5 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0">
        <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
      </button>
    </div>
  )
}

// ─── HTML Preview ─────────────────────────────────────────────────────────────

function HtmlPreview({ html, show, onToggle }: { html: string; show: boolean; onToggle: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-[var(--color-cool-gray)]/20 overflow-hidden bg-white shadow-sm">
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MailOpen className="w-4 h-4 text-[var(--color-soft-blue)]" />
          <span className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">
            Email Preview
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-cool-gray)] hover:bg-gray-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[var(--color-mint-green)]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy HTML"}
          </button>
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-cool-gray)] hover:bg-gray-200 transition-colors"
          >
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {show && (
        <iframe
          srcDoc={html}
          title="Newsletter Preview"
          className="w-full border-0"
          style={{ height: "520px" }}
          sandbox="allow-same-origin"
        />
      )}

      {!show && (
        <div className="p-8 text-center text-[var(--color-cool-gray)]">
          <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Preview hidden. Click Show to render.</p>
        </div>
      )}
    </div>
  )
}

// ─── Generate & Send Tab ──────────────────────────────────────────────────────

function GenerateTab({ subscriberCount }: { subscriberCount: number }) {
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
      // Unescape escape sequences from JSON-encoded HTML
      const rawHtml = data.data?.html ?? ""
      setGeneratedHtml(unescapeHtml(rawHtml))
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

      {/* Form card */}
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        <div className="h-1.5 w-full" style={{
          background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))"
        }} />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[var(--color-soft-blue)]" />
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
              AI Newsletter Generator
            </h2>
          </div>

          {/* Idea */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-dark-slate-gray)] mb-1.5">
              Newsletter Idea / Topic
            </label>
            <textarea
              value={idea}
              onChange={e => setIdea(e.target.value)}
              rows={3}
              placeholder="e.g. Weekly health tips about maintaining a balanced diet and exercise routine..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none text-sm resize-none bg-gray-50 placeholder:text-[var(--color-cool-gray)]"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-dark-slate-gray)] mb-1.5">
              Email Subject Line
            </label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Hygieia Weekly Health Newsletter — March Edition"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none text-sm bg-gray-50 placeholder:text-[var(--color-cool-gray)]"
            />
          </div>

          {/* Generate error */}
          {genError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[oklch(0.96_0.06_10)] text-xs text-[var(--color-soft-coral)]">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {genError}
            </div>
          )}

          {/* Generate button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={!idea.trim() || genLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)" }}
            >
              {genLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                : <><Sparkles className="w-4 h-4" /> Generate HTML</>
              }
            </button>

            {generatedHtml && !genLoading && (
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium border border-[var(--color-cool-gray)]/30 text-[var(--color-cool-gray)] hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      {generatedHtml && (
        <HtmlPreview
          html={generatedHtml}
          show={showPreview}
          onToggle={() => setShowPreview(p => !p)}
        />
      )}

      {/* Send section */}
      {generatedHtml && (
        <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-[var(--color-mint-green)]" />
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">Send Newsletter</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "oklch(0.95 0.04 178)", color: "var(--color-mint-green)" }}>
              {subscriberCount} recipients
            </span>
          </div>

          {!subject.trim() && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              Please add a subject line before sending.
            </div>
          )}

          {sendError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[oklch(0.96_0.06_10)] text-xs text-[var(--color-soft-coral)]">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {sendError}
            </div>
          )}

          {sendResult && <ResultBanner result={sendResult} onClose={() => setSendResult(null)} />}

          {!sendResult && (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))" }}
            >
              {sendLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                : <><Send className="w-4 h-4" /> Send to All Subscribers</>
              }
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Blog Post Tab ────────────────────────────────────────────────────────────

function BlogPostTab({ subscriberCount }: { subscriberCount: number }) {
  const [blogpostId, setBlogpostId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<BlogSendResult | null>(null)

  const handleSend = async () => {
    if (!blogpostId.trim()) return
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch(`${BASE_URL}/send-blogpost-newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogpostId: blogpostId.trim(), userId: MOCK_USER_ID }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to send")
      setResult(data.data)
    } catch (e: any) {
      setError(e.message || "Failed to send. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        <div className="h-1.5 w-full" style={{
          background: "linear-gradient(90deg, var(--color-soft-coral), oklch(0.55 0.28 15))"
        }} />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-[var(--color-soft-coral)]" />
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
              Send Blog Post as Newsletter
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
              style={{ background: "oklch(0.96 0.06 10)", color: "var(--color-soft-coral)" }}>
              AI-converted
            </span>
          </div>

          <p className="text-xs text-[var(--color-cool-gray)] leading-relaxed">
            Enter a blog post ID and the AI will automatically convert it into a newsletter format
            and send it to all {subscriberCount} subscribers.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-dark-slate-gray)] mb-1.5">
              Blog Post ID
            </label>
            <input
              value={blogpostId}
              onChange={e => setBlogpostId(e.target.value)}
              placeholder="e.g. 9a5d2f1a-9bc7-4c52-8214-1f03e11faa01"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-coral)] outline-none text-sm bg-gray-50 font-mono placeholder:text-[var(--color-cool-gray)] placeholder:font-sans"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[oklch(0.96_0.06_10)] text-xs text-[var(--color-soft-coral)]">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <ResultBanner result={result} onClose={() => setResult(null)} />
              {result.blogpost && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/20 bg-gray-50">
                  <BookOpen className="w-4 h-4 text-[var(--color-soft-coral)] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--color-dark-slate-gray)] truncate">
                      {result.blogpost.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-cool-gray)] mt-0.5">
                      {result.blogpost.category}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!blogpostId.trim() || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting & Sending…</>
              : <><Rss className="w-4 h-4" /> Convert & Send Newsletter</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Subscribers Tab ──────────────────────────────────────────────────────────

function SubscribersTab({ subscribers }: { subscribers: Subscriber[] }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-soft-blue)]" />
            <h2 className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">Mailing List</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "oklch(0.95 0.05 210)", color: "var(--color-soft-blue)" }}>
            {subscribers.length} subscribers
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {subscribers.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.95 0.05 210)" }}>
                  <Mail className="w-3.5 h-3.5 text-[var(--color-soft-blue)]" />
                </div>
                <span className="text-sm text-[var(--color-dark-slate-gray)]">{s.email}</span>
              </div>
              <span className="text-xs text-[var(--color-cool-gray)]">{timeAgo(s.subscribedAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { value: Tab; label: string; icon: React.ElementType }[] = [
  { value: "generate",    label: "Generate & Send",        icon: Sparkles   },
  { value: "blogpost",    label: "Blog Post Newsletter",   icon: BookOpen   },
  { value: "subscribers", label: "Subscribers",            icon: Users      },
]

export default function NewsletterPage() {
  const [tab, setTab] = useState<Tab>("generate")
  const subscribers = MOCK_SUBSCRIBERS

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)]">

      {/* HEADER — same classes as Manage Workers / CV Management */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-soft-blue)] via-[var(--color-mint-green)] to-[var(--color-soft-coral)] bg-clip-text text-transparent pb-1">
            Newsletter
          </h1>
          <p className="text-sm text-[var(--color-cool-gray)] mt-1">
            Generate, preview, and send newsletters to your subscribers
          </p>
        </div>
      </div>

      {/* STAT CARDS — same layout as users & CV pages, 3 cards full width */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          count={subscribers.length}
          label="Total Subscribers"
          gradient="linear-gradient(135deg, var(--color-soft-blue), oklch(0.45 0.18 230))"
          lightBg="oklch(0.95 0.05 210)"
          color="var(--color-soft-blue)"
        />
        <StatCard
          icon={Send}
          count="—"
          label="Newsletters Sent"
          gradient="linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))"
          lightBg="oklch(0.95 0.04 178)"
          color="var(--color-mint-green)"
        />
        <StatCard
          icon={Rss}
          count="—"
          label="Blog Posts Sent"
          gradient="linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))"
          lightBg="oklch(0.96 0.06 10)"
          color="var(--color-soft-coral)"
        />
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm w-fit">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
              style={tab === t.value
                ? { background: "var(--gradient-primary)", color: "white" }
                : { color: "var(--color-cool-gray)" }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* TAB CONTENT */}
      <div>
        {tab === "generate"    && <GenerateTab    subscriberCount={subscribers.length} />}
        {tab === "blogpost"    && <BlogPostTab    subscriberCount={subscribers.length} />}
        {tab === "subscribers" && <SubscribersTab subscribers={subscribers} />}
      </div>
    </div>
  )
}