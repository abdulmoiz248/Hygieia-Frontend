import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteFaq } from "@/api/admin/faq.api"

export function useDeleteFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      deleteFaq(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] })
    },
  })
}