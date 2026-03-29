export interface FaqItem {
  id?: string
  question: string
  answer: string
}

export interface FaqResponse {
  data: FaqItem[]
}