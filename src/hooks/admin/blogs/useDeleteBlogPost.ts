import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BASE_URL, BlogPost } from "@/lib/admin/blog-helpers"
import { adminDestructive, adminError } from "@/toasts/AdminToasts"

interface UseDeleteBlogPostOptions {
  onSuccess?: () => void
  onError?:   (err: Error) => void
}

export function useDeleteBlogPost(options?: UseDeleteBlogPostOptions) {
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
      // Only show default toast if caller doesn't handle it themselves
      if (!options?.onSuccess) {
        adminDestructive(`"${post.title}" deleted.`)
      }
      options?.onSuccess?.()
    },
    onError: (err: Error) => {
      if (!options?.onError) {
        adminError("Failed to delete post.")
      }
      options?.onError?.(err)
    },
  })
}
