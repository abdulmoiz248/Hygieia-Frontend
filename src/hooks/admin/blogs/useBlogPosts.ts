import { useQuery } from "@tanstack/react-query"
import { BASE_URL, normalizePost } from "@/lib/admin/blog-helpers"
import { adminError } from "@/toasts/AdminToasts"
import type { BlogPost, RawBlogPost } from "@/lib/admin/blog-helpers"

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${BASE_URL}/blogPost`)

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch blog posts")
  }

  // ✅ match all response shapes the blogs page handles
  const raw: RawBlogPost[] = Array.isArray(json)      ? json
    : Array.isArray(json.data)  ? json.data
    : json.posts                ? json.posts
    : json.items                ? json.items
    : []

  // ✅ reuse normalizePost from blog-helpers — same logic as the blogs page
  //    it correctly checks isVerified, verified, isverified, and status === "published"
  return raw.map(normalizePost).filter((p) => p.isVerified)
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn:  fetchBlogPosts,
    staleTime: 1000 * 60 * 5,
    throwOnError: false,
    meta: {
      onError: (err: Error) =>
        adminError(err.message || "Failed to load blog posts."),
    },
  })
}
