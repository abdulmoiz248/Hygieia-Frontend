import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type StarRatingProps = {
  rating: number
  hoverRating: number
  onRatingChange: (rating: number) => void
  onHoverChange: (rating: number) => void
}

function StarRating({ rating, onRatingChange, hoverRating, onHoverChange }: StarRatingProps) {
  const ratingLabels = ["Terrible", "Poor", "Average", "Good", "Excellent"]

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="group transition-all duration-200 hover:scale-110"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange(star)}
            onMouseLeave={() => onHoverChange(0)}
          >
            <Star
              className={cn(
                "transition-all duration-200",
                (hoverRating || rating) >= star
                  ? "fill-amber-400 text-amber-400 drop-shadow-lg"
                  : "fill-gray-200 text-gray-300 hover:fill-amber-200 hover:text-amber-200",
              )}
              size={40}
            />
          </button>
        ))}
      </div>
      {(hoverRating || rating) > 0 && (
        <div className="text-center">
          <p className="text-lg font-semibold text-soft-blue">
            {ratingLabels[(hoverRating || rating) - 1]}
          </p>
          <p className="text-sm text-cool-gray">
            {hoverRating || rating} out of 5 stars
          </p>
        </div>
      )}
    </div>
  )
}

export default StarRating
