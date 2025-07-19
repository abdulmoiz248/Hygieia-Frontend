"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Star, Filter, QrCode, Share2, Phone, Calendar, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockDoctors } from "@/mocks/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof mockDoctors)[0] | null>(null)

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = specialtyFilter === "all" || doctor.specialty === specialtyFilter
    const matchesLocation = locationFilter === "all" || doctor.location.includes(locationFilter)

    return matchesSearch && matchesSpecialty && matchesLocation
  })

  const specialties = [...new Set(mockDoctors.map((d) => d.specialty))]
  const locations = [...new Set(mockDoctors.map((d) => d.location.split(", ")[1]))]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-dark-slate-gray">Find Doctors</h1>
        <p className="text-cool-gray">Search and book appointments with qualified healthcare professionals</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cool-gray w-4 h-4" />
                <Input
                  placeholder="Search doctors, specialties..."
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

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-4">
          <p className="text-cool-gray">{filteredDoctors.length} doctors found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <motion.div key={doctor.id} whileHover={{ scale: 1.02 }}>
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-semibold text-dark-slate-gray mb-1">{doctor.name}</h3>
                      <Badge variant="outline" className="mb-2">
                        {doctor.specialty}
                      </Badge>

                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-sm text-cool-gray">({doctor.experience} years exp.)</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-cool-gray">
                        <MapPin className="w-4 h-4" />
                        {doctor.location}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-cool-gray">Consultation Fee</span>
                      <span className="font-semibold text-dark-slate-gray">${doctor.consultationFee}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-soft-blue hover:bg-soft-blue/90"
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-cool-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-slate-gray mb-2">No doctors found</h3>
            <p className="text-cool-gray">Try adjusting your search criteria</p>
          </div>
        )}
      </motion.div>

      {/* Doctor Profile Modal */}
      <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedDoctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedDoctor.name}</h2>
                    <p className="text-cool-gray">{selectedDoctor.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedDoctor.rating}</span>
                      <span className="text-cool-gray">• {selectedDoctor.experience} years experience</span>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-soft-blue/10 rounded-lg">
                    <div className="text-2xl font-bold text-soft-blue">{selectedDoctor.rating}</div>
                    <p className="text-sm text-cool-gray">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-mint-green/10 rounded-lg">
                    <div className="text-2xl font-bold text-mint-green">{selectedDoctor.experience}</div>
                    <p className="text-sm text-cool-gray">Years Exp.</p>
                  </div>
                  <div className="text-center p-4 bg-soft-coral/10 rounded-lg">
                    <div className="text-2xl font-bold text-soft-coral">${selectedDoctor.consultationFee}</div>
                    <p className="text-sm text-cool-gray">Consultation</p>
                  </div>
                </div>

                {/* About */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About Dr. {selectedDoctor.name.split(" ")[1]}</h3>
                  <p className="text-cool-gray">
                    Dr. {selectedDoctor.name.split(" ")[1]} is a highly experienced{" "}
                    {selectedDoctor.specialty.toLowerCase()} with {selectedDoctor.experience} years of practice. Known
                    for providing comprehensive care and staying up-to-date with the latest medical advances.
                  </p>
                </div>

                {/* Specializations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{selectedDoctor.specialty}</Badge>
                    <Badge variant="outline">General Consultation</Badge>
                    <Badge variant="outline">Preventive Care</Badge>
                    <Badge variant="outline">Treatment Planning</Badge>
                  </div>
                </div>

                {/* Education & Certifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Education & Certifications
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-soft-blue rounded-full"></div>
                      <span className="text-sm">MD from Harvard Medical School</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-mint-green rounded-full"></div>
                      <span className="text-sm">Board Certified in {selectedDoctor.specialty}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-soft-coral rounded-full"></div>
                      <span className="text-sm">Fellowship in Advanced {selectedDoctor.specialty}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-cool-gray">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedDoctor.location}</span>
                </div>

                {/* QR Code */}
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-16 h-16 text-cool-gray" />
                  </div>
                  <p className="text-sm text-cool-gray">Scan to share profile</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-soft-blue hover:bg-soft-blue/90" asChild>
                    <Link href={`/appointments/new?docId=${selectedDoctor.id}`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
