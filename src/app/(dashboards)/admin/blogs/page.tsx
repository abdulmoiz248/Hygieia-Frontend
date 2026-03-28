"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Clock, User, Search, BookOpen, ShieldCheck,
  LayoutGrid, List, AlertTriangle, Calendar,
  Trash2, Loader2, CheckCircle2, XCircle,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  authorId: string
  category: string
  tags: string[]
  readTime: number
  createdAt: string
  isVerified: boolean
  isFeatured: boolean
}

type ViewMode = "grid" | "list"
type Tab = "all" | "pending" | "published"

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:4000"

const GRADIENTS = [
  "linear-gradient(135deg, var(--color-soft-blue), oklch(0.45 0.18 230))",
  "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))",
  "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))",
  "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.45 0.18 230))",
  "linear-gradient(135deg, oklch(0.65 0.18 60), oklch(0.55 0.22 30))",
  "linear-gradient(135deg, oklch(0.55 0.18 140), oklch(0.45 0.14 160))",
]

function getGradient(id: string) {
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length
  return GRADIENTS[idx]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function getInitials(name: string) {
  return (name ?? "?").split(" ").map(w => w[0]).slice(0, 2).join("")
}

const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  "Nutrition":        { color: "var(--color-mint-green)",  bg: "oklch(0.95 0.04 178)" },
  "Diagnostics":      { color: "var(--color-soft-coral)",  bg: "oklch(0.96 0.06 10)"  },
  "Cardiology":       { color: "var(--color-soft-blue)",   bg: "oklch(0.95 0.05 210)" },
  "Sports & Fitness": { color: "oklch(0.55 0.22 55)",      bg: "oklch(0.96 0.06 55)"  },
}

