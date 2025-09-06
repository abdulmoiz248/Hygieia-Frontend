import { useQuery } from "@tanstack/react-query"
import type { BlogPost, BlogCategory } from "@/types/blog"
import api from "@/lib/axios"

const defaultColors = ["soft-blue", "soft-coral", "mint-green", "soft-yellow", "soft-purple"]

export function useBlogs() {
  return useQuery<{ posts: BlogPost[]; categories: BlogCategory[] }>({
    queryKey: ["blogsAndCategories"],
    queryFn: async () => {
      const res = await api("/blogPost")
      if (!res.data) throw new Error("Failed to fetch blogs")

     
      const posts: BlogPost[] = Array.isArray(res.data.data) ? res.data.data : []

      const categoryMap = new Map<string, BlogCategory>()
      posts.forEach((post) => {
        if (!categoryMap.has(post.category)) {
          const color = defaultColors[categoryMap.size % defaultColors.length]
          categoryMap.set(post.category, {
            id: post.category,
            name: post.category
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            description: post.excerpt || "",
            color,
          })
        }
      })

      return {
        posts,
        categories: Array.from(categoryMap.values()),
      }
    },
  })
}
