import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/constants"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminSuccess, adminError } from "@/toasts/AdminToasts"
import type { SendResult } from "@/types/admin/newsletter.types"

interface SendNewsletterPayload {
  html: string
  subject: string
}

async function sendNewsletter(
  html: string,
  subject: string,
  adminId: string,
): Promise<SendResult> {
  const res = await fetch(`${BASE_URL}/send-newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, subject, userId: adminId }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Send failed")
  return json.data as SendResult
}

export function useSendNewsletter() {
  const adminId = useAdminStore((s) => s.adminId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ html, subject }: SendNewsletterPayload) =>
      sendNewsletter(html, subject, adminId!),
    onSuccess: (data) => {
      console.log("Newsletter sent response:", data) 
      queryClient.invalidateQueries({ queryKey: ["sent-newsletters", adminId] })
      adminSuccess(data.message || `Newsletter sent to ${data.sentCount} subscribers.`)
    },
    onError: (err: Error) => {
      adminError(err.message || "Failed to send newsletter.")
    },
  })
}
