import { useMemo } from "react"
import { useBlogPosts }       from "@/hooks/admin/blogs/useBlogPosts"
import { useCVs }             from "@/hooks/admin/cv/useCVs"
import { useSentNewsletters } from "@/hooks/admin/newsletters/useSentNewsletters"
import { useDoctors }         from "@/hooks/admin/workers/useDoctors"
import { useNutritionists }   from "@/hooks/admin/workers/useNutritionists"
import { usePathologists }    from "@/hooks/admin/workers/usePathologists"
import { useFetchFaqs }       from "@/hooks/admin/faq/useFetchFaqs"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityType =
  | "blog_submitted"
  | "blog_verified"
  | "cv_submitted"
  | "user_registered"
  | "newsletter_sent"
  | "blog_newsletter_sent"
  | "worker_registered"
  | "faq_added"
  | "announcement_sent"

export interface ActivityItem {
  id:        string
  type:      ActivityType
  label:     string
  sub:       string
  timestamp: Date
  icon:      string
  color:     string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(date: Date): string {
  const now  = Date.now()
  const diff = now - date.getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)

  if (mins  < 1)   return "just now"
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days  === 1) return "yesterday"
  return `${days}d ago`
}

/**
 * Safely parse a timestamp string into a Date.
 * Returns null if the value is falsy or results in an invalid date —
 * so callers can decide to skip the item rather than show "just now".
 */
function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRecentActivity() {
  const { data: blogPosts,     isLoading: loadingBlogs }         = useBlogPosts()
  const { data: cvs,           isLoading: loadingCVs }           = useCVs()
  const { data: newsletters,   isLoading: loadingNewsletters }   = useSentNewsletters()
  const { data: doctors,       isLoading: loadingDoctors }       = useDoctors()
  const { data: nutritionists, isLoading: loadingNutritionists } = useNutritionists()
  const { data: pathologists,  isLoading: loadingPathologists }  = usePathologists()
  const { data: faqs,          isLoading: loadingFaqs }          = useFetchFaqs()

  const isLoading =
    loadingBlogs || loadingCVs || loadingNewsletters ||
    loadingDoctors || loadingNutritionists || loadingPathologists || loadingFaqs

  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = []

    // ── Blog posts ──────────────────────────────────────────────────────────
    ;(blogPosts ?? []).forEach((post) => {
      const createdAt = parseDate(post.createdAt) ?? new Date()

      items.push({
        id:        `blog-submitted-${post.id}`,
        type:      "blog_submitted",
        label:     "Blog post submitted",
        sub:       post.title ?? "Untitled",
        timestamp: createdAt,
        icon:      "FileText",
        color:     "text-soft-coral",
      })

      if (post.isVerified) {
        const rawPost = post as any
        const verifiedAt = parseDate(rawPost.updatedAt ?? rawPost.verifiedAt ?? rawPost.updated_at)
        items.push({
          id:        `blog-verified-${post.id}`,
          type:      "blog_verified",
          label:     "Blog post verified",
          sub:       post.title ?? "Untitled",
          timestamp: verifiedAt ?? createdAt,
          icon:      "CheckCircle2",
          color:     "text-mint-green",
        })
      }
    })

    // ── CVs ─────────────────────────────────────────────────────────────────
    ;(cvs ?? []).forEach((cv: any) => {
      const timestamp = parseDate(cv.createdAt ?? cv.submittedAt ?? cv.created_at) ?? new Date()
      items.push({
        id:        `cv-${cv.id ?? cv._id}`,
        type:      "cv_submitted",
        label:     "CV submitted for review",
        sub:       cv.name ?? cv.applicantName ?? cv.email ?? "",
        timestamp,
        icon:      "FileUser",
        color:     "text-soft-blue",
      })
    })

    // ── Newsletters ─────────────────────────────────────────────────────────
    ;(newsletters?.items ?? []).forEach((nl) => {
      const isBlog = nl.type === "blogpost"
      items.push({
        id:        `newsletter-${nl.id}`,
        type:      isBlog ? "blog_newsletter_sent" : "newsletter_sent",
        label:     isBlog ? "Blog newsletter sent" : "Newsletter sent",
        sub:       nl.subject,
        timestamp: new Date(nl.created_at),
        icon:      "Mail",
        color:     "text-soft-blue",
      })
    })

    // ── Workers ─────────────────────────────────────────────────────────────
    const allWorkers = [
      ...(doctors       ?? []).map((w: any) => ({ ...w, _role: "Doctor" })),
      ...(nutritionists ?? []).map((w: any) => ({ ...w, _role: "Nutritionist" })),
      ...(pathologists  ?? []).map((w: any) => ({ ...w, _role: "Pathologist" })),
    ]

    allWorkers.forEach((w: any) => {
      // Check both camelCase (mapped) and snake_case (raw) — order matters:
      // mapLabTechnician writes created_at → camelCase createdAt, so w.createdAt
      // is the primary. w.created_at is a safety net for any unmapped shape.
      const timestamp = parseDate(w.createdAt ?? w.created_at)

      // Skip workers with no parseable date rather than showing "just now"
      if (!timestamp) return

      items.push({
        id:        `worker-${w._id ?? w.id}`,
        type:      "worker_registered",
        label:     `${w._role} registered`,
        sub:       w.name ?? w.email ?? "",
        timestamp,
        icon:      "UserPlus",
        color:     "text-mint-green",
      })
    })

    // ── FAQs ────────────────────────────────────────────────────────────────
    ;(faqs ?? []).forEach((faq: any) => {
      const timestamp = parseDate(faq.createdAt ?? faq.created_at) ?? new Date()
      items.push({
        id:        `faq-${faq.id ?? faq._id}`,
        type:      "faq_added",
        label:     "FAQ added",
        sub:       faq.question ?? "",
        timestamp,
        icon:      "HelpCircle",
        color:     "text-soft-coral",
      })
    })

    // Sort newest first, filter to last 30 days, cap at 25
    const CUTOFF = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return items
      .filter((item) => item.timestamp >= CUTOFF)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 25)
  }, [blogPosts, cvs, newsletters, doctors, nutritionists, pathologists, faqs])

  return {
    isLoading,
    activities,
    recent:   activities.slice(0, 3),
    overflow: activities.slice(3),
    relativeTime,
  }
}
