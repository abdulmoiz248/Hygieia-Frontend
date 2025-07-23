"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpDown, X, MapPin, Clock, Star, Users } from "lucide-react"
import { mockDoctors } from "@/mocks/doctor"
import { ProfessionalDoctorCard } from "@/components/doctor dashboard/doctors/doctor-card"
import { ProfessionalFilters } from "@/components/doctor dashboard/doctors/doctors-filters"

interface FiltersState {
  search: string
  specialty: string
  location: string
  consultationType: string
  priceRange: [number, number]
  minRating: number
  availability: string
  verifiedOnly: boolean
  acceptsInsurance: boolean
}

export default function DoctorsPage() {
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    specialty: "All Specialties",
    location: "All Locations",
    consultationType: "All Types",
    priceRange: [0, 500],
    minRating: 0,
    availability: "Any",
    verifiedOnly: false,
    acceptsInsurance: false,
  })
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(()=>{
setIsLoading(false)
  },[])

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.specialty !== "All Specialties") count++
    if (filters.location !== "All Locations") count++
    if (filters.consultationType !== "All Types") count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.minRating > 0) count++
    if (filters.availability !== "Any") count++
    if (filters.verifiedOnly) count++
    if (filters.acceptsInsurance) count++
    return count
  }, [filters])

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    const filtered = mockDoctors.filter((doctor) => {
      // Search filter
      if (
        filters.search &&
        !doctor.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !doctor.specialty.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Specialty filter
      if (filters.specialty !== "All Specialties" && doctor.specialty !== filters.specialty) {
        return false
      }

      // Location filter
      if (filters.location !== "All Locations" && doctor.location !== filters.location) {
        return false
      }

      // Consultation type filter
      if (filters.consultationType !== "All Types" && !doctor.consultationTypes.includes(filters.consultationType)) {
        return false
      }

      // Price range filter
      if (doctor.consultationFee < filters.priceRange[0] || doctor.consultationFee > filters.priceRange[1]) {
        return false
      }

      // Rating filter
      if (doctor.rating < filters.minRating) {
        return false
      }

      // Availability filter
      if (filters.availability !== "Any") {
        if (filters.availability === "Today" && !doctor.availability.nextAvailable.includes("Today")) {
          return false
        }
      }

      // Verified only filter
      if (filters.verifiedOnly && !doctor.verified) {
        return false
      }

      // Insurance filter
      if (filters.acceptsInsurance && !doctor.acceptsInsurance) {
        return false
      }

      return true
    })

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "experience":
          return b.experience - a.experience
        case "price-low":
          return a.consultationFee - b.consultationFee
        case "price-high":
          return b.consultationFee - a.consultationFee
        case "patients":
          return b.totalPatients - a.totalPatients
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [filters, sortBy])

  const clearAllFilters = () => {
    setFilters({
      search: "",
      specialty: "All Specialties",
      location: "All Locations",
      consultationType: "All Types",
      priceRange: [0, 500],
      minRating: 0,
      availability: "Any",
      verifiedOnly: false,
      acceptsInsurance: false,
    })
  }

  const clearFilter = (filterKey: keyof FiltersState) => {
    const newFilters = { ...filters }
    switch (filterKey) {
      case "search":
        newFilters.search = ""
        break
      case "specialty":
        newFilters.specialty = "All Specialties"
        break
      case "location":
        newFilters.location = "All Locations"
        break
      case "consultationType":
        newFilters.consultationType = "All Types"
        break
      case "priceRange":
        newFilters.priceRange = [0, 500]
        break
      case "minRating":
        newFilters.minRating = 0
        break
      case "availability":
        newFilters.availability = "Any"
        break
      case "verifiedOnly":
        newFilters.verifiedOnly = false
        break
      case "acceptsInsurance":
        newFilters.acceptsInsurance = false
        break
    }
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green pt-15">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-soft-coral/10 text-snow-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            {mockDoctors.length}+ Verified Healthcare Professionals
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-soft-coral to-soft-blue drop-shadow-sm mb-4 animate-fade-in">
            Find Your Doctor
          </h1>
          <p className="text-lg text-cool-gray/80 leading-relaxed">
            Connect with verified healthcare professionals and schedule consultations
            <br className="hidden md:block" />
            at your convenience with our advanced search and filtering system.
          </p>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cool-gray/50" />
              <Input
                placeholder="Search by doctor name, specialty, or condition..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-12 h-12 border-2 border-gray-200/50 shadow-sm focus:ring-2 focus:ring-soft-blue/50 focus:border-soft-blue transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter("search")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 px-6 border-2 transition-all duration-200 ${
                  showFilters
                    ? "bg-soft-blue text-white border-soft-blue shadow-lg"
                    : "border-gray-200/50 text-cool-gray hover:bg-soft-blue/10 hover:border-soft-blue/50"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-soft-coral text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-gray-200/50 px-4 py-2">
                <ArrowUpDown className="w-4 h-4 text-cool-gray/50" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] border-0 shadow-none focus:ring-0 bg-transparent">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-2">
                    <SelectItem className="hover:text-white hover:bg-mint-green transition-colors" value="rating">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Highest Rated
                      </div>
                    </SelectItem>
                    <SelectItem className="hover:text-white hover:bg-mint-green transition-colors" value="experience">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Most Experienced
                      </div>
                    </SelectItem>
                    <SelectItem className="hover:text-white hover:bg-mint-green transition-colors" value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem className="hover:text-white hover:bg-mint-green transition-colors" value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem className="hover:text-white hover:bg-mint-green transition-colors" value="patients">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Most Patients
                      </div>
                    </SelectItem>
                    <SelectItem className="hover:text-white hover:bg-mint-green transition-colors" value="name">
                      Name A-Z
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50">
              <span className="text-sm font-medium text-cool-gray mr-2">Active filters:</span>
              {filters.search && (
                <Badge variant="secondary" className="bg-soft-blue/10 text-soft-blue border border-soft-blue/20">
                  Search: {filters.search}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter("search")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-soft-blue/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {filters.specialty !== "All Specialties" && (
                <Badge variant="secondary" className="bg-mint-green/10 text-mint-green border border-mint-green/20">
                  {filters.specialty}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter("specialty")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-mint-green/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              {filters.location !== "All Locations" && (
                <Badge variant="secondary" className="bg-soft-coral/10 text-soft-coral border border-soft-coral/20">
                  <MapPin className="w-3 h-3 mr-1" />
                  {filters.location}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter("location")}
                    className="ml-1 h-4 w-4 p-0 hover:bg-soft-coral/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-cool-gray hover:text-soft-coral hover:bg-soft-coral/10 transition-colors"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Filters (Collapsible) */}
        {showFilters && (
          <div className="mb-8 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-200/50 shadow-lg p-6">
              <ProfessionalFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>
        )}

        {/* Enhanced Results Count and Stats */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-cool-gray">
              <span className="font-bold text-2xl text-dark-slate-gray">{filteredDoctors.length}</span>
              <span className="ml-1">doctors found</span>
            </p>
            {filteredDoctors.length > 0 && (
              <div className="flex items-center gap-4 text-sm text-cool-gray/70">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Avg: {(filteredDoctors.reduce((acc, doc) => acc + doc.rating, 0) / filteredDoctors.length).toFixed(1)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-soft-blue" />
                  {filteredDoctors.reduce((acc, doc) => acc + doc.totalPatients, 0).toLocaleString()} patients served
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="mb-8 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Enhanced Doctors List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="space-y-6">
            {filteredDoctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProfessionalDoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-gray-200/50 shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-soft-coral/20 to-soft-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-cool-gray/40" />
              </div>
              <h3 className="text-2xl font-bold text-soft-coral mb-3">No doctors found</h3>
              <p className="text-cool-gray mb-6 leading-relaxed">
                We couldn&apos;t find any doctors matching your criteria.
                <br />
                Try adjusting your filters or search terms to discover more healthcare professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-soft-blue to-mint-green hover:from-soft-blue/90 hover:to-mint-green/90 text-white shadow-lg transition-all duration-200"
                >
                  Clear All Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFilters({ ...filters, search: "" })}
                  className="border-2 border-soft-coral/20 text-soft-coral hover:bg-soft-coral/10 transition-all duration-200"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredDoctors.length > 10 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-2 border-soft-blue/20 text-soft-blue hover:bg-soft-blue hover:text-white transition-all duration-200 px-8 py-3"
            >
              Load More Doctors
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
