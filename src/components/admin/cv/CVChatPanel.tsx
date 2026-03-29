import { useRef, useEffect, useState } from "react"
import { X, Send, Bot, User, Sparkles } from "lucide-react"
import type { ChatMessage } from "@/types/admin/cv"

interface CVChatPanelProps {
  onClose: () => void
}

export default function CVChatPanel({ onClose }: CVChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "assistant",
    content: "Hi! I'm your CV assistant. Ask me anything about the uploaded CVs — like \"Who has the most experience?\" or \"Which candidates are shortlisted?\"",
    timestamp: new Date(),
  }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return

    setMessages(prev => [...prev, { role: "user", content: q, timestamp: new Date() }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:4000/rag/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer || data.message || "I couldn't find an answer for that.",
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I couldn't reach the server. Please check your connection.",
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-[var(--color-cool-gray)]/15 flex flex-col z-50 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
        style={{ background: "var(--gradient-primary)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">CV Assistant</p>
            <p className="text-[11px] text-white/70">Powered by RAG</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" style={{ maxHeight: "380px" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === "assistant" ? "bg-[oklch(0.95_0.05_210)]" : "bg-[oklch(0.95_0.04_178)]"
            }`}>
              {msg.role === "assistant"
                ? <Bot className="w-3.5 h-3.5 text-[var(--color-soft-blue)]" />
                : <User className="w-3.5 h-3.5 text-[var(--color-mint-green)]" />}
            </div>
            <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
              msg.role === "user"
                ? "text-white rounded-tr-sm"
                : "bg-gray-50 text-[var(--color-dark-slate-gray)] rounded-tl-sm"
            }`}
              style={msg.role === "user" ? { background: "var(--gradient-primary)" } : {}}>
              {msg.content}
            </div>
          </div>
        ))}

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
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about CVs..."
            className="flex-1 bg-transparent text-xs outline-none text-[var(--color-dark-slate-gray)] placeholder:text-[var(--color-cool-gray)]"
          />
          <button onClick={send} disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: "var(--gradient-primary)" }}>
            <Send className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
