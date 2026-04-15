import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/blog-helpers"
import { adminDestructive, adminError } from "@/toasts/AdminToasts"

export function useDeleteBlogPostDetail(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/blogPost/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete post")
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["admin", "blogPost", id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "blogPosts"] })
      adminDestructive("Post deleted.")
    },
    onError: () => {
      adminError("Failed to delete post.")
    },
  })
}
