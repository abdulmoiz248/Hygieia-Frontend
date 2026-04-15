import { ShieldCheck } from "lucide-react"
import { Tab } from "@/lib/admin/blog-helpers"

interface BlogEmptyStateProps {
  search:    string
  activeTab: Tab
}

export function BlogEmptyState({ search, activeTab }: BlogEmptyStateProps) {
  const message = search
    ? "No posts match your search."
    : activeTab === "pending"   ? "No posts pending review."
    : activeTab === "published" ? "No published posts yet."
    : "No posts found."

  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-cool-gray)]/30 p-16 text-center">
      <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-[var(--color-mint-green)] opacity-40" />
      <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">{message}</p>
    </div>
  )
}
