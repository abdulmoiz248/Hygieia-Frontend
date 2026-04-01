import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface ConfirmModalProps {
  title:        string
  message:      string
  confirmLabel: string
  confirmStyle: React.CSSProperties
  onConfirm:   () => void
  onCancel:    () => void
  loading:      boolean
}

export function ConfirmModal({
  title, message, confirmLabel, confirmStyle, onConfirm, onCancel, loading,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
        style={{ border: "1.5px solid oklch(0.88 0.04 210)" }}
      >
        <h3 className="text-base font-bold text-[var(--color-dark-slate-gray)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--color-cool-gray)] mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50 disabled:opacity-40"
            style={{ borderColor: "oklch(0.88 0.04 210)", color: "var(--color-cool-gray)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            style={confirmStyle}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
