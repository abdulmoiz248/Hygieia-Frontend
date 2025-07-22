"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"

interface Review {
  id: string
  patientName: string
  patientAvatar?: string
  rating: number
  date: string
  comment: string
  helpful: number
  verified: boolean
}

const mockReviews: Review[] = [
  {
    id: "1",
    patientName: "John Smith",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Excellent doctor! Very thorough examination and clear explanations. The online consultation was smooth and professional.",
    helpful: 12,
    verified: true,
  },
  {
    id: "2",
    patientName: "Maria Garcia",
    rating: 5,
    date: "2024-01-10",
    comment:
      "Dr. Johnson is amazing! She took time to listen to all my concerns and provided a comprehensive treatment plan.",
    helpful: 8,
    verified: true,
  },
  {
    id: "3",
    patientName: "David Chen",
    rating: 4,
    date: "2024-01-05",
    comment: "Great experience overall. The doctor was knowledgeable and the staff was very helpful.",
    helpful: 5,
    verified: true,
  },
]

export function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % mockReviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + mockReviews.length) % mockReviews.length)
  }

  const avgRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-mint-green/5 animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-dark-slate-gray flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-soft-blue" />
              Patient Reviews
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(avgRating))}
                <span className="font-semibold text-dark-slate-gray ml-1">{avgRating.toFixed(1)}</span>
              </div>
              <span className="text-cool-gray">({mockReviews.length} reviews)</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevReview}
              className="w-8 h-8 p-0 border-soft-blue/20 hover:bg-soft-blue/10 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextReview}
              className="w-8 h-8 p-0 border-soft-blue/20 hover:bg-soft-blue/10 bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}
          >
            {mockReviews.map((review, index) => (
              <div key={review.id} className="w-full flex-shrink-0 px-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 border-2 border-mint-green/20">
                      <AvatarImage src={review.patientAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-mint-green/10 text-mint-green">
                        {review.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-dark-slate-gray">{review.patientName}</h4>
                        {review.verified && (
                          <Badge className="bg-mint-green/10 text-mint-green text-xs">Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-cool-gray">{review.date}</span>
                      </div>
                      <p className="text-cool-gray leading-relaxed">{review.comment}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Button variant="ghost" size="sm" className="text-cool-gray hover:text-soft-blue">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {mockReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentReview ? "bg-soft-blue" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
