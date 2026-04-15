import { motion } from "framer-motion"
import { AlertTriangle, ShieldCheck, CheckCircle2, Trash2 } from "lucide-react"

interface BlogDetailActionPanelProps {
  isPending:        boolean
  title:            string
  verifying:        boolean
  deleting:         boolean
  onApprove:        () => void
  onDeleteRequest:  () => void
}

export function BlogDetailActionPanel({
  isPending, verifying, deleting, onApprove, onDeleteRequest,
}: BlogDetailActionPanelProps) {
  const busy = verifying || deleting

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl p-5 space-y-3"
      style={{
        border:     "1.5px solid oklch(0.88 0.04 210)",
        background: isPending ? "oklch(0.98 0.01 50)" : "oklch(0.97 0.02 178)",
      }}
    >
      {/* Heading */}
      <div className="flex items-center gap-2">
        {isPending
          ? <AlertTriangle className="w-4 h-4" style={{ color: "oklch(0.50 0.20 50)" }} />
          : <ShieldCheck   className="w-4 h-4" style={{ color: "var(--color-mint-green)" }} />}
        <p
          className="text-sm font-bold"
          style={{ color: isPending ? "oklch(0.50 0.20 50)" : "var(--color-mint-green)" }}
        >
          {isPending ? "Admin Review Required" : "Post is Live"}
        </p>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed" style={{ color: "var(--color-cool-gray)" }}>
        {isPending
          ? "Review the full content above carefully before approving. Approving will publish this post and make it visible to all users. Deleting will permanently remove it."
          : "This post has been verified and is publicly visible. You can still delete it if needed."}
      </p>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        {isPending && (
          <button
            onClick={onApprove}
            disabled={busy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ background: "var(--color-mint-green)", color: "var(--color-dark-slate-gray)" }}
          >
            <CheckCircle2 className="w-4 h-4" /> Approve & Publish
          </button>
        )}
        <button
          onClick={onDeleteRequest}
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          style={{ background: "var(--color-soft-coral)", color: "white" }}
        >
          <Trash2 className="w-4 h-4" />
          {isPending ? "Reject & Delete" : "Delete Post"}
        </button>
      </div>
    </motion.div>
  )
}
