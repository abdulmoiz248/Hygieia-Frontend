export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    role: string
    avatar: string
  }
  publishedAt: string
  readTime: number
  category: string
  tags: string[]
  image: string
  featured: boolean
}

export interface BlogCategory {
  id: string
  name: string
  description: string
  color: string
}
