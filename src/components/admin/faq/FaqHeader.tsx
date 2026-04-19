import { Plus } from "lucide-react"

interface FaqHeaderProps {
  totalCount:    number
  onCreateClick: () => void
}

export default function FaqHeader({ totalCount, onCreateClick }: FaqHeaderProps) {
  const countText = `${totalCount} Total FAQ${totalCount !== 1 ? "s" : ""}`

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-2">
      <div>
        <h1 className="text-3xl font-bold pb-1 text-soft-coral">
          FAQ Management
        </h1>

        {/* Matches WorkersPageHeader gradient count style */}
        <span
          className="text-base font-semibold mt-0.5 block"
          style={{
            background:            "linear-gradient(90deg, var(--color-soft-blue), var(--color-mint-green), var(--color-soft-coral))",
            WebkitBackgroundClip:  "text",
            WebkitTextFillColor:   "transparent",
            backgroundClip:        "text",
          }}
        >
          {countText}
        </span>
      </div>

      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 self-start sm:self-auto"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Plus className="w-4 h-4" />
        Create FAQ
      </button>
    </div>
  )
}
