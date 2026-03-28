"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  CheckCircle2, Trash2, ArrowLeft, Star, StarOff,
  Clock, Tag, BookOpen, ShieldCheck,
  Loader2, XCircle, AlertTriangle, Calendar,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  authorRole: string
  authorId: string
  category: string
  tags: string[]
  thumbnailGradient: string
  readTime: number
  createdAt: string
  isVerified: boolean
  isFeatured: boolean
}

// ─── Mock Data — keep in sync with the review page (or pull from a shared lib) ─

const MOCK_POSTS: BlogPost[] = [
  {
    id: "bp1",
    title: "Why Intermittent Fasting Works Better Than You Think",
    excerpt: "Recent clinical studies show that time-restricted eating has profound effects on metabolic health beyond simple calorie restriction. Here's what the science really says.",
    content: `Intermittent fasting (IF) has gained tremendous popularity over the past decade, but the scientific underpinnings go far deeper than most people realize. While the popular narrative focuses on weight loss, the metabolic benefits extend into cellular repair, hormonal regulation, and even cognitive function.

## The Metabolic Switch

When you fast for 12–16 hours, your body depletes its glycogen stores and begins producing ketone bodies from stored fat. This metabolic switch — from glucose-burning to fat-burning — triggers a cascade of beneficial adaptations. Insulin sensitivity improves dramatically, with some studies showing a 20–30% improvement in just 8 weeks of consistent practice.

## Autophagy: Your Body's Cleanup System

Perhaps the most fascinating benefit is autophagy — the cellular process of breaking down and recycling damaged proteins and organelles. Nobel Prize winner Yoshinori Ohsumi's work showed that fasting is one of the most potent activators of autophagy. During a 16-hour fast, autophagy rates can increase by 300%.

## Practical Implementation

For patients I see with type 2 diabetes risk factors, I typically recommend a 14:10 protocol (14 hours fasting, 10 hours eating window) as a starting point. This is achievable without drastically altering lifestyle — simply finishing dinner by 7 PM and having breakfast at 9 AM covers the window.

## Who Should Be Cautious

Intermittent fasting is not appropriate for everyone. Pregnant women, children, those with a history of eating disorders, and individuals on certain medications should consult their physician before starting any fasting protocol.

The evidence is clear: when implemented correctly and for the right patients, intermittent fasting is one of the most powerful metabolic interventions available without a prescription.`,
    author: "Dr. Ahmed Raza",
    authorRole: "Cardiologist",
    authorId: "d2",
    category: "Nutrition",
    tags: ["fasting", "metabolism", "weight loss", "diabetes"],
    thumbnailGradient: "linear-gradient(135deg, var(--color-soft-blue), oklch(0.45 0.18 230))",
    readTime: 6,
    createdAt: "2026-03-26T10:00:00Z",
    isVerified: false,
    isFeatured: false,
  },
  {
    id: "bp2",
    title: "Understanding Your Blood Panel: What Every Number Means",
    excerpt: "Your CBC and metabolic panel contain a wealth of information about your health. A pathologist breaks down what each value means in plain language.",
    content: `Every year, millions of patients receive blood test results they don't fully understand. The numbers come back, and unless something is flagged in red, most people assume they're fine. But there's a wealth of nuance in those values that can reveal early warning signs years before a disease becomes symptomatic.

## The Complete Blood Count (CBC)

The CBC is the most commonly ordered blood test. It measures the cellular components of your blood — red cells, white cells, and platelets.

**Red Blood Cells (RBC) & Hemoglobin**: Low hemoglobin indicates anemia, which can stem from iron deficiency, B12 deficiency, chronic disease, or bone marrow issues. The MCV (mean corpuscular volume) tells us the size of red cells — small cells suggest iron deficiency while large cells point toward B12 or folate deficiency.

**White Blood Cells (WBC)**: Elevated WBC often indicates infection or inflammation. A differential count breaks this down further — elevated neutrophils suggest bacterial infection, while elevated lymphocytes point to viral infection.

**Platelets**: Both high and low platelet counts carry significance. Thrombocytopenia (low platelets) can cause bleeding risk, while thrombocytosis may indicate reactive inflammation.

## The Comprehensive Metabolic Panel (CMP)

The CMP covers kidney function, liver function, electrolytes, and blood sugar.

**Creatinine & BUN**: These are the primary markers of kidney function. Elevated values suggest the kidneys aren't filtering effectively.

**Liver Enzymes (ALT, AST, ALP)**: Mild elevations are common and often benign, but persistent or significant elevation warrants investigation.

## The Lipid Panel

Total cholesterol alone tells us relatively little. The ratio of LDL to HDL, and increasingly, non-HDL cholesterol and apolipoprotein B, give us a much more accurate picture of cardiovascular risk.

Understanding your numbers empowers you to have more productive conversations with your doctor and catch problems early.`,
    author: "Dr. Nadia Hussain",
    authorRole: "Histopathologist",
    authorId: "p2",
    category: "Diagnostics",
    tags: ["blood test", "pathology", "health monitoring", "CBC"],
    thumbnailGradient: "linear-gradient(135deg, var(--color-soft-coral), oklch(0.55 0.28 15))",
    readTime: 8,
    createdAt: "2026-03-24T14:30:00Z",
    isVerified: false,
    isFeatured: false,
  },
  {
    id: "bp3",
    title: "The Anti-Inflammatory Diet: Food as Medicine",
    excerpt: "Chronic inflammation underlies most modern diseases. A certified dietitian's guide to eating patterns that actively calm systemic inflammation.",
    content: `Inflammation is not inherently bad — it's the body's natural response to injury and infection. The problem arises when inflammation becomes chronic, simmering quietly for months or years, contributing to heart disease, type 2 diabetes, autoimmune conditions, and even depression.

## What Drives Chronic Inflammation?

The modern diet is a major contributor. Ultra-processed foods, refined carbohydrates, industrial seed oils high in omega-6 fatty acids, and excess added sugar all promote pro-inflammatory signaling.

## The Core Anti-Inflammatory Foods

**Fatty Fish**: Salmon, mackerel, sardines, and herring are rich in EPA and DHA — the omega-3 fatty acids with the most potent anti-inflammatory effects. Aim for 2–3 servings per week.

**Extra Virgin Olive Oil**: Contains oleocanthal, a compound with anti-inflammatory effects comparable to ibuprofen.

**Leafy Greens & Cruciferous Vegetables**: Spinach, kale, broccoli, and Brussels sprouts provide magnesium, folate, and sulforaphane.

**Berries**: Blueberries, strawberries, and tart cherries contain anthocyanins that reduce inflammatory signaling.

**Turmeric & Ginger**: Curcumin in turmeric inhibits multiple inflammatory mediators. Combine with black pepper to increase bioavailability by 2000%.

## Foods to Minimize

Refined carbohydrates, sugary beverages, processed meats, and vegetable oils high in omega-6 should be minimized or eliminated.

Making these changes can show measurable reductions in CRP (C-reactive protein, a key inflammatory marker) within as little as 4–6 weeks.`,
    author: "Ayesha Malik",
    authorRole: "Clinical Dietitian",
    authorId: "n1",
    category: "Nutrition",
    tags: ["inflammation", "diet", "gut health", "Mediterranean"],
    thumbnailGradient: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))",
    readTime: 7,
    createdAt: "2026-03-22T09:00:00Z",
    isVerified: false,
    isFeatured: false,
  },
  {
    id: "bp4",
    title: "Heart Rate Variability: The Hidden Metric of Stress",
    excerpt: "HRV is one of the most underutilized metrics in preventive cardiology. Here's why every patient should know their baseline.",
    content: `Heart rate variability (HRV) — the variation in time between consecutive heartbeats — has emerged as one of the most sensitive biomarkers for overall health, stress resilience, and recovery capacity.

## What HRV Actually Measures

A healthy heart is not a metronome. The time interval between beats fluctuates constantly in response to breathing, movement, stress, and autonomic nervous system tone. High HRV indicates strong parasympathetic tone — the body is resilient and adaptable. Low HRV suggests sympathetic dominance — the system is under chronic stress.

## HRV as a Predictor of Health

Low HRV has been independently associated with increased risk of cardiovascular events, all-cause mortality, depression, anxiety, and poor immune function.

## How to Improve Your HRV

**Breathing practices**: Slow, diaphragmatic breathing at 5–6 breaths per minute acutely and chronically improves HRV. Just 20 minutes daily can show measurable improvements within 4 weeks.

**Exercise**: Aerobic exercise is one of the most effective long-term HRV improvers, though intense exercise acutely suppresses HRV for 24–48 hours.

**Sleep**: HRV is heavily influenced by sleep quality. Even one night of poor sleep can drop HRV by 10–20%.

**Cold exposure**: Brief cold showers activate the vagus nerve and improve parasympathetic tone.

## Tracking Your Baseline

I recommend patients track HRV first thing in the morning, before getting out of bed, over a period of 2–4 weeks to establish their personal baseline. Single-day readings are meaningless — it's the trend that matters.`,
    author: "Dr. Ahmed Raza",
    authorRole: "Cardiologist",
    authorId: "d2",
    category: "Cardiology",
    tags: ["HRV", "heart health", "stress", "biometrics"],
    thumbnailGradient: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.45 0.18 230))",
    readTime: 9,
    createdAt: "2026-03-20T11:00:00Z",
    isVerified: false,
    isFeatured: false,
  },
  {
    id: "bp5",
    title: "Sports Nutrition for Non-Athletes: Peak Performance Every Day",
    excerpt: "The principles elite athletes use to optimize performance and recovery are equally powerful for busy professionals and parents.",
    content: `You don't need to be a professional athlete to benefit from sports nutrition principles. The same strategies that help elite performers train harder, recover faster, and maintain peak cognitive function are directly applicable to anyone.

## Protein: The Most Underconsumed Macronutrient

Most adults consume far less protein than is optimal for muscle maintenance and metabolic health. The current RDA of 0.8g/kg is a minimum to prevent deficiency, not a target for optimal function. For active adults, 1.6–2.2g/kg of body weight is supported by the literature.

Distribute protein evenly across meals. Three meals with 30–40g of protein each are far more effective for muscle synthesis than front-loading at dinner.

## Carbohydrate Timing

Unlike protein, carbohydrate timing has a significant impact on performance. Consuming the majority of carbohydrates around physical activity — before for fuel, after for glycogen replenishment — allows the body to use them effectively.

## The Hydration Performance Curve

Even mild dehydration (1–2% of body weight) measurably impairs cognitive performance, mood, and physical output. A simple guide: your urine should be pale yellow.

## Recovery Nutrition

The 30–60 minute post-exercise window is real. A combination of protein (20–30g) and carbohydrates (40–60g) accelerates recovery and glycogen replenishment after moderate to intense exercise.

Applying these principles doesn't require supplements or complex planning — just thoughtful attention to what, when, and how much you eat.`,
    author: "Zara Khan",
    authorRole: "Sports Nutritionist",
    authorId: "n2",
    category: "Sports & Fitness",
    tags: ["sports nutrition", "protein", "performance", "recovery"],
    thumbnailGradient: "linear-gradient(135deg, oklch(0.65 0.18 60), oklch(0.55 0.22 30))",
    readTime: 7,
    createdAt: "2026-03-19T08:00:00Z",
    isVerified: false,
    isFeatured: false,
  },
  {
    id: "bp6",
    title: "Reading a Pathology Report: A Patient's Guide",
    excerpt: "Pathology reports are written for clinicians, not patients. This guide translates the most common terminology into plain language.",
    content: `Receiving a pathology report can be an anxious experience. The language is technical, the stakes feel high, and waiting for your doctor to interpret it can feel unbearable. This guide aims to demystify the most common terminology.

## The Gross Description

This section describes what the pathologist observed with the naked eye — size, color, texture, and margins of the tissue sample.

## Microscopic Description

This is where the detailed analysis happens. The pathologist describes what the cells look like under the microscope.

**Differentiation**: Cells are described as well-differentiated (look similar to normal cells), moderately differentiated, or poorly differentiated (look very abnormal). Well-differentiated tumors generally behave less aggressively.

**Mitotic figures**: These represent cells caught in the process of dividing. High mitotic rate suggests rapid cell growth.

**Margins**: If the report says "margins are clear" or "negative margins," this means the surgeon removed tissue beyond the abnormal area. Positive margins indicate abnormal cells were found at the edge of the removed tissue.

## The Final Diagnosis

This is the most important section — the pathologist's conclusion. For biopsies, it will typically include the tissue type, whether the findings are benign or malignant, and if malignant, the grade and type.

**Benign** means non-cancerous. **Malignant** means cancerous.

## What's Next

Your pathology report is one piece of information that your clinical team integrates with your imaging, symptoms, and medical history to plan your care. If anything is unclear, always ask for a second opinion.`,
    author: "Dr. Usman Tariq",
    authorRole: "Clinical Pathologist",
    authorId: "p1",
    category: "Diagnostics",
    tags: ["pathology", "cancer screening", "patient education", "biopsy"],
    thumbnailGradient: "linear-gradient(135deg, oklch(0.55 0.18 140), oklch(0.45 0.14 160))",
    readTime: 8,
    createdAt: "2026-03-17T13:00:00Z",
    isVerified: false,
    isFeatured: false,
  },
]

