import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BASE_URL, BlogPost } from "@/lib/admin/blog-helpers"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminSuccess, adminError } from "@/toasts/AdminToasts"

export function useVerifyBlogPost() {
  const queryClient = useQueryClient()
  const adminId     = useAdminStore(s => s.adminId)

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      const res = await fetch(`${BASE_URL}/blogPost/${post.id}/verify`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId: adminId }),  // ✅ fixed
      })
      if (!res.ok) throw new Error("Failed to verify post")
      return post
    },
    onSuccess: (post) => {
      queryClient.setQueryData<BlogPost[]>(["admin", "blogPosts"], (prev = []) =>
        prev.map(p => p.id === post.id ? { ...p, isVerified: true } : p)
      )
      adminSuccess(`"${post.title}" verified and published.`)
    },
    onError: () => {
      adminError("Failed to verify post.")
    },
  })
}