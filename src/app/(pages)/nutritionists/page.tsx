"use client"

import { useState, useMemo } from "react"
import { NutritionistCard } from "@/components/nutritionist-main/nutritionist-card"
import { SearchBar } from "@/components/nutritionist-main/search-bar"
import { NutritionistFilters } from "@/components/nutritionist-main/nutritionist-filters"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import { useNutritionists } from "@/hooks/useNutritionist"
import Loader from "@/components/loader/loader" 







interface FilterState {
  specializations: string[]
  experienceRange: [number, number]
  priceRange: [number, number]
  rating: number
}

export default function NutritionistsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
const [filters, setFilters] = useState<FilterState>({
  specializations: [],
  experienceRange: [0, 20],
  priceRange: [0, 10000], // increase this
  rating: 0,
})



  const { data: nutritionists , isLoading, isError } = useNutritionists()


const filteredNutritionists = useMemo(() => {
  return nutritionists?.filter((nutritionist) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        (nutritionist.name?.toLowerCase() ?? "").includes(query) ||
        (nutritionist.specialization?.toLowerCase() ?? "").includes(query) ||
        (nutritionist.bio?.toLowerCase() ?? "").includes(query)

      if (!matchesSearch) return false
    }

    // Specialization filter
    if (filters.specializations.length > 0) {
      if (!filters.specializations.includes(nutritionist.specialization ?? "")) {
        return false
      }
    }

    // Experience filter
    if (
      (nutritionist.experienceYears ?? 0) < filters.experienceRange[0] ||
      (nutritionist.experienceYears ?? 0) > filters.experienceRange[1]
    ) {
      return false
    }

    // Price filter
    if (
      (nutritionist.consultationFee ?? 0) < filters.priceRange[0] ||
      (nutritionist.consultationFee ?? 0) > filters.priceRange[1]
    ) {
      return false
    }

    // Rating filter
    if ((nutritionist.rating ?? 0) < filters.rating) {
      return false
    }

    return true
  })
}, [searchQuery, filters, nutritionists])


console.log("filteredNutritionists:", filteredNutritionists)

  



  const availableSpecializations = useMemo(() => {
  return Array.from(new Set(nutritionists?.map((n) => n.specialization)))
}, [nutritionists])



if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader />
    </div>
  )
}

if (isError) {
  return <div className="text-center py-12 text-red-500">Failed to load data</div>
}




  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green">
      {/* Header */}
<div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-b border-border/50">
  <div className="absolute inset-0 opacity-5" />
  <div className="relative container mx-auto px-4 pt-16 pb-5">
    <div className="text-center space-y-6">
      <h1 className="text-5xl font-bold text-soft-coral mb-4 text-balance pt-7">
        Find Your Perfect Nutritionist
      <span className="block text-soft-blue">Personalized Health Guidance</span>
      </h1>
      <p className="text-xl text-cool-gray max-w-2xl mx-auto leading-relaxed">
        Connect with certified nutrition experts for personalized health and wellness support.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full max-w-md">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="flex items-center gap-4">
          <Button
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 shrink-0">
              <div className="sticky top-32">
                <NutritionistFilters
               
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableSpecializations={availableSpecializations}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {filteredNutritionists?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-soft-coral mb-2">No nutritionists found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredNutritionists?.map((nutritionist) => (
                  <NutritionistCard key={nutritionist.id} nutritionist={nutritionist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
