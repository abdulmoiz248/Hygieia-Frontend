"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Lock, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { useSelector } from "react-redux"
import { RootState } from "@/store/patient/store"
import api from "@/lib/axios"



const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    appointments: true,
    medications: true,
    healthTips: false,
    marketing: false,
  })

  const [showResetPassword, setShowResetPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [emailValid, setEmailValid] = useState(false)
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState("verifyEmail")

  const user = useSelector((store: RootState) => store.profile)

  console.log("email valid= ",emailValid)
 const handleVerifyEmail = async () => {
  setError("")
  if (user.email != email) {
    setEmailValid(false)
    setError("Incorrect Email Address")
    return
  }

  setEmailValid(true)
  setError("")
  setIsLoading(true)
  try {
    const res = await api.post('/auth/request-password-reset', { email })
    if (res.data.success) {
      localStorage.setItem("resetEmail", email)
      setCurrentStep("otp")
    } else {
      setError(res.data.message || "Something went wrong")
    }
  } catch (err) {
    console.log(err)
    setError("Something went wrong. Try again.")
  } finally {
    setIsLoading(false)
  }
}


  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      const email = localStorage.getItem("resetEmail")
      const res = await api.post("/auth/verify-reset-otp", { email, otp })
      if (res.data.success) {
        setCurrentStep("newPassword")
      } else {
        setError(res.data.message || "Invalid OTP. Please try again.")
      }
    } catch (err) {
      console.log(err)
      setError("Something went wrong. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.")
      return
    }
    if (!validatePassword(newPassword)) {
      setError("Password must be at least 6 characters long.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      const email = localStorage.getItem("resetEmail")
      const res = await api.post("/auth/reset-password", { email, otp, newPassword })
      if (res.data.success) {
        setCurrentStep("success")
        localStorage.removeItem("resetEmail")
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      console.log(err)
      setError("Something went wrong. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-soft-coral">Settings</h1>
        <p className="text-cool-gray">Manage your account preferences and privacy settings</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-soft-blue" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["appointments", "medications", "healthTips"].map((key) => (
              <div className="flex items-center justify-between" key={key}>
                <div>
                  <Label htmlFor={key} className="text-soft-blue">
                    {key === "appointments"
                      ? "Appointment Reminders"
                      : key === "medications"
                      ? "Medication Reminders"
                      : "Health Tips"}
                  </Label>
                  <p className="text-sm text-cool-gray">
                    {key === "appointments"
                      ? "Get notified about upcoming appointments"
                      : key === "medications"
                      ? "Reminders to take your medications"
                      : "Weekly health and wellness tips"}
                  </p>
                </div>
                <Switch
                  id={key}
                  checked={notifications[key as keyof typeof notifications]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [key]: checked }))
                  }
                  className="data-[state=checked]:bg-soft-blue data-[state=unchecked]:bg-soft-coral relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-mint-green" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Password</Label>
              </div>
              <Dialog
                open={showResetPassword}
                onOpenChange={(open) => {
                  setShowResetPassword(open)
                  if (!open) {
                    setEmail("")
                    setEmailValid(false)
                    setOtp("")
                    setNewPassword("")
                    setConfirmPassword("")
                    setCurrentStep("verifyEmail")
                    setError("")
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-soft-blue text-snow-white hover:bg-soft-blue/90" size="sm">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-snow-white">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>

                  {currentStep === "verifyEmail" && (
                    <div className="space-y-4">
                      <Label htmlFor="email">Enter your email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <Button
                        className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                        onClick={handleVerifyEmail}
                        disabled={!email || isLoading}
                      >
                        {isLoading ? "Verifying..." : "Verify Email"}
                      </Button>
                    </div>
                  )}

                  {currentStep === "otp" && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                      />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <Button
                        type="submit"
                        className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </form>
                  )}

                  {currentStep === "newPassword" && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="new" className="text-soft-blue pb-2">
                          New Password
                        </Label>
                        <Input
                          id="new"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm" className="text-soft-blue pb-2">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <Button
                        type="submit"
                        className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  )}

                  {currentStep === "success" && (
                    <div className="space-y-4 text-center">
                      <p className="text-green-600 font-semibold">Password updated successfully!</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
