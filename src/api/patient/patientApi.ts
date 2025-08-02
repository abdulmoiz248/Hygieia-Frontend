import axios from "axios"

const patientApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_URL}/api/patient`,
})

export default patientApi
