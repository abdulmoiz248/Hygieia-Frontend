import { useRef, useEffect, useState } from "react"
import { X, Send, Bot, User, Sparkles, ExternalLink } from "lucide-react"
import { useAdminStore } from "@/store/admin/useAdminStore"

// ── Types ─────────────────────────────────────────────────────────────────────

interface RAGSource {
  cv_id:            string
  cv_url:           string
  email:            string
  similarity_score: number
}

interface Message {
  role:      "user" | "assistant"
  content:   string
  timestamp: Date
  sources?:  RAGSource[]
}

interface CVChatPanelProps {
  onClose: () => void
}

// ── Constants ─────────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

// ── Component ─────────────────────────────────────────────────────────────────

export default function CVChatPanel({ onClose }: CVChatPanelProps) {
  const adminId = useAdminStore((s) => s.adminId)

  const [messages, setMessages] = useState<Message[]>([{
    role:      "assistant",
    content:   "Hi! I'm your CV assistant. Ask me anything about the uploaded CVs — like \"Who has the most experience?\" or \"Which candidates are shortlisted?\"",
    timestamp: new Date(),
  }])
  const [input,   setInput]   = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return

    setMessages((prev) => [...prev, { role: "user", content: q, timestamp: new Date() }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`${API}/rag/ask`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:        adminId,
          question:      q,
          topK:          6,
          minSimilarity: 0.15,
          model:         "llama-3.1-8b-instant",
          temperature:   0.2,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json?.message || `Server error: ${res.status}`)
      }

      setMessages((prev) => [...prev, {
        role:      "assistant",
        content:   json?.data?.answer || json?.message || "I couldn't find an answer for that.",
        timestamp: new Date(),
        sources:   json?.data?.sources ?? [],
      }])
    } catch (err) {
      setMessages((prev) => [...prev, {
        role:      "assistant",
        content:   err instanceof Error ? err.message : "Sorry, I couldn't reach the server. Please check your connection.",
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 w-[390px] max-h-[580px] bg-white rounded-2xl shadow-2xl border border-[var(--color-cool-gray)]/15 flex flex-col z-50 overflow-hidden">

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">CV Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
        style={{ maxHeight: "400px" }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>

            {/* Avatar */}
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === "assistant" ? "bg-[oklch(0.95_0.05_210)]" : "bg-[oklch(0.95_0.04_178)]"
            }`}>
              {msg.role === "assistant"
                ? <Bot  className="w-3.5 h-3.5 text-[var(--color-soft-blue)]" />
                : <User className="w-3.5 h-3.5 text-[var(--color-mint-green)]" />}
            </div>

            {/* Bubble + sources */}
            <div className={`flex flex-col gap-1.5 max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "text-white rounded-tr-sm"
                    : "bg-gray-50 text-[var(--color-dark-slate-gray)] rounded-tl-sm"
                }`}
                style={msg.role === "user" ? { background: "var(--gradient-primary)" } : {}}
              >
                {msg.content}
              </div>

              {/* Source chips — only on assistant messages */}
              {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {msg.sources.map((src) => (
                    <div
                      key={src.cv_id}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium"
                      style={{
                        borderColor: "oklch(0.88 0.04 210)",
                        color:       "var(--color-cool-gray)",
                      }}
                    >
                      {/* Email shown as plain text — no raw URL exposed */}
                      <span className="truncate max-w-[120px]">{src.email}</span>

                      {/* "View PDF" opens the actual PDF via Google Docs viewer */}
                      <a
                        href={`https://docs.google.com/gview?url=${encodeURIComponent(src.cv_url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View CV PDF"
                        className="flex items-center gap-0.5 hover:opacity-70 transition-opacity"
                        style={{ color: "var(--color-soft-blue)" }}
                      >
                        <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                        <span className="font-semibold">
                          {(src.similarity_score * 100).toFixed(0)}%
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[oklch(0.95_0.05_210)] flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-[var(--color-soft-blue)]" />
            </div>
            <div className="bg-gray-50 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-cool-gray)] animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-cool-gray)] animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-cool-gray)] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about CVs..."
            className="flex-1 bg-transparent text-xs outline-none text-[var(--color-dark-slate-gray)] placeholder:text-[var(--color-cool-gray)]"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Send className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
