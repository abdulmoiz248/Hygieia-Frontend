export default function Suggestions({ items, onSelect }: { items: string[], onSelect: (item: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="px-2 py-1 text-xs bg-soft-blue/20 text-soft-blue rounded-full hover:bg-soft-blue/40 transition-colors"
        >
          {item}
        </button>
      ))}
    </div>
  )
}



