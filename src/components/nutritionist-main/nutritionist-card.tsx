"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock,  QrCode, Share2 } from "lucide-react"
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
import { NutritionistProfile } from "@/store/nutritionist/userStore"

interface NutritionistCardProps {
  nutritionist: NutritionistProfile
}

export function NutritionistCard({ nutritionist }: NutritionistCardProps) {
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

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-16 w-16 ring-2 ring-primary/30 shadow-md">
            <AvatarImage src={nutritionist.img || "/placeholder.svg"} alt={nutritionist.name} />
            <AvatarFallback className="bg-primary/10 text-soft-blue font-semibold">
              {nutritionist.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-xl text-soft-coral truncate">{nutritionist.name}</h3>
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">{nutritionist.rating}</span>
              </div>
            </div>

            <Badge variant="secondary" className="mb-2 bg-soft-blue/20 text-soft-blue">
              {nutritionist.specialization}
            </Badge>

            <p className="text-sm text-muted-foreground line-clamp-2">{nutritionist.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/70" />
            <span>{nutritionist.experienceYears} yrs exp.</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
          
            <span>${nutritionist.consultationFee}/session</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="flex-1 rounded-xl bg-soft-blue  hover:bg-soft-blue/80  text-white shadow hover:opacity-90 transition">
            <Link href={`/nutritionists/${nutritionist.id}`}>View Profile</Link>
          </Button>

          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-xl border border-primary/30 hover:bg-primary/10 backdrop-blur-sm"
              >
                <Share2 className="h-5 w-5 text-primary" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl backdrop-blur-md bg-white/80 shadow-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-soft-coral">
                  <QrCode className="h-5 w-5 text-primary" />
                  Share Profile
                </DialogTitle>
                <DialogDescription>
                  Scan this QR code to share {nutritionist.name}&apos;s profile
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center p-6">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <QRCodeSVG value={profileUrl} size={200} level="M" includeMargin={true} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
