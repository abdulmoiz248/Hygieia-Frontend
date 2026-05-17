import { LabTest, LabTestFormData } from "@/types/admin/labTests"

const BASE = "http://localhost:4000"

export async function fetchLabTests(): Promise<LabTest[]> {
  const res = await fetch(`${BASE}/lab-tests`)
  if (!res.ok) throw new Error("Failed to fetch lab tests.")
  return res.json()
}

export async function fetchLabTestById(id: string): Promise<LabTest> {
  const res = await fetch(`${BASE}/lab-tests/${id}`)
  if (!res.ok) throw new Error("Failed to fetch lab test.")
  return res.json()
}

export async function createLabTest(
  userId: string,
  data: LabTestFormData
): Promise<LabTest> {
  const res = await fetch(`${BASE}/lab-tests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...data }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? "Failed to create lab test.")
  }
  const json = await res.json()
  return json.data ?? json
}

export async function updateLabTest(
  id: string,
  userId: string,
  data: Partial<LabTestFormData>
): Promise<LabTest> {
  const res = await fetch(`${BASE}/lab-tests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...data }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? "Failed to update lab test.")
  }
  const json = await res.json()
  return json.data ?? json
}

export async function deleteLabTest(id: string, userId: string): Promise<void> {
  const res = await fetch(`${BASE}/lab-tests/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? "Failed to delete lab test.")
  }
}
