"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { NotionEditor } from "./notion-editor"

import { useBlogStore, type Blog } from "@/store/nutritionist/blogs-store"

interface BlogFormProps {
  blog?: Blog
  onCancel: () => void
  onSuccess: () => void
}

export function BlogForm({ blog, onCancel, onSuccess }: BlogFormProps) {
  const { createBlog, updateBlog, loading } = useBlogStore()
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    category: blog?.category || "",
    readTime: blog?.readtime || 5,
    featured: blog?.featured || false,
  })
  const [tags, setTags] = useState<string[]>(blog?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(blog?.image || null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()
    data.append("title", formData.title)
    data.append("excerpt", formData.excerpt)
    data.append("content", formData.content)
    data.append("category", formData.category)
    data.append("readTime", formData.readTime.toString())
    data.append("featured", formData.featured.toString())
    data.append("tags", JSON.stringify(tags))
    

    if (image) {
      data.append("image", image)
    }

    try {
      if (blog) {
        await updateBlog(blog.id, data)
      } else {
        await createBlog(data)
      }
      onSuccess()
    } catch (error) {
      console.error("Error saving blog:", error)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      // Create preview URL for new image
      const previewUrl = URL.createObjectURL(file)
      setExistingImageUrl(previewUrl)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-dark-slate-gray">{blog ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              placeholder="A brief summary of your blog post..."
            />
          </div>

          <div>
            <Label>Content</Label>
            <NotionEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Type '/' to add headings, lists, and more..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="readTime">Read Time (minutes)</Label>
              <Input
                id="readTime"
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: Number.parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="image">Featured Image</Label>
              <div className="space-y-2">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {existingImageUrl && (
                  <div className="relative">
                    <img
                      src={existingImageUrl || "/placeholder.svg"}
                      alt="Featured image preview"
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImage(null)
                        setExistingImageUrl(null)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-mint-green/20 text-dark-slate-gray">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-soft-coral">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <Label htmlFor="featured">Featured Post</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? "Saving..." : blog ? "Update Post" : "Create Post"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
