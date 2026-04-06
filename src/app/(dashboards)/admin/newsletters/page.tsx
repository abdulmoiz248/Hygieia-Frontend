"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { BlogPostTab } from "@/components/admin/newsletter/BlogPostTab"
import { GenerateTab } from "@/components/admin/newsletter/GenerateTab"
import { NewsletterStatCards } from "@/components/admin/newsletter/NewsletterStatCards"
import { SubscribersTab } from "@/components/admin/newsletter/SubscribersTab"
import { buildStatCards, TABS } from "@/lib/admin/constants"
import { useSubscribers } from "@/hooks/admin/newsletters/useSubscribers"
import { useNewsletterStore } from "@/store/admin/useNewsletterStore"
import { adminError } from "@/toasts/AdminToasts"
import type { Tab } from "@/types/admin/newsletter.types"

export default function NewsletterPage() {
  const [tab, setTab] = useState<Tab>("generate")

  const { data: subscribers = [], isLoading, isError, error } = useSubscribers()
  const newslettersSent = useNewsletterStore((s) => s.newslettersSent)
  const blogpostsSent   = useNewsletterStore((s) => s.blogpostsSent)

  if (isError && error instanceof Error) {
    adminError(error.message || "Failed to load subscribers.")
  }

  const statCards = buildStatCards(subscribers.length, newslettersSent, blogpostsSent)

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-5 sm:space-y-6 bg-[var(--color-snow-white)]">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-soft-coral bg-clip-text pb-1">
          Newsletter
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-cool-gray)] mt-1">
          Generate, preview, and send newsletters to your subscribers
        </p>
      </div>

      {/* Stat Cards */}
      <NewsletterStatCards cards={statCards} />

      {/* Tabs — scrollable on mobile */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm w-max sm:w-fit">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={
                  tab === t.value
                    ? { background: "var(--gradient-primary)", color: "white" }
                    : { color: "var(--color-cool-gray)" }
                }
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-[var(--color-cool-gray)]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading subscribers…</span>
        </div>
      ) : (
        <div>
          {tab === "generate"    && <GenerateTab    subscriberCount={subscribers.length} />}
          {tab === "blogpost"    && <BlogPostTab    subscriberCount={subscribers.length} />}
          {tab === "subscribers" && <SubscribersTab subscribers={subscribers} />}
        </div>
      )}
    </div>
  )
}
