import { useQuery } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/constants"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminError } from "@/toasts/AdminToasts"

export interface BlogPostSummary {
  id: string
  title: string
  category: string
  author: string
  excerpt?: string
  isVerified: boolean
}

async function fetchBlogPosts(adminId: string): Promise<BlogPostSummary[]> {
  const res = await fetch(`${BASE_URL}/blogPost`, {
    headers: {
      "Content-Type": "application/json",
      "x-admin-id": adminId,
    },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Failed to fetch blog posts")
  // Return only verified/published posts — no point sending a draft as a newsletter
  const posts: BlogPostSummary[] = Array.isArray(json) ? json : (json.data ?? [])
  return posts.filter((p) => p.isVerified)
}

export function useBlogPosts() {
  const adminId = useAdminStore((s) => s.adminId)

  return useQuery({
    queryKey: ["admin-blog-posts", adminId],
    queryFn: () => fetchBlogPosts(adminId!),
    enabled: !!adminId,
    staleTime: 1000 * 60 * 5,
    throwOnError: false,
    meta: {
      onError: (err: Error) => adminError(err.message || "Failed to load blog posts."),
    },
  })
}
