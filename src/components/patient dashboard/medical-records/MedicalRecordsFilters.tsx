import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Filter } from "lucide-react"

interface MedicalRecordsFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  typeFilter: string
  setTypeFilter: (value: string) => void
}

export function MedicalRecordsFilters({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter
}: MedicalRecordsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[--color-snow-white] rounded-2xl shadow-md">
      <div className="flex-1">
        <Input
          placeholder="Search medical records..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-[--color-cool-gray] focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent transition-all duration-200"
        />
      </div>
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-full sm:w-56 rounded-xl border border-[--color-cool-gray] focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent transition-all duration-200">
          <Filter className="w-4 h-4 mr-2 text-[--color-dark-slate-gray]" />
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent className="rounded-xl bg-snow-white shadow-lg border border-[--color-cool-gray]">
          <SelectItem value="all" className="hover:text-white hover:bg-soft-blue">All Types</SelectItem>
          <SelectItem value="lab-result" className="hover:text-white hover:bg-soft-blue">Lab Results</SelectItem>
          <SelectItem value="prescription" className="hover:text-white hover:bg-soft-blue">Prescriptions</SelectItem>
          <SelectItem value="scan" className="hover:text-white hover:bg-soft-blue">Scans/X-Rays</SelectItem>
          <SelectItem value="report" className="hover:text-white hover:bg-soft-blue">Reports</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
