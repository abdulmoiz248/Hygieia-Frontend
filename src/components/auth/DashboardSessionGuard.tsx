"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface DashboardSessionGuardProps {
  children: ReactNode
  expectedRole: "admin" | "doctor" | "nutritionist" | "patient" | "pathologist"
}

const normalizeRole = (role: string | null) => {
  if (!role) return null

  const value = role.toLowerCase()
  return value.includes("lab") ? "pathologist" : value
}

export default function DashboardSessionGuard({
  children,
  expectedRole,
}: DashboardSessionGuardProps) {
  const router = useRouter()
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const id = localStorage.getItem("id")
    const role = normalizeRole(localStorage.getItem("role"))

    if (!id || !role) {
      router.replace("/login")
      return
    }

    if (role !== expectedRole) {
      router.replace(`/${role}/dashboard`)
      return
    }

    setVerified(true)
  }, [expectedRole, router])

  if (!verified) return null

  return <>{children}</>
}
