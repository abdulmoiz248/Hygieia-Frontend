"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Calendar, DollarSign, Video,  User } from "lucide-react"
import Link from "next/link"
import type { ExtendedDoctor } from "@/mocks/doctor"

interface ProfessionalDoctorCardProps {
  doctor: ExtendedDoctor
}

export function ProfessionalDoctorCard({ doctor }: ProfessionalDoctorCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-snow-white hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-4 md:w-48">
            <Avatar className="w-24 h-24 border border-gray-200 shadow-sm">
              <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
              <AvatarFallback className="bg-soft-blue text-white text-lg">
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left md:text-center">
              <div className="flex items-center justify-center sm:justify-start md:justify-center gap-1 mb-1">
                {renderStars(doctor.rating)}
              </div>
              <div className="text-sm text-cool-gray">
                <span className="font-semibold text-soft-coral">{doctor.rating}</span> (
                {doctor.totalPatients > 1000 ? `${(doctor.totalPatients / 1000).toFixed(1)}k` : doctor.totalPatients}{" "}
                reviews)
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-soft-coral mb-1">{doctor.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-gray-100 text-soft-blue font-normal px-3 py-1 rounded-full">
                    {doctor.specialty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-cool-gray">
                    <MapPin className="w-3 h-3" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-cool-gray mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-soft-blue" />
                    <span>{doctor.experience} yrs experience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-soft-coral" />
                    <span >Rs.{doctor.consultationFee} fee</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
               
                <div className="flex flex-wrap gap-2">
                  {doctor.consultationTypes.includes("Video") && (
                    <Badge variant="outline" className="border-soft-blue text-soft-blue bg-soft-blue/10 rounded-full px-2 py-1">
                      <Video className="w-3 h-3 mr-1" /> Online Appointment
                    </Badge>
                  )}
                  {doctor.consultationTypes.includes("In-Person") && (
                    <Badge variant="outline" className="border-mint-green text-mint-green bg-mint-green/10 rounded-full px-2 py-1">
                      <User className="w-3 h-3 mr-1" /> In-Person
                    </Badge>
                  )}
                 
                </div>
              </div>
            </div>

            <p className="text-cool-gray mb-4 line-clamp-3 text-sm leading-relaxed">{doctor.bio}</p>

            <div className="flex flex-wrap gap-2 mb-5">
              {doctor.specializations.slice(0, 4).map((spec, idx) => (
                <Badge key={idx} variant="secondary" className="bg-gray-100 text-cool-gray font-normal px-3 py-1 rounded-full">
                  {spec}
                </Badge>
              ))}
              {doctor.specializations.length > 4 && (
                <Badge variant="secondary" className="bg-gray-100 text-cool-gray font-normal px-3 py-1 rounded-full">
                  +{doctor.specializations.length - 4} more
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/doctors/${doctor.id}`} className="flex-1 sm:flex-initial">
                <Button className="w-full bg-soft-blue hover:bg-soft-blue/90 text-white rounded-full px-5 py-2 text-sm">
                  View Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-mint-green text-mint-green hover:bg-mint-green/10 bg-transparent rounded-full px-5 py-2 text-sm"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
