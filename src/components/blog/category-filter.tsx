"use client"

import { Badge } from "@/components/ui/badge"
import type { BlogCategory } from "@/types/blog"
import { Filter, Sparkles, Check } from "lucide-react"
import { useState } from "react"

interface CategoryFilterProps {
  categories: BlogCategory[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  
  const getCategoryColor = (color: string, isSelected: boolean, isHovered: boolean) => {
    const baseClasses =
      "cursor-pointer transition-all duration-300 ease-in-out font-medium px-5 py-2.5 rounded-full border-2 relative overflow-hidden group"

    if (isSelected) {
      switch (color) {
        case "soft-blue":
          return `${baseClasses} bg-soft-blue text-snow-white border-soft-blue shadow-lg shadow-soft-blue/30 hover:shadow-xl hover:shadow-soft-blue/40`
        case "soft-coral":
          return `${baseClasses} bg-soft-coral text-snow-white border-soft-coral shadow-lg shadow-soft-coral/30 hover:shadow-xl hover:shadow-soft-coral/40`
        case "mint-green":
          return `${baseClasses} bg-mint-green text-snow-white border-mint-green shadow-lg shadow-mint-green/30 hover:shadow-xl hover:shadow-mint-green/40`
        default:
          return `${baseClasses} bg-cool-gray text-snow-white border-cool-gray shadow-lg shadow-cool-gray/30 hover:shadow-xl hover:shadow-cool-gray/40`
      }
    }

    const hoverEffect = isHovered ? "scale-105 -translate-y-0.5" : ""

    switch (color) {
      case "soft-blue":
        return `${baseClasses} ${hoverEffect} bg-soft-blue/5 text-soft-blue border-soft-blue/30 hover:bg-soft-blue/10 hover:border-soft-blue/50 hover:shadow-md hover:shadow-soft-blue/20`
      case "soft-coral":
        return `${baseClasses} ${hoverEffect} bg-soft-coral/5 text-soft-coral border-soft-coral/30 hover:bg-soft-coral/10 hover:border-soft-coral/50 hover:shadow-md hover:shadow-soft-coral/20`
      case "mint-green":
        return `${baseClasses} ${hoverEffect} bg-mint-green/5 text-mint-green border-mint-green/30 hover:bg-mint-green/10 hover:border-mint-green/50 hover:shadow-md hover:shadow-mint-green/20`
      default:
        return `${baseClasses} ${hoverEffect} bg-cool-gray/5 text-cool-gray border-cool-gray/30 hover:bg-cool-gray/10 hover:border-cool-gray/50 hover:shadow-md hover:shadow-cool-gray/20`
    }
  }

  const activeFiltersCount = selectedCategory ? 1 : 0

  return (
    <div className="relative mb-12 bg-gradient-to-br from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-100/50 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-soft-blue/20 rounded-full blur-md"></div>
            <div className="relative bg-gradient-to-br from-soft-blue to-soft-blue/80 p-2.5 rounded-full shadow-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-dark-slate-gray to-cool-gray bg-clip-text text-transparent">
              Filter by Category
            </h3>
            <p className="text-xs text-cool-gray/70 mt-0.5">
              {activeFiltersCount > 0 
                ? `${activeFiltersCount} filter active` 
                : `${categories.length} categories available`
              }
            </p>
          </div>
        </div>
        
        {/* Clear Filter Button - only shown when filter is active */}
        {selectedCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            className="text-xs text-soft-coral hover:text-soft-coral/80 font-medium transition-colors duration-200 flex items-center gap-1 px-3 py-1.5 rounded-full bg-soft-coral/10 hover:bg-soft-coral/20"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <Badge
          variant="outline"
          className={`cursor-pointer transition-all duration-300 ease-in-out font-medium px-6 py-3 rounded-full border-2 relative overflow-hidden group ${
            selectedCategory === null
              ? "bg-gradient-to-r from-dark-slate-gray to-dark-slate-gray/90 text-snow-white border-dark-slate-gray shadow-lg shadow-dark-slate-gray/30 hover:shadow-xl hover:shadow-dark-slate-gray/40"
              : "bg-white text-dark-slate-gray border-cool-gray/20 hover:border-cool-gray/40 hover:bg-gray-50 hover:shadow-md hover:scale-105 hover:-translate-y-0.5"
          }`}
          onClick={() => onCategorySelect(null)}
          onMouseEnter={() => setHoveredCategory("all")}
          onMouseLeave={() => setHoveredCategory(null)}
          role="button"
          aria-pressed={selectedCategory === null}
          aria-label="Show all posts"
        >
          <span className="flex items-center gap-2">
            {selectedCategory === null ? (
              <Check className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            All Posts
          </span>
          {selectedCategory === null && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}
        </Badge>

        {categories.map((category) => {
          const isSelected = selectedCategory === category.id
          const isHovered = hoveredCategory === category.id
          
          return (
            <Badge
              key={category.id}
              variant="outline"
              className={getCategoryColor(category.color, isSelected, isHovered)}
              onClick={() => onCategorySelect(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              role="button"
              aria-pressed={isSelected}
              aria-label={`Filter by ${category.name}`}
            >
              <span className="flex items-center gap-2 relative z-10">
                {isSelected && <Check className="w-4 h-4" />}
                {category.name}
              </span>
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </Badge>
          )
        })}
      </div>

      {/* Decorative Line with Gradient */}
      <div className="mt-6 relative">
        <div className="h-px bg-gradient-to-r from-transparent via-soft-blue/20 to-transparent"></div>
        <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-soft-blue/40 to-transparent blur-sm"></div>
      </div>
    </div>
  )
}
