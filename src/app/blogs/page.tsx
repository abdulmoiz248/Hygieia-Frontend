"use client"

import { useState } from "react"
import { BlogCard } from "@/components/blog/blog-card"
import { CategoryFilter } from "@/components/blog/category-filter"
import { BlogHero } from "@/components/blog/blog-hero"
import { blogPosts, blogCategories } from "@/lib/blog-data"
import { TrendingUp, Star, Clock } from "lucide-react"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = selectedCategory ? blogPosts.filter((post) => post.category === selectedCategory) : blogPosts

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green ">
      <BlogHero />

      <section className="py-20 px-4 relative">
        {/* Background Decorations */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-soft-coral/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-mint-green/5 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <CategoryFilter
            categories={blogCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-soft-coral" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-dark-slate-gray to-soft-blue bg-clip-text text-transparent">
                    Featured Articles
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-soft-coral/30 to-transparent"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                    <BlogCard post={post} featured />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-mint-green" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-dark-slate-gray to-mint-green bg-clip-text text-transparent">
                    {featuredPosts.length > 0 ? "Latest Articles" : "All Articles"}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-mint-green/30 to-transparent"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${(index + featuredPosts.length) * 150}ms` }}
                  >
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-soft-blue/10 to-mint-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-12 h-12 text-cool-gray" />
              </div>
              <h3 className="text-2xl font-bold text-dark-slate-gray mb-4">No Articles Found</h3>
              <p className="text-cool-gray text-lg">
                Try selecting a different category or check back later for new content.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
