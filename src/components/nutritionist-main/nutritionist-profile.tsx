"use client"

import { notFound } from "next/navigation"
import { NutritionistProfile as NP } from "@/store/nutritionist/userStore"
import { useNutritionists } from "@/hooks/useNutritionist"
import Loader from "@/components/loader/loader"
import api from "@/lib/axios"

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
  Loader2,
  MapPin,
  MessageSquare,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ProviderReview = {
  id: string
  patientName: string
  rating: number
  review: string
  createdAt: string
}

type ProviderReviewsResponse = {
  items?: ProviderReview[]
}

const formatReviewDate = (date: string): string => {
  if (!date) {
    return ""
  }

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return ""
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function NutritionistProfile({ id }: { id: string }) {
  const { data: nutritionists, isLoading, isError } = useNutritionists()
  const [showQR, setShowQR] = useState(false)
  const [reviews, setReviews] = useState<ProviderReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true)
        setReviewsError(null)

        const response = await api.get<ProviderReviewsResponse>("/appointments/reviews/provider", {
          params: {
            providerId: id,
            role: "nutritionist",
            limit: 10,
            offset: 0,
          },
        })

        if (!isMounted) {
          return
        }

        setReviews(Array.isArray(response.data?.items) ? response.data.items : [])
      } catch {
        if (!isMounted) {
          return
        }

        setReviews([])
        setReviewsError("Failed to load reviews right now.")
      } finally {
        if (isMounted) {
          setReviewsLoading(false)
        }
      }
    }

    fetchReviews()

    return () => {
      isMounted = false
    }
  }, [id])

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

            <Card className="bg-gradient-to-br from-soft-blue/10 via-mint-green/5 to-cool-gray/10 backdrop-blur-lg border border-border/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-soft-blue text-lg font-semibold">
                  <MessageSquare className="h-6 w-6 text-soft-coral" />
                  Patient Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="flex items-center gap-3 text-cool-gray">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading reviews...</span>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-cool-gray/30 bg-white/60 p-4 text-sm text-cool-gray">
                    No reviews yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-xl border border-border/40 bg-white/70 p-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="font-semibold text-dark-slate-gray">{review.patientName || "Anonymous patient"}</p>
                          <span className="text-xs text-cool-gray">{formatReviewDate(review.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={`${review.id}-star-${index}`}
                              className={`h-4 w-4 ${index < review.rating ? "fill-yellow-400 text-yellow-500" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-dark-slate-gray leading-relaxed">{review.review}</p>
                      </div>
                    ))}
                  </div>
                )}

                {reviewsError && !reviewsLoading && reviews.length === 0 && (
                  <p className="mt-3 text-xs text-red-500">{reviewsError}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-soft-blue/15 via-snow-white to-mint-green/15 border border-soft-blue/20 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-soft-blue text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Working Hours & Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nutritionist!.workingHours.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-white/70 border border-border/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-soft-blue/30"
                    >
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="inline-flex items-center rounded-full bg-soft-blue/10 text-soft-blue px-2.5 py-1 font-semibold">
                          {s.day}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-soft-coral font-semibold">
                          <Clock className="h-4 w-4" />
                          {s.start} - {s.end}
                        </span>
                      </div>
                      {s.location && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-mint-green/15 px-2.5 py-1 text-xs font-medium text-dark-slate-gray">
                          <MapPin className="h-3.5 w-3.5 text-mint-green" />
                          <span>{s.location}</span>
                        </div>
                      )}
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
