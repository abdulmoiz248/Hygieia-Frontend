import { X, MessageCircleQuestion } from "lucide-react"
import type { FaqItem } from "@/api/admin/faq.api"

interface FaqFormModalProps {
  form: Omit<FaqItem, "id">
  isEditing: boolean
  submitAttempted: boolean
  onChange: (form: Omit<FaqItem, "id">) => void
  onSubmit: () => void
  onClose: () => void
}

export default function FaqFormModal({
  form,
  isEditing,
  submitAttempted,
  onChange,
  onSubmit,
  onClose,
}: FaqFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[92vh] flex flex-col border border-gray-100 overflow-hidden">

        {/* Top stripe */}
        <div
          className="h-1 w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green))" }}
        />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.95 0.05 210)" }}
            >
              <MessageCircleQuestion className="w-5 h-5" style={{ color: "var(--color-soft-blue)" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)]">
                {isEditing ? "Update FAQ" : "Create FAQ"}
              </h2>
              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">
                {isEditing ? "Edit the question and answer below" : "Add a new frequently asked question"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mt-0.5"
          >
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* Form body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">Question</label>
            <input
              value={form.question}
              onChange={e => onChange({ ...form, question: e.target.value })}
              placeholder="e.g. How do I book an appointment?"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all
                bg-gray-50 border border-gray-200
                focus:bg-white focus:border-[var(--color-soft-blue)] focus:ring-2 focus:ring-[var(--color-soft-blue)]/15
                placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-cool-gray)] mb-1.5">Answer</label>
            <textarea
              value={form.answer}
              onChange={e => onChange({ ...form, answer: e.target.value })}
              placeholder="Provide a clear and helpful answer…"
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all resize-none
                bg-gray-50 border border-gray-200
                focus:bg-white focus:border-[var(--color-mint-green)] focus:ring-2 focus:ring-[var(--color-mint-green)]/15
                placeholder:text-gray-400"
            />
          </div>

          {submitAttempted && (!form.question || !form.answer) && (
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--color-soft-coral)]/30"
              style={{ background: "oklch(0.98 0.02 10)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-soft-coral)" }} />
              <p className="text-xs text-[var(--color-soft-coral)]">Both question and answer are required.</p>
            </div>
          )}

          <button
            onClick={onSubmit}
            className="w-full py-2.5 rounded-xl text-white font-medium shadow-md transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: "var(--gradient-primary)" }}
          >
            {isEditing ? "Update FAQ" : "Create FAQ"}
          </button>
        </div>
      </div>
    </div>
  )
}
