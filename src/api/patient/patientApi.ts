import axios from "axios"

const backendBase = process.env.NEXT_PUBLIC_URL || "http://localhost:4000"

const patientApi = axios.create({
  baseURL: `${backendBase}/api/patient`,
})

export default patientApi
