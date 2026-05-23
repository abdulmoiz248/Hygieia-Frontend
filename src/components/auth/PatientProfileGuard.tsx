"use client"

// components/auth/PatientProfileGuard.tsx

import ProfileGuard from "@/components/auth/ProfileGuard"
import { usePatientProfileStore } from "@/store/patient/profile-store"

export default function PatientProfileGuard({ children }: { children: React.ReactNode }) {
  const profile = usePatientProfileStore((s) => s.profile)
  const loading = usePatientProfileStore((s) => s.loading)

  return (
    <ProfileGuard
      profile={profile}
      loading={loading}
      role="patient"
      profileRoute="/patient/profile"
      roleName="Patient"
    >
      {children}
    </ProfileGuard>
  )
}