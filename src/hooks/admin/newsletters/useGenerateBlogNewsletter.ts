import { useMutation } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/constants"
import { unescapeHtml } from "@/helpers/generateNewsletter"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminError } from "@/toasts/AdminToasts"
import type { BlogSendResult } from "@/types/admin/newsletter.types"

interface GenerateBlogNewsletterPayload {
  blogpostId: string
}

interface GenerateBlogNewsletterResponse {
  html: string
  blogpost: BlogSendResult["blogpost"] | null
}

async function generateBlogNewsletterHtml(
  blogpostId: string,
  adminId: string,
): Promise<GenerateBlogNewsletterResponse> {
  const res = await fetch(`${BASE_URL}/generate-blogpost-newsletter-html`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blogpostId, userId: adminId }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Failed to generate")
  return {
    html: unescapeHtml(json.data?.html ?? ""),
    blogpost: json.data?.blogpost ?? null,
  }
}

export function useGenerateBlogNewsletter() {
  const adminId = useAdminStore((s) => s.adminId)

  return useMutation({
    mutationFn: ({ blogpostId }: GenerateBlogNewsletterPayload) =>
      generateBlogNewsletterHtml(blogpostId, adminId!),
    onError: (err: Error) => {
      adminError(err.message || "Failed to generate blog newsletter.")
    },
  })
}
