"use client"

import { useMemo, useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import CountUp from "@/blocks/TextAnimations/CountUp/CountUp"
import {
  FileText, Search, Trash2, X, UserPlus, ChevronDown,
  Send, Bot, User, SortAsc,
  Download, Briefcase, Calendar, Mail, Phone,
  Sparkles, Inbox, Eye, Star, Ban,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type CVStatus = "new" | "reviewed" | "shortlisted" | "rejected"
type SortKey = "date" | "name" | "experience" | "status"
type AppliedRole = "doctor" | "nutritionist" | "pathologist"
type FilterRole = "all" | AppliedRole
type FilterStatus = "all" | CVStatus

interface CV {
  id: string
  name: string
  email: string
  phone: string
  role: AppliedRole
  experience: number
  cvFileName: string
  fileUrl?: string
  status: CVStatus
  appliedAt: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CVS: CV[] = [
  {
    id: "cv1", name: "Kamran Mirza", email: "kamran.mirza@gmail.com",
    phone: "0300-1234567", role: "doctor", experience: 10,
    cvFileName: "kamran_mirza_cv.pdf",
    status: "shortlisted", appliedAt: "2026-03-20T09:00:00Z",
  },
  {
    id: "cv2", name: "Sana Iqbal", email: "sana.iqbal@outlook.com",
    phone: "0321-9876543", role: "nutritionist", experience: 4,
    cvFileName: "sana_iqbal_resume.pdf",
    status: "new", appliedAt: "2026-03-25T14:00:00Z",
  },
  {
    id: "cv3", name: "Farhan Sheikh", email: "farhan.sheikh@gmail.com",
    phone: "0333-4455667", role: "pathologist", experience: 7,
    cvFileName: "farhan_sheikh_cv.docx",
    status: "reviewed", appliedAt: "2026-03-18T11:00:00Z",
  },
  {
    id: "cv4", name: "Mariam Tahir", email: "mariam.tahir@gmail.com",
    phone: "0345-7788990", role: "nutritionist", experience: 2,
    cvFileName: "mariam_cv.pdf",
    status: "new", appliedAt: "2026-03-27T08:30:00Z",
  },
  {
    id: "cv5", name: "Ali Hassan", email: "ali.hassan@yahoo.com",
    phone: "0312-3344556", role: "doctor", experience: 15,
    cvFileName: "ali_hassan_cv.doc",
    status: "rejected", appliedAt: "2026-03-10T16:00:00Z",
  },
  {
    id: "cv6", name: "Nadia Cheema", email: "nadia.cheema@gmail.com",
    phone: "0300-9988776", role: "pathologist", experience: 5,
    cvFileName: "nadia_cheema_resume.pdf",
    status: "reviewed", appliedAt: "2026-03-22T10:00:00Z",
  },
]

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CVStatus, {
  label: string
  icon: React.ElementType
  color: string
  colorClass: string
  gradient: string
  lightBg: string
}> = {
  new: {
    label: "New",
    icon: Inbox,
    color: "var(--color-soft-blue)",
    colorClass: "soft-blue",
    gradient: "linear-gradient(135deg, var(--color-soft-blue), oklch(0.45 0.18 230))",
    lightBg: "oklch(0.95 0.05 210)",
  },
  reviewed: {
    label: "Reviewed",
    icon: Eye,
    color: "var(--color-cool-gray)",
    colorClass: "cool-gray",
    gradient: "linear-gradient(135deg, var(--color-cool-gray), oklch(0.45 0.04 200))",
    lightBg: "oklch(0.93 0.02 180)",
  },
  shortlisted: {
    label: "Shortlisted",
    icon: Star,
    color: "var(--color-mint-green)",
    colorClass: "mint-green",
    gradient: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))",
    lightBg: "oklch(0.95 0.04 178)",
  },
  rejected: {
    label: "Rejected",
    icon: Ban,
    color: "var(--color-soft-coral)",
    colorClass: "soft-coral",
    gradient: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))",
    lightBg: "oklch(0.96 0.06 10)",
  },
}

