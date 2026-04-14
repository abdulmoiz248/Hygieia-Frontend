"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { useBlogPostDetail }        from "@/hooks/admin/blogs/blogs-details/useBlogPostDetail"
import { useVerifyBlogPostDetail }  from "@/hooks/admin/blogs/blogs-details/useVerifyBlogPostDetail"
import { useDeleteBlogPostDetail }  from "@/hooks/admin/blogs/blogs-details/useDeleteBlogPostDetail"

import { BlogDetailTopBar }      from "@/components/admin/blogs/blogs-details/BlogDetailTopBar"
import { BlogDetailHero }        from "@/components/admin/blogs/blogs-details/BlogDetailHero"
import { BlogDetailMeta }        from "@/components/admin/blogs/blogs-details/BlogDetailMeta"
import { BlogDetailBody }        from "@/components/admin/blogs/blogs-details/BlogDetailBody"
import { BlogDetailActionPanel } from "@/components/admin/blogs/blogs-details/BlogDetailActionPanel"
import { BlogDetailLoadingState, BlogDetailNotFound } from "@/components/admin/blogs/blogs-details/BlogDetailStates"
import { ConfirmModal }          from "@/components/admin/blogs/ConfirmModal"
import { AdminToastContainer }   from "@/toasts/AdminToasts"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params?.id as string

  const [confirmVerify, setConfirmVerify] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: post, isLoading } = useBlogPostDetail(id)

  const verifyMutation = useVerifyBlogPostDetail(id)
  const deleteMutation = useDeleteBlogPostDetail(id)

  const handleVerify = async () => {
    await verifyMutation.mutateAsync()
    setConfirmVerify(false)
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync()
    setConfirmDelete(false)
    setTimeout(() => router.push("/admin/blogs"), 1200)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) return <BlogDetailLoadingState />
  if (!post)     return <BlogDetailNotFound />

  const isPending  = !post.isVerified
  const verifying  = verifyMutation.isPending
  const deleting   = deleteMutation.isPending

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

      <AdminToastContainer />

    </div>
  )
}
