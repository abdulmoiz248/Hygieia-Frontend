"use client"

import React, { useState, useRef } from "react"
import { Upload,  FileImage, X } from "lucide-react"
import Card from "@/components/patient dashboard/ai diagnosis/Card"
import CardContent from "@/components/patient dashboard/ai diagnosis/CardContent"
import CardHeader from "@/components/patient dashboard/ai diagnosis/CardHeader"
import CardTitle from "@/components/patient dashboard/ai diagnosis/CardTitle"
import Button from "@/components/patient dashboard/ai diagnosis/Button"
import AnalysisProgressModal from "@/components/patient dashboard/ai diagnosis/AnalysisProgressModal"
import ResultsModal from "@/components/patient dashboard/ai diagnosis/ResultsModal"
import { predictModel } from "@/api/patient/recommendationsApi"
import { useToast } from "@/hooks/use-toast"

interface DiagnosisResult {
  type: "dental" | "acne"
  predictedClass: string
  confidence: number
  recommendation: string
  severity: "mild" | "moderate" | "severe"
  nextSteps: string[]
}

// UI components with your theme colors
// Remove the inline definitions of these components and use the imports instead.

export default function AIDiagnosisPage() {
  const { toast } = useToast()
  const [selectedType, setSelectedType] = useState<"dental" | "acne" | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getSeverity = (type: "dental" | "acne", predictedClass: string): "mild" | "moderate" | "severe" => {
    if (type === "acne") {
      if (predictedClass === "Cyst") return "severe"
      if (predictedClass === "Papules" || predictedClass === "Pustules") return "moderate"
      return "mild"
    }

    if (predictedClass === "Infection" || predictedClass === "Fractured Teeth") return "severe"
    if (predictedClass === "Caries" || predictedClass === "Impacted teeth") return "moderate"
    return "mild"
  }

  const getRecommendation = (type: "dental" | "acne", predictedClass: string): string => {
    if (type === "acne") {
      return `Detected pattern: ${predictedClass}. Please consult a dermatologist for confirmation and a personalized treatment plan.`
    }

    return `Detected pattern: ${predictedClass}. Please consult a dentist for proper evaluation and treatment planning.`
  }

  const getNextSteps = (type: "dental" | "acne", severity: "mild" | "moderate" | "severe") => {
    if (type === "dental") {
      return [
        severity === "severe" ? "Schedule a dental consultation as soon as possible" : "Schedule a dental consultation within 2 weeks",
        "Maintain good oral hygiene with fluoride toothpaste",
        "Avoid hard or sticky foods temporarily",
        "Use warm salt water rinse twice daily",
        "Monitor for increased pain, swelling, or sensitivity",
      ]
    }

    return [
      severity === "severe" ? "Consult a dermatologist promptly for medical treatment" : "Book a dermatologist consultation for confirmation",
      "Use gentle, non-comedogenic skincare products",
      "Avoid touching or picking affected areas",
      "Cleanse twice daily and apply prescribed/topical treatment as advised",
      "Track changes and worsening inflammation over the next 1-2 weeks",
    ]
  }

  const dataUrlToFile = (dataUrl: string, filename: string): File | null => {
    const [meta, base64] = dataUrl.split(",")
    if (!meta || !base64) {
      return null
    }

    const mimeMatch = meta.match(/data:(.*?);base64/)
    const mime = mimeMatch?.[1] ?? "image/jpeg"
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }

    return new File([bytes], filename, { type: mime })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }



  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')
        setUploadedImage(imageData)
        const file = dataUrlToFile(imageData, `${selectedType ?? "diagnosis"}-capture.jpg`)
        setUploadedFile(file)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setShowCamera(false)
  }

  const analyzeImage = async () => {
    if (!uploadedImage || !uploadedFile || !selectedType) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const prediction = await predictModel(selectedType, uploadedFile)
      clearInterval(progressInterval)
      setAnalysisProgress(100)

      const severity = getSeverity(selectedType, prediction.predicted_class)
      const apiResult: DiagnosisResult = {
        type: selectedType,
        predictedClass: prediction.predicted_class,
        confidence: Math.round(prediction.confidence * 100),
        recommendation: getRecommendation(selectedType, prediction.predicted_class),
        severity,
        nextSteps: getNextSteps(selectedType, severity),
      }

      setResult(apiResult)
      setIsAnalyzing(false)
      setShowResults(true)
      toast({
        title: "Analysis complete",
        description: `Detected: ${prediction.predicted_class}`,
      })
    } catch (err: any) {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setAnalysisProgress(0)

      const message = err?.response?.data?.message || err?.message || "Analysis failed"
      toast({
        title: "Analysis failed",
        description: message,
      })
    }
  }

  const resetDiagnosis = () => {
    setSelectedType(null)
    setUploadedImage(null)
    setUploadedFile(null)
    setResult(null)
    setShowResults(false)
    setAnalysisProgress(0)
    stopCamera()
  }

  return (
    <>
    <div className="min-h-screen bg-snow-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-soft-coral mb-2">AI Diagnosis</h1>
          <p className="text-cool-gray">Get instant AI-powered health insights from your photos</p>
        </div>

        {!selectedType ? (
          /* Type Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card
              className=" bg-white/40 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-soft-blue/30 "
              onClick={() => setSelectedType("dental")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-soft-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🦷</span>
                </div>
                <h3 className="text-xl font-semibold text-dark-slate-gray  mb-2">Dental Analysis</h3>
                <p className="text-cool-gray ">Upload photos of dental concerns for AI-powered analysis</p>
              </CardContent>
            </Card>

            <Card
              className="bg-white/40 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-mint-green/30 "
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
          </div>
        ) : (
          /* Upload & Analysis */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-snow-white">
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
                {!uploadedImage && !showCamera ? (
                  <div className="border-2 border-dashed border-cool-gray/30 rounded-lg p-12 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-cool-gray/10 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-cool-gray" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-dark-slate-gray mb-2">Upload Your Photo</h3>
                        <p className="text-cool-gray mb-4">Take a clear photo of the area you&apos;d like analyzed</p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        
                        <Button className="flex items-center gap-2 bg-soft-blue hover:bg-soft-blue/90" onClick={handleFileButtonClick}>
                          <FileImage className="w-4 h-4" />
                          Choose File
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                ) : showCamera ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover rounded-lg bg-black"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={capturePhoto} className="bg-soft-blue hover:bg-soft-blue/90">
                        Capture Photo
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={uploadedImage || ""}
                        alt="Uploaded for analysis"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-snow-white/90"
                        onClick={() => {
                          setUploadedImage(null)
                          setUploadedFile(null)
                        }}
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
          </div>
        )}

        {/* Analysis Progress Modal */}
        <AnalysisProgressModal open={isAnalyzing} selectedType={selectedType} analysisProgress={analysisProgress} />

        {/* Results Modal */}
        <ResultsModal open={showResults} onOpenChange={setShowResults} result={result} resetDiagnosis={resetDiagnosis} />
      </div>
    </div>
     </>
  )
}