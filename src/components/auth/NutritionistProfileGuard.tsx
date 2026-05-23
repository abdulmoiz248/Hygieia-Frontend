"use client"

// components/auth/NutritionistProfileGuard.tsx

import ProfileGuard from "@/components/auth/ProfileGuard"
import useNutritionistStore from "@/store/nutritionist/userStore"

export default function NutritionistProfileGuard({ children }: { children: React.ReactNode }) {
  const profile = useNutritionistStore((s) => s.profile)
  const loading = useNutritionistStore((s) => s.loading)

  return (
    <ProfileGuard
      profile={profile as any}
      loading={loading}
      role="nutritionist"
      profileRoute="/nutritionist/profile"
      roleName="Nutritionist"
    >
      {children}
    </ProfileGuard>
  )
}