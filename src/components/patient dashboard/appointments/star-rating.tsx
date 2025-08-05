"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  hoverRating: number
  onHoverChange: (rating: number) => void
  size?: "sm" | "md" | "lg"
  readonly?: boolean
}

export default function StarRating({
  rating,
  onRatingChange,
  hoverRating,
  onHoverChange,
  size = "md",
  readonly = false,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            "transition-all duration-200 focus:outline-none rounded-full p-1",
            !readonly && "hover:scale-110 focus:ring-2 focus:ring-soft-coral focus:ring-offset-2",
          )}
          onMouseEnter={() => !readonly && onHoverChange(star)}
          onMouseLeave={() => !readonly && onHoverChange(0)}
          onClick={() => !readonly && onRatingChange(star)}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-all duration-200",
              (hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-cool-gray hover:text-amber-200",
            )}
          />
        </button>
      ))}
      {rating > 0 && <span className="ml-2 text-sm font-medium text-cool-gray">{rating}/5</span>}
    </div>
  )
}
