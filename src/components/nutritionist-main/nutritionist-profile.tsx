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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">{nutritionist.name}</h1>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/20 text-secondary-foreground text-base px-3 py-1"
                        >
                          {nutritionist.specialization}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-accent/10 px-3 py-2 rounded-lg">
                          <Star className="h-5 w-5 fill-accent text-accent" />
                          <span className="font-semibold text-foreground">{nutritionist.rating}</span>
                        </div>

                        <Dialog open={showQR} onOpenChange={setShowQR}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleShare}
                              className="border-primary/20 hover:bg-primary/10 bg-transparent"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
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

                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">{nutritionist.bio}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <span>{nutritionist.experienceYears} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-5 w-5" />
                        <span>${nutritionist.consultationFee}/session</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-5 w-5" />
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
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {nutritionist.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="block w-fit">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nutritionist.education.map((edu, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium text-foreground">{edu}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Languages */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {nutritionist.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="bg-secondary/20">
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
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href={`mailto:${nutritionist.email}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {nutritionist.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <a
                    href={`tel:${nutritionist.phone}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {nutritionist.phone}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nutritionist.workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">{schedule.day}</span>
                      <span className="text-muted-foreground">
                        {schedule.start} - {schedule.end}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Book Consultation */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary mb-1">${nutritionist.consultationFee}</div>
                  <div className="text-sm text-muted-foreground">per session</div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                  Book Consultation
                </Button>
                <p className="text-xs text-muted-foreground mt-3">Secure booking with instant confirmation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
