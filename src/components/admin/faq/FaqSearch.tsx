import { Search } from "lucide-react"

interface FaqSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function FaqSearch({ value, onChange }: FaqSearchProps) {
  return (
    <div className="relative max-w-md group/search">
      <Search
        className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200
          text-[var(--color-cool-gray)]
          group-focus-within/search:text-[var(--color-soft-blue)]
          group-hover/search:text-[var(--color-soft-blue)]"
      />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search FAQs..."
        className="
          w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none
          bg-white shadow-sm transition-all duration-200
          border border-[var(--color-cool-gray)]/30
          hover:border-[var(--color-soft-blue)]/50 hover:shadow-md
          focus:ring-2 focus:ring-[var(--color-soft-blue)]/20
          focus:border-[var(--color-soft-blue)]
          placeholder:text-gray-400
        "
      />
    </div>
  )
}
