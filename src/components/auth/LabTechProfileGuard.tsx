"use client"

// components/auth/LabTechProfileGuard.tsx

import ProfileGuard from "@/components/auth/ProfileGuard"
import useLabTechnicianStore from "@/store/lab-tech/userStore"

export default function LabTechProfileGuard({ children }: { children: React.ReactNode }) {
  const profile = useLabTechnicianStore((s) => s.profile)
  const loading = useLabTechnicianStore((s) => s.loading)

  return (
    <ProfileGuard
      profile={profile as any}
      loading={loading}
      role="lab-technician"
      profileRoute="/lab-tech/profile"
      roleName="Pathologist"
    >
      {children}
    </ProfileGuard>
  )
}