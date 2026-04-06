import { create } from "zustand"

interface NewsletterStore {
  newslettersSent: number
  blogpostsSent: number
  incrementNewsletters: () => void
  incrementBlogposts: () => void
}

export const useNewsletterStore = create<NewsletterStore>((set) => ({
  newslettersSent: 0,
  blogpostsSent: 0,
  incrementNewsletters: () => set((s) => ({ newslettersSent: s.newslettersSent + 1 })),
  incrementBlogposts:   () => set((s) => ({ blogpostsSent:   s.blogpostsSent   + 1 })),
}))
