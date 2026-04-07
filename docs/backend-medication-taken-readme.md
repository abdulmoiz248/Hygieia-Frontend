# Backend README: Medication Taken Tracking

This document is for the backend developer who will implement the medication adherence endpoint used by the patient frontend.

## Previous routes and what they were doing

### Previous frontend route

- **Route:** `POST /api/patient/medications/taken`
- **What it did:** This was a Next.js API route inside the frontend app. It accepted the patient action and proxied the request to the backend.

### Previous backend route target

- **Route:** `POST /appointments/prescriptions/medications/taken`
- **What it did:** This is the backend endpoint the frontend has been calling to save the medication taken event. It should persist the adherence record in the database.

### Previous UI behavior

- The frontend previously allowed a toggle-style flow, which meant the same control could be used to mark and unmark a medicine.
- It also kept a temporary taken state on the device for the current day.
- That behavior has now been removed so the backend is the single source of truth.

## Frontend behavior

The frontend now behaves as a one-way workflow:

- When the patient clicks **Mark Taken**, the frontend sends the request to the backend immediately.
- The UI updates optimistically while the request is in flight.
- If the backend request fails, the frontend reverts the local state.
- The frontend does **not** store "taken" state in localStorage or on the device.
- The frontend does **not** allow unmarking from the UI.

So the backend is the source of truth.

---

## Required endpoint

### Save medication taken event

- **Method:** `POST`
- **Route:** `/appointments/prescriptions/medications/taken`

### Request body

```json
{
  "patientId": "uuid",
  "prescriptionId": "uuid",
  "medicationId": "uuid-or-string",
  "taken": true,
  "takenAt": "2026-04-07T09:00:00.000Z",
  "scheduledTime": "08:00 AM",
  "source": "patient-web"
}
```

### Expected rules

1. Validate `patientId`, `prescriptionId`, and `medicationId`.
2. Accept only `taken: true` from the frontend flow.
3. Insert a new medication adherence log row in the database.
4. Prevent duplicate entries for the same dose/day.
5. Return a success response with the created or existing log record.

---

## Recommended database behavior

Create a table such as `medication_adherence_logs` with:

- `id`
- `patient_id`
- `prescription_id`
- `medication_id`
- `taken`
- `taken_at`
- `scheduled_time`
- `source`
- `created_at`
- `updated_at`

### Recommended unique constraint

Use a unique key so the same dose is not inserted twice:

- `(patient_id, prescription_id, medication_id, DATE(taken_at))`

If the same payload is received again for the same day, update the existing row instead of creating a duplicate.

---

## Recommended response format

### Success

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
    "takenAt": "2026-04-07T09:00:00.000Z",
    "scheduledTime": "08:00 AM",
    "source": "patient-web"
  }
}
```

### Common errors

- `400` invalid payload
- `404` prescription or medication not found
- `409` duplicate or invalid state transition, if you choose to enforce it
- `500` server error

---

## Important frontend/backend alignment notes

- The frontend now sends the request immediately on click.
- The frontend no longer keeps a local device copy of "taken" state.
- The frontend disables unmarking, so the backend does not need to support "taken: false" for this flow.
- If the backend returns an error, the frontend shows the medication as not taken again.

---

## Suggested implementation note

If a medication is already marked taken for the same day, the backend should either:

- return the existing record with `success: true`, or
- respond with a clear `409` and message

The first option is usually smoother for the UI.
