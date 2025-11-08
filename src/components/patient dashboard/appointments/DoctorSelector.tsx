"use client"
import { useState, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Doctor } from "@/types"
import type { NutritionistProfile } from "@/store/nutritionist/userStore"

type DoctorSelectorModalProps = {
  doctors: Doctor[] | NutritionistProfile[]
  value: string
  onChange: (value: string) => void
  onOpenChange?: (open: boolean) => void
}

export default function DoctorSelectorModal({ doctors, value, onChange, onOpenChange }: DoctorSelectorModalProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter doctors based on search query
  const filteredDoctors = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return doctors

    return doctors.filter(
      (doc) => doc.name.toLowerCase().includes(query) || doc.specialization.toLowerCase().includes(query),
    )
  }, [searchQuery, doctors])

  // Handle doctor selection
  const handleSelect = useCallback(
    (doctorId: string) => {
      onChange(doctorId)
      setOpen(false)
      setSearchQuery("")
      onOpenChange?.(false)
    },
    [onChange, onOpenChange],
  )

  // Get selected doctor info
  const selectedDoctor = doctors.find((d) => d.id === value)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground block">Select Doctor</label>

      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-sm",
          "hover:bg-accent/50 transition-colors duration-200",
          selectedDoctor && "bg-accent/20 border-primary/50",
        )}
      >
        <span className={selectedDoctor ? "text-foreground font-medium" : "text-muted-foreground"}>
          {selectedDoctor ? selectedDoctor.name : "Select a doctor or nutritionist..."}
        </span>
        <Search className="h-4 w-4 text-muted-foreground" />
      </button>

      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen)
          onOpenChange?.(newOpen)
        }}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Select Doctor or Nutritionist</DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Doctor Cards Grid */}
          <div className="overflow-y-auto flex-1 pr-4">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No doctors found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleSelect(doctor.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg",
                      value === doctor.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card hover:bg-accent/30",
                    )}
                  >
                    {/* Doctor Image and Basic Info */}
                    <div className="flex gap-3 mb-3">
                      {doctor.img && (
                        <img
                          src={doctor.img || "/placeholder.svg"}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-dark-slate-gray truncate">{doctor.name}</h3>
                        <p className="text-sm text-soft-coral font-medium truncate">{doctor.specialization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-foreground">{doctor.rating}</span>
                          </div>
                          <span className="text-xs text-cool-gray">{doctor.experienceYears}+ years</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio/Description */}
                    {doctor.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{doctor.bio}</p>}

                    {/* Consultation Fee */}
                    <div className="mb-3 pb-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">
                        Rs.{doctor.consultationFee}
                        <span className="text-xs font-normal text-soft-coral ml-1">per session</span>
                      </p>
                    </div>

                    {/* Info Badges */}
                    <div className="space-y-2 text-xs">
                      {doctor.languages && doctor.languages.length > 0 && (
                        <div>
                          <p className="font-medium text-soft-blue mb-1">Languages</p>
                          <div className="flex flex-wrap gap-1">
                            {doctor.languages.slice(0, 3).map((lang) => (
                              <Badge key={lang} variant="secondary" className="text-xs py-0.5">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {doctor.certifications && doctor.certifications.length > 0 && (
                        <div>
                          <p className="font-medium text-soft-blue mb-1">Certifications</p>
                          <div className="flex flex-wrap gap-1">
                            {doctor.certifications.slice(0, 2).map((cert) => (
                            
                               <Badge key={cert} variant="secondary" className="text-xs py-0.5">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {doctor.education && doctor.education.length > 0 && (
                        <div>
                          <p className="font-medium text-soft-blue mb-1">Education</p>
                          <p className="text-muted-foreground line-clamp-1">{doctor.education[0]}</p>
                        </div>
                      )}

                    
                    </div>

                    {/* Selection Indicator */}
                    {value === doctor.id && (
                      <div className="mt-3 pt-3 border-t border-primary/20">
                        <p className="text-xs font-medium text-primary">✓ Selected</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
