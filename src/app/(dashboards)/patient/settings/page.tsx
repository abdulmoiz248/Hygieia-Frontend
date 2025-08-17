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
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [error, setError] = useState("")
  const user=useSelector((store:RootState)=>store.profile)


  const handleVerifyEmail = async () => {
    setError("")
 
       if(user.email!=email){
        setEmailValid(false)
         setError("Incorrect Email Address")
       }else{
           setEmailValid(true)
            setError("")
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
          <CardContent className="space-y-4 ">
            <div className="flex items-center justify-between">
              <div>
                <Label>Password</Label>
             </div>
              <Dialog open={showResetPassword} onOpenChange={(open) => {
                setShowResetPassword(open)
                if (!open) {
                  setEmail("")
                  setEmailValid(false)
                  setOtpSent(false)
                  setOtpVerified(false)
                  setError("")
                }
              }}>
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

                  {!emailValid && (
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
                        disabled={!email}
                      >
                        Verify Email
                      </Button>
                    </div>
                  )}

                  {emailValid && !otpSent && (
                    <div className="space-y-4">
                      <Label htmlFor="otp">OTP sent to your email</Label>
                      <Input id="otp" placeholder="123456" />
                      <Button
                        className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                        onClick={() => setOtpSent(true)}
                      >
                        Verify OTP
                      </Button>
                    </div>
                  )}

                  {otpSent && !otpVerified && (
                    <div className="space-y-4">
                      <Label htmlFor="otp">Re-enter OTP</Label>
                      <Input id="otp" placeholder="123456" />
                      <Button
                        className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white"
                        onClick={() => setOtpVerified(true)}
                      >
                        Confirm OTP
                      </Button>
                    </div>
                  )}

                  {otpVerified && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="new" className="text-soft-blue pb-2">New Password</Label>
                        <Input id="new" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm" className="text-soft-blue pb-2">Confirm New Password</Label>
                        <Input id="confirm" type="password" />
                      </div>
                      <Button className="w-full bg-soft-blue hover:bg-soft-blue/90 text-snow-white">
                        Update Password
                      </Button>
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
