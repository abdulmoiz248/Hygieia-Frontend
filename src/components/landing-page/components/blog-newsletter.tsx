"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import Image from "next/image"
import api from "@/lib/axios"
import type { BlogPost } from "@/types/blog"
import { useBlogs } from "@/hooks/useBlogs"

export default function BlogNewsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
 
  const [error, setError] = useState("")
  const router = useRouter()
   const { data, isLoading:loading, isError } = useBlogs()
   const {posts:blogPosts,categories:blogCategories}=data || {posts:[],categories:[]}
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      setIsLoading(loading)
    }, [loading])

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {}
    blogCategories.forEach((cat:any) => {
      map[cat.id.toLowerCase()] = cat.name
    })
    return map
  }, [blogCategories])

  const featuredPosts = useMemo(() => {
    const shuffled = [...blogPosts].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }, [blogPosts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsLoading(true)
      setError("")
      try {
        await api.post("/subscribe-newsletter", { email })
        setIsSubmitted(true)
      } catch (error) {
        console.log("Error submitting email:", error)
        setIsSubmitted(true)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <section className="py-20 px-4 md:px-10 bg-gradient-to-b from-mint-green to-snow-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full md:w-2/3"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark-slate-gray mb-8">
              Latest Health Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post: BlogPost, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.03,
                    rotateY: 5,
                    rotateX: 5,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="transform perspective-1000 cursor-pointer"
                  onClick={() => router.push(`/blogs/${post.id}`)}
                >
                  <Card className="overflow-hidden border-0 shadow-md h-full">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        fill
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-2 left-2 bg-soft-coral text-white text-xs px-2 py-1 rounded">
                        {categoryMap[post.category.toLowerCase()] ?? post.category}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-dark-slate-gray mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-soft-coral hover:text-soft-blue"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/blogs/${post.id}`)
                        }}
                      >
                        Read More →
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                className="bg-soft-blue hover:bg-[#1a3a5f] text-white"
                onClick={() => router.push("/blogs")}
              >
                View All Articles
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3"
          >
            <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] h-full">
              <h2 className="text-2xl font-bold text-dark-slate-gray mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mb-6">
                Get the latest health tips, AI insights, and exclusive offers delivered to your inbox.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full focus:ring-2 focus:ring-[#2A5C82] transition-all duration-300"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-soft-coral hover:bg-[#2DC653] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </span>
                      ) : (
                        "Subscribe Now"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-lg text-center"
                >
                  <div className="w-16 h-16 bg-[#34C759]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-[#34C759]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0c2842] mb-2">Successfully Subscribed!</h3>
                  <p className="text-gray-600">Thank you for subscribing! You&apos;ll start receiving our health insights and exclusive updates in your inbox.</p>
                </motion.div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#2A5C82]/20 flex items-center justify-center mr-3">
                    <Check className="w-4 h-4 text-soft-coral" />
                  </div>
                  <p className="text-sm text-gray-600">Weekly health tips</p>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#2A5C82]/20 flex items-center justify-center mr-3">
                    <Check className="w-4 h-4 text-soft-coral" />
                  </div>
                  <p className="text-sm text-gray-600">Exclusive AI insights</p>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#2A5C82]/20 flex items-center justify-center mr-3">
                    <Check className="w-4 h-4 text-soft-coral" />
                  </div>
                  <p className="text-sm text-gray-600">Special offers</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
