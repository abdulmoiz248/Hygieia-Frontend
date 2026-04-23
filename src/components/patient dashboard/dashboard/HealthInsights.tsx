"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { Award, Dumbbell, FlaskConical, HeartPulse, Lightbulb, Moon, Pill, RefreshCw, Stethoscope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { usePatientProfileStore } from "@/store/patient/profile-store"
import {
  getLatestPatientRecommendations,
  predictModel,
  refreshPatientRecommendations,
  type ModelType,
  type PatientRecommendation,
  type PredictionData,
} from "@/api/patient/recommendationsApi"

import { Variants } from "framer-motion"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, ease: "easeOut" },
  }),
}


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}


const MAX_RECOMMENDATIONS = 3

const getStoredPatientId = () =>
  typeof window !== "undefined" ? localStorage.getItem("id") || "" : ""

export default function HealthInsights() {
  const profileId = usePatientProfileStore((state) => state.profile.id)
  const { toast } = useToast()
  const [recommendations, setRecommendations] = useState<PatientRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictionType, setPredictionType] = useState<ModelType>("acne")
  const [predictionFile, setPredictionFile] = useState<File | null>(null)
  const [predictionResult, setPredictionResult] = useState<PredictionData | null>(null)
  const [predictionError, setPredictionError] = useState<string | null>(null)
  const [predicting, setPredicting] = useState(false)
  const [modelWarmingUp, setModelWarmingUp] = useState(false)
  const predictionResultRef = useRef<HTMLDivElement | null>(null)

  const patientId = profileId || getStoredPatientId()

  const visibleRecommendations = useMemo(
    () => recommendations.slice(0, MAX_RECOMMENDATIONS),
    [recommendations]
  )

  const probabilityEntries = useMemo(() => {
    if (!predictionResult?.probabilities) {
      return []
    }

    return Object.entries(predictionResult.probabilities).sort((a, b) => b[1] - a[1])
  }, [predictionResult])

  const detectedDisease = useMemo(() => {
    if (predictionResult?.predicted_class) {
      return predictionResult.predicted_class
    }

    if (probabilityEntries.length > 0) {
      return probabilityEntries[0][0]
    }

    return "Unknown"
  }, [predictionResult, probabilityEntries])

  const confidencePercent = useMemo(() => {
    if (typeof predictionResult?.confidence === "number") {
      return (predictionResult.confidence * 100).toFixed(2)
    }

    if (probabilityEntries.length > 0) {
      return (probabilityEntries[0][1] * 100).toFixed(2)
    }

    return "0.00"
  }, [predictionResult, probabilityEntries])

  useEffect(() => {
    if (!predictionResult) {
      return
    }

    predictionResultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [predictionResult])

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!patientId) {
        setLoading(false)
        setError("Patient ID is required")
        setRecommendations([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const record = await getLatestPatientRecommendations(patientId)
        setRecommendations((record.recommendations ?? []).slice(0, MAX_RECOMMENDATIONS))
      } catch (err: any) {
        const status = err?.response?.status

        if (status === 404) {
          setRecommendations([])
          setError("No recommendations found yet.")
        } else {
          setRecommendations([])
          setError(
            err?.response?.data?.message || err?.message || "Failed to load recommendations"
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [patientId])

  const handleGenerateRecommendations = async () => {
    if (!patientId) return

    setRefreshing(true)

    try {
      await refreshPatientRecommendations(patientId)
      const record = await getLatestPatientRecommendations(patientId)
      setRecommendations((record.recommendations ?? []).slice(0, MAX_RECOMMENDATIONS))
      setError(null)
      toast({
        title: "Recommendations updated",
        description: "Latest patient recommendations were generated successfully.",
      })
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to generate recommendations"
      setError(message)
      toast({
        title: "Unable to generate recommendations",
        description: message,
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handlePredict = async () => {
    if (!predictionFile) {
      setPredictionError("Image file is required.")
      return
    }

    setPredicting(true)
    setPredictionError(null)
    setModelWarmingUp(false)

    try {
      const result = await predictModel(predictionType, predictionFile)
      setPredictionResult(result)
      toast({
        title: "Prediction completed",
        description: `${predictionType === "acne" ? "Acne" : "Dental"} detected: ${result.predicted_class} (${(result.confidence * 100).toFixed(2)}%)`,
      })
    } catch (err: any) {
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || "Prediction failed"
      setPredictionResult(null)
      setPredictionError(message)
      setModelWarmingUp(status === 503)

      toast({
        title: "Prediction failed",
        description: status === 503
          ? "Model is warming up. Please retry in a moment."
          : message,
      })
    } finally {
      setPredicting(false)
    }
  }

  const getRecommendationIcon = (type: string) => {
    if (type === "fitness" || type === "exercise") return Dumbbell
    if (type === "sleep") return Moon
    if (type === "nutrition") return Award
    if (type === "medication") return Pill
    if (type === "doctor") return Stethoscope
    if (type === "disease_risk") return HeartPulse
    if (type === "lab_test") return FlaskConical
    return Lightbulb
  }

  const getRecommendationTheme = (type: string) => {
    if (type === "fitness" || type === "exercise") return { color: "text-soft-coral", bgColor: "bg-soft-coral/20" }
    if (type === "sleep") return { color: "text-soft-blue", bgColor: "bg-soft-blue/20" }
    if (type === "nutrition") return { color: "text-mint-green", bgColor: "bg-mint-green/20" }
    if (type === "medication") return { color: "text-soft-coral", bgColor: "bg-soft-coral/20" }
    if (type === "doctor") return { color: "text-soft-blue", bgColor: "bg-soft-blue/20" }
    if (type === "disease_risk") return { color: "text-soft-coral", bgColor: "bg-soft-coral/20" }
    if (type === "lab_test") return { color: "text-mint-green", bgColor: "bg-mint-green/20" }
    return { color: "text-soft-blue", bgColor: "bg-soft-blue/20" }
  }

  const showEmptyState = !loading && visibleRecommendations.length === 0

  return (
  
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 lg:space-y-6 w-full">
      {/* Recommendations Section */}
      <Card className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md max-w-full">
        <CardHeader className="border-b border-white/20 px-6">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-dark-slate-gray">
              <Lightbulb className="w-5 h-5 text-soft-coral" />
              Personalized Recommendations
            </CardTitle>
            <Button
              type="button"
              onClick={handleGenerateRecommendations}
              disabled={refreshing || loading || !patientId}
              variant="outline"
              className="rounded-full border-white/30 bg-white/40 text-dark-slate-gray hover:bg-white/60"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-xl border border-white/20 bg-white/20 p-5 text-sm text-dark-slate-gray/75">
              Loading recommendations...
            </div>
          ) : showEmptyState ? (
            <div className="col-span-full flex flex-col gap-3 rounded-xl border border-white/20 bg-white/20 p-5">
              <p className="text-sm font-medium text-dark-slate-gray">
                {error ?? "No recommendations are available yet."}
              </p>
              <p className="text-xs text-dark-slate-gray/70">
                Generate fresh recommendations for this patient to populate the dashboard.
              </p>
              <div>
                <Button
                  type="button"
                  onClick={handleGenerateRecommendations}
                  disabled={refreshing || !patientId}
                  className="rounded-full bg-soft-coral text-white hover:bg-soft-coral/90"
                >
                  {refreshing ? "Generating..." : "Generate Recommendations"}
                </Button>
              </div>
            </div>
          ) : (
            visibleRecommendations.map((rec, i) => {
              const Icon = getRecommendationIcon(rec.type)
              const theme = getRecommendationTheme(rec.type)

              return (
                <motion.div
                  key={`${rec.type}-${rec.title}-${i}`}
                  custom={i}
                  variants={fadeUp}
                  className={`flex flex-col gap-3 rounded-xl p-4 border border-white/20 hover:shadow-lg transition-shadow duration-300 cursor-pointer ${theme.bgColor} backdrop-blur-sm`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.color} bg-white/15`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1 flex-grow">
                    <h3 className="text-md font-bold text-dark-slate-gray">{rec.title}</h3>
                    <p className="text-xs text-dark-slate-gray/75 flex-grow">{rec.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs font-semibold text-dark-slate-gray/60">
                    <Badge
                      variant="secondary"
                      className={`capitalize rounded-full px-2 py-0.5 font-semibold ${
                        rec.priority === "high"
                          ? "bg-soft-coral/30 text-soft-coral border-soft-coral/40"
                          : rec.priority === "medium"
                          ? "bg-mint-green/30 text-mint-green border-mint-green/40"
                          : "bg-soft-blue/30 text-soft-blue border-soft-blue/40"
                      }`}
                    >
                      {rec.priority}
                    </Badge>

                    <span>
                      Timeframe: <span className="font-semibold">{rec.timeframe}</span>
                    </span>
                  </div>
                </motion.div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-md max-w-full">
        <CardHeader className="border-b border-white/20 px-6">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-dark-slate-gray">
            <HeartPulse className="w-5 h-5 text-soft-blue" />
            Model Predictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={predictionType === "acne" ? "default" : "outline"}
              className={predictionType === "acne" ? "bg-soft-coral text-white hover:bg-soft-coral/90" : "border-white/30 bg-white/30"}
              onClick={() => setPredictionType("acne")}
              disabled={predicting}
            >
              Acne
            </Button>
            <Button
              type="button"
              variant={predictionType === "dental" ? "default" : "outline"}
              className={predictionType === "dental" ? "bg-soft-blue text-white hover:bg-soft-blue/90" : "border-white/30 bg-white/30"}
              onClick={() => setPredictionType("dental")}
              disabled={predicting}
            >
              Dental
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null
                setPredictionFile(nextFile)
                setPredictionError(null)
                setPredictionResult(null)
                setModelWarmingUp(false)
              }}
              className="border-white/30 bg-white/50"
            />
            <Button
              type="button"
              onClick={handlePredict}
              disabled={predicting || !predictionFile}
              className="rounded-full bg-soft-coral text-white hover:bg-soft-coral/90"
            >
              {predicting ? "Predicting..." : "Predict"}
            </Button>
            {modelWarmingUp && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePredict}
                disabled={predicting || !predictionFile}
                className="rounded-full border-white/30 bg-white/40"
              >
                Retry
              </Button>
            )}
          </div>

          {predictionError && (
            <p className="text-sm text-soft-coral">{predictionError}</p>
          )}

          {predictionResult && (
            <div ref={predictionResultRef} className="rounded-xl border border-white/20 bg-white/25 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-dark-slate-gray">
                  Detected Disease: <span className="font-semibold">{detectedDisease}</span>
                </p>
                <p className="text-sm text-dark-slate-gray/80">
                  Confidence: <span className="font-semibold">{confidencePercent}%</span>
                </p>
              </div>

              {probabilityEntries.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-dark-slate-gray/70">
                    Class probabilities
                  </p>
                  <div className="space-y-1">
                    {probabilityEntries.map(([label, score]) => (
                      <div key={label} className="flex items-center justify-between text-xs text-dark-slate-gray/80">
                        <span>{label}</span>
                        <span className="font-medium">{(score * 100).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

   
    </motion.div>
  )
}