function getCategoryStyle(cat: string) {
  return CATEGORY_STYLES[cat] ?? { color: "var(--color-cool-gray)", bg: "oklch(0.93 0.02 180)" }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, count, label, gradient, lightBg, color }: {
  icon: React.ElementType; count: number; label: string
  gradient: string; lightBg: string; color: string
}) {
  return (
    <div className="rounded-2xl bg-white border border-[var(--color-cool-gray)]/15 shadow-sm overflow-hidden">
      <div className="h-1.5 w-full" style={{ background: gradient }} />
      <div className="p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: lightBg }}>
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

// ─── Blog Card (Grid) ─────────────────────────────────────────────────────────

function BlogCard({ post, onDelete, deleting }: {
  post: BlogPost; onDelete: () => void; deleting: boolean
}) {
  const gradient = getGradient(post.id)
  const isPending = !post.isVerified

  return (
    <div className="group rounded-2xl bg-white border border-[var(--color-cool-gray)]/15 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Thumbnail */}
      <Link href={`/admin/blogs/${post.id}`} className="relative h-44 w-full flex-shrink-0 block overflow-hidden" style={{ background: gradient }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <BookOpen className="w-16 h-16 text-white" />
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.22)", color: "white", backdropFilter: "blur(4px)" }}>
            {post.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
          style={{ background: "rgba(255,255,255,0.18)", color: "white", backdropFilter: "blur(6px)" }}>
          {isPending
            ? <><AlertTriangle className="w-3 h-3" /> Pending</>
            : <><CheckCircle2 className="w-3 h-3" /> Published</>
          }
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/admin/blogs/${post.id}`} className="flex-1 flex flex-col">
          <h3 className="font-bold text-[var(--color-dark-slate-gray)] text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[var(--color-soft-blue)] transition-colors">
            {post.title}
          </h3>
          <p className="text-xs text-[var(--color-cool-gray)] mt-2 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3 min-h-[1.5rem]">
            {post.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium leading-none flex items-center">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex-1" />
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ background: gradient }}>
              {getInitials(post.author)}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[var(--color-dark-slate-gray)] leading-none truncate">{post.author}</p>
              <p className="text-[10px] text-[var(--color-cool-gray)] mt-0.5 truncate">{post.authorRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1">
              <Clock className="w-3 h-3" />{post.readTime} min
            </span>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg text-[var(--color-soft-coral)] hover:bg-[oklch(0.96_0.06_10)] transition-colors disabled:opacity-40"
              title="Delete post"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Blog Row (List) ──────────────────────────────────────────────────────────

function BlogRow({ post, onDelete, deleting }: {
  post: BlogPost; onDelete: () => void; deleting: boolean
}) {
  const gradient = getGradient(post.id)
  const catStyle = getCategoryStyle(post.category)
  const isPending = !post.isVerified

  return (
    <div className="group w-full flex items-center gap-5 bg-white rounded-2xl border border-[var(--color-cool-gray)]/15 shadow-sm px-5 py-4 hover:shadow-md transition-all duration-200">
      <Link href={`/admin/blogs/${post.id}`} className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ background: gradient }}>
        <BookOpen className="w-6 h-6 text-white/80" />
      </Link>

      <Link href={`/admin/blogs/${post.id}`} className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-sm text-[var(--color-dark-slate-gray)] group-hover:text-[var(--color-soft-blue)] transition-colors leading-snug line-clamp-1">
            {post.title}
          </h3>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1"
            style={isPending
              ? { background: "oklch(0.96 0.06 55)", color: "oklch(0.55 0.22 55)" }
              : { background: "oklch(0.95 0.04 178)", color: "var(--color-mint-green)" }
            }>
            {isPending
              ? <><AlertTriangle className="w-3 h-3" /> Pending</>
              : <><CheckCircle2 className="w-3 h-3" /> Published</>
            }
          </span>
        </div>
        <p className="text-xs text-[var(--color-cool-gray)] mt-1 line-clamp-1">{post.excerpt}</p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: catStyle.bg, color: catStyle.color }}>{post.category}</span>
          <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1">
            <User className="w-3 h-3" />{post.author}
          </span>
          <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1">
            <Clock className="w-3 h-3" />{post.readTime} min
          </span>
          <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />{formatDate(post.createdAt)}
          </span>
        </div>
      </Link>

      <button
        onClick={onDelete}
        disabled={deleting}
        className="p-2 rounded-xl text-[var(--color-soft-coral)] hover:bg-[oklch(0.96_0.06_10)] transition-colors disabled:opacity-40 flex-shrink-0"
        title="Delete post"
      >
        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function ToastBanner({ toast }: { toast: { msg: string; type: "success" | "error" } }) {
  const ok = toast.type === "success"
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border"
      style={ok
        ? { background: "oklch(0.95 0.04 178)", borderColor: "var(--color-mint-green)", color: "var(--color-mint-green)" }
        : { background: "oklch(0.96 0.06 10)", borderColor: "var(--color-soft-coral)", color: "var(--color-soft-coral)" }
      }>
      {ok ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
      <p className="text-sm font-semibold">{toast.msg}</p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BlogReviewPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [activeTab, setActiveTab] = useState<Tab>("pending")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/blogPost`)
        const data = await res.json()
        setPosts(Array.isArray(data) ? data : data.posts ?? data.data ?? [])
      } catch {
        showToast("Failed to load posts.", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (post: BlogPost) => {
    setDeletingId(post.id)
    try {
      await fetch(`${BASE_URL}/blogPost/${post.id}`, { method: "DELETE" })
      setPosts(prev => prev.filter(p => p.id !== post.id))
      showToast(`"${post.title}" deleted.`, "error")
    } catch {
      showToast("Failed to delete post.", "error")
    } finally {
      setDeletingId(null)
    }
  }

  const totalCount     = posts.filter(p => !p.isVerified).length
  const publishedCount = posts.filter(p =>  p.isVerified).length
  const allCount       = posts.length

  const filtered = useMemo(() => posts
    .filter(p => {
      if (activeTab === "pending")   return !p.isVerified
      if (activeTab === "published") return  p.isVerified
      return true // "all" tab
    })
    .filter(p =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    ),
  [posts, activeTab, search])

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pending",   label: "Total Posts", count: totalCount     },
    { key: "published", label: "Published",   count: publishedCount },
    { key: "all",       label: "Pending",         count: allCount       },
  ]

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)]">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-soft-blue)] via-[var(--color-mint-green)] to-[var(--color-soft-coral)] bg-clip-text text-transparent pb-1">
          Blog Review
        </h1>
        <p className="text-sm text-[var(--color-cool-gray)] mt-1">
          Review, approve and manage all blog posts
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={BookOpen}      count={allCount}       label="Total Posts"
          gradient="linear-gradient(135deg, var(--color-soft-blue), oklch(0.45 0.18 230))"
          lightBg="oklch(0.95 0.05 210)" color="var(--color-soft-blue)" />
        <StatCard icon={AlertTriangle} count={totalCount}     label="Pending Review"
          gradient="linear-gradient(135deg, oklch(0.65 0.18 60), oklch(0.55 0.22 30))"
          lightBg="oklch(0.96 0.06 55)" color="oklch(0.55 0.22 55)" />
        <StatCard icon={ShieldCheck}   count={publishedCount} label="Published"
          gradient="linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))"
          lightBg="oklch(0.95 0.04 178)" color="var(--color-mint-green)" />
      </div>

      {/* TABS + SEARCH + VIEW TOGGLE */}
      <div className="flex flex-col gap-3">
        {/* Tab strip */}
        <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-2xl p-1 shadow-sm w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={activeTab === tab.key
                ? { background: "var(--gradient-primary)", color: "white" }
                : { color: "var(--color-cool-gray)" }
              }
            >
              {tab.label}
              <span className="text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none"
                style={activeTab === tab.key
                  ? { background: "rgba(255,255,255,0.25)", color: "white" }
                  : { background: "oklch(0.93 0.02 180)", color: "var(--color-cool-gray)" }
                }>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + view toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, author or category…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none bg-white shadow-sm text-sm"
            />
          </div>
          <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm">
            <button onClick={() => setViewMode("grid")} className="p-2 rounded-lg transition-all"
              style={viewMode === "grid" ? { background: "var(--gradient-primary)", color: "white" } : { color: "var(--color-cool-gray)" }}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className="p-2 rounded-lg transition-all"
              style={viewMode === "list" ? { background: "var(--gradient-primary)", color: "white" } : { color: "var(--color-cool-gray)" }}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* POSTS */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-soft-blue)] opacity-60" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-cool-gray)]/30 p-16 text-center">
          <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-[var(--color-mint-green)] opacity-40" />
          <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">
            {search ? "No posts match your search." : activeTab === "pending" ? "No posts pending review." : activeTab === "published" ? "No published posts yet." : "No posts found."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          {filtered.map(post => (
            <BlogCard key={post.id} post={post} onDelete={() => handleDelete(post)} deleting={deletingId === post.id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(post => (
            <BlogRow key={post.id} post={post} onDelete={() => handleDelete(post)} deleting={deletingId === post.id} />
          ))}
        </div>
      )}

      {toast && <ToastBanner toast={toast} />}
    </div>
  )
}