const ROLE_LABELS: Record<FilterRole, string> = {
  all: "All", doctor: "Doctor", nutritionist: "Nutritionist", pathologist: "Pathologist",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

function StatusBadge({ status }: { status: CVStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
      style={{ background: cfg.lightBg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

// ─── Stat Cards — AdminStatsCards layout ──────────────────────────────────────

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function CVStatCards({ counts }: { counts: Record<CVStatus, number> }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {(Object.keys(STATUS_CONFIG) as CVStatus[]).map((status) => {
        const cfg = STATUS_CONFIG[status]
        const Icon = cfg.icon
        return (
          <motion.div key={status} variants={itemVariants} className="h-full">
            <Card
              className={`h-full flex flex-col justify-between bg-gradient-to-br from-${cfg.colorClass}/10 to-${cfg.colorClass}/5 border-${cfg.colorClass}/20`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cool-gray">{cfg.label}</p>
                    <p className={`text-2xl font-bold text-${cfg.colorClass}`}>
                      <CountUp
                        from={0}
                        to={counts[status]}
                        separator=","
                        direction="up"
                        duration={1}
                        className={`text-${cfg.colorClass}`}
                      />
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 text-${cfg.colorClass}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── CV Card ──────────────────────────────────────────────────────────────────

function CVCard({
  cv, onDelete, onAddAsWorker, onStatusChange
}: {
  cv: CV
  onDelete: (id: string) => void
  onAddAsWorker: (cv: CV) => void
  onStatusChange: (id: string, status: CVStatus) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const roleColors: Record<AppliedRole, string> = {
    doctor:       "var(--color-soft-blue)",
    nutritionist: "var(--color-mint-green)",
    pathologist:  "var(--color-soft-coral)",
  }
  const color = roleColors[cv.role]
  const initials = cv.name.split(" ").map(w => w[0]).slice(0, 2).join("")

  const ext = cv.cvFileName.split(".").pop()?.toUpperCase() ?? "PDF"
  const extColor = ext === "PDF"
    ? { bg: "oklch(0.96 0.06 10)", color: "var(--color-soft-coral)" }
    : { bg: "oklch(0.95 0.05 210)", color: "var(--color-soft-blue)" }

  return (
    <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="h-1.5 w-full" style={{
        background: `linear-gradient(90deg, ${color}, oklch(0.72 0.11 178))`
      }} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{ background: color }}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--color-dark-slate-gray)] text-base leading-tight truncate">
                  {cv.name}
                </h3>
                <p className="text-xs mt-0.5 font-medium capitalize" style={{ color }}>
                  Applying as {ROLE_LABELS[cv.role]}
                </p>
              </div>
              <StatusBadge status={cv.status} />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> {cv.experience} yrs exp
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {timeAgo(cv.appliedAt)}
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"
                style={{ background: extColor.bg, color: extColor.color }}>
                <FileText className="w-3 h-3" /> {ext}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-4 text-xs text-[var(--color-cool-gray)]">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{cv.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{cv.phone}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div>
              <p className="text-xs font-semibold text-[var(--color-dark-slate-gray)] mb-2">Update Status</p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(STATUS_CONFIG) as CVStatus[]).map(s => (
                  <button key={s}
                    onClick={() => onStatusChange(cv.id, s)}
                    className="text-[11px] px-2.5 py-1 rounded-full font-semibold border-2 transition-all"
                    style={cv.status === s
                      ? { background: STATUS_CONFIG[s].lightBg, color: STATUS_CONFIG[s].color, borderColor: STATUS_CONFIG[s].color }
                      : { background: "white", color: "var(--color-cool-gray)", borderColor: "oklch(0.90 0.02 180)" }
                    }>
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 text-xs text-[var(--color-cool-gray)]">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
              <span className="truncate font-medium">{cv.cvFileName}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color }}
          >
            {expanded ? "Less" : "More options"}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>

          <div className="flex items-center gap-1">
            <button title="Download CV"
              className="p-2 rounded-lg hover:bg-gray-100 text-[var(--color-cool-gray)] transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button title="Add as Worker" onClick={() => onAddAsWorker(cv)}
              className="p-2 rounded-lg transition-colors text-[var(--color-mint-green)]"
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.95 0.04 178)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <UserPlus className="w-3.5 h-3.5" />
            </button>
            <button title="Delete CV" onClick={() => onDelete(cv.id)}
              className="p-2 rounded-lg transition-colors text-[var(--color-soft-coral)]"
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.96 0.06 10)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── RAG Chat Panel ───────────────────────────────────────────────────────────

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your CV assistant. Ask me anything about the uploaded CVs — like \"Who has the most experience?\" or \"Which candidates are shortlisted?\"",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    const userMsg: ChatMessage = { role: "user", content: q, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
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

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" style={{ maxHeight: "380px" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === "assistant" ? "bg-[oklch(0.95_0.05_210)]" : "bg-[oklch(0.95_0.04_178)]"
            }`}>
              {msg.role === "assistant"
                ? <Bot className="w-3.5 h-3.5 text-[var(--color-soft-blue)]" />
                : <User className="w-3.5 h-3.5 text-[var(--color-mint-green)]" />
              }
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

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 rounded-full bg-[var(--color-soft-coral)]/10 flex items-center justify-center">
          <Trash2 className="text-[var(--color-soft-coral)] w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-dark-slate-gray)]">Delete CV?</h2>
        <p className="text-sm text-[var(--color-cool-gray)]">This CV will be permanently removed. This action cannot be undone.</p>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border hover:bg-gray-50 text-sm">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-white text-sm"
            style={{ background: "var(--color-soft-coral)" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ name, onClose }: { name: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-white border border-[var(--color-cool-gray)]/15 shadow-xl rounded-2xl px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-[oklch(0.95_0.04_178)] flex items-center justify-center">
        <UserPlus className="w-4 h-4 text-[var(--color-mint-green)]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">{name}</p>
        <p className="text-xs text-[var(--color-cool-gray)]">Added to worker registration flow</p>
      </div>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-gray-100 rounded-lg">
        <X className="w-3.5 h-3.5 text-[var(--color-cool-gray)]" />
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const FILTER_TABS: { label: string; value: FilterRole }[] = [
  { label: "All", value: "all" },
  { label: "Doctors", value: "doctor" },
  { label: "Nutritionists", value: "nutritionist" },
  { label: "Pathologists", value: "pathologist" },
]

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Newest first", value: "date" },
  { label: "Name A–Z", value: "name" },
  { label: "Experience", value: "experience" },
]

const STATUS_ORDER: Record<CVStatus, number> = { new: 0, reviewed: 1, shortlisted: 2, rejected: 3 }

export default function CVPage() {
  const [cvs, setCvs] = useState<CV[]>(MOCK_CVS)
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState<FilterRole>("all")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showSort, setShowSort] = useState(false)

  const counts = useMemo(() => ({
    new:         cvs.filter(c => c.status === "new").length,
    reviewed:    cvs.filter(c => c.status === "reviewed").length,
    shortlisted: cvs.filter(c => c.status === "shortlisted").length,
    rejected:    cvs.filter(c => c.status === "rejected").length,
  }), [cvs])

  const filtered = useMemo(() => {
    let list = cvs.filter(c => {
      const matchRole   = filterRole === "all" || c.role === filterRole
      const matchStatus = filterStatus === "all" || c.status === filterStatus
      const q = search.toLowerCase()
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      return matchRole && matchStatus && matchSearch
    })

    list = [...list].sort((a, b) => {
      if (sortKey === "date")       return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      if (sortKey === "name")       return a.name.localeCompare(b.name)
      if (sortKey === "experience") return b.experience - a.experience
      if (sortKey === "status")     return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      return 0
    })

    return list
  }, [cvs, search, filterRole, filterStatus, sortKey])

  const handleDelete = () => {
    if (!deleteId) return
    setCvs(prev => prev.filter(c => c.id !== deleteId))
    setDeleteId(null)
  }

  const handleStatusChange = (id: string, status: CVStatus) =>
    setCvs(prev => prev.map(c => c.id === id ? { ...c, status } : c))

  const handleAddAsWorker = (cv: CV) => setToast(cv.name)

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)] fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-soft-blue)] via-[var(--color-mint-green)] to-[var(--color-soft-coral)] bg-clip-text text-transparent pb-1">
            CV Management
          </h1>
          <p className="text-sm text-[var(--color-cool-gray)] mt-1">
            {cvs.length} total CVs received
          </p>
        </div>
      </div>

      {/* STAT CARDS — AdminStatsCards layout */}
      <CVStatCards counts={counts} />

      {/* SEARCH + ROLE TABS + SORT + STATUS FILTERS */}
      <div className="flex flex-col gap-3">

        {/* Row 1: search left, role tabs + sort right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none bg-white shadow-sm text-sm"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm">
              {FILTER_TABS.map(tab => (
                <button key={tab.value} onClick={() => setFilterRole(tab.value)}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap"
                  style={filterRole === tab.value
                    ? { background: "var(--gradient-primary)", color: "white" }
                    : { color: "var(--color-cool-gray)" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="w-px h-7 bg-[var(--color-cool-gray)]/20" />

            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[var(--color-cool-gray)]/20 shadow-sm text-xs font-medium text-[var(--color-cool-gray)] hover:text-[var(--color-dark-slate-gray)] transition-colors whitespace-nowrap"
              >
                <SortAsc className="w-3.5 h-3.5" />
                {SORT_OPTIONS.find(s => s.value === sortKey)?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSort ? "rotate-180" : ""}`} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl shadow-lg z-20 py-1 min-w-[150px]">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.value}
                      onClick={() => { setSortKey(opt.value); setShowSort(false) }}
                      className="w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-gray-50"
                      style={sortKey === opt.value
                        ? { color: "var(--color-soft-blue)" }
                        : { color: "var(--color-cool-gray)" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: status filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[var(--color-cool-gray)]">Filter:</span>
          {(["reviewed", "shortlisted", "rejected"] as CVStatus[]).map(s => {
            const cfg = STATUS_CONFIG[s]
            const isActive = filterStatus === s
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(prev => prev === s ? "all" : s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                style={isActive
                  ? { background: cfg.lightBg, color: cfg.color, borderColor: cfg.color }
                  : { background: "white", color: "var(--color-cool-gray)", borderColor: "oklch(0.90 0.02 180)" }
                }
              >
                <cfg.icon className="w-3 h-3" />
                {cfg.label}
              </button>
            )
          })}
          {filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-[var(--color-cool-gray)] hover:text-[var(--color-soft-coral)] transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* CV GRID */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-cool-gray)]/30 p-12 text-center">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-20 text-[var(--color-cool-gray)]" />
          <p className="text-sm text-[var(--color-cool-gray)]">No CVs match your filters</p>
          {filterStatus !== "all" && (
            <button onClick={() => setFilterStatus("all")}
              className="mt-3 text-xs font-medium underline"
              style={{ color: "var(--color-soft-blue)" }}>
              Clear status filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(cv => (
            <CVCard key={cv.id} cv={cv}
              onDelete={setDeleteId}
              onAddAsWorker={handleAddAsWorker}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* FLOATING CHAT */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white shadow-2xl hover:scale-[1.03] transition-all duration-200 z-40"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">Ask AI about CVs</span>
          <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
        </button>
      )}

      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      {deleteId && <DeleteModal onConfirm={handleDelete} onClose={() => setDeleteId(null)} />}
      {toast && <Toast name={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
