"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { specialties, locations, consultationTypes } from "@/mocks/doctor"

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

interface ProfessionalFiltersProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
}

export function ProfessionalFilters({ filters, onFiltersChange }: ProfessionalFiltersProps) {
  const updateFilter = (key: keyof FiltersState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
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

  return (
    <div className="bg-snow-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-soft-coral">Filter Results</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-cool-gray hover:text-soft-blue">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Specialty */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-dark-slate-gray">Specialty</Label>
          <Select value={filters.specialty} onValueChange={(value) => updateFilter("specialty", value)}>
            <SelectTrigger className="border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-snow-white">
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty} className="hover:text-white hover:bg-mint-green">
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-dark-slate-gray">Location</Label>
          <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
            <SelectTrigger className="border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-snow-white">
              {locations.map((location) => (
                <SelectItem key={location} value={location} className="hover:text-white hover:bg-mint-green">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Consultation Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-dark-slate-gray">Consultation Type</Label>
          <Select value={filters.consultationType} onValueChange={(value) => updateFilter("consultationType", value)}>
            <SelectTrigger className="border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-snow-white">
              {consultationTypes.map((type) => (
                <SelectItem key={type} value={type} className="hover:text-white hover:bg-mint-green" > 
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-dark-slate-gray">
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Label>
      <Slider
  value={filters.priceRange}
  onValueChange={(value) => updateFilter("priceRange", value)}
  max={500}
  min={0}
  step={10}
  className="w-full 
    [&_[data-slot=slider-track]]:h-2 
    [&_[data-slot=slider-track]]:bg-soft-coral/30 
    [&_[data-slot=slider-track]]:rounded-full

    [&_[data-slot=slider-range]]:bg-soft-blue 
    [&_[data-slot=slider-range]]:rounded-full 

    [&_[data-slot=slider-thumb]]:w-5 
    [&_[data-slot=slider-thumb]]:h-5 
    [&_[data-slot=slider-thumb]]:bg-snow-white 
    [&_[data-slot=slider-thumb]]:border-2 
    [&_[data-slot=slider-thumb]]:border-soft-blue 
    [&_[data-slot=slider-thumb]]:rounded-full 
    [&_[data-slot=slider-thumb]]:shadow-md 
    [&_[data-slot=slider-thumb]]:hover:scale-105 
    [&_[data-slot=slider-thumb]]:transition-transform"
/>



        </div>

        {/* Minimum Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-dark-slate-gray">
            Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
          </Label>
        <Slider
  value={[filters.minRating]}
  onValueChange={(value) => updateFilter("minRating", value[0])}
  max={5}
  min={0}
  step={0.1}
  className="w-full
    [&_[data-slot=slider-track]]:h-2 
    [&_[data-slot=slider-track]]:bg-soft-coral/30 
    [&_[data-slot=slider-track]]:rounded-full

    [&_[data-slot=slider-range]]:bg-soft-blue 
    [&_[data-slot=slider-range]]:rounded-full 

    [&_[data-slot=slider-thumb]]:w-4 
    [&_[data-slot=slider-thumb]]:h-4 
    [&_[data-slot=slider-thumb]]:bg-snow-white 
    [&_[data-slot=slider-thumb]]:border-2 
    [&_[data-slot=slider-thumb]]:border-soft-blue 
    [&_[data-slot=slider-thumb]]:rounded-full 
    [&_[data-slot=slider-thumb]]:shadow-sm 
    [&_[data-slot=slider-thumb]]:hover:scale-105 
    [&_[data-slot=slider-thumb]]:transition-transform"
/>

        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-dark-slate-gray">Availability</Label>
          <Select value={filters.availability} onValueChange={(value) => updateFilter("availability", value)}>
            <SelectTrigger className="border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-snow-white">
              <SelectItem className="hover:text-white hover:bg-mint-green" value="Any">Any</SelectItem>
              <SelectItem className="hover:text-white hover:bg-mint-green" value="Today">Available Today</SelectItem>
              <SelectItem className="hover:text-white hover:bg-mint-green" value="This Week">This Week</SelectItem>
              <SelectItem className="hover:text-white hover:bg-mint-green" value="Next Week">Next Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

     
      </div>
    </div>
  )
}
