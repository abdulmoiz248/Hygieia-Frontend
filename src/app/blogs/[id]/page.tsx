"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { BlogContent } from "@/components/blog/blog-content"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Share2, BookmarkPlus } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { ShareModal } from "@/components/blog/share-modal"
import { useParams } from "next/navigation"
import { useBlogs } from "@/hooks/useBlogs"
import Loader from "@/components/loader/loader"

export default function BlogPostPage() {
  const { id } = useParams()
  const { data, isLoading, isError } = useBlogs()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const posts = data?.posts || []
  const post = useMemo(() => posts.find((p) => p.id === id), [posts, id])

  useEffect(() => {
    if (!isLoading && !post) {
      notFound()
    }
  }, [isLoading, post])

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-mint-green/20 via-snow-white to-soft-blue/20">
        <Loader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-coral/10 to-snow-white">
        <div className="text-center space-y-4">
          <p className="text-2xl font-semibold text-dark-slate-gray">Oops! Something went wrong</p>
          <p className="text-lg text-cool-gray">Failed to load blog. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (!post) return null

  const postUrl = `/blog/${post.id}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-mint-green/20">
        <div
          className="h-full bg-gradient-to-r from-soft-blue via-mint-green to-soft-coral transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

    

      {/* Main Content */}
      <div className="relative pt-10">
        <div className="absolute inset-0 bg-gradient-to-b from-mint-green/5 via-transparent to-soft-blue/5 pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-snow-white rounded-3xl shadow-xl border border-soft-blue/10 overflow-hidden">
            <BlogContent post={post} />
          </div>
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
