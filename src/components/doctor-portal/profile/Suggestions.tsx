interface SuggestionsProps {
  items: string[]
  onSelect: (item: string) => void
}

export default function Suggestions({ items, onSelect }: SuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="px-3 py-1 text-xs rounded-full border border-soft-blue text-soft-blue hover:bg-soft-blue hover:text-white transition"
        >
          + {item}
        </button>
      ))}
    </div>
  )
}
