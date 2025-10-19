"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, AlertTriangle } from "lucide-react"
import { NotionEditor } from "./notion-editor"
import { useBlogStore, type Blog } from "@/store/nutritionist/blogs-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

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

  // --- New states for Hugging Face generation ---
  const [generating, setGenerating] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  // --- Modal states ---
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" })

  const handleError = (message: string) => {
    setErrorModal({ open: true, message })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || tags.length === 0 || !existingImageUrl) {
      handleError("Please fill in all required fields, add at least one tag, and upload an image.")
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

    if (image) {
      data.append("image", image)
    } else if (existingImageUrl && existingImageUrl.startsWith("data:image")) {
      const res = await fetch(existingImageUrl)
      const blob = await res.blob()
      const file = new File([blob], "generated.png", { type: blob.type })
      data.append("image", file)
    }

    try {
      if (blog) await updateBlog(blog.id, data)
      else await createBlog(data)
      onSuccess()
    } catch (error) {
      console.error("Error saving blog:", error)
      handleError("Something went wrong while saving your blog. Please try again.")
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

  const generateImage = async () => {
    if (!formData.title && !formData.excerpt && !formData.content) {
      handleError("Please add a title, excerpt, or content before generating an image.")
      return
    }

    setGenerating(true)
    try {
      const res = await fetch("/api/generateImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.title, excerpt: formData.excerpt, content: formData.content }),
      })
      const data = await res.json()
      if (data.imageUrl) {
        setPreviewImage(data.imageUrl)
        setShowModal(true)
      } else {
        handleError("Failed to generate image. Please try again.")
      }
    } catch (err) {
      console.error(err)
      handleError("Image generation failed. Please try again later.")
    }
    setGenerating(false)
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto shadow-xl border border-gray-100 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold text-soft-blue">
            {blog ? "Edit Blog Post ✏️" : "Create New Blog Post 📝"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-soft-blue font-medium">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-soft-blue font-medium">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt" className="text-soft-blue font-medium">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                placeholder="A brief summary of your blog post..."
                required
                className="mt-1"
              />
            </div>

            {/* Content */}
            <div>
              <Label className="font-medium text-soft-blue">Content *</Label>
              <div className="border rounded-lg bg-white p-2 mt-1 shadow-inner">
                <NotionEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Type '/' to add headings, lists, and more..."
                />
              </div>
            </div>

            {/* ReadTime & Featured Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="readTime" className="font-medium text-soft-blue">Read Time (minutes) *</Label>
                <Input
                  id="readTime"
                  type="number"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: Number.parseInt(e.target.value) })}
                  min="1"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="image" className="font-medium text-soft-blue">Featured Image *</Label>
                <div className="space-y-2 mt-1">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required={!existingImageUrl} />
                  <Button
                    type="button"
                    onClick={generateImage}
                    disabled={generating}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white w-full transition-all"
                  >
                    {generating ? "Generating..." : "✨ Generate Image"}
                  </Button>

                  {existingImageUrl && (
                    <div className="relative mt-3 rounded-md overflow-hidden shadow-md">
                      <img
                        src={existingImageUrl}
                        alt="Featured preview"
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 bg-soft-coral text-white hover:bg-red-500"
                        onClick={() => { setImage(null); setExistingImageUrl(null) }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="font-medium text-soft-blue">Tags *</Label>
              <div className="flex gap-2 mb-2 mt-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm" variant="secondary">
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

            {/* Submit / Cancel */}
            <div className="flex gap-4 mt-6">
              <Button type="submit" disabled={loading} className="bg-soft-blue text-white hover:bg-soft-blue/90 flex-1 py-2 text-base rounded-lg">
                {loading ? "Saving..." : blog ? "Update Post" : "Create Post"}
              </Button>
              <Button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-soft-coral hover:bg-soft-coral hover:text-white py-2 rounded-lg">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- Error Modal --- */}
      <Dialog open={errorModal.open} onOpenChange={(open) => setErrorModal({ open, message: "" })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-soft-coral">
              <AlertTriangle className="w-5 h-5" /> Oops!
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              {errorModal.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorModal({ open: false, message: "" })} className="bg-soft-blue text-white hover:bg-soft-blue/90">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Preview Modal --- */}
      {showModal && previewImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-xl w-full relative shadow-2xl animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold mb-2 text-soft-blue">Preview Generated Image</h3>
            <img src={previewImage} alt="Generated preview" className="w-full h-64 object-cover rounded-lg mb-4" />
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                onClick={() => {
                  setExistingImageUrl(previewImage)
                  setImage(null)
                  setShowModal(false)
                }}
                className="bg-soft-blue text-white hover:bg-soft-blue/90"
              >
                Approve
              </Button>
              <Button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-100 text-soft-blue hover:bg-gray-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
