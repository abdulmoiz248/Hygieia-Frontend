import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BASE_URL, BlogPost } from "@/lib/admin/blog-helpers"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminSuccess, adminError } from "@/toasts/AdminToasts"

export function useToggleFeatureBlogPost() {
  const queryClient = useQueryClient()
  const adminId     = useAdminStore(s => s.adminId)

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      const endpoint = post.isFeatured ? "unfeature" : "feature"
      const res = await fetch(`${BASE_URL}/blogPost/${post.id}/${endpoint}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId: adminId }),  // ✅ fixed
      })
      if (!res.ok) throw new Error(`Failed to ${endpoint} post`)
      return post
    },
    onSuccess: (post) => {
      queryClient.setQueryData<BlogPost[]>(["admin", "blogPosts"], (prev = []) =>
        prev.map(p => p.id === post.id ? { ...p, isFeatured: !p.isFeatured } : p)
      )
      adminSuccess(
        post.isFeatured
          ? `"${post.title}" removed from featured.`
          : `"${post.title}" marked as featured.`
      )
    },
    onError: (_, post) => {
      adminError(`Failed to ${post.isFeatured ? "unfeature" : "feature"} post.`)
    },
  })
}