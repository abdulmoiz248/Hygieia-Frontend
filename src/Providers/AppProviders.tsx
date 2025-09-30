// src/providers/AppProviders.tsx
"use client"

import NutritionistProvider from "@/Providers/NutritionistsProvider"
import { PatientProvider } from "@/Providers/PatientProvider"
import LabTechProvider from "@/Providers/LabTechProvider"
import BlogsQueryProvider from "@/Providers/BlogsQueryProvider"

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NutritionistProvider>
      <PatientProvider>
        <LabTechProvider>
          <BlogsQueryProvider>
            {children}
          </BlogsQueryProvider>
        </LabTechProvider>
      </PatientProvider>
    </NutritionistProvider>
  )
}
