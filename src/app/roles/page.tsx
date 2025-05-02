import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Stethoscope,
  Apple,
  FlaskConical,
  ShieldCheck,
  Pill
} from "lucide-react"
import Link from "next/link"
import Navbar from '@/components/layouts/landing-page/navbar'
import Footer from '@/components/layouts/landing-page/Footer'

const SelectRole = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mint-green via-snow-white to-mint-green p-4">
        <Card className="w-full mt-10 max-w-md bg-dark-slate-gray backdrop-blur-lg border-0 transform transition-all duration-500 hover:scale-[1.02] animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-white animate-slide-in-right">
              Select Your Role
            </CardTitle>
            <p className="text-sm text-gray-300 animate-slide-in-right delay-100">
              Choose your role to proceed with login
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/doctor/login" className="block hover:bg-soft-coral">
              <Button className="w-full bg-white/5 hover:bg-white/10 text-white transform transition-all duration-300 hover:scale-[1.02] animate-slide-in-right delay-200 flex items-center justify-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Doctor
              </Button>
            </Link>

            <Link href="/nutritionist/login" className="block hover:bg-soft-coral">
              <Button className="w-full bg-white/5 hover:bg-white/10 text-white transform transition-all duration-300 hover:scale-[1.02] animate-slide-in-right delay-200 flex items-center justify-center gap-2">
                <Apple className="h-5 w-5" />
                Nutritionist
              </Button>
            </Link>

            <Link href="/lab-technician/login" className="block hover:bg-soft-coral">
              <Button className="w-full bg-white/5 hover:bg-white/10 text-white transform transition-all duration-300 hover:scale-[1.02] animate-slide-in-right delay-200 flex items-center justify-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Lab Technician
              </Button>
            </Link>

            <Link href="/admin/login" className="block hover:bg-soft-coral">
              <Button className="w-full bg-white/5 hover:bg-white/10 text-white transform transition-all duration-300 hover:scale-[1.02] animate-slide-in-right delay-300 flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Admin Staff
              </Button>
            </Link>

            <Link href="/pharmacist/login" className="block hover:bg-soft-coral">
              <Button className="w-full bg-white/5 hover:bg-white/10 text-white transform transition-all duration-300 hover:scale-[1.02] animate-slide-in-right delay-400 flex items-center justify-center gap-2">
                <Pill className="h-5 w-5" />
                Pharmacist
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  )
}

export default SelectRole
