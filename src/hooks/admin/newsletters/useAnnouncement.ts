import { useMutation } from "@tanstack/react-query"
import { BASE_URL } from "@/lib/admin/constants"
import { useAdminStore } from "@/store/admin/useAdminStore"
import { adminSuccess, adminError } from "@/toasts/AdminToasts"

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnnouncementTarget =
  | "doctor"
  | "nutritionist"
  | "pathologist"
  | "all_workers"
  | "patient"
  | "all_users"

export interface AnnouncementPayload {
  title:   string
  message: string
  target:  AnnouncementTarget
}

export interface AnnouncementResult {
  success:        boolean
  recipientCount: number
  insertedCount:  number
  target:         AnnouncementTarget
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function sendAnnouncement(
  payload: AnnouncementPayload,
  adminId: string,
): Promise<AnnouncementResult> {
  const res = await fetch(`${BASE_URL}/announcement`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ ...payload, userId: adminId }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || "Failed to send announcement")
  return json.data as AnnouncementResult
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnnouncement() {
  const adminId = useAdminStore((s) => s.adminId)

  return useMutation({
    mutationFn: (payload: AnnouncementPayload) =>
      sendAnnouncement(payload, adminId!),
    onSuccess: (data) => {
      adminSuccess(
        `Announcement dispatched to ${data.recipientCount} recipient${data.recipientCount !== 1 ? "s" : ""}.`
      )
    },
    onError: (err: Error) => {
      adminError(err.message || "Failed to send announcement.")
    },
  })
}
