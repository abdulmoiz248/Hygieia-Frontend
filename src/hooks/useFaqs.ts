import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import type { FaqItem, FaqResponse } from "@/types/faq"

export function useFaqs() {
  return useQuery<FaqItem[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data } = await api.get<FaqResponse | FaqItem[]>("/faqs")

      if (Array.isArray(data)) {
        return data
      }

      return Array.isArray(data?.data) ? data.data : []
    },
    staleTime: 1000 * 60 * 5,
  })
}