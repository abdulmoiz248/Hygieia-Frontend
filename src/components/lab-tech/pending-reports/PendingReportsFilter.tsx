"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, ChevronDown, Clock,  MapPin, Calendar, SortAsc } from "lucide-react"

interface SearchCardProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  typeFilter: string
  setTypeFilter: (value: string) => void
  locationFilter: string
  setLocationFilter: (value: string) => void
  dateFilter: string
  setDateFilter: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
}

export function PendingReportFilter({ 
  searchQuery, 
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  locationFilter,
  setLocationFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy
}: SearchCardProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = [statusFilter, typeFilter, locationFilter, dateFilter].filter(f => f !== "all").length + (sortBy !== "date-asc" ? 1 : 0)

  const clearAllFilters = () => {
    setStatusFilter("all")
    setTypeFilter("all")
    setLocationFilter("all")
    setDateFilter("all")
    setSortBy("date-asc")
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-snow-white hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-slate-gray w-5 h-5" />
              <Input
                placeholder="Search by patient name or test name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-cool-gray/30 focus:ring-2 focus:ring-mint-green focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
            
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="relative px-6 py-3 rounded-xl border-cool-gray/30 hover:bg-soft-blue/10 hover:border-soft-blue transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Filter className="w-5 h-5 mr-2 text-soft-blue" />
              <span className="font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-soft-coral text-snow-white px-2 py-0.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-cool-gray/20">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-slate-gray uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-soft-coral" />
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "pending",  "completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        statusFilter === status
                          ? "bg-soft-coral text-snow-white shadow-md scale-105"
                          : "bg-cool-gray/10 text-dark-slate-gray hover:bg-soft-coral/20 hover:scale-105"
                      }`}
                    >
                      {status === "all" ? "All" : status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-slate-gray uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-mint-green" />
                  Location
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "home", "lab"].map((location) => (
                    <button
                      key={location}
                      onClick={() => setLocationFilter(location)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        locationFilter === location
                          ? "bg-mint-green text-black shadow-md scale-105"
                          : "bg-cool-gray/10 text-dark-slate-gray hover:bg-mint-green/20 hover:scale-105"
                      }`}
                    >
                      {location === "all" ? "All" : location === "home" ? "Home Visit" : "At Lab"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-slate-gray uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-peach" />
                  Schedule
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "today", "tomorrow", "this-week"].map((date) => (
                    <button
                      key={date}
                      onClick={() => setDateFilter(date)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        dateFilter === date
                          ? "bg-peach text-black shadow-md scale-105"
                          : "bg-cool-gray/10 text-dark-slate-gray hover:bg-peach/20 hover:scale-105"
                      }`}
                    >
                      {date === "all" ? "All" : date === "this-week" ? "This Week" : date.charAt(0).toUpperCase() + date.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-dark-slate-gray uppercase tracking-wide flex items-center gap-2">
                  <SortAsc className="w-3.5 h-3.5 text-soft-blue" />
                  Sort By
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "date-asc", label: "Date ↑" },
                    { value: "date-desc", label: "Date ↓" },
                    { value: "name-asc", label: "Name A-Z" },
                    { value: "name-desc", label: "Name Z-A" }
                  ].map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => setSortBy(sort.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        sortBy === sort.value
                          ? "bg-soft-blue text-snow-white shadow-md scale-105"
                          : "bg-cool-gray/10 text-dark-slate-gray hover:bg-soft-blue/20 hover:scale-105"
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              {activeFilterCount > 0 && (
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                  <Button
                    onClick={clearAllFilters}
                    variant="ghost"
                    size="sm"
                    className="text-soft-coral hover:bg-soft-coral/10 hover:text-soft-coral font-medium"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
