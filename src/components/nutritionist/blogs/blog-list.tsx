"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Plus } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { useBlogStore, Blog } from "@/store/nutritionist/blogs-store"
import Image from "next/image"

interface BlogListProps {
  onEdit: (blog: Blog) => void
  onCreate: () => void
  onView: (blog: Blog) => void
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function BlogList({ onEdit, onCreate, onView }: BlogListProps) {
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlogStore()
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)

  useEffect(() => {
    if (blogs.length === 0) fetchBlogs()
  }, [fetchBlogs])

  const handleDelete = async () => {
    if (blogToDelete) {
      await deleteBlog(blogToDelete.id)
      setBlogToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-cool-gray">Loading blogs...</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-soft-coral p-8">Error loading blogs: {error}</div>
  }

  return (
    <div className="space-y-6">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soft-coral">My Blogs</h1>
          <p className="text-cool-gray">Manage your blog posts and create new content</p>
        </div>
        <Button onClick={onCreate} className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </motion.div>

      {!blogs || blogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-cool-gray mb-4">No blog posts yet.</p>
            <Button onClick={onCreate} className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => onEdit(blog)}
            >
              {blog.image && (
                <div className="relative w-full h-48 md:h-52">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-t-3xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-5 flex flex-col justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {blog.category && (
                      <Badge className="bg-soft-blue/20 text-soft-blue text-xs px-3 py-1 rounded-full font-medium">
                        {blog.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    )}
                    {blog.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} className="bg-mint-green/20 text-dark-slate-gray text-xs px-2 py-1 rounded-full">
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags && blog.tags.length > 3 && (
                      <span className="text-xs text-cool-gray">+{blog.tags.length - 3} more</span>
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-soft-coral line-clamp-2">{blog.title}</h3>
                  {blog.excerpt && <p className="text-sm text-cool-gray line-clamp-3">{blog.excerpt}</p>}
                </div>

                <div className="flex items-center justify-between mt-4 text-sm text-cool-gray">
                  <span>{blog.publishedat && new Date(blog.publishedat).toLocaleDateString()}</span>
                  <span>{blog.readtime && `${blog.readtime} min read`}</span>
                  <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onView(blog)
                      }}
                      className="hover:bg-mint-green/20"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setBlogToDelete(blog)
                      }}
                      className="text-soft-coral hover:text-soft-coral hover:bg-soft-coral/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {blog.featured && (
                  <Badge className="absolute top-4 right-4 bg-soft-coral text-white text-xs px-3 py-1 rounded-full shadow-md">
                    Featured
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-soft-coral mb-4">Delete Blog?</h2>
            <p className="text-cool-gray mb-6">Are you sure you want to delete "{blogToDelete.title}"? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setBlogToDelete(null)} className="bg-cool-gray hover:bg-cool-gray/80 text-white">
                Cancel
              </Button>
              <Button onClick={handleDelete} className="bg-soft-coral hover:bg-soft-coral/90 text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
