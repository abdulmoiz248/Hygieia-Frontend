"use client"

import { useState } from "react"
import {BlogPostTab} from "@/components/admin/newsletter"
import {GenerateTab} from "@/components/admin/newsletter"
import {NewsletterStatCards} from "@/components/admin/newsletter"
import {SubscribersTab} from "@/components/admin/newsletter"
import { buildStatCards, MOCK_SUBSCRIBERS, TABS } from "@/lib/admin/constants"
import type { Tab } from "@/types/admin/newsletter.types"

export default function NewsletterPage() {
  const [tab, setTab] = useState<Tab>("generate")
  const subscribers = MOCK_SUBSCRIBERS
  const statCards = buildStatCards(subscribers.length)

  return (
    <div className="min-h-screen p-6 space-y-6 bg-[var(--color-snow-white)]">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-soft-coral bg-clip-text pb-1">
            Newsletter
          </h1>
          <p className="text-sm text-[var(--color-cool-gray)] mt-1">
            Generate, preview, and send newsletters to your subscribers
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <NewsletterStatCards cards={statCards} />

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[var(--color-cool-gray)]/20 rounded-xl p-1 shadow-sm w-fit">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
              style={
                tab === t.value
                  ? { background: "var(--gradient-primary)", color: "white" }
                  : { color: "var(--color-cool-gray)" }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div>
        {tab === "generate"    && <GenerateTab    subscriberCount={subscribers.length} />}
        {tab === "blogpost"    && <BlogPostTab    subscriberCount={subscribers.length} />}
        {tab === "subscribers" && <SubscribersTab subscribers={subscribers} />}
      </div>
    </div>
  )
}
