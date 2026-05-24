"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  isProfileCompleteForRole,
  type Role,
  type AnyProfile,
} from "@/lib/patient/ProfileCompleteness"
import { AlertCircle } from "lucide-react"

interface ProfileGuardProps {
  children: React.ReactNode
  profile: AnyProfile | null | undefined
  loading?: boolean
  role: Role
  profileRoute: string
  roleName: string
}

export default function ProfileGuard({
  children,
  profile,
  loading = false,
  role,
  profileRoute,
  roleName,
}: ProfileGuardProps) {
  const router     = useRouter()
  const pathname   = usePathname()
  const redirected = useRef(false)

  const isOnProfilePage   = pathname === profileRoute || pathname?.startsWith(profileRoute)
  const profileIncomplete = !loading && (!profile || !isProfileCompleteForRole(role, profile))

  // On first load, redirect to profile page if incomplete
  useEffect(() => {
    if (loading || isOnProfilePage) return
    if (profileIncomplete && !redirected.current) {
      redirected.current = true
      router.replace(profileRoute)
    }
  }, [loading, profileIncomplete, isOnProfilePage, profileRoute, router])

  // Still show nothing during loading (avoids flash)
  if (loading && !isOnProfilePage) return null

  return (
    <>
      {profileIncomplete && (
        <IncompleteProfileBanner
          roleName={roleName}
          profileRoute={profileRoute}
          isOnProfilePage={isOnProfilePage}
        />
      )}
      {children}
    </>
  )
}

function IncompleteProfileBanner({
  roleName,
  profileRoute,
  isOnProfilePage,
}: {
  roleName: string
  profileRoute: string
  isOnProfilePage: boolean
}) {
  const router = useRouter()

  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm mx-6 mt-4"
    >
      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
      <p className="flex-1 font-medium">
        Your <span className="font-semibold">{roleName}</span> profile is incomplete.{" "}
        {!isOnProfilePage && (
          <span>
            Some features may be limited until you{" "}
            <button
              onClick={() => router.push(profileRoute)}
              className="underline font-semibold hover:text-amber-700 transition-colors"
            >
              complete your profile
            </button>
            .
          </span>
        )}
        {isOnProfilePage && (
          <span>Please fill in the required fields below.</span>
        )}
      </p>
    </div>
  )
}