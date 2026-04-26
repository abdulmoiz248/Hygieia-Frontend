"use client"

import { useState } from "react"
import {
  BookOpen, Check, Eye, Loader2, Search, Send, Star,
  User, Clock, Calendar, X,
} from "lucide-react"
import { useSendBlogNewsletter }  from "@/hooks/admin/newsletters/useSendBlogNewsletter"
import { useBlogPosts }           from "@/hooks/admin/blogs/useBlogPosts"
import { useBlogPostDetail }      from "@/hooks/admin/blogs/blogs-details/useBlogPostDetail"
import {
  getThemeGradient, getCategoryStyle,
} from "@/lib/admin/blog-helpers"
import { formatDateOnly }         from "@/helpers/date"
import { timeAgo }                from "@/helpers/formatTimeAgo"
import { BlogDetailBody }         from "@/components/admin/blogs/blogs-details/BlogDetailBody"
import { BlogDetailMeta }         from "@/components/admin/blogs/blogs-details/BlogDetailMeta"
import { BlogDetailHero }         from "@/components/admin/blogs/blogs-details/BlogDetailHero"

interface BlogPostTabProps {
  subscriberCount: number
}

// ─── Single card: row + expandable action section when selected ────────────────

function BlogCard({
  post,
  isSelected,
  subscriberCount,
  isSending,
  onSelect,
  onPreview,
  onSend,
}: {
  post:            any
  isSelected:      boolean
  subscriberCount: number
  isSending:       boolean
  onSelect:        () => void
  onPreview:       () => void
  onSend:          () => void
}) {
  const catStyle = getCategoryStyle(post.category)
  const gradient = getThemeGradient(post.id)

  return (
    <div
      className="w-full rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border:     isSelected ? "1.5px solid var(--color-soft-coral)" : "1.5px solid oklch(0.88 0.04 210)",
        background: isSelected ? "oklch(0.99 0.01 10)" : "white",
        boxShadow:  isSelected ? "0 4px 16px rgba(230,100,80,0.10)" : undefined,
      }}
    >
      {/* ── Clickable row ── */}
      <div
        className="flex items-center gap-4 px-4 py-3 cursor-pointer"
        onClick={onSelect}
      >
        {/* Checkbox */}
        <span
          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all border"
          style={
            isSelected
              ? { background: "var(--color-soft-coral)", borderColor: "var(--color-soft-coral)" }
              : { background: "white", borderColor: "oklch(0.75 0.02 210)" }
          }
        >
          {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
        </span>

        {/* Thumbnail */}
        <div
          className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden relative flex items-center justify-center"
          style={!post.image ? { background: gradient } : undefined}
        >
          {post.image
            ? <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            : <BookOpen className="w-5 h-5 text-white/70" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h3
              className="font-semibold text-sm line-clamp-1 flex-1 min-w-0"
              style={{ color: isSelected ? "var(--color-soft-coral)" : "var(--color-dark-slate-gray)" }}
            >
              {post.title}
            </h3>
            {post.isFeatured && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0"
                style={{ background: "oklch(0.95 0.05 210)", color: "var(--color-soft-blue)" }}
              >
                <Star className="w-2.5 h-2.5 fill-current" /> Featured
              </span>
            )}
            <span
              className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1 flex-shrink-0"
              title={formatDateOnly(post.createdAt)}
            >
              <Calendar className="w-3 h-3" />{timeAgo(post.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            {post.category && (
              <span
                className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: catStyle.bg, color: catStyle.color }}
              >
                {post.category}
              </span>
            )}
            {post.author && (
              <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1">
                <User className="w-3 h-3" />{post.author}
              </span>
            )}
            {post.readTime > 0 && (
              <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1">
                <Clock className="w-3 h-3" />{post.readTime}m
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Action section — expands inside the same card border ── */}
      {isSelected && (
        <div
          className="flex flex-wrap items-center gap-2 px-4 py-3"
          style={{ borderTop: "1px dashed oklch(0.88 0.06 15)" }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onPreview() }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-all hover:scale-[1.02] active:scale-[0.97]"
            style={{
              background: "white",
              border:     "1.5px solid var(--color-soft-coral)",
              color:      "var(--color-soft-coral)",
            }}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onSend() }}
            disabled={isSending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold shadow-sm disabled:opacity-50 transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
          >
            {isSending
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
              : <><Send className="w-4 h-4" /> Send to {subscriberCount} Subscribers</>}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Preview modal — fetches the FULL post (with content) via useBlogPostDetail ─

function BlogPreviewModal({
  postId,
  subscriberCount,
  onClose,
  onSend,
  isSending,
}: {
  postId:          string
  subscriberCount: number
  onClose:         () => void
  onSend:          () => void
  isSending:       boolean
}) {
  // Same hook as BlogDetailPage — guarantees content is always present
  const { data: post, isLoading } = useBlogPostDetail(postId)

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh", border: "1px solid oklch(0.90 0.02 210)" }}
      >
        {/* Accent stripe */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, var(--color-soft-coral), var(--color-mint-green), var(--color-soft-blue))" }}
        />

        {/* Loading */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center gap-3 py-24 text-[var(--color-cool-gray)]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading post…</span>
          </div>
        )}

        {!isLoading && post && (
          <>
            {/* Hero — exact same component as BlogDetailPage */}
            <div className="relative flex-shrink-0">
              <BlogDetailHero post={post} />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg transition-all hover:scale-110 active:scale-95"
                style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(4px)" }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 pt-5 pb-4 space-y-5">
                {/* Meta — exact same component as BlogDetailPage */}
                <BlogDetailMeta post={post} />

                <div className="border-t" style={{ borderColor: "oklch(0.92 0.02 210)" }} />

                {/* Body — exact same component as BlogDetailPage, content is guaranteed */}
                <BlogDetailBody content={post.content} />
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex items-center justify-between gap-3 flex-shrink-0 bg-white"
              style={{ borderTop: "1px solid oklch(0.93 0.02 210)" }}
            >
              <p className="text-xs text-[var(--color-cool-gray)]">
                Sending to{" "}
                <span className="font-semibold text-[var(--color-dark-slate-gray)]">
                  {subscriberCount} subscribers
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:bg-gray-50 active:scale-[0.98]"
                  style={{ borderColor: "oklch(0.88 0.02 210)", color: "var(--color-cool-gray)" }}
                >
                  Close
                </button>
                <button
                  onClick={onSend}
                  disabled={isSending}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
                >
                  {isSending
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                    : <><Send className="w-4 h-4" /> Send Newsletter</>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

export function BlogPostTab({ subscriberCount }: BlogPostTabProps) {
  const [search,     setSearch]     = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [previewId,  setPreviewId]  = useState<string | null>(null)

  const { data: blogPosts = [], isLoading: blogsLoading } = useBlogPosts()
  const sendMutation = useSendBlogNewsletter()

  const filtered = blogPosts.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase())    ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (id: string) => setSelectedId((prev) => (prev === id ? null : id))

  const handleSend = async (id: string) => {
    await sendMutation.mutateAsync({ blogpostId: id }).catch(() => null)
    setPreviewId(null)
    setSelectedId(null)
  }

  return (
    <>
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        {/* Accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
        />

        <div className="p-4 sm:p-6 space-y-4">

          {/* Header */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--color-soft-coral)]" />
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
              Blog Post Newsletter
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto flex-shrink-0"
              style={{ background: "oklch(0.96 0.06 10)", color: "var(--color-soft-coral)" }}
            >
              AI-converted
            </span>
          </div>

          <p className="text-xs text-[var(--color-cool-gray)] leading-relaxed">
            Select a published blog post. The AI will convert it into a newsletter and send it directly to{" "}
            <span className="font-medium text-[var(--color-dark-slate-gray)]">{subscriberCount} subscribers</span>.
          </p>

          {/* Search */}
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)] transition-colors group-focus-within:text-[var(--color-soft-coral)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, or author…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all
                bg-white border border-gray-200
                shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                hover:border-[var(--color-soft-coral)]/40
                focus:border-[var(--color-soft-coral)] focus:ring-2 focus:ring-[var(--color-soft-coral)]/15
                placeholder:text-gray-400"
            />
          </div>

          {/* Blog list */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {blogsLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-[var(--color-cool-gray)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Loading blog posts…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--color-cool-gray)]">
                No blog posts found.
              </div>
            ) : (
              filtered.map((post: any) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  isSelected={selectedId === post.id}
                  subscriberCount={subscriberCount}
                  isSending={sendMutation.isPending && selectedId === post.id}
                  onSelect={() => handleSelect(post.id)}
                  onPreview={() => setPreviewId(post.id)}
                  onSend={() => handleSend(post.id)}
                />
              ))
            )}
          </div>

        </div>
      </div>

      {/* Preview modal — passes only the ID; fetches full content internally */}
      {previewId && (
        <BlogPreviewModal
          postId={previewId}
          subscriberCount={subscriberCount}
          onClose={() => setPreviewId(null)}
          onSend={() => handleSend(previewId)}
          isSending={sendMutation.isPending}
        />
      )}
    </>
  )
}