import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

interface ToastBannerProps {
  toast: {
    msg:  string
    type: "success" | "error"
  }
}

export function ToastBanner({ toast }: ToastBannerProps) {
  const ok = toast.type === "success"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border"
      style={ok
        ? { background: "oklch(0.95 0.04 178)", borderColor: "var(--color-mint-green)", color: "var(--color-mint-green)" }
        : { background: "oklch(0.96 0.06 10)",  borderColor: "var(--color-soft-coral)", color: "var(--color-soft-coral)" }}
    >
      {ok
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        : <XCircle      className="w-4 h-4 flex-shrink-0" />}
      <p className="text-sm font-semibold">{toast.msg}</p>
    </motion.div>
  )
}
