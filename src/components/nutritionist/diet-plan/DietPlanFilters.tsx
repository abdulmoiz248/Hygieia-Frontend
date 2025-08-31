"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface PatientPlansFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
}

export function PatientPlansFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}: PatientPlansFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[--color-snow-white] rounded-2xl shadow-md items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full rounded-xl border border-[--color-cool-gray] 
                     focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent 
                     transition-all duration-200"
        />
      </div>

      {/* Filter Dropdown */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-56 rounded-xl border border-[--color-cool-gray] 
                                 focus:ring-2 focus:ring-[--color-mint-green] focus:border-transparent 
                                 transition-all duration-200">
          <Filter className="w-4 h-4 mr-2 text-[--color-dark-slate-gray]" />
          <SelectValue placeholder="Filter plans" />
        </SelectTrigger>
        <SelectContent className="rounded-xl bg-[--color-snow-white] shadow-lg border border-[--color-cool-gray]">
          <SelectItem value="all" className="hover:text-white hover:bg-[--color-mint-green]">
            All Plans
          </SelectItem>
          <SelectItem value="active" className="hover:text-white hover:bg-[--color-mint-green]">
            Active Plans
          </SelectItem>
          <SelectItem value="completed" className="hover:text-white hover:bg-[--color-mint-green]">
            Completed Plans
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
