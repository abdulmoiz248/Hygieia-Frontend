"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

interface FilterState {
  specializations: string[]
  experienceRange: [number, number]
  priceRange: [number, number]
  rating: number
}

interface NutritionistFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableSpecializations: string[]
}

export function NutritionistFilters({ filters, onFiltersChange, availableSpecializations }: NutritionistFiltersProps) {
  const toggleSpecialization = (spec: string) => {
    const newSpecs = filters.specializations.includes(spec)
      ? filters.specializations.filter((s) => s !== spec)
      : [...filters.specializations, spec]

    onFiltersChange({ ...filters, specializations: newSpecs })
  }

  const clearFilters = () => {
    onFiltersChange({
      specializations: [],
      experienceRange: [0, 20],
      priceRange: [0, 300],
      rating: 0,
    })
  }

  const hasActiveFilters =
    filters.specializations.length > 0 ||
    filters.experienceRange[0] > 0 ||
    filters.experienceRange[1] < 20 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 300 ||
    filters.rating > 0

  return (
    <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/10 to-cool-gray/20 backdrop-blur-lg border border-border/30 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-2xl w-80 ">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-soft-blue">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-soft-blue transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 text-soft-blue">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {availableSpecializations.map((spec) => (
              <Badge
                key={spec}
                variant={filters.specializations.includes(spec) ? "default" : "outline"}
                className={`cursor-pointer transition-colors rounded-lg px-3 py-1 ${
                  filters.specializations.includes(spec)
                    ? "bg-soft-blue text-snow-white hover:bg-soft-blue/90"
                    : "border border-soft-blue/30 text-dark-slate-gray hover:bg-soft-blue/10"
                }`}
                onClick={() => toggleSpecialization(spec)}
              >
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-soft-blue">Experience (Years)</h4>
          <div className="px-2">
            <Slider
              value={filters.experienceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, experienceRange: value as [number, number] })}
              max={20}
              min={0}
              step={1}
              className="w-full accent-soft-blue"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{filters.experienceRange[0]} yrs</span>
              <span>{filters.experienceRange[1]} yrs</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-soft-blue">Price Range (Rs)</h4>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
              max={300}
              min={0}
              step={10}
              className="w-full accent-soft-blue"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-soft-blue">Minimum Rating</h4>
          <div className="px-2">
            <Slider
              value={[filters.rating]}
              onValueChange={(value) => onFiltersChange({ ...filters, rating: value[0] })}
              max={5}
              min={0}
              step={0.1}
              className="w-full accent-soft-blue"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Any rating</span>
              <span>{filters.rating > 0 ? `${filters.rating}+ stars` : "Any"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
