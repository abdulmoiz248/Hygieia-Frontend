import { BookOpen, Rss, Send, Sparkles, Users } from "lucide-react"
import type { StatCardData, Subscriber, Tab } from "@/types/admin/newsletter.types"

// ─── API ──────────────────────────────────────────────────────────────────────

export const BASE_URL = "http://localhost:4000"

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_SUBSCRIBERS: Subscriber[] = [
  { email: "ali.khan@gmail.com",       subscribedAt: "2026-03-01T10:00:00Z" },
  { email: "sana.mirza@outlook.com",   subscribedAt: "2026-03-05T08:30:00Z" },
  { email: "farhan.sheikh@gmail.com",  subscribedAt: "2026-03-10T14:00:00Z" },
  { email: "ayesha.malik@gmail.com",   subscribedAt: "2026-03-12T09:15:00Z" },
  { email: "usman.tariq@yahoo.com",    subscribedAt: "2026-03-15T11:00:00Z" },
  { email: "nadia.cheema@gmail.com",   subscribedAt: "2026-03-18T16:45:00Z" },
  { email: "kamran.iqbal@gmail.com",   subscribedAt: "2026-03-20T07:30:00Z" },
  { email: "mariam.tahir@outlook.com", subscribedAt: "2026-03-22T13:00:00Z" },
  { email: "zara.hussain@gmail.com",   subscribedAt: "2026-03-24T10:20:00Z" },
  { email: "bilal.raza@gmail.com",     subscribedAt: "2026-03-26T15:00:00Z" },
]

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
