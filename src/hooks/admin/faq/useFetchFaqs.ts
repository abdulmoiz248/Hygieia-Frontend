import { useQuery } from "@tanstack/react-query"
import { fetchFaqs } from "@/api/admin/faq.api"

export function useFetchFaqs() {
  return useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: fetchFaqs,
  })
}