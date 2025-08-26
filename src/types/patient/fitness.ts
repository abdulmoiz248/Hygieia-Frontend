
export type Goal = {
  id: string
  type: string
  unit: string
  current: number
  target: number
}

export type DayStatus = {
  date: string
  completed: boolean
}



export type FitnessState = {
  goals: Goal[]
  activityLog: DayStatus[]
  caloriesConsumed: number
  caloriesBurned: number
  proteinConsumed: number
  fatConsumed: number
  carbsConsumed:number
  loading:boolean
  error: string | null
}
