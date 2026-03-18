"use client"

import { useQuery } from "@tanstack/react-query"
import type { Doctor } from "@/types"
import api from "@/lib/axios"

async function fetchDoctors(): Promise<Doctor[]> {
  const res = await api.get('/doctors')

  if (!res.data) throw new Error("Failed to fetch doctors")

  const mapped: Doctor[] = res.data.map((doctor: any) => ({
    id: doctor.id || doctor._id,
    name: doctor.name,
    email: doctor.personal_email || doctor.email || "",
    phone: doctor.phone,
    gender: doctor.gender,
    dateofbirth: doctor.dateofbirth,
    img: doctor.img,
    specialization: doctor.specialization,
    experienceYears: doctor.experienceYears || 0,
    certifications: doctor.certifications || [],
    education: doctor.education || [],
    languages: doctor.languages || [],
    bio: doctor.bio,
    consultationFee: doctor.consultationFee || 0,
    workingHours: (doctor.workingHours || []).map((workingHour: any) => ({
      day: workingHour.day,
      start: workingHour.start,
      end: workingHour.end,
      location: workingHour.location || "",
    })),
    rating: doctor.rating || 0,
  }))

  return mapped
}

export function useDoctors() {
  return useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  })
}
