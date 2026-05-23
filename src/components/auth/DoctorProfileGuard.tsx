"use client"

// components/auth/DoctorProfileGuard.tsx

import ProfileGuard from "@/components/auth/ProfileGuard"
import useDoctorStore from "@/store/doctor/doctor-store"

export default function DoctorProfileGuard({ children }: { children: React.ReactNode }) {
  const profile = useDoctorStore((s) => s.profile)
  const loading = useDoctorStore((s) => s.loading)

  return (
    <ProfileGuard
      profile={profile as any}
      loading={loading}
      role="doctor"
      profileRoute="/doctor/profile"
      roleName="Doctor"
    >
      {children}
    </ProfileGuard>
  )
}