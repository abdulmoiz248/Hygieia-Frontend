import api from '@/lib/axios'
import { LabTest, LabTestFormData } from "@/types/admin/labTests"

type BackendRecordType = "lab" | "scan"

function toBackendRecordType(value: LabTestFormData["record_type"]): BackendRecordType {
  return value === "scan" ? "scan" : "lab"
}

function fromBackendRecordType(value?: string): LabTest["record_type"] {
  return value === "scan" ? "scan" : "report"
}

function normalizeLabTest(test: LabTest & { record_type?: string }): LabTest {
  return {
    ...test,
    record_type: fromBackendRecordType(test.record_type),
  }
}

export async function fetchLabTests(): Promise<LabTest[]> {
  const res = await api.get<LabTest[]>('/lab-tests')
  return res.data.map((test) => normalizeLabTest(test))
}

export async function fetchLabTestById(id: string): Promise<LabTest> {
  const res = await api.get<LabTest>(`/lab-tests/${id}`)
  return normalizeLabTest(res.data)
}

function extractError(e: unknown, fallback = 'Request failed') {
  try {
    // axios errors may have response.data.message
    const anyErr: any = e
    return (anyErr?.response?.data?.message) || anyErr?.message || fallback
  } catch {
    return fallback
  }
}

export async function createLabTest(
  userId: string,
  data: LabTestFormData
): Promise<LabTest> {
  try {
    const payload = {
      userId,
      ...data,
      record_type: toBackendRecordType(data.record_type),
    }
    const res = await api.post('/lab-tests', payload)
    const created = (res.data && (res.data.data ?? res.data)) as LabTest
    return normalizeLabTest(created)
  } catch (e) {
    throw new Error(extractError(e, 'Failed to create lab test.'))
  }
}

export async function updateLabTest(
  id: string,
  userId: string,
  data: Partial<LabTestFormData>
): Promise<LabTest> {
  try {
    const payload = {
      userId,
      ...data,
      record_type: data.record_type ? toBackendRecordType(data.record_type) : undefined,
    }
    const res = await api.patch(`/lab-tests/${id}`, payload)
    const updated = (res.data && (res.data.data ?? res.data)) as LabTest
    return normalizeLabTest(updated)
  } catch (e) {
    throw new Error(extractError(e, 'Failed to update lab test.'))
  }
}

export async function deleteLabTest(id: string, userId: string): Promise<void> {
  try {
    await api.delete(`/lab-tests/${id}`, { data: { userId } })
  } catch (e) {
    throw new Error(extractError(e, 'Failed to delete lab test.'))
  }
}
