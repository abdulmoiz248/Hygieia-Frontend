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
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: gradient }}
          />
          {/* Subtle bottom fade so bottom badges stay readable on gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <BookOpen className="w-10 h-10 text-white/20" />
          </div>
        </>
      )}

      {/* ── Top-left: Featured badge (published posts only) ── */}
      {post.isFeatured && (
        <div
          className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            background:     "rgba(180,130,0,0.78)",
            color:          "#fff",
            backdropFilter: "blur(6px)",
            border:         "0.5px solid rgba(255,200,50,0.35)",
          }}
        >
          <Star className="w-2.5 h-2.5 fill-white flex-shrink-0" />
          Featured
        </div>
      )}

      {/* ── Top-right: Verification / publish status ── */}
      <div
        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
        style={
          post.isVerified
            ? {
                background:     "rgba(22,163,74,0.75)",
                color:          "#fff",
                backdropFilter: "blur(6px)",
                border:         "0.5px solid rgba(100,220,140,0.35)",
              }
            : {
                background:     "rgba(234,88,12,0.82)",
                color:          "#fff",
                backdropFilter: "blur(6px)",
                border:         "0.5px solid rgba(255,150,80,0.35)",
              }
        }
      >
        {post.isVerified
          ? <><CheckCircle2  className="w-2.5 h-2.5 flex-shrink-0" /> Published</>
          : <><AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" /> Pending</>}
      </div>

      {/* ── Bottom-left: Category ── */}
      {post.category && (
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background:     "rgba(255,255,255,0.18)",
              color:          "#fff",
              backdropFilter: "blur(5px)",
              border:         "0.5px solid rgba(255,255,255,0.28)",
            }}
          >
            {post.category}
          </span>
        </div>
      )}
    </div>
  )
}
