import { createPortal } from "react-dom"
import { X, UserPlus, CheckCircle2 } from "lucide-react"

interface CVAddWorkerModalProps {
  name: string
  onClose: () => void
}

export default function CVAddWorkerModal({ name, onClose }: CVAddWorkerModalProps) {
  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

        {/* Top stripe */}
        <div className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, var(--color-mint-green), oklch(0.60 0.14 170))" }} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "oklch(0.95 0.04 178)" }}>
              <UserPlus className="w-5 h-5" style={{ color: "var(--color-mint-green)" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--color-dark-slate-gray)] leading-tight">Worker Added</h2>
              <p className="text-xs text-[var(--color-cool-gray)] mt-0.5">Candidate moved to registration</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 mt-0.5">
            <X className="w-4 h-4 text-[var(--color-cool-gray)]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="flex gap-3 p-3.5 rounded-xl border border-[var(--color-mint-green)]/20"
            style={{ background: "oklch(0.97 0.03 178)" }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-mint-green)" }} />
            <p className="text-sm text-[var(--color-cool-gray)] leading-relaxed">
              <span className="font-semibold text-[var(--color-dark-slate-gray)]">{name}</span> has been added to the worker registration flow and will be contacted shortly.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 px-6 pb-5">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
            style={{ background: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))" }}>
            Got it
          </button>
        </div>
      </div>
    </div>
  )

  if (typeof document === "undefined") return null
  return createPortal(modal, document.body)
}
