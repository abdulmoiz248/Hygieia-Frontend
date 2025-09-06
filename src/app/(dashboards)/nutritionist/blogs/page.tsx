"use client"

import { useState } from "react"
import { BlogList } from "@/components/nutritionist/blogs/blog-list"
import { BlogForm } from "@/components/nutritionist/blogs/blog-form"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

import { Blog} from "@/store/nutritionist/blogs-store"

type View = "list" | "create" | "edit" | "view"

export default function BlogDashboard() {
 
  const [currentView, setCurrentView] = useState<View>("list")
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog)
    setCurrentView("edit")
  }

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog)
     window.open(`/blogs/${blog.id}`, "_blank")
  //  setCurrentView("view")
  }

  const handleCreate = () => {
    setSelectedBlog(null)
    setCurrentView("create")
  }

  const handleBack = () => {
    setCurrentView("list")
    setSelectedBlog(null)
  }

  const handleSuccess = () => {
    setCurrentView("list")
    setSelectedBlog(null)
  }


  return (
    <div className="min-h-screen bg-snow-white">
      <div className="container">
       

        {currentView === "list" && <BlogList onEdit={handleEdit} onCreate={handleCreate} onView={handleView} />}

        {(currentView === "create" || currentView === "edit") && (
          <BlogForm blog={selectedBlog!} onCancel={handleBack} onSuccess={handleSuccess} />
        )}

     

      </div>
    </div>
  )
}
