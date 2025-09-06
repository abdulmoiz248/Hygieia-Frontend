"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Plus } from "lucide-react"

import { useBlogStore ,Blog} from "@/store/nutritionist/blogs-store"
import Image from "next/image"

interface BlogListProps {
  onEdit: (blog: Blog) => void
  onCreate: () => void
  onView: (blog: Blog) => void
}

export function BlogList({ onEdit, onCreate, onView }: BlogListProps) {
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlogStore()

  useEffect(() => {
    if(blogs.length==0)
        fetchBlogs()
  }, [fetchBlogs])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlog(id)
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-slate-gray">My Blog Posts</h1>
        <Button onClick={onCreate} className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

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
          {Array.isArray(blogs) &&
            blogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {blog.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src={blog.image || "/placeholder.svg?height=80&width=120"}
                          alt={blog.title}
                          width={120}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          {blog.category && (
                            <Badge variant="outline" className="text-soft-blue border-soft-blue">
                              {blog.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          )}
                          {blog.featured && <Badge className="bg-soft-coral text-snow-white">Featured</Badge>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onView(blog)}
                            className="hover:bg-mint-green/20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(blog)}
                            className="hover:bg-soft-blue/20"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(blog.id)}
                            className="text-soft-coral hover:text-soft-coral hover:bg-soft-coral/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-dark-slate-gray mb-2 line-clamp-2">{blog.title}</h3>
                      {blog.excerpt && <p className="text-cool-gray mb-3 line-clamp-2">{blog.excerpt}</p>}
                      <div className="flex items-center gap-4 text-sm text-cool-gray">
                        {blog.publishedat && <span>{new Date(blog.publishedat).toLocaleDateString()}</span>}
                        {blog.readtime && <span>{blog.readtime} min read</span>}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex gap-1">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-mint-green/20 text-dark-slate-gray text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {blog.tags.length > 3 && <span className="text-xs">+{blog.tags.length - 3} more</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
