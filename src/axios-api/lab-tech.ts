import axios from "axios"

export const LabTechapi = axios.create({
  baseURL: "http://localhost:4000/booked-lab-tests", 
  headers: {
    "Content-Type": "application/json",
  },
})
