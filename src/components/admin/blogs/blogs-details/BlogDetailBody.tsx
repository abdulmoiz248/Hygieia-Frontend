import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

interface BlogDetailBodyProps {
  content: string
}

export function BlogDetailBody({ content }: BlogDetailBodyProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {content ? (
        <div
          className="prose prose-sm max-w-none text-[var(--color-dark-slate-gray)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div
          className="rounded-2xl p-8 text-center border border-dashed"
          style={{ borderColor: "oklch(0.88 0.04 210)" }}
        >
          <BookOpen
            className="w-8 h-8 mx-auto mb-2 opacity-20"
            style={{ color: "var(--color-cool-gray)" }}
          />
          <p className="text-sm text-[var(--color-cool-gray)]">No content body available.</p>
        </div>
      )}
    </motion.div>
  )
}
