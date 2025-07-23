"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, ArrowUpDown } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green pt-15 ">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
  <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-soft-coral drop-shadow-sm mb-3 animate-fade-in">
    Find a Doctor
  </h1>
  <p className="text-lg text-snow-white">
    Easily connect with verified healthcare professionals and schedule consultations at your convenience.
  </p>
</div>

        {/* Search and Filter Bar */}
       {/* Search and Filter Bar */}
<div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 px-2">
  <div className="relative flex-grow">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
    <Input
      placeholder="Search by name, specialty..."
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      className="pl-10 border border-gray-200 shadow-sm focus:ring-2 focus:ring-soft-blue focus:border-soft-blue transition-all"
    />
  </div>

  <div className="flex gap-3 flex-wrap justify-between md:justify-start">
    <Button
      variant="outline"
      onClick={() => setShowFilters(!showFilters)}
      className="border border-gray-200 text-cool-gray hover:bg-soft-blue/10 transition-all"
    >
      <Filter className="w-4 h-4 mr-2" />
      Filters
    </Button>

    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-muted" />
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px] border border-gray-200 shadow-sm focus:ring-2 focus:ring-soft-blue focus:border-soft-blue transition-all">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="bg-snow-white">
          <SelectItem className="hover:text-white hover:bg-mint-green" value="rating">Highest Rated</SelectItem>
          <SelectItem className="hover:text-white hover:bg-mint-green" value="experience">Most Experienced</SelectItem>
          <SelectItem className="hover:text-white hover:bg-mint-green" value="price-low">Price: Low to High</SelectItem>
          <SelectItem className="hover:text-white hover:bg-mint-green" value="price-high">Price: High to Low</SelectItem>
          <SelectItem className="hover:text-white hover:bg-mint-green" value="patients">Most Patients</SelectItem>
          <SelectItem className="hover:text-white hover:bg-mint-green" value="name">Name A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</div>


        {/* Mobile Sort (Visible on small screens) */}
        <div className="md:hidden mb-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full border-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="patients">Most Patients</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters (Collapsible) */}
        {showFilters && (
          <div className="mb-6">
            <ProfessionalFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-cool-gray">
            <span className="font-medium text-dark-slate-gray">{filteredDoctors.length}</span> doctors found
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Doctors List */}
        {filteredDoctors.length > 0 ? (
          <div className="space-y-6">
            {filteredDoctors.map((doctor) => (
              <ProfessionalDoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-100 rounded-lg bg-gray-50">
            <h3 className="text-xl font-medium text-dark-slate-gray mb-2">No doctors found</h3>
            <p className="text-cool-gray mb-4">Try adjusting your filters or search criteria to find more doctors.</p>
            <Button
              onClick={() =>
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
              className="bg-soft-blue hover:bg-soft-blue/90"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
