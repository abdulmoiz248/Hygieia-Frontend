"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("role")
    const id   = localStorage.getItem("id")

    if (!role || !id) {
      router.replace("/login")
    } else {
      setVerified(true)
    }
  }, [router])

  if (!verified) return null

  return <>{children}</>
}