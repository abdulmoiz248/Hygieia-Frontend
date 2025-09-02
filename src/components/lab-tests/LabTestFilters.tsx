'use client'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface LabTestsFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedCategory: string | null
  setSelectedCategory: (value: string | null) => void
  categories: string[]
}

export function LabTestsFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories
}: LabTestsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[--color-snow-white] rounded-2xl shadow-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search lab tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 rounded-xl border border-[--color-cool-gray] focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
          >
            ✕
          </button>
        )}
      </div>
    <Select
  value={selectedCategory ?? "all"}
  onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
>
  <SelectTrigger className="w-full sm:w-56 rounded-xl border border-[--color-cool-gray] focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent transition-all duration-200">
    <Filter className="w-4 h-4 mr-2 text-[--color-dark-slate-gray]" />
    <SelectValue placeholder="All Tests" />
  </SelectTrigger>
  <SelectContent className="rounded-xl bg-snow-white shadow-lg border border-[--color-cool-gray]">
    <SelectItem value="all" className="hover:text-white hover:bg-mint-green">
      All Tests
    </SelectItem>
    {categories.map((category) => (
      <SelectItem
        key={category}
        value={category}
        className="hover:text-white hover:bg-mint-green"
      >
        {category}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

    </div>
  )
}
