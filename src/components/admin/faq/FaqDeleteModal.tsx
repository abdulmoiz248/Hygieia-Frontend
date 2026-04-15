import { X, Trash2, AlertTriangle } from "lucide-react"

interface FaqDeleteModalProps {
  onConfirm: () => void
  onClose: () => void
}

export default function FaqDeleteModal({ onConfirm, onClose }: FaqDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

        {/* Top stripe */}
        <div
          className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
        />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.96 0.06 10)" }}
            >
              <Trash2 className="w-5 h-5" style={{ color: "var(--color-soft-coral)" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)] leading-tight">Delete FAQ</h2>
              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">This action is permanent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 mt-0.5"
          >
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div
            className="flex gap-3 p-3.5 rounded-xl border border-[var(--color-soft-coral)]/20"
            style={{ background: "oklch(0.98 0.02 10)" }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-soft-coral)" }} />
            <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed">
              This FAQ will be permanently removed. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-[var(--color-cool-gray)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
            style={{ background: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))" }}
          >
            Delete FAQ
          </button>
        </div>
      </div>
    </div>
  )
}
