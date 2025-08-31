"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Star,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  Award,
  GraduationCap,
  Languages,
  QrCode,
  Share2,
  ArrowLeft,
  Coins,
} from "lucide-react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NutritionistProfile as NP } from "@/store/nutritionist/userStore"

interface NutritionistProfileProps {
  nutritionist: NP
}

export function NutritionistProfile({ nutritionist }: NutritionistProfileProps) {
  const [showQR, setShowQR] = useState(false)
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/nutritionist/${nutritionist.id}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${nutritionist.name} - Nutritionist`,
          text: `Check out ${nutritionist.name}, a ${nutritionist.specialization} specialist`,
          url: profileUrl,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      setShowQR(true)
    }
  }

  const formatWorkingHours = (hours: { day: string; start: string; end: string }[]) => {
    return hours.map((h) => `${h.day}: ${h.start} - ${h.end}`).join(", ")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green pt-13">

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="bg-snow-white/40 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                    <AvatarImage src={nutritionist.img || "/placeholder.svg"} alt={nutritionist.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                      {nutritionist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-soft-coral mb-2">{nutritionist.name}</h1>
                        <Badge
                        
                          className="bg-mint-green text-secondary-foreground text-base px-3 py-1"
                        >
                          {nutritionist.specialization}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-yellow-100/60 px-3 py-2 rounded-lg">
  <Star className="h-5 w-5 text-yellow-500 fill-current" />
  <span className="font-semibold text-yellow-700">{nutritionist.rating}</span>
</div>


                        <Dialog open={showQR} onOpenChange={setShowQR}>
                          <DialogTrigger asChild>
                            <Button
                            
                              size="icon"
                              onClick={handleShare}
                              className="border-b border-soft-coral hover:text-cool-gray hover:bg-soft-coral text-soft-coral bg-transparent"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-soft-coral">
                                <QrCode className="h-5 w-5" />
                                Share Profile
                              </DialogTitle>
                              <DialogDescription>
                                Scan this QR code to share {nutritionist.name}'s profile
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center p-6">
                              <div className="bg-white p-4 rounded-lg">
                                <QRCodeSVG value={profileUrl} size={200} level="M" includeMargin={true} />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <p className="text-cool-gray text-lg leading-relaxed mb-6">{nutritionist.bio}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-dark-slate-gray">
                        <Clock className="h-5 w-5 text-soft-coral" />
                        <span >{nutritionist.experienceYears} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-dark-slate-gray">
                        <Coins className="h-5 w-5 text-soft-coral" />
                        <span>Rs. {nutritionist.consultationFee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-dark-slate-gray">
                        <Calendar className="h-5 w-5 text-soft-coral" />
                        <span>{nutritionist.gender}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Certifications */}
  <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-soft-blue text-lg font-semibold">
        <Award className="h-6 w-6 " />
        Certifications
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 list-disc list-inside text-dark-slate-gray">
        {nutritionist.certifications.map((cert, index) => (
          <li key={index} className="hover:text-soft-blue transition-colors duration-200">
            {cert}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>

  {/* Education */}
  <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-soft-blue text-lg font-semibold">
        <GraduationCap className="h-6 w-6 " />
        Education
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3 list-disc list-inside text-dark-slate-gray">
        {nutritionist.education.map((edu, index) => (
          <li key={index} className="hover:text-soft-blue transition-colors duration-200">
            {edu}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
</div>


            {/* Languages */}
          <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
  <CardHeader>
    <CardTitle className="flex items-center gap-3 text-soft-blue text-lg font-semibold">
      <Languages className="h-6 w-6 text-mint-green" />
      Languages
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-wrap gap-3">
      {nutritionist.languages.map((lang, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="bg-secondary/20 text-dark-slate-gray font-medium px-3 py-1 rounded-lg shadow-sm hover:bg-secondary/30 transition-colors duration-200"
        >
          {lang}
        </Badge>
      ))}
    </div>
  </CardContent>
</Card>

          </div>

          {/* Sidebar */}
      <div className="space-y-6">
  {/* Contact Info */}
  <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
    <CardHeader className="text-soft-blue">
      <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-soft-coral" />
        <a
          href={`mailto:${nutritionist.email}`}
          className="text-dark-slate-gray hover:text-soft-blue transition-colors duration-200 font-medium"
        >
          {nutritionist.email}
        </a>
      </div>
      <div className="flex items-center gap-3">
        <Phone className="h-6 w-6 text-soft-coral" />
        <a
          href={`tel:${nutritionist.phone}`}
          className="text-dark-slate-gray hover:text-soft-blue transition-colors duration-200 font-medium"
        >
          {nutritionist.phone}
        </a>
      </div>
    </CardContent>
  </Card>

  {/* Working Hours */}
  <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
    <CardHeader>
      <CardTitle className="text-soft-blue text-lg font-semibold">Working Hours</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {nutritionist.workingHours.map((schedule, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="font-medium text-dark-slate-gray">{schedule.day}</span>
            <span className="text-soft-coral">{schedule.start} <span className="text-dark-slate-gray font-bold"> - </span> {schedule.end}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>

  {/* Book Consultation */}
<Card className="bg-gradient-to-br from-mint-green/20 via-soft-blue/10 to-cool-gray/20 border border-primary/30 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
  <CardContent className="p-8 text-center relative">
    <div className="mb-6">
      <div className="text-3xl md:text-4xl font-extrabold text-dark-slate-gray mb-2 animate-pulse">
        Rs. {nutritionist.consultationFee}
      </div>
      <div className="text-sm md:text-base text-muted-foreground tracking-wide">
        per session
      </div>
    </div>
    <Button className="w-full bg-soft-blue  hover:bg-soft-blue text-snow-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
      Book Consultation
    </Button>
    <p className="text-xs md:text-sm text-muted-foreground mt-4">
      Secure booking with instant confirmation
    </p>
    <div className="absolute top-0 right-0 w-24 h-24 bg-soft-blue/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-mint-green/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
  </CardContent>
</Card>

</div>

        </div>
      </div>
    </div>
  )
}
