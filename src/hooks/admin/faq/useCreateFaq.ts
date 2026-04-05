import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFaq } from "@/api/admin/faq.api"
import type { FaqItem } from "@/types/admin/faq"

export function useCreateFaq() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ faq, userId }: { faq: Omit<FaqItem, "id">; userId: string }) =>
      createFaq(faq, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] })
    },
  })
}