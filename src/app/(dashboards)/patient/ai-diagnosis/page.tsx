"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  BadgeCheck,
  Camera,
  CircleCheck,
  FileImage,
  ImagePlus,
  Info,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnalysisProgressModal from "@/components/patient dashboard/ai diagnosis/AnalysisProgressModal"
import ResultsModal from "@/components/patient dashboard/ai diagnosis/ResultsModal"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
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

const ANALYSIS_TYPES = [
  {
    id: "dental" as const,
    label: "Dental Analysis",
    category: "Oral Health",
    description: "Screen dental photos for cavities, gum concerns, and visible oral health issues.",
    Icon: Stethoscope,
    accent: "text-soft-blue",
    border: "border-soft-blue",
    panel: "bg-soft-blue/6",
    iconPanel: "bg-soft-blue/10 border-soft-blue/20",
    features: ["Cavity screening", "Gum review"],
  },
  {
    id: "acne" as const,
    label: "Skin Analysis",
    category: "Dermatology",
    description: "Review skin photos for acne patterns, visible severity, and care suggestions.",
    Icon: Sparkles,
    accent: "text-mint-green",
    border: "border-mint-green",
    panel: "bg-mint-green/8",
    iconPanel: "bg-mint-green/10 border-mint-green/20",
    features: ["Acne type", "Severity guide", "Care advice"],
  },
]

const PHOTO_TIPS = [
  { Icon: Camera, label: "Use bright natural light" },
  { Icon: ScanLine, label: "Keep the subject centered" },
  { Icon: FileImage, label: "Avoid blur or heavy filters" },
  { Icon: ShieldCheck, label: "Upload only your own image" },
]

export default function AIDiagnosisPage() {
  const [selectedType, setSelectedType] = useState<AnalysisType | null>("dental")
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
    setSelectedType("dental")
    setUploadedImage(null)
    setResult(null)
    setAnalysisProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setUploadedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const canAnalyze = Boolean(selectedType && uploadedImage)

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full space-y-6"
      >
        <motion.div variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold text-soft-coral">AI Diagnosis</h1>
            <p className="mt-1 whitespace-nowrap text-sm leading-6 text-cool-gray">
              Upload a photo for quick AI guidance.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[0.78fr_1.22fr]">
          <Card className="flex h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex h-full min-h-0 w-full flex-col">
              <CardHeader className="shrink-0 border-b border-gray-100 px-5 py-3.5">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-dark-slate-gray">
                  <ScanLine className="h-5 w-5 text-soft-coral" />
                  Choose Analysis Type
                </CardTitle>
              </CardHeader>
              <CardContent className="grid flex-1 grid-rows-2 gap-3 p-4">
                {ANALYSIS_TYPES.map((type) => {
                  const selected = selectedType === type.id
                  const Icon = type.Icon

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`h-full w-full rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? `${type.border} ${type.panel} shadow-sm`
                          : "border-gray-100 bg-snow-white hover:border-soft-blue/25 hover:bg-soft-blue/5"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${type.iconPanel}`}>
                          <Icon className={`h-6 w-6 ${type.accent}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wide ${type.accent}`}>{type.category}</p>
                              <h2 className="mt-0.5 text-base font-bold text-dark-slate-gray">{type.label}</h2>
                            </div>
                            <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              selected ? `${type.border} bg-white` : "border-gray-200 bg-white"
                            }`}>
                              {selected && <CircleCheck className={`h-4 w-4 ${type.accent}`} />}
                            </div>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-cool-gray">{type.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {type.features.map((feature) => (
                              <span
                                key={feature}
                                className="rounded-full border border-gray-100 bg-white px-2.5 py-1 text-xs font-medium text-dark-slate-gray/70"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </div>
          </Card>

          <Card className="flex h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex min-h-0 w-full flex-col">
              <CardHeader className="shrink-0 border-b border-gray-100 px-5 py-3.5">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-dark-slate-gray">
                  <Upload className="h-5 w-5 text-soft-coral" />
                  Upload Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="grid flex-1 items-stretch gap-5 p-4 lg:grid-cols-[minmax(0,1.45fr)_240px]">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex h-full min-h-[360px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                    uploadedImage
                      ? "border-soft-blue/40 bg-soft-blue/5"
                      : "border-gray-200 bg-snow-white hover:border-soft-blue/40 hover:bg-soft-blue/5"
                  }`}
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
                      <img src={uploadedImage} alt="Uploaded for AI diagnosis" className="h-full max-h-[460px] w-full object-contain" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-dark-slate-gray shadow-sm transition-colors hover:bg-gray-50"
                        aria-label="Remove uploaded image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex max-w-sm flex-col items-center px-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-soft-blue/15 bg-soft-blue/8">
                        <ImagePlus className="h-8 w-8 text-soft-blue" />
                      </div>
                      <h2 className="mt-4 text-lg font-bold text-dark-slate-gray">Drop in a clear photo</h2>
                      <p className="mt-2 text-sm leading-relaxed text-cool-gray">
                        Upload a JPG, PNG, or WEBP image. Clear, close-up photos produce better guidance.
                      </p>
                      <span className="mt-4 rounded-full bg-soft-blue px-4 py-2 text-sm font-semibold text-white">
                        Select Image
                      </span>
                    </div>
                  )}
                </div>

                <aside className="grid h-full min-h-[360px] grid-rows-[1fr_auto_auto] gap-4">
                  <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-snow-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-cool-gray/70">Photo Checklist</p>
                    <div className="mt-3 grid content-start gap-3">
                      {PHOTO_TIPS.map(({ Icon, label }) => (
                        <div key={label} className="flex items-center gap-3 text-sm text-dark-slate-gray">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-green/10">
                            <Icon className="h-4 w-4 text-mint-green" />
                          </div>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <p className="text-xs leading-relaxed text-amber-800">
                        AI diagnosis is informational only. It should support, not replace, care from a qualified clinician.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all ${
                      canAnalyze
                        ? "bg-soft-blue text-white shadow-sm hover:bg-soft-blue/90 hover:shadow-md"
                        : "cursor-not-allowed bg-gray-100 text-cool-gray/50"
                    }`}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {canAnalyze ? "Analyze Photo" : "Choose type and photo"}
                  </button>
                </aside>
              </CardContent>
            </div>
          </Card>
        </motion.div>
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
