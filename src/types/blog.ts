export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedat: string
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
