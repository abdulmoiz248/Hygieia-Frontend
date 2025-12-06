"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ArrowRight } from "lucide-react"
import type { KeyboardEvent, ClipboardEvent, ChangeEvent } from "react"
import api from "@/lib/axios"

type VerificationStatus = "idle" | "success" | "error"

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [email,setEmail]=useState('')
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null))
  const router = useRouter()

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(()=>{
    const email=localStorage.getItem('email')
    if(email){
      setEmail(email)
    }
    else{
      router.push('/signup')
    }
  },[])

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (
      value &&
      index < 5 &&
      inputRefs.current[index + 1] instanceof HTMLInputElement
    ) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1] instanceof HTMLInputElement
    ) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    const pastedOtp = pastedData.slice(0, 6).split("")

    if (!/^\d+$/.test(pastedData)) {
      setErrorMessage("Only numbers are allowed")
      setTimeout(() => setErrorMessage(""), 3000)
      return
    }

    const newOtp = [...otp]
    pastedOtp.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
    if (
      nextEmptyIndex !== -1 &&
      inputRefs.current[nextEmptyIndex] instanceof HTMLInputElement
    ) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else if (inputRefs.current[5] instanceof HTMLInputElement) {
      inputRefs.current[5]?.focus()
    }
  }

  const verifyOtp = async() => {
    const otpString = otp.join("")

    // if (otpString.length !== 6) {
    //   setErrorMessage("Please enter all 6 digits")
    //   setVerificationStatus("error")
    //   setTimeout(() => {
    //     setErrorMessage("")
    //     setVerificationStatus("idle")
    //   }, 3000)
    //   return
    // }

    // setIsVerifying(true)
    // setVerificationStatus("idle")
    try{
      setIsVerifying(true)
      const res=await api.post(`/auth/verify-otp`,{email,otp:otpString})
      if(res.data.success){
        setShowModal(true)
        localStorage.removeItem('email')
      }
      else{
        setErrorMessage(res.data.message)
        setVerificationStatus("error")
        setTimeout(() => {
          setErrorMessage("")
          setVerificationStatus("idle")
        }, 3000)
      }
    }
    catch(err){
      console.log(err)
      setErrorMessage("Invalid or Otp Expired")
    }finally{
      setIsVerifying(false)
    }
  
  }


  const isVerifyButtonDisabled =
    isVerifying || verificationStatus === "success"

  const handleModalClose = () => {
    setShowModal(false)
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-green via-snow-white to-mint-green flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-dark-slate-gray rounded-2xl shadow-xl p-8"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-snow-white text-center mb-2"
        >
          Verification Code
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-cool-gray text-center mb-8"
        >
          Please enter the 6-digit code sent to your device
        </motion.p>

        <div className="flex justify-center gap-2 sm:gap-4 mb-8">
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              className="relative"
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-10 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-lg 
                  bg-cool-gray/30 text-snow-white  border-2 
                  ${
                    verificationStatus === "error"
                      ? "border-soft-coral animate-shake"
                      : verificationStatus === "success"
                        ? "border-mint-green"
                        : "border-cool-gray"
                  } 
                  focus:outline-none focus:border-mint-green focus:ring-2 focus:ring-mint-green focus:ring-opacity-50
                  transition-all duration-200`}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: digit ? 1 : 0 }}
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-mint-green"
              />
            </motion.div>
          ))}
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-soft-coral text-center mb-4"
          >
            {errorMessage}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <button
            onClick={verifyOtp}
            disabled={isVerifyButtonDisabled}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium hover:bg-mint-green
              ${isVerifying ? "bg-cool-gray cursor-not-allowed" : "bg-mint-green hover:bg-opacity-90"} 
              text-dark-slate-gray transition-all duration-200`}
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-dark-slate-gray border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

       
        </motion.div>
      </motion.div>

      {/* Modal for OTP Verified */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center"
            >
              <CheckCircle className="w-16 h-16 text-mint-green mb-4" />
              <h2 className="text-2xl font-bold text-dark-slate-gray mb-2 text-center">OTP Verified!</h2>
              <p className="text-cool-gray text-center mb-6">
                Your OTP has been successfully verified.<br />
                Please login to continue.
              </p>
              <button
                onClick={handleModalClose}
                className="px-6 py-2 bg-mint-green text-dark-slate-gray font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200"
              >
                Go to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
