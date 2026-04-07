# Patient Frontend Integration — Medication Taken Tracking

This document describes the API contract for saving patient medicine intake actions ("Mark as Taken") and retrieving medication logs.

## What is already implemented in frontend

Frontend now sends an event whenever a patient marks/unmarks a medicine:

- Internal frontend route (Next.js): `POST /api/patient/medications/taken`
- This route currently proxies to backend target:
  - `POST /appointments/prescriptions/medications/taken`
- Payload includes:
  - `patientId`
  - `prescriptionId`
  - `medicationId`
  - `taken` (boolean)
  - `takenAt` (ISO timestamp)
  - `scheduledTime` (string, optional)
  - `source` (`"patient-web"`)

---

## Backend API Required

### 1) Save medication taken/un-taken event

- **Method:** `POST`
- **Route:** `/appointments/prescriptions/medications/taken`
- **Purpose:** Persist medicine adherence event from patient dashboard.

### Request Body

```json
{
  "patientId": "uuid",
  "prescriptionId": "uuid",
  "medicationId": "uuid-or-string",
  "taken": true,
  "takenAt": "2026-03-18T09:00:00.000Z",
  "scheduledTime": "08:00 AM",
  "source": "patient-web"
}
```

### Suggested Behavior

- Upsert by unique key: `(patientId, prescriptionId, medicationId, date(takenAt))`
- If the same key exists, return the existing record or update `takenAt`
- Frontend only sends `taken: true` for this flow

### Success Response (example)

```json
{
  "success": true,
  "message": "Medication status saved",
  "data": {
    "id": "log-uuid",
    "patientId": "uuid",
    "prescriptionId": "uuid",
    "medicationId": "uuid-or-string",
    "taken": true,
    "takenAt": "2026-03-18T09:00:00.000Z",
    "scheduledTime": "08:00 AM",
    "date": "2026-03-18"
  }
}
```

### Error Responses

- `400` invalid payload / missing IDs
- `404` prescription or medication not found for patient
- `409` duplicate or invalid state transition (optional)
- `500` server error

---

### 2) Get medication logs by date range (recommended)

- **Method:** `GET`
- **Route:** `/appointments/prescriptions/medications/logs`
- **Query params:**
  - `patientId` (required)
  - `from` (YYYY-MM-DD, optional)
  - `to` (YYYY-MM-DD, optional)
- **Purpose:** Power adherence charts, dose history, and future analytics.

### Success Response (example)

```json
{
  "success": true,
  "data": [
    {
      "id": "log-uuid",
      "patientId": "uuid",
      "prescriptionId": "uuid",
      "medicationId": "uuid-or-string",
      "taken": true,
      "takenAt": "2026-03-18T09:00:00.000Z",
      "scheduledTime": "08:00 AM",
      "date": "2026-03-18",
      "created_at": "2026-03-18T09:00:01.000Z",
      "updated_at": "2026-03-18T09:00:01.000Z"
    }
  ]
}
```

---

## DB/Model suggestion (backend)

Table: `medication_adherence_logs`

- `id` (uuid, pk)
- `patient_id` (uuid, index)
- `prescription_id` (uuid, index)
- `medication_id` (string)
- `taken` (boolean)
- `taken_at` (timestamp)
- `scheduled_time` (string, nullable)
- `source` (string, default `patient-web`)
- `created_at`
- `updated_at`

Recommended unique composite index:

- `(patient_id, prescription_id, medication_id, DATE(taken_at))`

---

## Notes for backend dev

- Current frontend sends medication IDs as provided by prescription API. If medication IDs are not globally unique, keep them scoped by prescription.
- Frontend uses optimistic UI: if API fails, UI reverts to previous state.
- Frontend currently expects standard JSON error body with `message`.
