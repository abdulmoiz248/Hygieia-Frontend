"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  Upload, Sparkles, Shield, Zap, Camera, X, ScanLine, Brain,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnalysisProgressModal from "@/components/patient dashboard/ai diagnosis/AnalysisProgressModal"
import ResultsModal from "@/components/patient dashboard/ai diagnosis/ResultsModal"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

type AnalysisType = "dental" | "acne"

interface DiagnosisResult {
  type: AnalysisType
  predictedClass: string
  confidence: number
  recommendation: string
  severity: "mild" | "moderate" | "severe"
  nextSteps: string[]
}

const ANALYSIS_TYPES: {
  id: AnalysisType
  emoji: string
  label: string
  category: string
  description: string
  features: { icon: string; text: string }[]
  accent: string
  accentBorder: string
  iconBg: string
  dotColor: string
  gradientFrom: string
  gradientTo: string
}[] = [
  {
    id: "dental",
    emoji: "🦷",
    label: "Dental Analysis",
    category: "Oral Health",
    description: "Detect cavities, gum disease, fractures and other dental conditions from photos.",
    features: [
      { icon: "🔍", text: "Cavity detection" },
      { icon: "🦠", text: "Gum disease screening" },
      { icon: "💥", text: "Fracture analysis" },
    ],
    accent: "text-soft-blue",
    accentBorder: "border-soft-blue",
    iconBg: "bg-soft-blue/10 border-soft-blue/20",
    dotColor: "bg-soft-blue",
    gradientFrom: "from-soft-blue/10",
    gradientTo: "to-soft-blue/5",
  },
  {
    id: "acne",
    emoji: "✨",
    label: "Skin Analysis",
    category: "Dermatology",
    description: "Identify acne type, severity and get personalised skincare recommendations.",
    features: [
      { icon: "📊", text: "Acne classification" },
      { icon: "⚡", text: "Severity grading" },
      { icon: "💆", text: "Skincare advice" },
    ],
    accent: "text-mint-green",
    accentBorder: "border-mint-green",
    iconBg: "bg-mint-green/10 border-mint-green/20",
    dotColor: "bg-mint-green",
    gradientFrom: "from-mint-green/10",
    gradientTo: "to-mint-green/5",
  },
]

