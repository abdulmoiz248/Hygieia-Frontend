import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/types/blog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, ArrowUpRight, Heart, BookOpen } from "lucide-react"

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical-research":
        return "bg-gradient-to-r from-soft-blue/20 to-soft-blue/10 text-soft-blue border-soft-blue/30"
      case "nutrition":
        return "bg-gradient-to-r from-soft-coral/20 to-soft-coral/10 text-soft-coral border-soft-coral/30"
      case "lab-technology":
        return "bg-gradient-to-r from-mint-green/20 to-mint-green/10 text-mint-green border-mint-green/30"
      default:
        return "bg-gradient-to-r from-cool-gray/20 to-cool-gray/10 text-cool-gray border-cool-gray/30"
    }
  }

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "medical-research":
        return "from-soft-blue/10 to-transparent"
      case "nutrition":
        return "from-soft-coral/10 to-transparent"
      case "lab-technology":
        return "from-mint-green/10 to-transparent"
      default:
        return "from-cool-gray/10 to-transparent"
    }
  }

  return (
    <Link href={`/blogs/${post.id}`}>
      <Card
        className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden ${
          featured ? "md:col-span-2 lg:col-span-2" : ""
        }`}
      >
        {/* Background Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(post.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        ></div>

        <div className="relative">
          <div className="relative overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              width={featured ? 800 : 400}
              height={featured ? 400 : 250}
              className={`w-full object-cover transition-all duration-700 group-hover:scale-110 ${
                featured ? "h-56 md:h-72" : "h-48 md:h-56"
              }`}
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Floating Action Button */}
            <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowUpRight className="w-5 h-5 text-dark-slate-gray" />
            </div>

            {/* Featured Badge */}
            {post.featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-soft-coral to-soft-coral/80 text-snow-white border-0 shadow-lg">
                  ⭐ Featured
                </Badge>
              </div>
            )}
          </div>

          <CardHeader className="pb-3 relative">
            <div className="flex items-center justify-between my-3">
              <Badge
                variant="outline"
                className={`${getCategoryColor(post.category)} border backdrop-blur-sm font-medium`}
              >
                {post.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Heart className="w-4 h-4 text-soft-coral" />
                <BookOpen className="w-4 h-4 text-soft-blue" />
              </div>
            </div>

            <h3
              className={`font-bold text-dark-slate-gray group-hover:text-soft-blue transition-colors duration-300 leading-tight ${
                featured ? "text-xl md:text-3xl" : "text-lg md:text-xl"
              }`}
            >
              {post.title}
            </h3>
          </CardHeader>

          <CardContent className="relative">
            <p className="text-cool-gray mb-6 line-clamp-2 leading-relaxed group-hover:text-dark-slate-gray/80 transition-colors duration-300">
              {post.excerpt}
            </p>

            {/* Enhanced Meta Information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-soft-blue/20 to-mint-green/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-soft-blue" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-dark-slate-gray">{post.author.name}</span>
                    <p className="text-xs text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}m</span>
                </div>
                <time dateTime={post.publishedAt} className="text-xs">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