const BASE_URL = "http://localhost:4000"
const ADMIN_USER_ID = "5e3dd75b-7c38-4bf9-8a76-bc45bab74d7c"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("")
}

const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  "Nutrition":        { color: "var(--color-mint-green)",  bg: "oklch(0.95 0.04 178)" },
  "Diagnostics":      { color: "var(--color-soft-coral)",  bg: "oklch(0.96 0.06 10)"  },
  "Cardiology":       { color: "var(--color-soft-blue)",   bg: "oklch(0.95 0.05 210)" },
  "Sports & Fitness": { color: "oklch(0.55 0.22 55)",      bg: "oklch(0.96 0.06 55)"  },
}

function getCategoryStyle(cat: string) {
  return CATEGORY_STYLES[cat] ?? { color: "var(--color-cool-gray)", bg: "oklch(0.93 0.02 180)" }
}

// ─── Content Renderer ─────────────────────────────────────────────────────────

function renderContent(text: string) {
  return text.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-lg font-bold text-[var(--color-dark-slate-gray)] mt-8 mb-3">
          {block.replace("## ", "")}
        </h2>
      )
    }
    const parts = block.split(/(\*\*[^*]+\*\*)/g)
    return (
      <p key={i} className="text-sm text-[var(--color-cool-gray)] leading-relaxed mt-3">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j} className="text-[var(--color-dark-slate-gray)] font-semibold">{part.replace(/\*\*/g, "")}</strong>
            : part
        )}
      </p>
    )
  })
}

