import { Search } from "lucide-react"

interface FaqSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function FaqSearch({ value, onChange }: FaqSearchProps) {
  return (
    <div className="relative max-w-md">
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-cool-gray)]" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search FAQs..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-cool-gray)]/30 focus:ring-2 focus:ring-[var(--color-soft-blue)] outline-none bg-white shadow-sm text-sm"
      />
    </div>
  )
}
