import { motion } from "framer-motion"
import { Calendar, Clock, Tag } from "lucide-react"
import { BlogPostDetail, getThemeGradient, getInitials, formatDate } from "@/lib/admin/blog-helpers"

interface BlogDetailMetaProps {
  post: BlogPostDetail
}

export function BlogDetailMeta({ post }: BlogDetailMetaProps) {
  const gradient = getThemeGradient(post.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="space-y-4"
    >
      {/* Title */}
      <h1 className="text-2xl font-bold text-[var(--color-dark-slate-gray)] leading-snug">
        {post.title}
      </h1>

      {/* Author + Date + Read time */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: gradient }}
          >
            {getInitials(post.author)}
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--color-dark-slate-gray)]">{post.author}</p>
            {post.authorRole && (
              <p className="text-[10px] text-[var(--color-cool-gray)]">{post.authorRole}</p>
            )}
          </div>
        </div>

        <span className="w-px h-4 bg-gray-200" />

        <span className="text-xs text-[var(--color-cool-gray)] flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />{formatDate(post.createdAt, "long")}
        </span>

        {post.readTime > 0 && (
          <>
            <span className="w-px h-4 bg-gray-200" />
            <span className="text-xs text-[var(--color-cool-gray)] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{post.readTime} min read
            </span>
          </>
        )}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <Tag className="w-3.5 h-3.5 text-[var(--color-cool-gray)]" />
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: "oklch(0.95 0.03 210)", color: "var(--color-soft-blue)" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p
          className="text-sm leading-relaxed italic border-l-2 pl-4"
          style={{ color: "var(--color-cool-gray)", borderColor: "var(--color-soft-blue)" }}
        >
          {post.excerpt}
        </p>
      )}
    </motion.div>
  )
}
