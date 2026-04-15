"use client"

import { useState, useMemo } from "react"
import { Loader2 } from "lucide-react"

import { Tab, ViewMode } from "@/lib/admin/blog-helpers"

import { useBlogPosts }            from "@/hooks/admin/blogs/useAdminBlogPosts"
import { useDeleteBlogPost }       from "@/hooks/admin/blogs/useDeleteBlogPost"
import { useVerifyBlogPost }       from "@/hooks/admin/blogs/useVerifyBlogPost"
import { useToggleFeatureBlogPost } from "@/hooks/admin/blogs/useToggleFeatureBlogPost"

import { BlogStatCards, buildStatCards } from "@/components/admin/blogs/BlogStatCards"
import { BlogFilters }                   from "@/components/admin/blogs/BlogFilters"
import { BlogCard }                      from "@/components/admin/blogs/BlogCard"
import { BlogRow }                       from "@/components/admin/blogs/BlogRow"
import { BlogEmptyState }                from "@/components/admin/blogs/BlogEmptyState"
import { AdminToastContainer }           from "@/toasts/AdminToasts"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogReviewPage() {
  const [search,    setSearch]    = useState("")
  const [viewMode,  setViewMode]  = useState<ViewMode>("grid")
  const [activeTab, setActiveTab] = useState<Tab>("all")

  const { data: posts = [], isLoading } = useBlogPosts()

  const deleteMutation       = useDeleteBlogPost()
  const verifyMutation       = useVerifyBlogPost()
  const toggleFeatureMutation = useToggleFeatureBlogPost()

  // ── Derived State ────────────────────────────────────────────────────────

  const totalCount     = posts.length
  const pendingCount   = posts.filter(p => !p.isVerified).length
  const publishedCount = posts.filter(p =>  p.isVerified).length

  const tabs = [
    { key: "all"       as Tab, label: "All Posts",  count: totalCount     },
    { key: "pending"   as Tab, label: "Pending",    count: pendingCount   },
    { key: "published" as Tab, label: "Published",  count: publishedCount },
  ]

  const filtered = useMemo(() =>
    posts
      .filter(p => {
        if (activeTab === "pending")   return !p.isVerified
        if (activeTab === "published") return  p.isVerified
        return true
      })
      .filter(p =>
        !search ||
        p.title?.toLowerCase().includes(search.toLowerCase())    ||
        p.author?.toLowerCase().includes(search.toLowerCase())   ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      ),
  [posts, activeTab, search])

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-6 space-y-5 bg-[var(--color-snow-white)]">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-soft-coral pb-0.5">Blog Review</h1>
        <p className="text-sm text-[var(--color-cool-gray)]">Review, approve and manage all blog posts</p>
      </div>

      {/* Stat Cards */}
      <BlogStatCards cards={buildStatCards(totalCount, pendingCount, publishedCount)} />

      {/* Filters */}
      <BlogFilters
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        viewMode={viewMode}
        onViewMode={setViewMode}
      />

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-soft-blue)] opacity-60" />
        </div>
      ) : filtered.length === 0 ? (
        <BlogEmptyState search={search} activeTab={activeTab} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          {filtered.map(post => (
            <BlogCard
              key={post.id}
              post={post}
              onDelete={()        => deleteMutation.mutate(post)}
              deleting={deleteMutation.isPending && deleteMutation.variables?.id === post.id}
              onVerify={()        => verifyMutation.mutate(post)}
              onToggleFeature={() => toggleFeatureMutation.mutate(post)}
              actioning={
                (verifyMutation.isPending        && verifyMutation.variables?.id === post.id) ||
                (toggleFeatureMutation.isPending && toggleFeatureMutation.variables?.id === post.id)
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(post => (
            <BlogRow
              key={post.id}
              post={post}
              onDelete={()        => deleteMutation.mutate(post)}
              deleting={deleteMutation.isPending && deleteMutation.variables?.id === post.id}
              onVerify={()        => verifyMutation.mutate(post)}
              onToggleFeature={() => toggleFeatureMutation.mutate(post)}
              actioning={
                (verifyMutation.isPending        && verifyMutation.variables?.id === post.id) ||
                (toggleFeatureMutation.isPending && toggleFeatureMutation.variables?.id === post.id)
              }
            />
          ))}
        </div>
      )}

      <AdminToastContainer />

    </div>
  )
}
