"use client"

import { Mail, Users } from "lucide-react"
import { timeAgo } from "@/helpers/formatTimeAgo"
import type { Subscriber } from "@/types/admin/newsletter.types"

interface SubscribersTabProps {
  subscribers: Subscriber[]
}

export function SubscribersTab({ subscribers }: SubscribersTabProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--color-cool-gray)]/15 bg-white shadow-sm overflow-hidden">
        {/* Accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-blue), oklch(0.55 0.18 230))" }}
        />

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-soft-blue)]" />
            <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
              Mailing List
            </h2>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "oklch(0.95 0.05 210)", color: "var(--color-soft-blue)" }}
          >
            {subscribers.length} subscribers
          </span>
        </div>

        {/* Subscriber rows */}
        <div className="p-4 space-y-2">
          {subscribers.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--color-cool-gray)]/15 bg-gray-50 hover:bg-[oklch(0.97_0.03_210)] hover:border-[var(--color-soft-blue)]/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.95 0.05 210)" }}
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--color-soft-blue)]" />
                </div>
                <span className="text-sm text-[var(--color-dark-slate-gray)]">{s.email}</span>
              </div>
              <span className="text-xs text-[var(--color-cool-gray)] bg-white px-2.5 py-1 rounded-lg border border-[var(--color-cool-gray)]/15">
                {timeAgo(s.created_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
