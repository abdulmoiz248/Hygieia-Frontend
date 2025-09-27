"use client"

import { notFound } from "next/navigation"
import { NutritionistProfile as NP } from "@/store/nutritionist/userStore"
import { useNutritionists } from "@/hooks/useNutritionist"
import Loader from "@/components/loader/loader"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Star,
  Clock,
  Calendar,
  Award,
  GraduationCap,
  Languages,
  QrCode,
  Share2,
  Coins,
} from "lucide-react"
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

export function NutritionistProfile({ id }: { id: string }) {
  const { data: nutritionists, isLoading, isError } = useNutritionists()
  const [showQR, setShowQR] = useState(false)
  if (isLoading) {
    return  <div className="flex items-center justify-center min-h-[400px]">
      <Loader />
    </div>

  }

  if (isError) {
    return <div className="text-center py-12 text-red-500">Failed to load data</div>
  }

  const nutritionist: NP | undefined = nutritionists?.find((n) => n.id === id)

  if (!nutritionist) {
    notFound()
  }


  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/nutritionist/${nutritionist!.id}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${nutritionist!.name} - Nutritionist`,
          text: `Check out ${nutritionist!.name}, a ${nutritionist!.specialization} specialist`,
          url: profileUrl,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      setShowQR(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green pt-13">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-snow-white/40 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                    <AvatarImage src={nutritionist!.img || "/placeholder.svg"} alt={nutritionist!.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                      {nutritionist!.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-soft-coral mb-2">{nutritionist!.name}</h1>
                        <Badge className="bg-mint-green text-secondary-foreground text-base px-3 py-1">
                          {nutritionist!.specialization}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-yellow-100/60 px-3 py-2 rounded-lg">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="font-semibold text-yellow-700">{nutritionist!.rating}</span>
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
                                Scan this QR code to share {nutritionist!.name}&apos;s profile
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

                    <p className="text-cool-gray text-lg leading-relaxed mb-6">{nutritionist!.bio}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-dark-slate-gray">
                        <Clock className="h-5 w-5 text-soft-coral" />
                        <span>{nutritionist!.experienceYears} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-dark-slate-gray">
                        <Coins className="h-5 w-5 text-soft-coral" />
                        <span>Rs. {nutritionist!.consultationFee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-dark-slate-gray">
                        <Calendar className="h-5 w-5 text-soft-coral" />
                        <span>{nutritionist!.gender}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-soft-blue text-lg font-semibold">
                    <Award className="h-6 w-6" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-dark-slate-gray">
                    {nutritionist!.certifications.map((cert, i) => (
                      <li key={i}>{cert}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-soft-blue text-lg font-semibold">
                    <GraduationCap className="h-6 w-6" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 list-disc list-inside text-dark-slate-gray">
                    {nutritionist!.education.map((edu, i) => (
                      <li key={i}>{edu}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Languages */}
            <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-soft-blue text-lg font-semibold">
                  <Languages className="h-6 w-6 text-mint-green" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {nutritionist!.languages.map((lang, i) => (
                    <Badge key={i} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 border border-border/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-soft-blue text-lg font-semibold">Working Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nutritionist!.workingHours.map((s, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="font-medium text-dark-slate-gray">{s.day}</span>
                      <span className="text-soft-coral">
                        {s.start} - {s.end}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-mint-green/20 via-soft-blue/10 to-cool-gray/20 border border-primary/30 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="mb-6">
                  <div className="text-3xl md:text-4xl font-extrabold text-dark-slate-gray mb-2 animate-pulse">
                    Rs. {nutritionist!.consultationFee}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground tracking-wide">
                    per session
                  </div>
                </div>
                <Button className="w-full bg-soft-blue text-snow-white font-bold py-4 rounded-xl shadow-lg text-lg">
                  Book Consultation
                </Button>
                <p className="text-xs md:text-sm text-muted-foreground mt-4">
                  Secure booking with instant confirmation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
