// ─── Tab ──────────────────────────────────────────────────────────────────────

export type Tab = "generate" | "blogpost" | "subscribers"

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface SendResult {
  sentCount: number
  failedCount: number
  recipientCount: number
  message: string
}

export interface BlogSendResult extends SendResult {
  blogpost: { id: string; title: string; category: string }
}

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Subscriber {
  email: string
  subscribedAt: string
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

export type StatCardColor = "soft-blue" | "mint-green" | "soft-coral" | "cool-gray"

export interface StatCardData {
  id: string
  title: string
  value: number | string
  subtitle?: string
  icon: React.ElementType
  color: StatCardColor
  colorText?: string
  trend?: string
}
