import Link from "next/link"
import { Loader2, BookOpen } from "lucide-react"

export function BlogDetailLoadingState() {
  return (
    <div className="min-h-screen bg-[var(--color-snow-white)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-soft-blue)] opacity-60" />
        <p className="text-sm text-[var(--color-cool-gray)]">Loading post…</p>
      </div>
    </div>
  )
}

export function BlogDetailNotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-snow-white)] flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-[var(--color-cool-gray)] opacity-30" />
        <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">Post not found.</p>
        <Link
          href="/admin/blogs"
          className="mt-3 inline-block text-sm text-[var(--color-soft-blue)] hover:underline"
        >
          ← Back to Blog Review
        </Link>
      </div>
    </div>
  )
}
