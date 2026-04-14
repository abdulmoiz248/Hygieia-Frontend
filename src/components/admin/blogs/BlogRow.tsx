import Link from "next/link"
import {
  User, Clock, Calendar, BookOpen,
  Star, StarOff, AlertTriangle, CheckCircle2,
  Trash2, Loader2,
} from "lucide-react"
import { BlogPost, getThemeGradient, getCategoryStyle, formatDate } from "@/lib/admin/blog-helpers"

interface BlogRowProps {
  post:            BlogPost
  onDelete:        () => void
  deleting:        boolean
  onVerify:        () => void
  onToggleFeature: () => void
  actioning:       boolean
}

export function BlogRow({
  post, onDelete, deleting, onVerify, onToggleFeature, actioning,
}: BlogRowProps) {
  const catStyle  = getCategoryStyle(post.category)
  const isPending = !post.isVerified
  const busy      = deleting || actioning

  return (
    <div
      className="group w-full flex items-center gap-4 bg-white rounded-2xl shadow-sm px-4 py-3 hover:shadow-md transition-all duration-200"
      style={{ border: "1.5px solid oklch(0.88 0.04 210)" }}
    >
      {/* Thumbnail */}
      <Link
        href={`/admin/blogs/${post.id}`}
        className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden relative flex items-center justify-center"
        style={!post.image ? { background: getThemeGradient(post.id) } : undefined}
      >
        {post.image
          ? <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          : <BookOpen className="w-5 h-5 text-white/70" />}
      </Link>

      {/* Info */}
      <Link href={`/admin/blogs/${post.id}`} className="flex-1 min-w-0">

        {/* Title + Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-sm text-[var(--color-dark-slate-gray)] group-hover:text-[var(--color-soft-blue)] transition-colors line-clamp-1 flex-1 min-w-0">
            {post.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {post.isFeatured && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                style={{ background: "oklch(0.95 0.05 210)", color: "var(--color-soft-blue)" }}
              >
                <Star className="w-2.5 h-2.5 fill-current" /> Featured
              </span>
            )}
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
              style={isPending
                ? { background: "oklch(0.96 0.08 50)", color: "oklch(0.50 0.20 50)" }
                : { background: "oklch(0.95 0.04 178)", color: "var(--color-mint-green)" }}
            >
              {isPending
                ? <><AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" /> Pending</>
                : <><CheckCircle2  className="w-2.5 h-2.5 flex-shrink-0" /> Published</>}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ background: catStyle.bg, color: catStyle.color }}
          >
            {post.category}
          </span>
          <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1">
            <User className="w-3 h-3" />{post.author}
          </span>
          {post.readTime > 0 && (
            <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1">
              <Clock className="w-3 h-3" />{post.readTime}m
            </span>
          )}
          <span className="text-[11px] text-[var(--color-cool-gray)] flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />{formatDate(post.createdAt)}
          </span>
        </div>

      </Link>

      {/* ── PENDING: Verify only ── */}
      {isPending && (
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={onVerify}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
            style={{
              background: "var(--color-mint-green)",
              color:      "var(--color-dark-slate-gray)",
              fontSize:   "0.72rem",
              letterSpacing: "0.03em",
            }}
          >
            {actioning
              ? <Loader2     className="w-3 h-3 animate-spin" />
              : <CheckCircle2 className="w-3 h-3" />}
            Verify
          </button>
        </div>
      )}

      {/* ── PUBLISHED: Feature / Unfeature only ── */}
      {!isPending && (
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={onToggleFeature}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all disabled:opacity-40 hover:opacity-90 active:scale-95"
            style={post.isFeatured
              ? { background: "var(--color-soft-coral)", color: "white", fontSize: "0.72rem", letterSpacing: "0.03em" }
              : { background: "var(--color-soft-blue)",  color: "white", fontSize: "0.72rem", letterSpacing: "0.03em" }}
          >
            {actioning
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : post.isFeatured
                ? <><StarOff className="w-3 h-3" /> Unfeature</>
                : <><Star    className="w-3 h-3" /> Feature</>}
          </button>
        </div>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        disabled={busy}
        className="p-2 rounded-xl text-[var(--color-soft-coral)] hover:bg-[oklch(0.96_0.06_10)] transition-colors disabled:opacity-40 flex-shrink-0"
      >
        {deleting
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Trash2  className="w-4 h-4" />}
      </button>
    </div>
  )
}