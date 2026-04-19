"use client"

import { useState } from "react"
import {
  BookOpen, Check, Eye, Loader2, Search, Send, Star,
  X, User, Clock, Calendar, Tag,
} from "lucide-react"
import { useSendBlogNewsletter }    from "@/hooks/admin/newsletters/useSendBlogNewsletter"
import { useBlogPosts }             from "@/hooks/admin/blogs/useBlogPosts"
import { getThemeGradient, getInitials, getCategoryStyle } from "@/lib/admin/blog-helpers"
import { formatDateOnly }           from "@/helpers/date"
import { timeAgo }                  from "@/helpers/formatTimeAgo"
import { BlogDetailBody }           from "@/components/admin/blogs/blogs-details/BlogDetailBody"

interface BlogPostTabProps {
  subscriberCount: number
}

// ─── Blog row item (list-view style, no delete/feature/verify controls) ───────

function BlogListRow({
  post,
  isSelected,
  onSelect,
  onPreview,
}: {
  post:       any
  isSelected: boolean
  onSelect:   () => void
  onPreview:  () => void
}) {
  const catStyle = getCategoryStyle(post.category)
  const gradient = getThemeGradient(post.id)

  return (
    <div
      className="group w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-3 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-px"
      style={{
        border: isSelected
          ? "1.5px solid var(--color-soft-coral)"
          : "1.5px solid oklch(0.88 0.04 210)",
        background: isSelected ? "oklch(0.99 0.01 10)" : "white",
      }}
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

        {/* Title + badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className="font-semibold text-sm transition-colors line-clamp-1 flex-1 min-w-0"
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
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
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
          <span
            className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1 ml-auto"
            title={formatDateOnly(post.createdAt)}
          >
            <Calendar className="w-3 h-3" />{timeAgo(post.createdAt)}
          </span>
        </div>
      </div>

      {/* Preview button — always visible, stops row click propagation */}
      <button
        onClick={(e) => { e.stopPropagation(); onPreview() }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0 transition-all hover:scale-[1.04] active:scale-[0.97] hover:shadow-sm"
        style={{
          border:      "1px solid var(--color-soft-blue)",
          color:       "var(--color-soft-blue)",
          background:  "oklch(0.97 0.02 210)",
        }}
      >
        <Eye className="w-3.5 h-3.5" />
        Preview
      </button>
    </div>
  )
}

// ─── Blog detail preview dialog ───────────────────────────────────────────────

function BlogPreviewDialog({
  post,
  subscriberCount,
  onClose,
  onSend,
  isSending,
}: {
  post:           any
  subscriberCount: number
  onClose:        () => void
  onSend:         () => void
  isSending:      boolean
}) {
  const gradient = getThemeGradient(post.id)

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">

        {/* Accent stripe */}
        <div className="h-1 w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))" }} />

        {/* ── Hero ── */}
        <div className="relative w-full flex-shrink-0" style={{ height: "200px" }}>
          {post.image ? (
            <>
              <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradient }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <BookOpen className="w-12 h-12 text-white/20" />
              </div>
            </>
          )}

          {/* Category badge on hero */}
          {post.category && (
            <div className="absolute bottom-3 left-4 z-10">
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(6px)" }}>
                {post.category}
              </span>
            </div>
          )}

          {/* Close button on hero */}
          <button onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-lg transition-colors"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-5 pb-4 space-y-4">

            {/* Meta section */}
            <div className="space-y-3">
              {/* Title */}
              <h1 className="text-xl font-bold text-[var(--color-dark-slate-gray)] leading-snug">
                {post.title}
              </h1>

              {/* Author + date + read time */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{ background: gradient }}>
                    {getInitials(post.author)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-dark-slate-gray)]">{post.author}</p>
                    {post.authorRole && (
                      <p className="text-[10px] text-[var(--color-cool-gray)]">{post.authorRole}</p>
                    )}
                  </div>
                </div>

                <span className="w-px h-4 bg-gray-200" />

                <span className="text-xs text-[var(--color-cool-gray)] flex items-center gap-1"
                  title={timeAgo(post.createdAt)}>
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDateOnly(post.createdAt)}
                </span>

                {post.readTime > 0 && (
                  <>
                    <span className="w-px h-4 bg-gray-200" />
                    <span className="text-xs text-[var(--color-cool-gray)] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{post.readTime} min read
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <Tag className="w-3.5 h-3.5 text-[var(--color-cool-gray)]" />
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "oklch(0.95 0.03 210)", color: "var(--color-soft-blue)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm leading-relaxed italic border-l-2 pl-4"
                  style={{ color: "var(--color-cool-gray)", borderColor: "var(--color-soft-blue)" }}>
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Content body — reuse BlogDetailBody renderer */}
            <BlogDetailBody content={post.content ?? ""} />

          </div>
        </div>

        {/* ── Footer: send action ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0 bg-white">
          <p className="text-xs text-[var(--color-cool-gray)]">
            Sending as newsletter to{" "}
            <span className="font-semibold text-[var(--color-dark-slate-gray)]">
              {subscriberCount} subscribers
            </span>
          </p>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-[var(--color-cool-gray)] hover:bg-gray-50 transition-all active:scale-[0.98]">
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
      </div>
    </div>
  )
}

// ─── Main tab component ───────────────────────────────────────────────────────

export function BlogPostTab({ subscriberCount }: BlogPostTabProps) {
  const [search,      setSearch]      = useState("")
  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [previewPost, setPreviewPost] = useState<any | null>(null)

  const { data: blogPosts = [], isLoading: blogsLoading } = useBlogPosts()
  const sendMutation = useSendBlogNewsletter()

  const filtered = blogPosts.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase())    ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (id: string) => setSelectedId((prev) => (prev === id ? null : id))

  const handleSend = async () => {
    if (!selectedId) return
    await sendMutation.mutateAsync({ blogpostId: selectedId }).catch(() => null)
    setPreviewPost(null)
  }

  const selectedPost = blogPosts.find((p: any) => p.id === selectedId)

  return (
    <>
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        {/* Accent bar */}
        <div className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }} />

        <div className="p-4 sm:p-6 space-y-4">

          {/* Header */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--color-soft-coral)]" />
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
              Blog Post Newsletter
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto flex-shrink-0"
              style={{ background: "oklch(0.96 0.06 10)", color: "var(--color-soft-coral)" }}>
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
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
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
                <BlogListRow
                  key={post.id}
                  post={post}
                  isSelected={selectedId === post.id}
                  onSelect={() => handleSelect(post.id)}
                  onPreview={() => setPreviewPost(post)}
                />
              ))
            )}
          </div>

          {/* Send row — only visible when a post is selected */}
          {selectedId && (
            <div className="pt-1 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <button
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
              >
                {sendMutation.isPending ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                ) : (
                  <><Send className="w-4 h-4" /> Send to {subscriberCount} Subscribers</>
                )}
              </button>

              <p className="text-xs text-[var(--color-cool-gray)]">
                Selected:{" "}
                <span className="font-medium text-[var(--color-dark-slate-gray)] line-clamp-1">
                  {selectedPost?.title}
                </span>
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Blog detail preview dialog */}
      {previewPost && (
        <BlogPreviewDialog
          post={previewPost}
          subscriberCount={subscriberCount}
          onClose={() => setPreviewPost(null)}
          onSend={() => {
            setSelectedId(previewPost.id)
            handleSend()
          }}
          isSending={sendMutation.isPending}
        />
      )}
    </>
  )
}
