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
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || tags.length === 0 || !existingImageUrl) {
      alert("Please fill in all fields, add at least one tag, and upload an image.")
      return
    }

    const data = new FormData()
    data.append("title", formData.title)
    data.append("excerpt", formData.excerpt)
    data.append("content", formData.content)
    data.append("category", formData.category)
    data.append("readTime", formData.readTime.toString())
    data.append("featured", formData.featured.toString())
    data.append("tags", JSON.stringify(tags))
    if (image) data.append("image", image)

    try {
      if (blog) await updateBlog(blog.id, data)
      else await createBlog(data)
      onSuccess()
    } catch (error) {
      console.error("Error saving blog:", error)
    }
  }

  const addTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
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
      setExistingImageUrl(URL.createObjectURL(file))
    }
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border border-gray-200 rounded-xl">
      <CardHeader className="">
        <CardTitle className="text-2xl font-semibold text-soft-blue">{blog ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-soft-blue font-medium">Title <span className="text-soft-coral">*</span></Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-soft-blue font-medium">Category <span className="text-soft-coral">*</span></Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt" className=" text-soft-blue font-medium">Excerpt <span className="text-soft-coral">*</span></Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              placeholder="A brief summary of your blog post..."
              required
            />
          </div>

          <div>
            <Label className="font-medium text-soft-blue">Content <span className="text-soft-coral">*</span></Label>
            <NotionEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Type '/' to add headings, lists, and more..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="readTime" className="font-medium text-soft-blue">Read Time (minutes) <span className="text-soft-coral">*</span></Label>
              <Input
                id="readTime"
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: Number.parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="image" className="font-medium text-soft-blue">Featured Image <span className="text-soft-coral">*</span></Label>
              <div className="space-y-2">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required={!existingImageUrl} />
                {existingImageUrl && (
                  <div className="relative">
                    <img
                      src={existingImageUrl}
                      alt="Featured image preview"
                      className="w-full h-40 object-cover rounded-md border border-gray-300"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => { setImage(null); setExistingImageUrl(null) }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label className="font-medium text-soft-blue">Tags <span className="text-soft-coral">*</span></Label>
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
                <Badge key={tag} variant="secondary" className="bg-mint-green/30 text-soft-blue px-2 py-1 rounded flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-soft-coral">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>



          <div className="flex gap-4 mt-4">
            <Button type="submit" disabled={loading} className="bg-soft-blue text-snow-white hover:bg-soft-blue/90 flex-1">
              {loading ? "Saving..." : blog ? "Update Post" : "Create Post"}
            </Button>
            <Button type="button"  onClick={onCancel} className="flex-1 bg-snow-white text-soft-coral hover:bg-soft-coral hover:text-snow-white">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
