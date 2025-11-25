import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/types/blog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, ArrowRight, Calendar } from "lucide-react"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical-research":
        return "bg-soft-blue/10 text-soft-blue border-soft-blue/20"
      case "nutrition":
        return "bg-soft-coral/10 text-soft-coral border-soft-coral/20"
      case "lab-technology":
        return "bg-mint-green/10 text-mint-green border-mint-green/20"
      default:
        return "bg-cool-gray/10 text-cool-gray border-cool-gray/20"
    }
  }

  const getCategoryAccent = (category: string) => {
    switch (category) {
      case "medical-research":
        return "bg-soft-blue"
      case "nutrition":
        return "bg-soft-coral"
      case "lab-technology":
        return "bg-mint-green"
      default:
        return "bg-cool-gray"
    }
  }

  return (
    <Link href={`/blogs/${post.id}`} className="block h-full">
      <Card className="group h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white border border-gray-100 overflow-hidden">
        {/* Image Container - Fixed Height */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60"></div>
          
          {/* Category Badge on Image */}
          <div className="absolute top-4 left-4 z-10">
            <Badge
              variant="outline"
              className={`${getCategoryColor(post.category)} border backdrop-blur-md font-semibold text-xs px-3 py-1`}
            >
              {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          </div>

          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg font-semibold">
                ⭐ Featured
              </Badge>
            </div>
          )}

          {/* Color Accent Line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${getCategoryAccent(post.category)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
        </div>

        {/* Content Container - Flex Grow */}
        <CardContent className="flex flex-col flex-grow p-6">
          {/* Title - Fixed Height with Line Clamp */}
          <h3 className="font-bold text-dark-slate-gray text-xl leading-tight mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-soft-blue transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt - Fixed Height with Line Clamp */}
          <p className="text-cool-gray text-sm leading-relaxed mb-4 line-clamp-3 min-h-[4.5rem]">
            {post.excerpt}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-4"></div>

          {/* Meta Information - Push to Bottom */}
          <div className="mt-auto space-y-3">
            {/* Author & Date Row */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soft-blue/20 to-mint-green/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-soft-blue" />
                </div>
                <span className="font-medium text-dark-slate-gray truncate max-w-[120px]">
                  {post.author ?? "Anonymous"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-cool-gray flex-shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.publishedat} className="text-xs">
                  {new Date(post.publishedat).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </time>
              </div>
            </div>

            {/* Read More Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-cool-gray text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{post.readTime} min read</span>
              </div>

              <div className="flex items-center gap-1 text-soft-blue font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                <span>Read More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
