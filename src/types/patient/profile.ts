export type ProfileType = {
  id:string
  name: string
  email: string
  phone: string
dateOfBirth: string
  address: string
  emergencyContact: string
  bloodType: string
  allergies: string
  conditions: string
  medications: string
  avatar: string
  gender: string
  weight: number
  height: number
  vaccines: string
  ongoingMedications: string
  surgeryHistory: string
  implants: string
  pregnancyStatus: string
  menstrualCycle: string
  mentalHealth: string
  familyHistory: string
  organDonor: string
  disabilities: string
  lifestyle: string
  healthscore:number 
  adherence :number| string
  missed_doses:number| string
  doses_taken:number| string
  limit:Limit
}


export type Limit= {
  sleep?: number
  water?: number
  steps?: number
  protein?: number
  carbs?: number
  fats?: number
}