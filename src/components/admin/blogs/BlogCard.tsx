import Link from "next/link"
import {
  Clock, ShieldCheck, Star, StarOff,
  Trash2, Loader2, CheckCircle2,
} from "lucide-react"
import { BlogPost, getThemeGradient, getInitials } from "@/lib/admin/blog-helpers"
import { Thumbnail } from "@/components/admin/blogs/Thumbnail"

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

  return (
    <div
      className="group rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col h-full"
      style={{ border: "1.5px solid oklch(0.88 0.04 210)" }}
    >
      {/* Thumbnail */}
      <Link href={`/admin/blogs/${post.id}`} className="block flex-shrink-0">
        <Thumbnail post={post} />
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">

        {/* Title */}
        <Link href={`/admin/blogs/${post.id}`}>
          <h3 className="font-semibold text-[var(--color-dark-slate-gray)] text-sm leading-snug line-clamp-2 group-hover:text-[var(--color-soft-blue)] transition-colors">
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

        {/* Pending Actions: Verify + Feature */}
        {isPending && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={onVerify}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
              style={{
                background: "var(--color-mint-green)",
                color: "var(--color-dark-slate-gray)",
                fontSize: "0.72rem",
                letterSpacing: "0.03em",
              }}
            >
              {actioning
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <CheckCircle2 className="w-3 h-3" />}
              Verify & Publish
            </button>
            <button
              onClick={onToggleFeature}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
              style={post.isFeatured
                ? { background: "var(--color-soft-coral)", color: "white", fontSize: "0.72rem", letterSpacing: "0.03em" }
                : { background: "var(--color-soft-blue)",  color: "white", fontSize: "0.72rem", letterSpacing: "0.03em" }}
            >
              {post.isFeatured
                ? <><StarOff className="w-3 h-3" /> Unfeature</>
                : <><Star    className="w-3 h-3" /> Feature</>}
            </button>
          </div>
        )}

        {/* Published Status Badges */}
        {!isPending && (
          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
            <span
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: "oklch(0.95 0.04 178)", color: "var(--color-mint-green)" }}
            >
              <ShieldCheck className="w-3 h-3" /> Verified & Published
            </span>
            {post.isFeatured && (
              <span
                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg"
                style={{ background: "oklch(0.95 0.05 210)", color: "var(--color-soft-blue)" }}
              >
                <Star className="w-3 h-3 fill-current" /> Featured
              </span>
            )}
          </div>
        )}

        {/* Footer: Author + Read Time + Delete */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
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
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {post.readTime > 0 && (
              <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1">
                <Clock className="w-3 h-3" />{post.readTime}m
              </span>
            )}
            <button
              onClick={onDelete}
              disabled={busy}
              className="p-1 rounded-md text-[var(--color-soft-coral)] hover:bg-[oklch(0.96_0.06_10)] transition-colors disabled:opacity-40"
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
