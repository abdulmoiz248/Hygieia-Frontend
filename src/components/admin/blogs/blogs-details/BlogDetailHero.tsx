import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { BlogPostDetail, getThemeGradient } from "@/lib/admin/blog-helpers"

interface BlogDetailHeroProps {
  post: BlogPostDetail
}

export function BlogDetailHero({ post }: BlogDetailHeroProps) {
  const gradient = getThemeGradient(post.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full"
      style={{ height: "260px" }}
    >
      {post.image ? (
        <>
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: gradient }}
        >
          <BookOpen className="w-16 h-16 text-white/20" />
        </div>
      )}

      {/* Category badge */}
      <div className="absolute bottom-4 left-4 z-10">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(6px)" }}
        >
          {post.category}
        </span>
      </div>
    </motion.div>
  )
}
