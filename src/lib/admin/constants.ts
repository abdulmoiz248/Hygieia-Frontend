import { BookOpen, Rss, Send, Sparkles, Users } from "lucide-react"
import type { StatCardData, Tab } from "@/types/admin/newsletter.types"

// ─── API ──────────────────────────────────────────────────────────────────────

export const BASE_URL = "http://localhost:4000"

// ─── Tab definitions ──────────────────────────────────────────────────────────

export const TABS: { value: Tab; label: string; icon: React.ElementType }[] = [
  { value: "generate",    label: "Generate & Send",      icon: Sparkles },
  { value: "blogpost",    label: "Blog Post Newsletter", icon: BookOpen },
  { value: "subscribers", label: "Subscribers",          icon: Users    },
]

// ─── Stat card builder ────────────────────────────────────────────────────────

export function buildStatCards(subscriberCount: number): StatCardData[] {
  return [
    {
      id: "subscribers",
      title: "Total Subscribers",
      value: subscriberCount,
      icon: Users,
      color: "soft-blue",
    },
    {
      id: "sent",
      title: "Newsletters Sent",
      value: "—",
      icon: Send,
      color: "mint-green",
    },
    {
      id: "blogposts",
      title: "Blog Posts Sent",
      value: "—",
      icon: Rss,
      color: "soft-coral",
    },
  ]
}
