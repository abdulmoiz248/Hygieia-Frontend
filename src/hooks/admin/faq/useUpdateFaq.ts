import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateFaq } from "@/api/admin/faq.api"
import type { FaqItem } from "@/types/admin/faq"

export function useUpdateFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, faq, userId }: { id: string; faq: Omit<FaqItem, "id">; userId: string }) =>
      updateFaq(id, faq, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] })
    },
  })
}