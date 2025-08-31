import api from "@/lib/axios";
import { LabTechnicianProfile } from "@/store/lab-tech/userStore";


export async function uploadUserAvatar(file: File, role: string, userId: string,updateField?:<K extends keyof LabTechnicianProfile>(
    field: K,
    value: LabTechnicianProfile[K]
  ) => void) {
  const formData = new FormData();
  formData.append('file', file); // key must match FileInterceptor('file')

  try {
    const res = await api.post(
      `/auth/profile-pic?role=${role}&userId=${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // ✅ important
        },
      }
    );

    if (res.data.success && role=='lab-technician') {
      const img = res.data.img;
      updateField?.('img', img);
    }
  } catch (err: any) {
    console.error('Error uploading avatar:', err);
    throw err;
  }
}