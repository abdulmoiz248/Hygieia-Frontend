export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedat: string
  readTime: number
  readtime?: number
  category: string
  tags: string[]
  image: string
  featured: boolean
  isFeatured?: boolean
  verified?: boolean
  isVerified?: boolean
  isverified?: boolean
  status?: string
}

export interface BlogCategory {
  id: string
  name: string
  description: string
  color: string
}
