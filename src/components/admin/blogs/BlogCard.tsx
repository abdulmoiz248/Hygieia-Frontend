import Link from "next/link"
import {
  Clock, Loader2, CheckCircle2, Rss,
  Star, Trash2,
} from "lucide-react"
import { BlogPost, getThemeGradient, getInitials } from "@/lib/admin/blog-helpers"
import { Thumbnail } from "@/components/admin/blogs/Thumbnail"
import { useSendBlogNewsletter } from "@/hooks/admin/newsletters/useSendBlogNewsletter"

interface BlogCardProps {
  post:            BlogPost
  onDelete:        () => void
  deleting:        boolean
  onVerify:        () => void
  onToggleFeature: () => void
  actioning:       boolean
}

export function BlogCard({
  post, onDelete, deleting, onVerify, onToggleFeature, actioning,
}: BlogCardProps) {
  const isPending = !post.isVerified
  const busy      = deleting || actioning

  const sendMutation = useSendBlogNewsletter()

  const handleSendNewsletter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    sendMutation.mutate({ blogpostId: post.id })
  }

  const handleToggleFeature = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFeature()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete()
  }

  return (
    <div
      className="group rounded-2xl bg-white overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ border: "0.5px solid oklch(0.88 0.04 210)" }}
    >
      {/* Thumbnail — badges live here only (status, featured, category) */}
      <Link href={`/admin/blogs/${post.id}`} className="block flex-shrink-0">
        <Thumbnail post={post} />
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">

        {/* Title */}
        <Link href={`/admin/blogs/${post.id}`}>
          <h3 className="font-medium text-[var(--color-dark-slate-gray)] text-sm leading-snug line-clamp-2 transition-colors group-hover:text-[var(--color-soft-blue)]">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xs text-[var(--color-cool-gray)] leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* ── PENDING: Verify & Publish ── */}
        {isPending && (
          <button
            onClick={onVerify}
            disabled={busy}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
            style={{
              background:    "linear-gradient(135deg, #34d399, #059669)",
              color:         "#fff",
              fontSize:      "0.75rem",
              letterSpacing: "0.03em",
            }}
          >
            {actioning
              ? <Loader2      className="w-3.5 h-3.5 animate-spin" />
              : <CheckCircle2 className="w-3.5 h-3.5" />}
            Verify &amp; Publish
          </button>
        )}

        {/* ── PUBLISHED: Send Newsletter ── */}
        {!isPending && (
          <button
            onClick={handleSendNewsletter}
            disabled={sendMutation.isPending}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
           style={{
  background: "linear-gradient(135deg, oklch(0.7 0.22 10), oklch(0.6 0.25 10))",
  color: "#fff",
  fontSize: "0.75rem",
  letterSpacing: "0.03em",
}}
          >
            {sendMutation.isPending
              ? <><Loader2 className="w-3 h-3 animate-spin" /> Sending…</>
              : <><Rss     className="w-3 h-3" /> Send as newsletter</>}
          </button>
        )}

        {/* ── Footer: Author · Read time · Star (published) · Delete ── */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-1">

          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
              style={{ background: getThemeGradient(post.id) }}
            >
              {getInitials(post.author)}
            </div>
            <p className="text-xs font-medium text-[var(--color-dark-slate-gray)] truncate">
              {post.author}
            </p>
          </div>

          {/* Meta icons */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {post.readTime > 0 && (
              <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1 mr-0.5">
                <Clock className="w-3 h-3" />{post.readTime}m
              </span>
            )}

            {/* Feature / Unfeature — published posts only */}
            {!isPending && (
              <button
                onClick={handleToggleFeature}
                disabled={busy}
                className="p-1 rounded-md transition-colors disabled:opacity-40 hover:bg-amber-50 active:scale-90"
                title={post.isFeatured ? "Remove from featured" : "Mark as featured"}
              >
                {actioning
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-cool-gray)]" />
                  : <Star
                      className="w-3.5 h-3.5 transition-colors"
                      style={post.isFeatured
                        ? { fill: "oklch(0.75 0.18 65)", color: "oklch(0.75 0.18 65)" }
                        : { fill: "none",                color: "var(--color-cool-gray)" }}
                    />}
              </button>
            )}

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={busy}
              className="p-1 rounded-md text-[var(--color-soft-coral)] hover:bg-[oklch(0.96_0.06_10)] transition-colors disabled:opacity-40 active:scale-90"
              title="Delete"
            >
              {deleting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Trash2  className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
