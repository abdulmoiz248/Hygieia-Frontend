import Link from "next/link"
import { ArrowLeft, Star, AlertTriangle, BadgeCheck, CheckCircle2, Trash2 } from "lucide-react"
import { BlogPostDetail } from "@/lib/admin/blog-helpers"

interface BlogDetailTopBarProps {
  post:             BlogPostDetail
  isPending:        boolean
  verifying:        boolean
  deleting:         boolean
  onApprove:        () => void
  onDeleteRequest:  () => void
}

export function BlogDetailTopBar({
  post, isPending, verifying, deleting, onApprove, onDeleteRequest,
}: BlogDetailTopBarProps) {
  const busy = verifying || deleting

  return (
    <div
      className="z-30 bg-white/90 backdrop-blur-md border-b px-6 py-3 flex items-center justify-between gap-4"
      style={{ borderColor: "oklch(0.88 0.04 210)" }}
    >
      {/* Back link */}
      <Link
        href="/admin/blogs"
        className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--color-soft-blue)]"
        style={{ color: "var(--color-cool-gray)" }}
      >
        <ArrowLeft className="w-4 h-4" /> Blog Review
      </Link>

      {/* Status badges */}
      <div className="flex items-center gap-2">
        {post.isFeatured && (
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "oklch(0.95 0.05 210)", color: "var(--color-soft-blue)" }}
          >
            <Star className="w-3 h-3 fill-current" /> Featured
          </span>
        )}
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={isPending
            ? { background: "oklch(0.96 0.08 50)", color: "oklch(0.50 0.20 50)" }
            : { background: "oklch(0.95 0.04 178)", color: "var(--color-mint-green)" }}
        >
          {isPending
            ? <><AlertTriangle className="w-3 h-3" /> Pending Review</>
            : <><BadgeCheck    className="w-3 h-3" /> Published</>}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {isPending && (
          <button
            onClick={onApprove}
            disabled={busy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ background: "var(--color-mint-green)", color: "var(--color-dark-slate-gray)" }}
          >
            <CheckCircle2 className="w-4 h-4" /> Approve & Publish
          </button>
        )}
        <button
          onClick={onDeleteRequest}
          disabled={busy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          style={{ background: "var(--color-soft-coral)", color: "white" }}
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  )
}
