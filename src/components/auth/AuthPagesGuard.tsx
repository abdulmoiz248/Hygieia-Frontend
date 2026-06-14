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
    const cookieRole = Cookies.get("role") || null
    const cookieId = Cookies.get("id") || null
    const cookieToken = Cookies.get("token") || null
    const storedRole = localStorage.getItem("role")
    const storedId = localStorage.getItem("id")
    const storedToken = localStorage.getItem("token")

    const role = normalizeRole(cookieRole)

    if (role && cookieId && cookieToken) {
      localStorage.setItem("role", role)
      localStorage.setItem("id", cookieId)
      localStorage.setItem("token", cookieToken)
      router.replace(`/${role}/dashboard`)
      return
    }

    if (cookieRole || cookieId || cookieToken || storedRole || storedId || storedToken) {
      Cookies.remove("token")
      Cookies.remove("id")
      Cookies.remove("role")
      localStorage.removeItem("token")
      localStorage.removeItem("id")
      localStorage.removeItem("role")
    }

    setReady(true)
  }, [router])

  if (!ready) return null

  return <>{children}</>
}
