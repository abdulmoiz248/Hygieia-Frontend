"use client"

import React, { useState, useRef } from "react"
import { Upload, Camera, FileImage, X } from "lucide-react"
import Card from "@/components/patient dashboard/ai diagnosis/Card"
import CardContent from "@/components/patient dashboard/ai diagnosis/CardContent"
import CardHeader from "@/components/patient dashboard/ai diagnosis/CardHeader"
import CardTitle from "@/components/patient dashboard/ai diagnosis/CardTitle"
import Button from "@/components/patient dashboard/ai diagnosis/Button"
import AnalysisProgressModal from "@/components/patient dashboard/ai diagnosis/AnalysisProgressModal"
import ResultsModal from "@/components/patient dashboard/ai diagnosis/ResultsModal"

interface DiagnosisResult {
  type: "dental" | "acne"
  confidence: number
  recommendation: string
  severity: "mild" | "moderate" | "severe"
  nextSteps: string[]
}

// UI components with your theme colors
// Remove the inline definitions of these components and use the imports instead.

export default function AIDiagnosisPage() {
  const [selectedType, setSelectedType] = useState<"dental" | "acne" | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions or use file upload instead.')
    }
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
    stopCamera()
  }

  return (
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
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-soft-blue/30 bg-snow-white"
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

            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-mint-green/30 bg-snow-white"
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
          </div>
        )}

        {/* Analysis Progress Modal */}
        <AnalysisProgressModal open={isAnalyzing} selectedType={selectedType} analysisProgress={analysisProgress} />

        {/* Results Modal */}
        <ResultsModal open={showResults} onOpenChange={setShowResults} result={result} resetDiagnosis={resetDiagnosis} />
      </div>
    </div>
  )
}