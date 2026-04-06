import { useMutation } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/constants"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { useNewsletterStore } from "@/store/admin/useNewsletterStore"
import { adminSuccess, adminError } from "@/toasts/AdminToasts"
import type { SendResult } from "@/types/admin/newsletter.types"

interface SendBlogNewsletterPayload {
  blogpostId: string
}

async function sendBlogNewsletter(
  blogpostId: string,
  adminId: string,
): Promise<SendResult> {
  const res = await fetch(`${BASE_URL}/send-blogpost-newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blogpostId, userId: adminId }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Failed to send")
  return json.data as SendResult
}

export function useSendBlogNewsletter() {
  const adminId = useAdminStore((s) => s.adminId)
  const incrementBlogposts = useNewsletterStore((s) => s.incrementBlogposts)

  return useMutation({
    mutationFn: ({ blogpostId }: SendBlogNewsletterPayload) =>
      sendBlogNewsletter(blogpostId, adminId!),
    onSuccess: (data) => {
      incrementBlogposts()
      adminSuccess(data.message || `Blog newsletter sent to ${data.sentCount} subscribers.`)
    },
    onError: (err: Error) => {
      adminError(err.message || "Failed to send blog newsletter.")
    },
  })
}
