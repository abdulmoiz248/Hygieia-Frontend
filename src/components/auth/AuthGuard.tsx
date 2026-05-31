"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [verified, setVerified] = useState(false)

  const normalizeRole = (role: string | null) => {
    if (!role) return null

    const normalized = role.toLowerCase()
    return normalized.includes("lab") ? "pathologist" : normalized
  }

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || Cookies.get("role") || null
    const storedId = localStorage.getItem("id") || Cookies.get("id") || null
    const storedToken = localStorage.getItem("token") || Cookies.get("token") || null

    const role = normalizeRole(storedRole)

    if (!role || !storedId || !storedToken) {
      router.replace("/login")
      return
    }

    // Keep localStorage in sync so role-based layouts can read it reliably.
    localStorage.setItem("role", role)
    localStorage.setItem("id", storedId)
    localStorage.setItem("token", storedToken)

    const currentSegment = window.location.pathname.split("/")[1]
    const knownRoles = ["admin", "doctor", "nutritionist", "patient", "pathologist"]

    if (knownRoles.includes(currentSegment) && currentSegment !== role) {
      router.replace(`/${role}/dashboard`)
    } else {
      setVerified(true)
    }
  }, [router])

  if (!verified) return null

  return <>{children}</>
}