// ─── Toast Banner ─────────────────────────────────────────────────────────────

function ToastBanner({ toast }: { toast: { msg: string; type: "success" | "error" } }) {
  const isSuccess = toast.type === "success"
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border"
      style={isSuccess
        ? { background: "oklch(0.95 0.04 178)", borderColor: "var(--color-mint-green)", color: "var(--color-mint-green)" }
        : { background: "oklch(0.96 0.06 10)", borderColor: "var(--color-soft-coral)", color: "var(--color-soft-coral)" }
      }>
      {isSuccess
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        : <XCircle className="w-4 h-4 flex-shrink-0" />
      }
      <p className="text-sm font-semibold">{toast.msg}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
  const [isFeatured, setIsFeatured] = useState(false)

  const post = MOCK_POSTS.find(p => p.id === id)

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleApprove = async () => {
    if (!post) return
    setActionLoading("approve")
    try {
      await fetch(`${BASE_URL}/blogPost/${post.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: ADMIN_USER_ID }),
      })
      showToast(`"${post.title}" approved and published.`, "success")
      setTimeout(() => router.push("/admin/blogs"), 1200)
    } catch {
      showToast("Failed to approve. Check your connection.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!post) return
    setActionLoading("reject")
    try {
      await fetch(`${BASE_URL}/blogPost/${post.id}`, { method: "DELETE" })
      showToast(`"${post.title}" rejected and deleted.`, "error")
      setTimeout(() => router.push("/admin/blogs"), 1200)
    } catch {
      showToast("Failed to delete. Check your connection.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleFeature = async () => {
    if (!post) return
    setActionLoading("feature")
    try {
      const endpoint = isFeatured ? "unfeature" : "feature"
      await fetch(`${BASE_URL}/blogPost/${post.id}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: ADMIN_USER_ID }),
      })
      setIsFeatured(prev => !prev)
      showToast(isFeatured ? "Removed from featured." : "Post marked as featured.", "success")
    } catch {
      showToast("Failed to update featured status.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-snow-white)]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-[var(--color-soft-coral)] opacity-50" />
          <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">Post not found</p>
          <button
            onClick={() => router.push("/blogs")}
            className="mt-4 text-xs text-[var(--color-soft-blue)] underline underline-offset-2"
          >
            Back to Blog Review
          </button>
        </div>
      </div>
    )
  }

  const catStyle = getCategoryStyle(post.category)

  return (
    <div className="min-h-screen bg-[var(--color-snow-white)]">
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-10">

        {/* ── Action bar — on the snow-white background, above the hero ── */}
        <div className="flex items-center justify-between gap-4 mb-5">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-cool-gray)] hover:text-[var(--color-dark-slate-gray)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Posts
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Feature toggle */}
            <button
              onClick={handleFeature}
              disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50"
              style={isFeatured
                ? { background: "oklch(0.96 0.06 55)", color: "oklch(0.55 0.22 55)", borderColor: "oklch(0.85 0.10 55)" }
                : { background: "white", color: "var(--color-cool-gray)", borderColor: "oklch(0.90 0.02 180)" }
              }
            >
              {actionLoading === "feature"
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : isFeatured
                  ? <><StarOff className="w-3.5 h-3.5" /> Unfeature</>
                  : <><Star className="w-3.5 h-3.5" /> Feature</>
              }
            </button>

            {/* Reject */}
            <button
              onClick={handleReject}
              disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-soft-coral)] border border-[var(--color-soft-coral)]/40 bg-[oklch(0.96_0.06_10)] hover:bg-[oklch(0.93_0.08_10)] transition-all disabled:opacity-50"
            >
              {actionLoading === "reject"
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <><Trash2 className="w-3.5 h-3.5" /> Reject & Delete</>
              }
            </button>

            {/* Approve */}
            <button
              onClick={handleApprove}
              disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md hover:scale-[1.02] transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, var(--color-mint-green), oklch(0.60 0.14 170))" }}
            >
              {actionLoading === "approve"
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <><ShieldCheck className="w-3.5 h-3.5" /> Approve & Publish</>
              }
            </button>
          </div>
        </div>

        {/* Hero thumbnail */}
        <div className="h-56 rounded-3xl overflow-hidden mb-8 relative"
          style={{ background: post.thumbnailGradient }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-white/20" />
          </div>
          <div className="absolute bottom-6 left-7">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)" }}>
              {post.category}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: catStyle.bg, color: catStyle.color }}>{post.category}</span>
          <span className="text-xs text-[var(--color-cool-gray)] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readTime} min read
          </span>
          <span className="text-xs text-[var(--color-cool-gray)] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[var(--color-dark-slate-gray)] leading-tight mb-5">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: post.thumbnailGradient }}>
            {getInitials(post.author)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-dark-slate-gray)]">{post.author}</p>
            <p className="text-xs text-[var(--color-cool-gray)]">{post.authorRole}</p>
          </div>
        </div>

        {/* Content */}
        <div>{renderContent(post.content)}</div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
          <Tag className="w-3.5 h-3.5 text-[var(--color-cool-gray)] mt-0.5" />
          {post.tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-[var(--color-cool-gray)] font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {toast && <ToastBanner toast={toast} />}
    </div>
  )
}