export default function AIDiagnosisPage() {
  const [selectedType, setSelectedType] = useState<AnalysisType | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleAnalyze = () => {
    if (!selectedType || !uploadedImage) return
    setShowProgress(true)
    setAnalysisProgress(0)
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setShowProgress(false)
          setResult({
            type: selectedType,
            predictedClass: selectedType === "dental" ? "Dental Caries" : "Mild Acne",
            confidence: 87,
            recommendation:
              selectedType === "dental"
                ? "Early signs of cavity detected. Schedule a dental cleaning and fluoride treatment."
                : "Mild inflammatory acne present. A consistent gentle skincare routine is recommended.",
            severity: "mild",
            nextSteps:
              selectedType === "dental"
                ? ["Book a dental check-up within 2 weeks", "Use fluoride toothpaste twice daily", "Floss daily"]
                : ["Use a salicylic acid cleanser", "Apply non-comedogenic moisturiser", "Consult a dermatologist if it worsens"],
          })
          setShowResults(true)
          return 100
        }
        return prev + 2
      })
    }, 60)
  }

  const resetDiagnosis = () => {
    setSelectedType(null)
    setUploadedImage(null)
    setResult(null)
    setAnalysisProgress(0)
  }

  const canAnalyze = selectedType && uploadedImage

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 lg:space-y-8 w-full"
      >
        {/* ── Page header ── */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-soft-coral">AI Diagnosis</h1>
          <p className="text-cool-gray mt-1">
            Upload a photo and get instant AI-powered health insights in seconds.
          </p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-cool-gray">
              <Zap className="w-3.5 h-3.5 text-soft-blue" />
              <span>Fast results</span>
              <span className="font-semibold text-soft-blue">&lt; 10s</span>
            </div>
            <span className="text-cool-gray/30">·</span>
            <div className="flex items-center gap-1.5 text-xs text-cool-gray">
              <Shield className="w-3.5 h-3.5 text-mint-green" />
              <span>Secure &amp; private</span>
              <span className="font-semibold text-mint-green">100%</span>
            </div>
            <span className="text-cool-gray/30">·</span>
            <div className="flex items-center gap-1.5 text-xs text-cool-gray">
              <ScanLine className="w-3.5 h-3.5 text-soft-coral" />
              <span>AI accuracy</span>
              <span className="font-semibold text-soft-coral">High</span>
            </div>
          </div>
        </motion.div>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">

          {/* LEFT — choose analysis type */}
          <motion.div variants={itemVariants} className="flex flex-col gap-0">
            <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden flex flex-col flex-1">
              {/* card header */}
              <CardHeader className="border-b border-white/20 py-3 px-4 sm:px-5">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-medium text-dark-slate-gray/80">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-soft-coral opacity-80" />
                  Choose Analysis Type
                </CardTitle>
              </CardHeader>

              {/* ↓ pt-2 instead of p-4 to remove extra gap under header */}
              <CardContent className="px-4 sm:px-5 !pt-0 pb-4 sm:pb-5 flex flex-col gap-4 flex-1">
                {ANALYSIS_TYPES.map((t) => {
                  const isSelected = selectedType === t.id
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedType(isSelected ? null : t.id)}
                      className={`
                        relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex-1 flex flex-col
                        bg-gradient-to-br ${t.gradientFrom} ${t.gradientTo}
                        ${isSelected
                          ? `${t.accentBorder} shadow-md`
                          : "border-white/40 hover:border-cool-gray/40 hover:shadow-sm"
                        }
                      `}
                    >
                      {/* ── Radio circle — top-right, always visible ── */}
                      <div
                        className={`
                          absolute top-3.5 right-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
                          transition-all duration-200
                          ${isSelected
                            ? `${t.accentBorder} bg-soft-blue`
                            : "border-cool-gray/40 bg-white"
                          }
                          ${t.id === "acne" && isSelected ? "bg-mint-green border-mint-green" : ""}
                        `}
                      >
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* card body */}
                      <div className="flex items-start gap-3 pr-6">
                        {/* emoji icon box */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl border ${t.iconBg} shrink-0`}>
                          {t.emoji}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${t.accent}`}>
                            {t.category}
                          </span>
                          <h3 className="text-sm font-bold text-dark-slate-gray mt-0.5">{t.label}</h3>
                          <p className="text-xs text-cool-gray mt-1 leading-relaxed">{t.description}</p>
                        </div>
                      </div>

                      {/* feature chips */}
                      <div className="flex flex-wrap gap-2 mt-3 pl-14">
                        {t.features.map((f) => (
                          <span
                            key={f.text}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-dark-slate-gray/70 bg-white/60 border border-white/60 rounded-full px-2.5 py-1"
                          >
                            <span>{f.icon}</span>
                            {f.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT — upload + analyse */}
          <motion.div variants={itemVariants} className="flex flex-col gap-0">
            <Card className="bg-white/40 backdrop-blur-lg shadow-sm border border-white/20 rounded-2xl overflow-hidden flex flex-col flex-1">
              <CardHeader className="border-b border-white/20 py-3 px-4 sm:px-5">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-medium text-dark-slate-gray/80">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-soft-coral opacity-80" />
                  Upload Photo
                </CardTitle>
              </CardHeader>

              {/* ↓ pt-2 instead of pt-4 to remove extra gap under header */}
              <CardContent className="px-4 sm:px-5 !pt-0 pb-4 sm:pb-5 flex flex-col gap-4 flex-1">

                {/* upload dropzone — flex-1 so it fills space */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative rounded-xl border-2 border-dashed transition-all duration-200
                    cursor-pointer group overflow-hidden flex-1 flex items-center justify-center
                    ${uploadedImage
                      ? "border-soft-blue/40 bg-soft-blue/5"
                      : "border-cool-gray/30 bg-white/30 hover:border-soft-blue/40 hover:bg-soft-blue/5"
                    }
                  `}
                  style={{ minHeight: 220 }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  {uploadedImage ? (
                    <>
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-full object-cover rounded-xl"
                        style={{ maxHeight: 280 }}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); setUploadedImage(null) }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4 text-dark-slate-gray" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-soft-blue/10 border border-soft-blue/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6 text-soft-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark-slate-gray">Click to upload a photo</p>
                        <p className="text-xs text-cool-gray mt-1">PNG, JPG or WEBP · Max 10 MB</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-cool-gray/50">
                        <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> Camera photo</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Upload className="w-3 h-3" /> File upload</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* photo tips grid — always shown, compact */}
                <div className="rounded-xl border border-white/40 bg-cool-gray/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cool-gray/60 mb-2">Photo Tips</p>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                    {[
                      { icon: "💡", tip: "Good lighting" },
                      { icon: "📐", tip: "Clear focus" },
                      { icon: "🔍", tip: "Close-up shot" },
                      { icon: "🎯", tip: "Centred subject" },
                    ].map((tip) => (
                      <div key={tip.tip} className="flex items-center gap-1.5 text-xs text-cool-gray">
                        <span>{tip.icon}</span>
                        <span>{tip.tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* analyse button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm
                    transition-all duration-200
                    ${canAnalyze
                      ? "bg-soft-blue hover:bg-soft-blue/90 text-white shadow-sm hover:shadow-md"
                      : "bg-cool-gray/15 text-cool-gray/40 cursor-not-allowed"
                    }
                  `}
                >
                  <Sparkles className="w-4 h-4" />
                  {canAnalyze ? "Analyse Now" : "Select a type and upload a photo"}
                </button>

                {/* disclaimer */}
                <div className="rounded-xl border border-amber-200/60 bg-amber-50/80 p-3">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Disclaimer:</strong> AI results are for informational purposes only and do not replace professional medical advice. Always consult a qualified healthcare provider.
                  </p>
                </div>

              </CardContent>
            </Card>
          </motion.div>

        </div>
      </motion.div>

      <AnalysisProgressModal
        open={showProgress}
        selectedType={selectedType}
        analysisProgress={analysisProgress}
      />
      <ResultsModal
        open={showResults}
        onOpenChange={setShowResults}
        result={result}
        resetDiagnosis={resetDiagnosis}
      />
    </>
  )
}