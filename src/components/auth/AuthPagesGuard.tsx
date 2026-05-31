"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function AuthPagesGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

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

    if (role && storedId && storedToken) {
      localStorage.setItem("role", role)
      localStorage.setItem("id", storedId)
      localStorage.setItem("token", storedToken)
      router.replace(`/${role}/dashboard`)
      return
    }

    setReady(true)
  }, [router])

  if (!ready) return null

  return <>{children}</>
}