"use client"

import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"

import {
  BlogPost, RawBlogPost, Tab, ViewMode,
  BASE_URL, normalizePost,
} from "@/lib/admin/blog-helpers"

import { BlogStatCards, buildStatCards } from "@/components/admin/blogs/BlogStatCards"
import { BlogFilters }                   from "@/components/admin/blogs/BlogFilters"
import { BlogCard }                      from "@/components/admin/blogs/BlogCard"
import { BlogRow }                       from "@/components/admin/blogs/BlogRow"
import { BlogEmptyState }                from "@/components/admin/blogs/BlogEmptyState"
import { ToastBanner }                   from "@/components/admin/blogs/ToastBanner"

// ─── Admin ID ─────────────────────────────────────────────────────────────────

const ADMIN_ID = "af30f1aa-1ec5-4fb8-99d5-8d17f31fb0c8"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogReviewPage() {
  const [posts,       setPosts]       = useState<BlogPost[]>([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState("")
  const [viewMode,    setViewMode]    = useState<ViewMode>("grid")
  const [activeTab,   setActiveTab]   = useState<Tab>("all")
  const [deletingId,  setDeletingId]  = useState<string | null>(null)
  const [actioningId, setActioningId] = useState<string | null>(null)
  const [toast,       setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null)

  // ── Toast ────────────────────────────────────────────────────────────────

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${BASE_URL}/blogPost`)
        const json = await res.json()
        const raw: RawBlogPost[] = Array.isArray(json) ? json
          : Array.isArray(json.data) ? json.data
          : json.posts ?? json.items ?? []
        setPosts(raw.map(normalizePost))
      } catch {
        showToast("Failed to load posts.", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleDelete = async (post: BlogPost) => {
    setDeletingId(post.id)
    try {
      await fetch(`${BASE_URL}/blogPost/${post.id}`, { method: "DELETE" })
      setPosts(prev => prev.filter(p => p.id !== post.id))
      showToast(`"${post.title}" deleted.`, "error")
    } catch {
      showToast("Failed to delete post.", "error")
    } finally {
      setDeletingId(null)
    }
  }

  const handleVerify = async (post: BlogPost) => {
    setActioningId(post.id)
    try {
      await fetch(`${BASE_URL}/blogPost/${post.id}/verify`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ adminUserId: ADMIN_ID }),
      })
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isVerified: true } : p))
      showToast(`"${post.title}" verified and published.`, "success")
    } catch {
      showToast("Failed to verify post.", "error")
    } finally {
      setActioningId(null)
    }
  }

  const handleToggleFeature = async (post: BlogPost) => {
    setActioningId(post.id)
    const endpoint = post.isFeatured ? "unfeature" : "feature"
    try {
      await fetch(`${BASE_URL}/blogPost/${post.id}/${endpoint}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ adminUserId: ADMIN_ID }),
      })
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isFeatured: !p.isFeatured } : p))
      showToast(
        post.isFeatured
          ? `"${post.title}" removed from featured.`
          : `"${post.title}" marked as featured.`,
        "success",
      )
    } catch {
      showToast(`Failed to ${endpoint} post.`, "error")
    } finally {
      setActioningId(null)
    }
  }

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
      {loading ? (
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
              onDelete={()        => handleDelete(post)}
              deleting={deletingId  === post.id}
              onVerify={()        => handleVerify(post)}
              onToggleFeature={() => handleToggleFeature(post)}
              actioning={actioningId === post.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(post => (
            <BlogRow
              key={post.id}
              post={post}
              onDelete={()        => handleDelete(post)}
              deleting={deletingId  === post.id}
              onVerify={()        => handleVerify(post)}
              onToggleFeature={() => handleToggleFeature(post)}
              actioning={actioningId === post.id}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && <ToastBanner toast={toast} />}

    </div>
  )
}
