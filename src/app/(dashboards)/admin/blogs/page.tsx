"use client"

import { useState, useMemo } from "react"
import { Loader2 } from "lucide-react"

import { Tab, ViewMode, BlogPost } from "@/lib/admin/blog-helpers"

import { useBlogPosts }             from "@/hooks/admin/blogs/useAdminBlogPosts"
import { useVerifyBlogPost }        from "@/hooks/admin/blogs/useVerifyBlogPost"
import { useToggleFeatureBlogPost } from "@/hooks/admin/blogs/useToggleFeatureBlogPost"

import { BlogStatCards, buildStatCards } from "@/components/admin/blogs/BlogStatCards"
import { BlogFilters }                   from "@/components/admin/blogs/BlogFilters"
import { BlogCard }                      from "@/components/admin/blogs/BlogCard"
import { BlogRow }                       from "@/components/admin/blogs/BlogRow"
import { BlogEmptyState }                from "@/components/admin/blogs/BlogEmptyState"
import { AdminToastContainer }           from "@/toasts/AdminToasts"
import BlogDeleteModal from "@/components/admin/blogs/BlogDeleteModal"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogReviewPage() {
  const [search,      setSearch]      = useState("")
  const [viewMode,    setViewMode]    = useState<ViewMode>("grid")
  const [activeTab,   setActiveTab]   = useState<Tab>("all")
  const [deletePost,  setDeletePost]  = useState<BlogPost | null>(null)

  const { data: posts = [], isLoading } = useBlogPosts()

  const verifyMutation        = useVerifyBlogPost()
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

      {/* Header — matches WorkersPageHeader style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
        <div>
          <h1 className="text-3xl font-bold pb-1 text-soft-coral">
            Blog Review
          </h1>
          <p
            className="text-base font-semibold mt-0.5 capitalize"
            style={{
              background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Review, approve and manage all blog posts
          </p>
        </div>
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
              onDelete={()        => setDeletePost(post)}
              deleting={false}
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
              onDelete={()        => setDeletePost(post)}
              deleting={false}
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

      {/* Delete Modal */}
      {deletePost && (
        <BlogDeleteModal
          post={deletePost}
          onClose={() => setDeletePost(null)}
        />
      )}

      <AdminToastContainer />

    </div>
  )
}
