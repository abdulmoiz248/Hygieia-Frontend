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

      {/* Floating Action Buttons - Right Side Bottom */}
      <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3">
        <Button
          size="icon"
          onClick={() => setIsShareModalOpen(true)}
          className="bg-snow-white/95 backdrop-blur-md hover:bg-snow-white text-soft-blue border-2 border-soft-blue/20 hover:border-soft-blue/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14 hover:scale-110"
        >
          <Share2 className="w-6 h-6" />
        </Button>

     
      </div>

      {/* Main Content */}
      <div className="relative pt-10">
        <div className="absolute inset-0 bg-gradient-to-b from-mint-green/5 via-transparent to-soft-blue/5 pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb Navigation - Above Content Card */}
          <div className="mb-6 flex items-center gap-3 text-cool-gray">
            <Link href="/" className="hover:text-soft-blue transition-colors flex items-center gap-1 group">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-soft-blue transition-colors text-sm font-medium">
              Blog
            </Link>
            <span>/</span>
            <span className="text-dark-slate-gray font-semibold text-sm truncate max-w-[300px]">
              {post.title}
            </span>
          </div>

          <div className="bg-snow-white rounded-3xl shadow-xl border border-soft-blue/10 overflow-hidden">
            <BlogContent post={post} />
          </div>

          {/* Bottom Navigation Bar */}
          <div className="mt-8 p-6 bg-snow-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-soft-blue/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link href="/blogs">
                <Button
                  variant="outline"
                  className="text-soft-blue hover:text-soft-blue/80 hover:bg-soft-blue/10 border-soft-blue/30 transition-all duration-300 rounded-full px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Posts
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsShareModalOpen(true)}
                  className="text-soft-blue hover:text-soft-blue/80 hover:bg-soft-blue/10 border-soft-blue/30 transition-all duration-300 rounded-full px-6"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>

               
              </div>
            </div>
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
