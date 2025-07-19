"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Camera, FileImage, Loader2, CheckCircle, AlertTriangle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DiagnosisResult {
  type: "dental" | "acne"
  confidence: number
  recommendation: string
  severity: "mild" | "moderate" | "severe"
  nextSteps: string[]
}

export default function AIDiagnosisPage() {
  const [selectedType, setSelectedType] = useState<"dental" | "acne" | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!uploadedImage || !selectedType) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + Math.random() * 15
      })
    }, 200)

    setTimeout(() => {
      clearInterval(progressInterval)
      setAnalysisProgress(100)

      const mockResult: DiagnosisResult = {
        type: selectedType,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        recommendation:
          selectedType === "dental"
            ? "Based on the image analysis, this appears to be a minor dental concern. I recommend scheduling a consultation with a dentist for proper evaluation."
            : "The analysis suggests mild to moderate acne. Consider consulting with a dermatologist for a personalized treatment plan.",
        severity: ["mild", "moderate", "severe"][Math.floor(Math.random() * 3)] as "mild" | "moderate" | "severe",
        nextSteps:
          selectedType === "dental"
            ? [
                "Schedule a dental consultation within 2 weeks",
                "Maintain good oral hygiene with fluoride toothpaste",
                "Avoid hard or sticky foods temporarily",
                "Use warm salt water rinse twice daily",
                "Monitor for any changes or increased pain",
              ]
            : [
                "Consult with a dermatologist for professional assessment",
                "Use gentle, non-comedogenic skincare products",
                "Avoid touching or picking at affected areas",
                "Consider topical treatments like benzoyl peroxide",
                "Maintain a consistent skincare routine",
              ],
      }

      setResult(mockResult)
      setIsAnalyzing(false)
      setShowResults(true)
    }, 3000)
  }

  const resetDiagnosis = () => {
    setSelectedType(null)
    setUploadedImage(null)
    setResult(null)
    setShowResults(false)
    setAnalysisProgress(0)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "text-mint-green"
      case "moderate":
        return "text-yellow-600"
      case "severe":
        return "text-soft-coral"
      default:
        return "text-cool-gray"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-slate-gray">AI Diagnosis</h1>
        <p className="text-cool-gray">Get instant AI-powered health insights from your photos</p>
      </div>

      {!selectedType ? (
        /* Type Selection */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-soft-blue/30"
              onClick={() => setSelectedType("dental")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-soft-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🦷</span>
                </div>
                <h3 className="text-xl font-semibold text-dark-slate-gray mb-2">Dental Analysis</h3>
                <p className="text-cool-gray">Upload photos of dental concerns for AI-powered analysis</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-mint-green/30"
              onClick={() => setSelectedType("acne")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-dark-slate-gray mb-2">Acne Analysis</h3>
                <p className="text-cool-gray">Analyze skin conditions and get personalized recommendations</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ) : (
        /* Upload & Analysis */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedType === "dental" ? "🦷" : "✨"}</span>
                  {selectedType === "dental" ? "Dental" : "Acne"} Analysis
                </div>
                <Button variant="ghost" size="icon" onClick={resetDiagnosis}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-cool-gray" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-dark-slate-gray mb-2">Upload Your Photo</h3>
                      <p className="text-cool-gray mb-4">Take a clear photo of the area you&apos;d like analyzed</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Camera className="w-4 h-4" />
                        Take Photo
                      </Button>
                      <label htmlFor="file-upload">
                        <Button className="flex items-center gap-2 bg-soft-blue hover:bg-soft-blue/90">
                          <FileImage className="w-4 h-4" />
                          Choose File
                        </Button>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded for analysis"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                      onClick={() => setUploadedImage(null)}
                    >
                      Change Photo
                    </Button>
                  </div>

                  {!isAnalyzing && !result && (
                    <Button onClick={analyzeImage} className="w-full bg-soft-blue hover:bg-soft-blue/90">
                      Analyze Image
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analysis Progress Modal */}
      <Dialog open={isAnalyzing} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-soft-blue" />
              Analyzing Your Image
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedType === "dental" ? "🦷" : "✨"}</div>
              <h3 className="text-lg font-medium text-dark-slate-gray mb-2">AI Analysis in Progress</h3>
              <p className="text-cool-gray mb-4">Our AI is examining your photo for insights...</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-3" />
            </div>

            <div className="text-center text-sm text-cool-gray">
              {analysisProgress < 30 && "Processing image..."}
              {analysisProgress >= 30 && analysisProgress < 60 && "Analyzing features..."}
              {analysisProgress >= 60 && analysisProgress < 90 && "Generating insights..."}
              {analysisProgress >= 90 && "Finalizing results..."}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-mint-green" />
              Analysis Complete
            </DialogTitle>
          </DialogHeader>

          {result && (
            <div className="space-y-6">
              {/* Confidence Score */}
              <div className="text-center">
                <div className="text-4xl font-bold text-soft-blue mb-2">{result.confidence}%</div>
                <p className="text-cool-gray">Confidence Level</p>
                <Progress value={result.confidence} className="w-full max-w-xs mx-auto mt-2" />
              </div>

              {/* Severity */}
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${getSeverityColor(result.severity)}`} />
                <span className="font-medium">Severity: </span>
                <Badge className={getSeverityColor(result.severity)}>
                  {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                </Badge>
              </div>

              {/* Recommendation */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-dark-slate-gray mb-2">AI Recommendation</h3>
                <p className="text-cool-gray">{result.recommendation}</p>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="font-semibold text-dark-slate-gray mb-3">Recommended Next Steps</h3>
                <div className="space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-soft-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-soft-blue">{index + 1}</span>
                      </div>
                      <p className="text-cool-gray">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-soft-blue hover:bg-soft-blue/90">Book Consultation</Button>
                <Button variant="outline" onClick={resetDiagnosis}>
                  New Analysis
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not
                  replace professional medical advice. Please consult with a qualified healthcare provider for proper
                  diagnosis and treatment.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
