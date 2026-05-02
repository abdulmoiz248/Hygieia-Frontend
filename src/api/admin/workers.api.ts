import { Worker, Role } from "@/types/admin/workers"

const BASE = "http://localhost:4000"

// ─── Shared mapper helpers ────────────────────────────────────────────────────

function mapDoctor(d: any): Worker {
  return { ...d, _id: d._id ?? d.id, email: d.email ?? "", role: "doctor" as Role }
}

function mapNutritionist(n: any): Worker {
  return { ...n, _id: n._id ?? n.id, email: n.email ?? "", role: "nutritionist" as Role }
}

function mapLabTechnician(t: any): Worker {
  return {
    _id: t._id ?? t.id,
    id: t.id,
    email: t.email ?? "",
    name: t.name ?? "",
    phone: t.phone ?? "",
    gender: t.gender ?? "",
    dateofbirth: t.dateofbirth ?? "",
    img: t.img ?? "",
    personal_email: t.personal_email ?? "",
    specialization: "",
    experienceYears: 0,
    certifications: [],
    education: [],
    languages: [],
    bio: "",
    consultationFee: 0,
    workingHours: [],
    rating: 0,
    createdAt: t.created_at ?? "",   // ← was hardcoded "" — API returns snake_case
    role: "pathologist" as Role,
  }
}

// ─── Fetch functions ──────────────────────────────────────────────────────────

export async function fetchDoctors(): Promise<Worker[]> {
  const res = await fetch(`${BASE}/doctors`)
  if (!res.ok) throw new Error("Failed to fetch doctors")
  const data = await res.json()
  return (Array.isArray(data) ? data : data.doctors ?? []).map(mapDoctor)
}

export async function fetchNutritionists(): Promise<Worker[]> {
  const res = await fetch(`${BASE}/nutritionists`)
  if (!res.ok) throw new Error("Failed to fetch nutritionists")
  const data = await res.json()
  return (Array.isArray(data) ? data : data.nutritionists ?? []).map(mapNutritionist)
}

export async function fetchPathologists(): Promise<Worker[]> {
  const res = await fetch(`${BASE}/lab-technicians`)
  if (!res.ok) throw new Error("Failed to fetch lab technicians")
  const data = await res.json()
  return (Array.isArray(data) ? data : []).map(mapLabTechnician)
}

// ─── Mutations ────────────────────────────────────────────────────────────────
export interface RegisterWorkerPayload {
  name:          string
  role:          string   // "doctor" | "nutritionist" | "lab-technician"
  personalEmail: string
}

export async function registerWorker(payload: RegisterWorkerPayload): Promise<{
  id: string
  email: string
  role: string
}> {
  const { name, role, personalEmail } = payload
  const res = await fetch(`${BASE}/auth/register-worker`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role, personalEmail }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? "Registration failed")
  }
  const data = await res.json()
  return data.data ?? data
}

export interface DeleteWorkerPayload {
  email: string
}

export async function deleteWorker(payload: DeleteWorkerPayload): Promise<void> {
  const res = await fetch(`${BASE}/auth/delete-worker`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload.email }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? "Delete failed")
  }
}
