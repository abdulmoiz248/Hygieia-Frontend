import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BASE_URL, BlogPostDetail } from "@/lib/admin/blog-helpers"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminSuccess, adminError } from "@/toasts/AdminToasts"

export function useVerifyBlogPostDetail(id: string) {
  const queryClient = useQueryClient()
  const adminId     = useAdminStore(s => s.adminId)

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/blogPost/${id}/verify`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId: adminId }),  // ✅ fixed
      })
      if (!res.ok) throw new Error("Failed to approve post")
    },
    onSuccess: () => {
      queryClient.setQueryData<BlogPostDetail>(["admin", "blogPost", id], (prev) =>
        prev ? { ...prev, isVerified: true } : prev
      )
      queryClient.invalidateQueries({ queryKey: ["admin", "blogPosts"] })
      adminSuccess("Post approved and published!")
    },
    onError: () => {
      adminError("Failed to approve post.")
    },
  })
}