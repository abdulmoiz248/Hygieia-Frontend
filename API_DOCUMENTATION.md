# Hygieia API Documentation

Complete API documentation for the Hygieia Healthcare Management System.

---

## Table of Contents
1. [Patient APIs](#patient-apis)
2. [Nutritionist APIs](#nutritionist-apis)
3. [Lab Tech APIs](#lab-tech-apis)
4. [Authentication APIs](#authentication-apis)
5. [Blog APIs](#blog-apis)
6. [Next.js API Routes](#nextjs-api-routes)

---

## Base URLs

- **Main API**: `process.env.NEXT_PUBLIC_URL` (configured in environment)
- **Patient API**: `${NEXT_PUBLIC_URL}/api/patient`
- **Lab Tech API**: `http://localhost:4000/booked-lab-tests`

---

## Patient APIs

### 1. Appointments

#### Get Patient Appointments
**Route**: `GET /appointments/patient`

**Query Parameters**:
```json
{
  "patientId": "string (required)"
}
```

**Response**:
```json
[
  {
    "id": "string",
    "patientId": "string",
    "doctorId": "string",
    "date": "string",
    "time": "string",
    "status": "scheduled | completed | cancelled",
    "type": "string",
    "notes": "string",
    "mode": "online | in-person",
    "dataShared": "boolean"
  }
]
```

---

#### Get Appointment by ID
**Route**: `GET /appointments/:id`

**Path Parameters**:
- `id`: Appointment ID (string)

**Response**:
```json
{
  "id": "string",
  "patientId": "string",
  "doctorId": "string",
  "date": "string",
  "time": "string",
  "status": "string",
  "type": "string",
  "notes": "string",
  "mode": "string",
  "dataShared": "boolean"
}
```

---

#### Create Appointment
**Route**: `POST /appointments`

**Body**:
```json
{
  "patientId": "string (required)",
  "doctorId": "string (required)",
  "date": "string (required)",
  "time": "string (required)",
  "status": "string",
  "type": "string",
  "notes": "string",
  "mode": "online | in-person",
  "dataShared": "boolean"
}
```

**Response**:
```json
{
  "id": "string",
  "message": "Appointment created successfully"
}
```

---

#### Update Appointment
**Route**: `PATCH /appointments/:id`

**Path Parameters**:
- `id`: Appointment ID (string)

**Body**:
```json
{
  "date": "string (optional)",
  "time": "string (optional)",
  "status": "string (optional)",
  "notes": "string (optional)"
}
```

**Response**:
```json
{
  "id": "string",
  "message": "Appointment updated successfully"
}
```

---

#### Cancel Appointment (Patient)
**Route**: `PATCH /appointments/:id`

**Path Parameters**:
- `id`: Appointment ID (string)

**Body**:
```json
{
  "status": "cancelled"
}
```

**Response**:
```json
{
  "id": "string",
  "status": "cancelled",
  "message": "Appointment cancelled successfully"
}
```

---

### 2. Profile

#### Get Patient Profile
**Route**: `GET /api/patient/profile`

**Headers**:
```json
{
  "patient": "string (JWT token)"
}
```

**Response**:
```json
{
  "success": true,
  "initialState": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "dateOfBirth": "string",
    "address": "string",
    "emergencyContact": "string",
    "bloodType": "string",
    "allergies": "string",
    "conditions": "string",
    "medications": "string",
    "avatar": "string",
    "gender": "string",
    "weight": "number",
    "height": "number",
    "vaccines": "string",
    "ongoingMedications": "string",
    "surgeryHistory": "string",
    "implants": "string",
    "pregnancyStatus": "string",
    "menstrualCycle": "string",
    "mentalHealth": "string",
    "familyHistory": "string",
    "organDonor": "string",
    "disabilities": "string",
    "lifestyle": "string",
    "healthscore": "number",
    "adherence": "number",
    "missed_doses": "number",
    "doses_taken": "number",
    "limit": {
      "sleep": "number",
      "water": "number",
      "steps": "number",
      "protein": "number",
      "carbs": "number",
      "fats": "number"
    }
  }
}
```

---

#### Update Patient Profile
**Route**: `PUT /api/patient/profile`

**Headers**:
```json
{
  "patient": "string (JWT token)"
}
```

**Body** (all fields optional):
```json
{
  "name": "string",
  "phone": "string",
  "address": "string",
  "bloodType": "string",
  "allergies": "string",
  "weight": "number",
  "height": "number",
  "lifestyle": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

#### Upload Profile Avatar
**Route**: `POST /api/patient/upload-avatar`

**Headers**:
```json
{
  "patient": "string (JWT token)",
  "Content-Type": "multipart/form-data"
}
```

**Body** (FormData):
```
avatar: File (required)
```

**Response**:
```json
{
  "avatarUrl": "string"
}
```

---

#### Delete Profile
**Route**: `DELETE /api/patient/profile`

**Headers**:
```json
{
  "patient": "string (JWT token)"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

---

### 3. Medical Records

#### Get Patient Medical Records
**Route**: `GET /medical-records/patient/:patientId`

**Path Parameters**:
- `patientId`: Patient ID (string)

**Response**:
```json
[
  {
    "id": "string",
    "title": "string",
    "record_type": "string",
    "date": "string (ISO date)",
    "file_url": "string",
    "doctor_name": "string (optional)"
  }
]
```

---

#### Upload Medical Record
**Route**: `POST /medical-records/upload`

**Headers**:
```json
{
  "Content-Type": "multipart/form-data"
}
```

**Body** (FormData):
```
file: File (required)
title: string (required)
recordType: string (required)
patientId: string (required)
```

**Response**:
```json
{
  "id": "string",
  "title": "string",
  "record_type": "string",
  "date": "string",
  "file_url": "string",
  "doctor_name": "string"
}
```

---

#### Delete Medical Record
**Route**: `DELETE /medical-records/:id`

**Path Parameters**:
- `id`: Record ID (string)

**Query Parameters**:
```json
{
  "patientId": "string (required)"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Medical record deleted successfully"
}
```

---

### 4. Lab Tests

#### Get All Available Lab Tests
**Route**: `GET /lab-tests`

**Response**:
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "preparationInstructions": ["string"]
  }
]
```

---

#### Get Patient's Booked Lab Tests
**Route**: `GET /booked-lab-tests/patient/:patientId`

**Path Parameters**:
- `patientId`: Patient ID (string)

**Response**:
```json
[
  {
    "id": "string",
    "test_id": "string",
    "testName": "string",
    "scheduled_date": "string",
    "scheduled_time": "string",
    "location": "string",
    "instructions": ["string"],
    "bookedAt": "string (ISO date)",
    "status": "pending | completed | cancelled"
  }
]
```

---

#### Book Lab Test
**Route**: `POST /booked-lab-tests`

**Body**:
```json
{
  "testName": "string (required)",
  "testId": "string (required)",
  "patientId": "string (required)",
  "scheduledDate": "string (required)",
  "scheduledTime": "string (required)",
  "location": "string (optional)",
  "instructions": ["string"] (optional)
}
```

**Response**:
```json
{
  "id": "string",
  "test_id": "string",
  "scheduled_date": "string",
  "scheduled_time": "string",
  "location": "string",
  "instructions": ["string"],
  "status": "pending"
}
```

---

#### Cancel Lab Test Booking
**Route**: `PATCH /booked-lab-tests/:bookingId/cancel`

**Path Parameters**:
- `bookingId`: Booking ID (string)

**Response**:
```json
{
  "id": "string",
  "status": "cancelled",
  "message": "Lab test booking cancelled successfully"
}
```

---

### 5. Workout Sessions

#### Get Patient Workout Sessions
**Route**: `GET /workout-sessions/patient/:patientId`

**Path Parameters**:
- `patientId`: Patient ID (string)

**Response**:
```json
[
  {
    "id": "string",
    "exercises": [
      {
        "id": "string",
        "name": "string",
        "type": "strength | cardio | flexibility | hiit",
        "sets": "number (optional)",
        "reps": "number (optional)",
        "duration": "number (optional)",
        "caloriesBurned": "number (optional)",
        "difficulty": "easy | medium | hard"
      }
    ],
    "total_duration": "number",
    "total_calories": "number",
    "created_at": "string (ISO date)"
  }
]
```

---

#### Create Workout Session
**Route**: `POST /workout-sessions`

**Body**:
```json
{
  "patientId": "string (required)",
  "routineId": "string (required)",
  "exercises": [
    {
      "id": "string",
      "name": "string",
      "type": "strength | cardio | flexibility | hiit",
      "sets": "number (optional)",
      "reps": "number (optional)",
      "duration": "number (optional)",
      "caloriesBurned": "number (optional)",
      "difficulty": "easy | medium | hard"
    }
  ],
  "totalDuration": "number (required)",
  "totalCalories": "number (required)"
}
```

**Response**:
```json
{
  "id": "string",
  "created_at": "string",
  "message": "Workout session created successfully"
}
```

---

#### Update Workout Session
**Route**: `PATCH /workout-sessions/:id`

**Path Parameters**:
- `id`: Session ID (string)

**Body**:
```json
{
  "routineId": "string",
  "exercises": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "sets": "number",
      "reps": "number",
      "duration": "number",
      "caloriesBurned": "number",
      "difficulty": "string"
    }
  ],
  "totalDuration": "number",
  "totalCalories": "number"
}
```

**Response**:
```json
{
  "id": "string",
  "created_at": "string",
  "message": "Workout session updated successfully"
}
```

---

#### Delete Workout Session
**Route**: `DELETE /workout-sessions/:id`

**Path Parameters**:
- `id`: Session ID (string)

**Response**:
```json
{
  "success": true,
  "message": "Workout session deleted successfully"
}
```

---

### 6. Fitness Tracking

#### Get Fitness Data
**Route**: `GET /fitness`

**Query Parameters**:
```json
{
  "userId": "string (required)"
}
```

**Response**:
```json
{
  "steps": "number",
  "water": "number",
  "sleep": "number",
  "calories_burned": "number",
  "calories_intake": "number",
  "protein": "number",
  "fat": "number",
  "carbs": "number"
}
```

---

#### Update Fitness Data
**Route**: `POST /fitness`

**Body**:
```json
{
  "userId": "string (required)",
  "updates": {
    "steps": "number (optional)",
    "water": "number (optional)",
    "sleep": "number (optional)",
    "calories_intake": "number (optional)",
    "calories_burned": "number (optional)",
    "protein": "number (optional)",
    "fat": "number (optional)",
    "carbs": "number (optional)"
  }
}
```

**Response**:
```json
{
  "steps": "number",
  "water": "number",
  "sleep": "number",
  "calories_burned": "number",
  "calories_intake": "number",
  "protein": "number",
  "fat": "number",
  "carbs": "number"
}
```

---

### 7. Diet Plans

#### Get Patient Diet Plan
**Route**: `GET /diet-plans/patient/:patientId`

**Path Parameters**:
- `patientId`: Patient ID (string)

**Response**:
```json
{
  "id": "string",
  "daily_calories": "string",
  "protein": "string",
  "carbs": "string",
  "fat": "string",
  "deficiency": "string",
  "notes": "string",
  "calories_burned": "string",
  "exercise": "string",
  "start_date": "string",
  "end_date": "string",
  "patient_id": "string",
  "nutritionist_id": "string"
}
```

---

## Nutritionist APIs

### 1. Appointments

#### Cancel Appointment (Nutritionist)
**Route**: `PATCH /appointments/:appointmentId/cancel`

**Path Parameters**:
- `appointmentId`: Appointment ID (string)

**Body**:
```json
{
  "reason": "string (required)",
  "notes": "string (optional)",
  "cancelledBy": "doctor",
  "nutritionistId": "string (required)"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "appointment": {
    "id": "string",
    "status": "cancelled",
    "cancellationReason": "string",
    "cancellationNotes": "string",
    "cancelledAt": "string (ISO date)",
    "cancelledBy": "doctor"
  }
}
```

---

### 2. Nutritionists

#### Get All Nutritionists
**Route**: `GET /nutritionists`

**Response**:
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "gender": "string",
    "dateofbirth": "string",
    "img": "string",
    "specialization": "string",
    "experienceYears": "number",
    "certifications": ["string"],
    "education": ["string"],
    "languages": ["string"],
    "bio": "string",
    "consultationFee": "number",
    "workingHours": [
      {
        "day": "string",
        "start": "string",
        "end": "string",
        "location": "string"
      }
    ],
    "rating": "number"
  }
]
```

---

### 3. Diet Plans

#### Update Diet Plan
**Route**: `PATCH /diet-plans/:dietPlanId`

**Path Parameters**:
- `dietPlanId`: Diet Plan ID (string)

**Body**:
```json
{
  "daily_calories": "string (optional)",
  "protein": "string (optional)",
  "carbs": "string (optional)",
  "fat": "string (optional)",
  "deficiency": "string (optional)",
  "notes": "string (optional)",
  "calories_burned": "string (optional)",
  "exercise": "string (optional)",
  "start_date": "string (optional)",
  "end_date": "string (optional)",
  "nutritionist_id": "string (required)"
}
```

**Response**:
```json
{
  "id": "string",
  "daily_calories": "string",
  "protein": "string",
  "carbs": "string",
  "fat": "string",
  "deficiency": "string",
  "notes": "string",
  "calories_burned": "string",
  "exercise": "string",
  "start_date": "string",
  "end_date": "string",
  "patient_id": "string",
  "nutritionist_id": "string"
}
```

---

## Blog APIs

### 1. Get Nutritionist's Blogs
**Route**: `GET /blogPost/doctor/:doctorId`

**Path Parameters**:
- `doctorId`: Nutritionist/Doctor ID (string)

**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "excerpt": "string",
      "content": "string",
      "author": {
        "name": "string",
        "role": "string",
        "avatar": "string"
      },
      "publishedat": "string (ISO date)",
      "readtime": "number",
      "category": "string",
      "tags": ["string"],
      "image": "string",
      "featured": "boolean",
      "doctor_id": "string"
    }
  ]
}
```

---

### 2. Create Blog Post
**Route**: `POST /blogPost`

**Headers**:
```json
{
  "Content-Type": "multipart/form-data"
}
```

**Body** (FormData):
```
title: string (required)
excerpt: string (optional)
content: string (required)
category: string (optional)
tags: string[] (optional)
image: File (optional)
doctorId: string (required)
author: string (required)
```

**Response**:
```json
{
  "id": "string",
  "message": "Blog post created successfully"
}
```

---

### 3. Update Blog Post
**Route**: `PUT /blogPost/:id`

**Path Parameters**:
- `id`: Blog Post ID (string)

**Headers**:
```json
{
  "Content-Type": "multipart/form-data"
}
```

**Body** (FormData):
```
title: string (optional)
excerpt: string (optional)
content: string (optional)
category: string (optional)
tags: string[] (optional)
image: File (optional)
doctorId: string (required)
```

**Response**:
```json
{
  "id": "string",
  "message": "Blog post updated successfully"
}
```

---

### 4. Delete Blog Post
**Route**: `DELETE /blogPost/:id`

**Path Parameters**:
- `id`: Blog Post ID (string)

**Response**:
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

---

## Lab Tech APIs

### 1. Upload Scan
**Route**: `POST /booked-lab-tests/:id/upload-scan`

**Path Parameters**:
- `id`: Booked Lab Test ID (string)

**Headers**:
```json
{
  "Content-Type": "multipart/form-data"
}
```

**Body** (FormData):
```
file: File (required)
```

**Response**:
```json
{
  "success": true,
  "message": "Scan uploaded successfully"
}
```

---

### 2. Upload Result
**Route**: `POST /booked-lab-tests/:id/upload-result`

**Path Parameters**:
- `id`: Booked Lab Test ID (string)

**Body**:
```json
{
  "resultData": {
    "key": "value"
  },
  "title": "string (required)"
}
```

**Response**:
```json
{
  "file_url": "string",
  "message": "Result uploaded successfully"
}
```

---

## Authentication APIs

### 1. Create User
**Route**: `POST /auth/user`

**Query Parameters**:
```json
{
  "role": "patient | nutritionist | lab-tech (required)"
}
```

**Body**:
```json
{
  "profileData": {
    "name": "string (required)",
    "email": "string (required)",
    "password": "string (required)",
    "phone": "string (optional)",
    "gender": "string (optional)",
    "dateofbirth": "string (optional)"
  }
}
```

**Response**:
```json
{
  "success": true,
  "userId": "string",
  "token": "string",
  "message": "User created successfully"
}
```

---

### 2. Upload Profile Picture
**Route**: `POST /auth/user/:userId/upload-picture`

**Path Parameters**:
- `userId`: User ID (string)

**Headers**:
```json
{
  "Content-Type": "multipart/form-data"
}
```

**Body** (FormData):
```
file: File (required)
```

**Response**:
```json
{
  "imageUrl": "string",
  "message": "Profile picture uploaded successfully"
}
```

---

## Next.js API Routes

### 1. Generate Blog Image (AI)
**Route**: `POST /api/generateImage`

**Body**:
```json
{
  "title": "string (optional)",
  "excerpt": "string (optional)",
  "content": "string (optional)"
}
```

**Note**: At least one field must be provided.

**Response**:
```json
{
  "imageUrl": "string (base64 data URL)"
}
```

**Error Response**:
```json
{
  "error": "string"
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Detailed error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

---

## Notes

1. **Authentication**: Most patient APIs require authentication via JWT token in headers or localStorage.
2. **File Uploads**: All file upload endpoints use `multipart/form-data` content type.
3. **Date Formats**: All dates are in ISO 8601 format (e.g., "2026-01-03T10:30:00Z").
4. **IDs**: All IDs are strings (UUIDs).
5. **Environment Variables**: Configure `NEXT_PUBLIC_URL` and `HF_TOKEN` in your `.env` file.

---

**Last Updated**: January 3, 2026
