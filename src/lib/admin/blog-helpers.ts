// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  authorId: string
  category: string
  tags: string[]
  readTime: number
  createdAt: string
  isVerified: boolean
  isFeatured: boolean
  image?: string
}

/** Extended type for the detail page — adds content/body */
export interface BlogPostDetail extends BlogPost {
  content: string
}

export interface RawBlogPost {
  id: string
  title?: string
  content?: string
  body?: string
  excerpt?: string
  author?: string
  authorRole?: string
  doctorId?: string
  category?: string
  tags?: string[]
  readTime?: number
  publishedat?: string
  createdAt?: string
  verified?: boolean
  isVerified?: boolean
  isverified?: boolean
  status?: string
  featured?: boolean
  isFeatured?: boolean
  image?: string
}

export type ViewMode = "grid" | "list"
export type Tab      = "all" | "pending" | "published"

// ─── Constants ────────────────────────────────────────────────────────────────

export const BASE_URL = "http://localhost:4000"

export const THEME_GRADIENTS = [
  "linear-gradient(135deg, var(--color-soft-blue) 0%, oklch(0.52 0.16 220) 100%)",
  "linear-gradient(135deg, var(--color-soft-coral) 0%, oklch(0.52 0.22 10) 100%)",
  "linear-gradient(135deg, var(--color-mint-green) 0%, oklch(0.52 0.14 165) 100%)",
  "linear-gradient(135deg, oklch(0.58 0.18 255) 0%, oklch(0.48 0.16 235) 100%)",
  "linear-gradient(135deg, oklch(0.60 0.16 195) 0%, oklch(0.50 0.18 215) 100%)",
  "linear-gradient(135deg, oklch(0.56 0.14 155) 0%, oklch(0.46 0.12 170) 100%)",
]

export const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  "Nutrition":        { color: "var(--color-mint-green)",  bg: "oklch(0.95 0.04 178)" },
  "Diagnostics":      { color: "var(--color-soft-coral)",  bg: "oklch(0.96 0.06 10)"  },
  "Cardiology":       { color: "var(--color-soft-blue)",   bg: "oklch(0.95 0.05 210)" },
  "Sports & Fitness": { color: "oklch(0.55 0.22 55)",      bg: "oklch(0.96 0.06 55)"  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getThemeGradient(id: string): string {
  const idx = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % THEME_GRADIENTS.length
  return THEME_GRADIENTS[idx]
}

export function getCategoryStyle(cat: string): { color: string; bg: string } {
  return CATEGORY_STYLES[cat] ?? { color: "var(--color-cool-gray)", bg: "oklch(0.93 0.02 180)" }
}

export function formatDate(iso: string, style: "short" | "long" = "short"): string {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  })
}

export function getInitials(name: string): string {
  return (name ?? "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
}

export function normalizePost(raw: RawBlogPost): BlogPost {
  const isVerified = Boolean(
    raw.isVerified ??
    raw.verified ??
    raw.isverified ??
    (raw.status === "verified" || raw.status === "published") ??
    false
  )
  return {
    id:         raw.id,
    title:      raw.title      ?? "Untitled",
    excerpt:    raw.excerpt    ?? "",
    author:     raw.author     ?? "Unknown Author",
    authorRole: raw.authorRole ?? "",
    authorId:   raw.doctorId   ?? "",
    category:   raw.category   ?? "General",
    tags:       raw.tags       ?? [],
    readTime:   raw.readTime   ?? 0,
    createdAt:  raw.publishedat ?? raw.createdAt ?? new Date().toISOString(),
    isVerified,
    isFeatured: raw.isFeatured ?? raw.featured ?? false,
    image:      raw.image,
  }
}

export function normalizeDetailPost(raw: RawBlogPost): BlogPostDetail {
  return {
    ...normalizePost(raw),
    content: raw.content ?? raw.body ?? "",
  }
}
