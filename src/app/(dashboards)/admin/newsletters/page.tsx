"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { BlogPostTab }          from "@/components/admin/newsletter/BlogPostTab"
import { GenerateTab }          from "@/components/admin/newsletter/GenerateTab"
import { NewsletterStatCards }  from "@/components/admin/newsletter/NewsletterStatCards"
import { SubscribersTab }       from "@/components/admin/newsletter/SubscribersTab"
import { SentHistoryTab }       from "@/components/admin/newsletter/SentHistoryTab"
import { buildStatCards, TABS } from "@/lib/admin/constants"
import { useSubscribers }       from "@/hooks/admin/newsletters/useSubscribers"
import { useSentNewsletters }   from "@/hooks/admin/newsletters/useSentNewsletters"
import { adminError }           from "@/toasts/AdminToasts"
import type { Tab }             from "@/types/admin/newsletter.types"

export default function NewsletterPage() {
  const [tab, setTab] = useState<Tab>("generate")

  const { data: subscribers = [], isLoading, isError, error } = useSubscribers()
  const { data: sentData } = useSentNewsletters()

  if (isError && error instanceof Error) {
    adminError(error.message || "Failed to load subscribers.")
  }

  const newslettersSent = sentData?.newslettersSent ?? 0
  const blogpostsSent   = sentData?.blogpostsSent   ?? 0
  const statCards       = buildStatCards(subscribers.length, newslettersSent, blogpostsSent)

  return (
    <div className="min-h-screen px-6 pb-6 space-y-6 bg-[var(--color-snow-white)]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
        <div>
          <h1 className="text-3xl font-bold pb-1 text-soft-coral">
            Newsletter
          </h1>
          <p
            className="text-base font-semibold mt-0.5"
            style={{
              background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Generate, preview, and send newsletters to your subscribers
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <NewsletterStatCards cards={statCards} />

      {/* Tabs — fit-content container so background only covers the tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          {TABS.map((t) => {
            const Icon     = t.icon
            const isActive = tab === t.value
            return (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={isActive
                  ? { background: "var(--gradient-primary)", color: "white", boxShadow: "0 2px 8px rgba(91,168,196,0.3)" }
                  : { color: "var(--color-cool-gray)" }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(91,168,196,0.08)"
                    e.currentTarget.style.color = "var(--color-soft-blue)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = ""
                    e.currentTarget.style.color = "var(--color-cool-gray)"
                  }
                }}
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
          {tab === "history"     && <SentHistoryTab />}
        </div>
      )}
    </div>
  )
}
