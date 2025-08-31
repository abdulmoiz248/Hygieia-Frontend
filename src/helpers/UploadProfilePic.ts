import api from "@/lib/axios"
import { LabTechnicianProfile } from "@/store/lab-tech/userStore"
import { NutritionistProfile } from "@/store/nutritionist/userStore"

export async function uploadUserAvatar<
  T extends LabTechnicianProfile | NutritionistProfile
>(
  file: File,
  role: string,
  userId: string,
  updateField?: <K extends keyof T>(field: K, value: T[K]) => void
) {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const res = await api.post(
      `/auth/profile-pic?role=${role}&userId=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    if (res.data.success) {
      const img = res.data.img as string
      updateField?.("img" as keyof T, img as T[keyof T])
    }
  } catch (err: any) {
    console.error("Error uploading avatar:", err)
    throw err
  }
}
