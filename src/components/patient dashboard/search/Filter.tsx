import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {  MapPin, Stethoscope } from "lucide-react"

interface FiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  typeFilter: string
  setTypeFilter: (value: string) => void
  specialtyFilter: string
  setSpecialtyFilter: (value: string) => void
  locationFilter: string
  setLocationFilter: (value: string) => void
  specialties: string[]
  locations: string[]
}

export default function Filters({
  searchQuery,
  setSearchQuery,
  specialtyFilter,
  setSpecialtyFilter,
  locationFilter,
  setLocationFilter,
  specialties,
  locations
}: FiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-[--color-snow-white] rounded-2xl shadow-md">
      <div className="flex-1">
        <Input
          placeholder="Search Doctors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-[--color-cool-gray] focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent transition-all duration-200"
        />
      </div>

      <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
        <SelectTrigger className="w-full lg:w-56 rounded-xl border border-[--color-cool-gray] focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent transition-all duration-200">
          <Stethoscope className="w-4 h-4 mr-2 text-[--color-dark-slate-gray]" />
          <SelectValue placeholder="Specialty" />
        </SelectTrigger>
        <SelectContent className="rounded-xl bg-snow-white shadow-lg border border-[--color-cool-gray]">
          <SelectItem value="all" className="hover:text-white hover:bg-soft-blue">All Specialties</SelectItem>
          {specialties.map((specialty) => (
            <SelectItem key={specialty} value={specialty} className="hover:text-white hover:bg-soft-blue">
              {specialty}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={locationFilter} onValueChange={setLocationFilter}>
        <SelectTrigger className="w-full lg:w-56 rounded-xl border border-[--color-cool-gray] focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent transition-all duration-200">
          <MapPin className="w-4 h-4 mr-2 text-[--color-dark-slate-gray]" />
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent className="rounded-xl bg-snow-white shadow-lg border border-[--color-cool-gray]">
          <SelectItem value="all" className="hover:text-white hover:bg-soft-blue">All Locations</SelectItem>
          {locations.map((location) => (
            <SelectItem key={location} value={location} className="hover:text-white hover:bg-soft-blue">
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

    
    </div>
  )
}
