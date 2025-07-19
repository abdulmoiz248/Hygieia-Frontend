"use client"

import { Badge } from "@/components/ui/badge"
import type { BlogCategory } from "@/types/blog"
import { Sparkles, Filter } from "lucide-react"

interface CategoryFilterProps {
  categories: BlogCategory[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const getCategoryColor = (color: string, isSelected: boolean) => {
    const baseClasses =
      "cursor-pointer transition-all duration-300 transform hover:scale-105 font-medium px-4 py-2 shadow-lg"

    if (isSelected) {
      switch (color) {
        case "soft-blue":
          return `${baseClasses} bg-gradient-to-r from-soft-blue to-soft-blue/80 text-snow-white shadow-soft-blue/30`
        case "soft-coral":
          return `${baseClasses} bg-gradient-to-r from-soft-coral to-soft-coral/80 text-snow-white shadow-soft-coral/30`
        case "mint-green":
          return `${baseClasses} bg-gradient-to-r from-mint-green to-mint-green/80 text-snow-white shadow-mint-green/30`
        default:
          return `${baseClasses} bg-gradient-to-r from-cool-gray to-cool-gray/80 text-snow-white shadow-cool-gray/30`
      }
    }

    switch (color) {
      case "soft-blue":
        return `${baseClasses} bg-gradient-to-r from-soft-blue/10 to-soft-blue/5 text-soft-blue border-soft-blue/20 hover:from-soft-blue/20 hover:to-soft-blue/10 hover:shadow-soft-blue/20`
      case "soft-coral":
        return `${baseClasses} bg-gradient-to-r from-soft-coral/10 to-soft-coral/5 text-soft-coral border-soft-coral/20 hover:from-soft-coral/20 hover:to-soft-coral/10 hover:shadow-soft-coral/20`
      case "mint-green":
        return `${baseClasses} bg-gradient-to-r from-mint-green/10 to-mint-green/5 text-mint-green border-mint-green/20 hover:from-mint-green/20 hover:to-mint-green/10 hover:shadow-mint-green/20`
      default:
        return `${baseClasses} bg-gradient-to-r from-cool-gray/10 to-cool-gray/5 text-cool-gray border-cool-gray/20 hover:from-cool-gray/20 hover:to-cool-gray/10 hover:shadow-cool-gray/20`
    }
  }

  return (
    <div className="relative mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-soft-blue" />
          <h3 className="text-lg font-semibold text-dark-slate-gray">Filter by Category</h3>
        </div>
        <Sparkles className="w-4 h-4 text-soft-coral animate-pulse" />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4">
        <Badge
          variant="outline"
          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 font-medium px-6 py-3 shadow-lg ${
            selectedCategory === null
              ? "bg-gradient-to-r from-dark-slate-gray to-dark-slate-gray/80 text-snow-white shadow-dark-slate-gray/30"
              : "bg-gradient-to-r from-gray-50 to-white text-cool-gray border-cool-gray/20 hover:shadow-cool-gray/20 hover:from-gray-100 hover:to-gray-50"
          }`}
          onClick={() => onCategorySelect(null)}
        >
          ✨ All Posts
        </Badge>

        {categories.map((category) => (
          <Badge
            key={category.id}
            variant="outline"
            className={getCategoryColor(category.color, selectedCategory === category.id)}
            onClick={() => onCategorySelect(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      {/* Decorative Line */}
      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-soft-blue/30 to-transparent"></div>
    </div>
  )
}
