"use client"

import { useState } from "react"
import { BookOpen, Check, Loader2, Search, Send } from "lucide-react"
import { useSendBlogNewsletter } from "@/hooks/admin/newsletters/useSendBlogNewsletter"
import { useBlogPosts } from "@/hooks/admin/blogs/useBlogPosts"

interface BlogPostTabProps {
  subscriberCount: number
}

export function BlogPostTab({ subscriberCount }: BlogPostTabProps) {
  const [search,     setSearch]     = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: blogPosts = [], isLoading: blogsLoading } = useBlogPosts()
  const sendMutation = useSendBlogNewsletter()

  const filtered = blogPosts.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase())    ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  )

  // Toggle: clicking the same post deselects it
  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const handleSend = async () => {
    if (!selectedId) return
    await sendMutation.mutateAsync({ blogpostId: selectedId }).catch(() => null)
  }

  return (
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
          Select a published blog post. The AI will convert it into a newsletter and
          send it directly to{" "}
          <span className="font-medium text-[var(--color-dark-slate-gray)]">
            {subscriberCount} subscribers
          </span>.
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-cool-gray)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or author…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-coral)] outline-none text-sm bg-gray-50 placeholder:text-[var(--color-cool-gray)]"
          />
        </div>

        {/* Blog list */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
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
            filtered.map((post: any) => {
              const isSelected = selectedId === post.id
              return (
                <button
                  key={post.id}
                  onClick={() => handleSelect(post.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border"
                  style={
                    isSelected
                      ? { background: "oklch(0.96 0.06 10)", borderColor: "var(--color-soft-coral)" }
                      : { background: "var(--color-snow-white)", borderColor: "oklch(0.91 0.02 210)" }
                  }
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

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: isSelected ? "var(--color-soft-coral)" : "var(--color-dark-slate-gray)" }}
                    >
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {post.category && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium">
                          {post.category}
                        </span>
                      )}
                      {post.author && (
                        <span className="text-[11px] text-[var(--color-cool-gray)] truncate">
                          {post.author}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Send button — only when a post is selected */}
        {selectedId && (
          <div className="pt-1 border-t border-gray-100">
            <button
              onClick={handleSend}
              disabled={sendMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
            >
              {sendMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to {subscriberCount} Subscribers
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
