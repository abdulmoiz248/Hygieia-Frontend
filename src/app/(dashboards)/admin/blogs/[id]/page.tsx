"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

import {
  BlogPostDetail, RawBlogPost,
  BASE_URL, ADMIN_ID, normalizeDetailPost,
} from "@/lib/admin/blog-helpers"

import { BlogDetailTopBar }      from "@/components/admin/blogs/blogs-details/BlogDetailTopBar"
import { BlogDetailHero }        from "@/components/admin/blogs/blogs-details/BlogDetailHero"
import { BlogDetailMeta }        from "@/components/admin/blogs/blogs-details/BlogDetailMeta"
import { BlogDetailBody }        from "@/components/admin/blogs/blogs-details/BlogDetailBody"
import { BlogDetailActionPanel } from "@/components/admin/blogs/blogs-details/BlogDetailActionPanel"
import { BlogDetailLoadingState, BlogDetailNotFound } from "@/components/admin/blogs/blogs-details/BlogDetailStates"
import { ConfirmModal }          from "@/components/admin/blogs/ConfirmModal"
import { ToastBanner }           from "@/components/admin/blogs/ToastBanner"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params?.id as string

  const [post,          setPost]          = useState<BlogPostDetail | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [verifying,     setVerifying]     = useState(false)
  const [deleting,      setDeleting]      = useState(false)
  const [toast,         setToast]         = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const [confirmVerify, setConfirmVerify] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // ── Toast ─────────────────────────────────────────────────────────────────

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${BASE_URL}/blogPost/${id}`)
        const json = await res.json()
        const raw: RawBlogPost = json.data ?? json
        setPost(normalizeDetailPost(raw))
      } catch {
        showToast("Failed to load post.", "error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleVerify = async () => {
    if (!post) return
    setVerifying(true)
    try {
      await fetch(`${BASE_URL}/blogPost/${post.id}/verify`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ adminUserId: ADMIN_ID }),
      })
      setPost(prev => prev ? { ...prev, isVerified: true } : prev)
      setConfirmVerify(false)
      showToast("Post approved and published!", "success")
    } catch {
      showToast("Failed to approve post.", "error")
    } finally {
      setVerifying(false)
    }
  }

  const handleDelete = async () => {
    if (!post) return
    setDeleting(true)
    try {
      await fetch(`${BASE_URL}/blogPost/${post.id}`, { method: "DELETE" })
      setConfirmDelete(false)
      showToast("Post deleted.", "error")
      setTimeout(() => router.push("/admin/blogs"), 1200)
    } catch {
      showToast("Failed to delete post.", "error")
      setDeleting(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return <BlogDetailLoadingState />
  if (!post)   return <BlogDetailNotFound />

  const isPending = !post.isVerified

  return (
    <div className="min-h-screen bg-[var(--color-snow-white)]">

      {/* Top bar */}
      <BlogDetailTopBar
        post={post}
        isPending={isPending}
        verifying={verifying}
        deleting={deleting}
        onApprove={() => setConfirmVerify(true)}
        onDeleteRequest={() => setConfirmDelete(true)}
      />

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        <BlogDetailHero post={post} />

        <BlogDetailMeta post={post} />

        <div className="border-t" style={{ borderColor: "oklch(0.88 0.04 210)" }} />

        <BlogDetailBody content={post.content} />

        <BlogDetailActionPanel
          isPending={isPending}
          title={post.title}
          verifying={verifying}
          deleting={deleting}
          onApprove={() => setConfirmVerify(true)}
          onDeleteRequest={() => setConfirmDelete(true)}
        />

      </div>

      {/* Confirm modals */}
      {confirmVerify && (
        <ConfirmModal
          title="Approve & Publish Post?"
          message={`"${post.title}" will be verified and made publicly visible to all users on the platform.`}
          confirmLabel="Yes, Approve"
          confirmStyle={{ background: "var(--color-mint-green)", color: "var(--color-dark-slate-gray)" }}
          onConfirm={handleVerify}
          onCancel={() => setConfirmVerify(false)}
          loading={verifying}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title={isPending ? "Reject & Delete Post?" : "Delete Post?"}
          message={`"${post.title}" will be permanently deleted. This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          confirmStyle={{ background: "var(--color-soft-coral)", color: "white" }}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}

      {/* Toast */}
      {toast && <ToastBanner toast={toast} />}

    </div>
  )
}
