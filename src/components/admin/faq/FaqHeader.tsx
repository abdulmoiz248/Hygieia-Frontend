import { Plus } from "lucide-react"

interface FaqHeaderProps {
  totalCount: number
  onCreateClick: () => void
}

export default function FaqHeader({ totalCount, onCreateClick }: FaqHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-soft-coral bg-clip-text pb-1">
          FAQ Management
        </h1>
        <p className="text-sm text-[var(--color-cool-gray)] mt-1">
          {totalCount} total FAQs
        </p>
      </div>

      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-md hover:scale-[1.02] transition"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Plus className="w-4 h-4" />
        Create FAQ
      </button>
    </div>
  )
}
