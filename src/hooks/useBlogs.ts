import { useQuery } from "@tanstack/react-query"
import type { BlogPost, BlogCategory } from "@/types/blog"
import api from "@/lib/axios"
import { normalizeEscapedText } from "@/lib/blog-markdown"

const defaultColors = ["soft-blue", "soft-coral", "mint-green", "soft-yellow", "soft-purple"]

type RawBlogPost = Partial<BlogPost> & {
  body?: string
  createdAt?: string
  readtime?: number
  isFeatured?: boolean
  isVerified?: boolean
  isverified?: boolean
}

function normalizeBlogPost(raw: RawBlogPost): BlogPost {
  const verifiedFlag =
    raw.verified ??
    raw.isVerified ??
    raw.isverified
  const verified = Boolean(verifiedFlag ?? (raw.status === "verified" || raw.status === "published"))

  return {
    id: raw.id ?? "",
    title: raw.title ?? "Untitled",
    excerpt: normalizeEscapedText(raw.excerpt ?? ""),
    content: normalizeEscapedText(raw.content ?? raw.body ?? ""),
    author: raw.author ?? "Unknown Author",
    publishedat: raw.publishedat ?? raw.createdAt ?? new Date().toISOString(),
    readTime: raw.readTime ?? raw.readtime ?? 0,
    readtime: raw.readtime ?? raw.readTime ?? 0,
    category: raw.category ?? "General",
    tags: raw.tags ?? [],
    image: raw.image || "/placeholder.svg",
    featured: raw.featured ?? raw.isFeatured ?? false,
    isFeatured: raw.isFeatured ?? raw.featured ?? false,
    verified,
    isVerified: verified,
    isverified: verified,
    status: raw.status,
  }
}

export function useBlogs() {
  return useQuery<{ posts: BlogPost[]; categories: BlogCategory[] }>({
    queryKey: ["blogsAndCategories"],
    queryFn: async () => {
      const res = await api("/blogPost")
      if (!res.data) throw new Error("Failed to fetch blogs")

     
      const posts: BlogPost[] = Array.isArray(res.data.data)
        ? res.data.data.map((post: RawBlogPost) => normalizeBlogPost(post)).filter((post: BlogPost) => post.id)
        : []

      const categoryMap = new Map<string, BlogCategory>()
      posts.filter((post) => post.verified).forEach((post) => {
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
