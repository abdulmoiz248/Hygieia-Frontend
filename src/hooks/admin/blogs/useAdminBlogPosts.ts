import { useQuery } from "@tanstack/react-query"
import { RawBlogPost, BASE_URL, normalizePost } from "@/lib/admin/blog-helpers"

export function useBlogPosts() {
  return useQuery({
    queryKey: ["admin", "blogPosts"],
    queryFn:  async () => {
      const res  = await fetch(`${BASE_URL}/blogPost`)
      const json = await res.json()
      const raw: RawBlogPost[] = Array.isArray(json) ? json
        : Array.isArray(json.data) ? json.data
        : json.posts ?? json.items ?? []
      return raw.map(normalizePost)
    },
  })
}
