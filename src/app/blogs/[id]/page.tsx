"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { BlogContent } from "@/components/blog/blog-content"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Share2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { ShareModal } from "@/components/blog/share-modal"
import { useParams } from "next/navigation"
import { useBlogs } from "@/hooks/useBlogs"

export default function BlogPostPage() {
  const { id } = useParams()
  const { data, isLoading, isError } = useBlogs()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const posts = data?.posts || []

  const post = useMemo(() => posts.find((p) => p.id === id), [posts, id])

  useEffect(() => {
    if (!isLoading && !post) {
      notFound()
    }
  }, [isLoading, post])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-dark-slate-gray">Loading blog...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Failed to load blog. Please try again later.</p>
      </div>
    )
  }

  if (!post) return null

  const postUrl = `/blog/${post.id}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green pt-20">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-soft-blue/10">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/blogs">
                <Button
                  variant="ghost"
                  className="text-soft-blue hover:text-soft-blue/80 hover:bg-soft-blue/10 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-cool-gray">
                <Link href="/" className="hover:text-soft-blue transition-colors">
                  <Home className="w-4 h-4" />
                </Link>
                <span>/</span>
                <Link href="/blogs" className="hover:text-soft-blue transition-colors">
                  Blog
                </Link>
                <span>/</span>
                <span className="text-dark-slate-gray font-medium truncate max-w-32">{post.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-soft-blue hover:text-soft-blue/80 hover:bg-soft-blue/10 transition-all duration-300"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <BlogContent post={post} />
        </div>
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        postTitle={post.title}
        postUrl={postUrl}
      />
    </div>
  )
}
