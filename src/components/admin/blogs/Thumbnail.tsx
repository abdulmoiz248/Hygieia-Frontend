import { BookOpen, Star, AlertTriangle, CheckCircle2 } from "lucide-react"
import { BlogPost, getThemeGradient } from "@/lib/admin/blog-helpers"

interface ThumbnailProps {
  post: BlogPost
}

export function Thumbnail({ post }: ThumbnailProps) {
  const gradient = getThemeGradient(post.id)
  const hasImg   = !!post.image

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "9rem" }}>

      {/* Background: image or gradient */}
      {hasImg ? (
        <>
          <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: gradient }}
        >
          <BookOpen className="w-10 h-10 text-white/25" />
        </div>
      )}

      {/* Featured badge */}
      {post.isFeatured && (
        <div
          className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(4px)" }}
        >
          <Star className="w-2.5 h-2.5 fill-white flex-shrink-0" /> Featured
        </div>
      )}

      {/* Verification status badge */}
      <div
        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
        style={{ background: "rgba(255,255,255,0.18)", color: "white", backdropFilter: "blur(6px)" }}
      >
        {!post.isVerified
          ? <><AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" /> Pending</>
          : <><CheckCircle2  className="w-2.5 h-2.5 flex-shrink-0" /> Published</>}
      </div>

      {/* Category badge */}
      <div className="absolute bottom-2.5 left-2.5 z-10">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(4px)" }}
        >
          {post.category}
        </span>
      </div>

    </div>
  )
}
