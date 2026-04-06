import { useMutation } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/constants"
import { unescapeHtml } from "@/helpers/generateNewsletter"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminError } from "@/toasts/AdminToasts"

interface GenerateNewsletterPayload {
  idea: string
}

interface GenerateNewsletterResponse {
  html: string
}

async function generateNewsletterHtml(
  idea: string,
  adminId: string,
): Promise<GenerateNewsletterResponse> {
  const res = await fetch(`${BASE_URL}/generate-newsletter-html`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, userId: adminId }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Generation failed")
  return { html: unescapeHtml(json.data?.html ?? "") }
}

export function useGenerateNewsletter() {
  const adminId = useAdminStore((s) => s.adminId)

  return useMutation({
    mutationFn: ({ idea }: GenerateNewsletterPayload) =>
      generateNewsletterHtml(idea, adminId!),
    onError: (err: Error) => {
      adminError(err.message || "Failed to generate newsletter.")
    },
  })
}
