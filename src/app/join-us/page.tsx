"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Stethoscope, FlaskConical, Apple, CheckCircle, Loader2 } from "lucide-react"
import Navbar from "@/components/layouts/landing-page/navbar"
import Footer from "@/components/layouts/landing-page/Footer"
import api from "@/lib/axios"

type Role = "doctor" | "lab_technician" | "nutritionist" | ""
type DoctorField = "cardiology" | "neurology" | "pediatrics" | "orthopedics" | "dermatology" | ""

export default function LandingPage() {
  const formRef = useRef<HTMLDivElement>(null)

  const [selectedRole, setSelectedRole] = useState<Role>("")
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    experience: "",
    doctorField: "" as DoctorField,
    cv: null as File | null,
  })
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setFormData((prev) => ({ ...prev, doctorField: "" }))
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, cv: file }))
    }
  }

const [errorMessage, setErrorMessage] = useState("")

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setErrorMessage("")

  try {
    const payload = new FormData()
    payload.append("role", selectedRole)
    payload.append("email", formData.email)
    payload.append("fullName", formData.fullName)
    payload.append("phone", formData.phone)
    payload.append("experience", formData.experience)
    if (selectedRole === "doctor") {
      payload.append("doctorField", formData.doctorField)
    }
    if (formData.cv) {
      payload.append("file", formData.cv)
    }

    await api.post("/cv", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    setShowModal(true)
    setSelectedRole("")
    setFormData({
      email: "",
      fullName: "",
      phone: "",
      experience: "",
      doctorField: "",
      cv: null,
    })
  } catch {
    setErrorMessage("Email already exists. Please use a different one.")
  } finally {
    setLoading(false)
  }
}


  const isFormValid = () => {
    const baseValid = selectedRole && formData.email && formData.fullName && formData.phone && formData.cv
    if (selectedRole === "doctor") {
      return baseValid && formData.doctorField
    }
    return baseValid
  }
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green">
        <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center pt-3">
  <h1 className="text-5xl font-bold text-dark-slate-gray mb-4 text-balance pt-7">
    Join Our Medical Network
    <span className="block text-soft-blue">Advance Your Career</span>
  </h1>
  <p className="text-xl text-cool-gray max-w-2xl mx-auto leading-relaxed">
    Connect with healthcare professionals and take the next step in your medical journey. 
    Choose your role and get started today.
  </p>
</div>

        </section>

        <section className="pb-16 pt-0 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-soft-coral mb-12">Select Your Role</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedRole === "doctor" ? "ring-2 ring-soft-blue bg-soft-blue/5" : ""
                }`}
                onClick={() => handleRoleSelect("doctor")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-soft-blue/10 rounded-full flex items-center justify-center mb-4">
                    <Stethoscope className="w-8 h-8 text-soft-blue" />
                  </div>
                  <CardTitle className="text-soft-blue">Doctor</CardTitle>
                  <CardDescription>Medical practitioners providing patient care and treatment</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedRole === "lab_technician" ? "ring-2 ring-mint-green bg-mint-green/5" : ""
                }`}
                onClick={() => handleRoleSelect("lab_technician")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-mint-green/10 rounded-full flex items-center justify-center mb-4">
                    <FlaskConical className="w-8 h-8 text-mint-green" />
                  </div>
                  <CardTitle className="text-mint-green">Lab Technician</CardTitle>
                  <CardDescription>Laboratory professionals conducting tests and analysis</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedRole === "nutritionist" ? "ring-2 ring-soft-coral bg-soft-coral/5" : ""
                }`}
                onClick={() => handleRoleSelect("nutritionist")}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-soft-coral/10 rounded-full flex items-center justify-center mb-4">
                    <Apple className="w-8 h-8 text-soft-coral" />
                  </div>
                  <CardTitle className="text-soft-coral">Nutritionist</CardTitle>
                  <CardDescription>Nutrition experts providing dietary guidance and wellness plans</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {selectedRole && (
          <section ref={formRef} className="py-16 px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-dark-slate-gray">Complete Your Registration</CardTitle>
                  <CardDescription className="text-center">Fill in your basic information to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Briefly describe your professional experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        rows={3}
                      />
                    </div>

                    {selectedRole === "doctor" && (
                      <div className="space-y-2">
                        <Label htmlFor="doctorField">Medical Specialization</Label>
                        <Select
                          value={formData.doctorField}
                          onValueChange={(value) => handleInputChange("doctorField", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your specialization" className="bg-snow-white" />
                          </SelectTrigger>
                          <SelectContent className="bg-snow-white">
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="dermatology">Dermatology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="cv">Upload CV/Resume</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <input
                          id="cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          required
                        />
                        <label htmlFor="cv" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-cool-gray mx-auto mb-2" />
                          <p className="text-sm text-cool-gray">
                            {formData.cv ? formData.cv.name : "Click to upload your CV/Resume"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-soft-blue hover:bg-soft-blue/90 border-2 border-soft-blue text-snow-white"
                      disabled={!isFormValid() || loading}
                    >
                       {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          Submitting...
                        </>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </form>
                  {errorMessage && (
  <p className="text-red-500 text-center">{errorMessage}</p>
)}

                </CardContent>
              </Card>
            </div>
          </section>
        )}

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md bg-mint-green">
            <DialogHeader>
              <div className="mx-auto w-16 h-16 bg-mint-green/10 rounded-full flex items-center justify-center ">
                <CheckCircle className="w-8 h-8 text-soft-coral" />
              </div>
              <DialogTitle className="text-center text-2xl text-dark-slate-gray">Registration Complete!</DialogTitle>
              <DialogDescription className="text-center text-snow-white">
                Thank you for joining our medical network. We&apos;ll review your application and get back to you within 24-48
                hours.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-6 text-dark-slate-gray">
              <Button onClick={() => setShowModal(false)} className="bg-soft-blue hover:bg-soft-blue/90">
                Got it, thanks!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  )
}
