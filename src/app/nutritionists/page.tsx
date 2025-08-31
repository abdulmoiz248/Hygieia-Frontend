"use client"

import { useState, useMemo } from "react"
import { NutritionistCard } from "@/components/nutritionist-main/nutritionist-card"
import { SearchBar } from "@/components/nutritionist-main/search-bar"
import { NutritionistFilters } from "@/components/nutritionist-main/nutritionist-filters"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import { NutritionistProfile } from "@/store/nutritionist/userStore"


export const mockNutritionists: NutritionistProfile[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@nutrition.com",
    phone: "+1 (555) 123-4567",
    gender: "Female",
    dateofbirth: "1985-03-15",
    img: "/placeholder.svg?height=300&width=300",
    specialization: "Sports Nutrition",
    experienceYears: 8,
    certifications: ["Certified Sports Nutritionist", "Registered Dietitian"],
    education: ["MS in Nutrition Science - Stanford University", "BS in Dietetics - UC Berkeley"],
    languages: ["English", "Mandarin", "Spanish"],
    bio: "Specialized in optimizing athletic performance through personalized nutrition strategies. Worked with Olympic athletes and professional sports teams.",
    consultationFee: 150,
    workingHours: [
      { day: "Monday", start: "09:00", end: "17:00" },
      { day: "Tuesday", start: "09:00", end: "17:00" },
      { day: "Wednesday", start: "09:00", end: "17:00" },
      { day: "Thursday", start: "09:00", end: "17:00" },
      { day: "Friday", start: "09:00", end: "15:00" },
    ],
    rating: 4.9,
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    email: "michael.rodriguez@wellness.com",
    phone: "+1 (555) 234-5678",
    gender: "Male",
    dateofbirth: "1982-07-22",
    img: "/placeholder.svg?height=300&width=300",
    specialization: "Clinical Nutrition",
    experienceYears: 12,
    certifications: ["Registered Dietitian Nutritionist", "Certified Diabetes Educator"],
    education: ["PhD in Clinical Nutrition - Harvard University", "MS in Nutrition - NYU"],
    languages: ["English", "Spanish", "Portuguese"],
    bio: "Expert in managing chronic diseases through evidence-based nutrition interventions. Specializes in diabetes, heart disease, and metabolic disorders.",
    consultationFee: 180,
    workingHours: [
      { day: "Monday", start: "08:00", end: "16:00" },
      { day: "Tuesday", start: "08:00", end: "16:00" },
      { day: "Wednesday", start: "10:00", end: "18:00" },
      { day: "Thursday", start: "08:00", end: "16:00" },
      { day: "Friday", start: "08:00", end: "14:00" },
    ],
    rating: 4.8,
  },
  {
    id: "3",
    name: "Dr. Emily Johnson",
    email: "emily.johnson@plantbased.com",
    phone: "+1 (555) 345-6789",
    gender: "Female",
    dateofbirth: "1990-11-08",
    img: "/placeholder.svg?height=300&width=300",
    specialization: "Plant-Based Nutrition",
    experienceYears: 6,
    certifications: ["Plant-Based Nutrition Certificate", "Registered Dietitian"],
    education: ["MS in Nutrition - Cornell University", "BS in Food Science - UC Davis"],
    languages: ["English", "French"],
    bio: "Passionate about sustainable nutrition and plant-based lifestyles. Helps clients transition to healthier, environmentally conscious eating patterns.",
    consultationFee: 120,
    workingHours: [
      { day: "Monday", start: "10:00", end: "18:00" },
      { day: "Tuesday", start: "10:00", end: "18:00" },
      { day: "Wednesday", start: "09:00", end: "17:00" },
      { day: "Thursday", start: "10:00", end: "18:00" },
      { day: "Saturday", start: "09:00", end: "13:00" },
    ],
    rating: 4.7,
  },
]

export function getNutritionistById(id: string): NutritionistProfile | undefined {
  return mockNutritionists.find((nutritionist) => nutritionist.id === id)
}


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
    priceRange: [0, 300],
    rating: 0,
  })


  
  const availableSpecializations = useMemo(() => {
    return Array.from(new Set(mockNutritionists.map((n) => n.specialization)))
  }, [])

  const filteredNutritionists = useMemo(() => {
    return mockNutritionists.filter((nutritionist) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          nutritionist.name.toLowerCase().includes(query) ||
          nutritionist.specialization.toLowerCase().includes(query) ||
          nutritionist.bio.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      // Specialization filter
      if (filters.specializations.length > 0) {
        if (!filters.specializations.includes(nutritionist.specialization)) {
          return false
        }
      }

      // Experience filter
      if (
        nutritionist.experienceYears < filters.experienceRange[0] ||
        nutritionist.experienceYears > filters.experienceRange[1]
      ) {
        return false
      }

      // Price filter
      if (
        nutritionist.consultationFee < filters.priceRange[0] ||
        nutritionist.consultationFee > filters.priceRange[1]
      ) {
        return false
      }

      // Rating filter
      if (nutritionist.rating < filters.rating) {
        return false
      }

      return true
    })
  }, [searchQuery, filters])

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green">
      {/* Header */}
     <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm pt-13">
  <div className="container mx-auto px-4 py-6">
    <div className="text-left mb-6">
      <h1 className="text-4xl font-bold text-soft-coral mb-2 text-balance">
        Find Your Perfect Nutritionist
      </h1>
      <p className="text-lg text-cool-gray text-pretty">
        Connect with certified nutrition experts for personalized health guidance
      </p>
    </div>

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex-1">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
           
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
        </div>

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
            {filteredNutritionists.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-soft-coral mb-2">No nutritionists found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredNutritionists.map((nutritionist) => (
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
