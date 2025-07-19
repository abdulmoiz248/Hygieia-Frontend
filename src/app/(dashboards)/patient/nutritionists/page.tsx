"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Star, Filter, Users, Award, Calendar, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

const mockNutritionists = [
  {
    id: "1",
    name: "Dr. Lisa Chen",
    specialty: "Sports Nutrition",
    rating: 4.9,
    location: "New York, NY",
    experience: 8,
    consultationFee: 120,
    avatar: "/placeholder.svg?height=100&width=100",
    specializations: ["Weight Management", "Athletic Performance", "Meal Planning"],
    languages: ["English", "Mandarin"],
  },
  {
    id: "2",
    name: "Dr. Maria Rodriguez",
    specialty: "Clinical Nutrition",
    rating: 4.8,
    location: "Los Angeles, CA",
    experience: 12,
    consultationFee: 150,
    avatar: "/placeholder.svg?height=100&width=100",
    specializations: ["Diabetes Management", "Heart Health", "Mediterranean Diet"],
    languages: ["English", "Spanish"],
  },
  {
    id: "3",
    name: "Dr. James Wilson",
    specialty: "Pediatric Nutrition",
    rating: 4.7,
    location: "Chicago, IL",
    experience: 10,
    consultationFee: 100,
    avatar: "/placeholder.svg?height=100&width=100",
    specializations: ["Child Nutrition", "Family Meal Planning", "Picky Eaters"],
    languages: ["English"],
  },
]

export default function NutritionistsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [selectedNutritionist, setSelectedNutritionist] = useState<(typeof mockNutritionists)[0] | null>(null)
  const [shareDetails, setShareDetails] = useState(false)

  const filteredNutritionists = mockNutritionists.filter((nutritionist) => {
    const matchesSearch =
      nutritionist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nutritionist.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = specialtyFilter === "all" || nutritionist.specialty === specialtyFilter
    return matchesSearch && matchesSpecialty
  })

  const specialties = [...new Set(mockNutritionists.map((n) => n.specialty))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-slate-gray">Find Nutritionists</h1>
        <p className="text-cool-gray">Connect with certified nutrition experts for personalized diet plans</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cool-gray w-4 h-4" />
              <Input
                placeholder="Search nutritionists, specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-cool-gray">{filteredNutritionists.length} nutritionists found</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNutritionists.map((nutritionist) => (
          <motion.div key={nutritionist.id} whileHover={{ scale: 1.02 }}>
            <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={nutritionist.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {nutritionist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-slate-gray mb-1">{nutritionist.name}</h3>
                    <Badge variant="outline" className="mb-2">
                      {nutritionist.specialty}
                    </Badge>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{nutritionist.rating}</span>
                      <span className="text-sm text-cool-gray">({nutritionist.experience} years exp.)</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-cool-gray">
                      <MapPin className="w-4 h-4" />
                      {nutritionist.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Specializations</p>
                    <div className="flex flex-wrap gap-1">
                      {nutritionist.specializations.slice(0, 2).map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {nutritionist.specializations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{nutritionist.specializations.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cool-gray">Consultation Fee</span>
                    <span className="font-semibold text-dark-slate-gray">${nutritionist.consultationFee}</span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-mint-green hover:bg-mint-green/90"
                    onClick={() => setSelectedNutritionist(nutritionist)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Select Nutritionist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Nutritionist Selection Modal */}
      <Dialog open={!!selectedNutritionist} onOpenChange={() => setSelectedNutritionist(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNutritionist && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedNutritionist.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedNutritionist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedNutritionist.name}</h2>
                    <p className="text-cool-gray">{selectedNutritionist.specialty}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-mint-green/10 rounded-lg">
                    <div className="text-2xl font-bold text-mint-green">{selectedNutritionist.rating}</div>
                    <p className="text-sm text-cool-gray">Rating</p>
                  </div>
                  <div className="text-center p-3 bg-soft-blue/10 rounded-lg">
                    <div className="text-2xl font-bold text-soft-blue">{selectedNutritionist.experience}</div>
                    <p className="text-sm text-cool-gray">Years Exp.</p>
                  </div>
                  <div className="text-center p-3 bg-soft-coral/10 rounded-lg">
                    <div className="text-2xl font-bold text-soft-coral">${selectedNutritionist.consultationFee}</div>
                    <p className="text-sm text-cool-gray">Consultation</p>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNutritionist.specializations.map((spec) => (
                      <Badge key={spec} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <div className="flex gap-2">
                    {selectedNutritionist.languages.map((lang) => (
                      <Badge key={lang} className="bg-gray-100 text-gray-800">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Share Details Option */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                  
                  <Checkbox
  id="share-details"
  checked={shareDetails}
  onCheckedChange={(val) => setShareDetails(val === true)}
/>

                     <div>
                      <label htmlFor="share-details" className="font-medium text-sm cursor-pointer">
                        Share my profile details with nutritionist
                      </label>
                      <p className="text-xs text-cool-gray mt-1">
                        This will automatically share your health profile, dietary preferences, and fitness goals to
                        help create a personalized plan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-mint-green hover:bg-mint-green/90">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>
                  <Button variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Get Diet Plan
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
