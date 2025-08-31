"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({
  onSearch,
  placeholder = "Search nutritionists by name, specialty, or location...",
}: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative max-w-2xl"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 pr-12 h-12 text-base bg-card/70 backdrop-blur-md border border-border/40 rounded-2xl shadow-sm focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
