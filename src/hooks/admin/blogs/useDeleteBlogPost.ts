import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BASE_URL, BlogPost } from "@/lib/admin/blog-helpers"
import { adminDestructive, adminError } from "@/toasts/AdminToasts"

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: BlogPost) => {
      const res = await fetch(`${BASE_URL}/blogPost/${post.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete post")
      return post
    },
    onSuccess: (post) => {
      queryClient.setQueryData<BlogPost[]>(["admin", "blogPosts"], (prev = []) =>
        prev.filter(p => p.id !== post.id)
      )
      adminDestructive(`"${post.title}" deleted.`)
    },
    onError: () => {
      adminError("Failed to delete post.")
    },
  })
}
