"use client"


import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, DollarSign, QrCode, Share2 } from "lucide-react"
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
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={nutritionist.img || "/placeholder.svg"} alt={nutritionist.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {nutritionist.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-foreground truncate">{nutritionist.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium text-foreground">{nutritionist.rating}</span>
              </div>
            </div>

            <Badge variant="secondary" className="mb-2 bg-secondary/20 text-secondary-foreground">
              {nutritionist.specialization}
            </Badge>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{nutritionist.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{nutritionist.experienceYears} years exp.</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>${nutritionist.consultationFee}/session</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
            <Link href={`/nutritionist/${nutritionist.id}`}>View Profile</Link>
          </Button>

          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="shrink-0 border-primary/20 hover:bg-primary/10 bg-transparent"
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
                <DialogDescription>Scan this QR code to share {nutritionist.name}'s profile</DialogDescription>
              </DialogHeader>
              <div className="flex justify-center p-6">
                <div className="bg-white p-4 rounded-lg">
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
