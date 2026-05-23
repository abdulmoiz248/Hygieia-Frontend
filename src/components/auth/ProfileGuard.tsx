"use client"

// components/auth/ProfileGuard.tsx
// Uses isProfileCompleteForRole() — edit lib/patient/profileCompleteness.ts to change required fields.

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  isProfileCompleteForRole,
  getMissingFieldsForRole,
  type Role,
  type AnyProfile,
} from "@/lib/patient/ProfileCompleteness"

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
  const [showBanner, setShowBanner] = useState(false)

  const isOnProfilePage   = pathname === profileRoute || pathname?.startsWith(profileRoute)
  const profileIncomplete = !loading && (!profile || !isProfileCompleteForRole(role, profile))

  useEffect(() => {
    if (loading || isOnProfilePage) return
    if (profileIncomplete && !redirected.current) {
      redirected.current = true
      sessionStorage.setItem(`${role}_profile_prompt`, "1")
      router.replace(profileRoute)
    }
  }, [loading, profileIncomplete, isOnProfilePage, profileRoute, role, router])

  useEffect(() => {
    if (!isOnProfilePage) return
    const key = `${role}_profile_prompt`
    if (sessionStorage.getItem(key)) {
      setShowBanner(true)
      sessionStorage.removeItem(key)
    }
  }, [isOnProfilePage, role])

  if (loading && !isOnProfilePage) return null
  if (profileIncomplete && !isOnProfilePage) return null

  return (
    <>
      {showBanner && profile && (
        <ProfileSetupBanner
          roleName={roleName}
          missingFields={getMissingFieldsForRole(role, profile).map((f) => f.label)}
          onDismiss={() => setShowBanner(false)}
        />
      )}
      {children}
    </>
  )
}

function ProfileSetupBanner({
  roleName,
  missingFields,
  onDismiss,
}: {
  roleName: string
  missingFields: string[]
  onDismiss: () => void
}) {
  return (
    <div
      role="alert"
      className="relative flex items-start gap-3 rounded-xl border border-soft-blue/30 bg-soft-blue/10 px-4 py-3 text-sm text-dark-slate-gray shadow-sm mx-6 mt-4"
    >
      <span className="mt-0.5 text-soft-blue text-lg select-none">👋</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-soft-blue">
          Welcome! Please complete your {roleName} profile.
        </p>
        <p className="text-cool-gray mt-0.5 mb-2">
          The following required fields are missing:
        </p>
        <ul className="space-y-0.5">
          {missingFields.map((label) => (
            <li key={label} className="flex items-center gap-1.5 text-xs text-dark-slate-gray/80">
              <span className="w-1.5 h-1.5 rounded-full bg-soft-blue/60 shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-cool-gray hover:text-dark-slate-gray transition-colors text-base leading-none mt-0.5"
      >
        ✕
      </button>
    </div>
  )
}