import { useQuery } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/constants"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminError } from "@/toasts/AdminToasts"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SentNewsletterItem {
  id: string
  type: "manual" | "blogpost"
  subject: string
  newsletter_link: string
  recipient_count: number
  sent_count: number
  failed_count: number
  status: string
  created_at: string
}

interface SentNewslettersResponse {
  items: SentNewsletterItem[]
  total: number
  limit: number
  offset: number
}

export interface SentNewsletterCounts {
  newslettersSent: number
  blogpostsSent: number
  items: SentNewsletterItem[]
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchSentNewsletters(adminId: string): Promise<SentNewsletterCounts> {
  const res = await fetch(`${BASE_URL}/sent-newsletters?userId=${adminId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const json = await res.json()
  console.log("Sent newsletters response:", json)

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch sent newsletters")
  }

  const data: SentNewslettersResponse = json.data

  const newslettersSent = data.items.filter((i) => i.type === "manual").length
  const blogpostsSent   = data.items.filter((i) => i.type === "blogpost").length

  return {
    newslettersSent,
    blogpostsSent,
    items: data.items,
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSentNewsletters() {
  const adminId = useAdminStore((s) => s.adminId)

  return useQuery({
    queryKey: ["sent-newsletters", adminId],
    queryFn: () => fetchSentNewsletters(adminId!),
    enabled: !!adminId,
    staleTime: 0,
    throwOnError: false,
    meta: {
      onError: (err: Error) =>
        adminError(err.message || "Failed to load sent newsletter counts."),
    },
  })
}
