import { useState } from "react"
import { Pencil, Trash2, ChevronDown, HelpCircle, BookOpen, MessageCircleQuestion } from "lucide-react"
import type { FaqItem } from "@/lib/admin/faq.api"

interface FaqListProps {
  faqs: FaqItem[]
  loading: boolean
  onEdit: (faq: FaqItem) => void
  onDeleteRequest: (id: string) => void
}

export default function FaqList({ faqs, loading, onEdit, onDeleteRequest }: FaqListProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (loading) {
    return <p className="text-sm text-[var(--color-cool-gray)] px-1">Loading…</p>
  }

  if (faqs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-cool-gray)]/30 py-14 text-center">
        <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-20 text-[var(--color-cool-gray)]" />
        <p className="text-sm text-[var(--color-cool-gray)]">No FAQs found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {faqs.map(faq => {
        const isOpen = openId === faq.id

        return (
          <div
            key={faq.id}
            className="rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            style={{
              border: isOpen
                ? "1.5px solid var(--color-soft-blue)"
                : "1.5px solid oklch(0.88 0.03 220)",
            }}
          >
            {/* Top gradient stripe */}
            <div
              className="h-0.5 w-full"
              style={{ background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))" }}
            />

            {/* Question row */}
            <div
              className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50/70 transition-colors"
              onClick={() => setOpenId(isOpen ? null : faq.id!)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ background: isOpen ? "oklch(0.95 0.05 210)" : "oklch(0.95 0.02 220)" }}
                >
                  <MessageCircleQuestion
                    className="w-3.5 h-3.5 transition-colors"
                    style={{ color: isOpen ? "var(--color-soft-blue)" : "var(--color-cool-gray)" }}
                  />
                </div>
                <h3 className="font-semibold text-sm text-[var(--color-dark-slate-gray)] leading-snug">
                  {faq.question}
                </h3>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                <button
                  onClick={e => { e.stopPropagation(); onEdit(faq) }}
                  className="p-2 rounded-lg transition-colors hover:bg-[oklch(0.95_0.05_210)]"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5 text-[var(--color-soft-blue)]" />
                </button>

                <button
                  onClick={e => { e.stopPropagation(); onDeleteRequest(faq.id!) }}
                  className="p-2 rounded-lg transition-colors hover:bg-[oklch(0.96_0.06_10)]"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[var(--color-soft-coral)]" />
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1" />

                <ChevronDown
                  className={`w-4 h-4 text-[var(--color-cool-gray)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {/* Answer */}
            {isOpen && (
              <div className="px-5 pb-5 pt-1">
                <div
                  className="flex gap-3 p-3.5 rounded-xl border border-[var(--color-soft-blue)]/15"
                  style={{ background: "oklch(0.97 0.02 220)" }}
                >
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[var(--color-soft-blue)]" />
                  <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
