const API = "http://localhost:4000/faqs"

export interface FaqItem {
  id?: string
  question: string
  answer: string
}

export async function fetchFaqs(): Promise<FaqItem[]> {
  const res = await fetch(API)
  const data = await res.json()
  return data.data
}

export async function createFaq(
  faq: Omit<FaqItem, "id">,
  userId: string
): Promise<void> {
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...faq, userId }),
  })
}

export async function updateFaq(
  id: string,
  faq: Omit<FaqItem, "id">,
  userId: string
): Promise<void> {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...faq, userId }),
  })
}

export async function deleteFaq(id: string, userId: string): Promise<void> {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  })
}