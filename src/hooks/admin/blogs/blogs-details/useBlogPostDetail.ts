import { useQuery } from "@tanstack/react-query"
import { RawBlogPost, BASE_URL, normalizeDetailPost } from "@/lib/admin/blog-helpers"

export function useBlogPostDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "blogPost", id],
    queryFn:  async () => {
      const res  = await fetch(`${BASE_URL}/blogPost/${id}`)
      if (!res.ok) throw new Error("Failed to load post")
      const json = await res.json()
      const raw: RawBlogPost = json.data ?? json
      return normalizeDetailPost(raw)
    },
    enabled: !!id,
  })
}
