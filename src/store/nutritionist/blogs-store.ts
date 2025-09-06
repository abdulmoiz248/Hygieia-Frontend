// stores/useBlogStore.ts
import { create } from 'zustand'
import api from '@/lib/axios'

export interface Blog {
  id: string
  title: string
  excerpt?: string
  content?: string
  author?: { name: string; role: string; avatar: string }
  publishedat?: string
  readtime?: number
  category?: string
  tags?: string[]
  image?: string
  featured?: boolean
  doctor_id?: string
}

interface BlogState {
  blogs: Blog[]
  loading: boolean
  error: string | null
  fetchBlogs: () => Promise<void>
  createBlog: (formData: FormData) => Promise<void>
  updateBlog: (id: string, formData: FormData) => Promise<void>
  deleteBlog: (id: string) => Promise<void>
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  loading: false,
  error: null,

  fetchBlogs: async () => {
    try {
      set({ loading: true, error: null })
      const doctorId = localStorage.getItem('id')
      if (!doctorId) {
        set({ blogs: [], loading: false, error: 'Doctor ID not found' })
        return
      }
      const res = await api.get(`/blogPost/doctor/${doctorId}`)
      set({ blogs: res.data.data || [], loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  createBlog: async (formData: FormData) => {
    try {
      set({ loading: true, error: null })
      const doctorId = localStorage.getItem('id')
      if (doctorId) {
        formData.append('doctorId', doctorId)
      }
      await api.post('/blogPost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await get().fetchBlogs()
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  updateBlog: async (id: string, formData: FormData) => {
    try {
      set({ loading: true, error: null })
      const doctorId = localStorage.getItem('id')
      if (doctorId) {
        formData.append('doctorId', doctorId)
      }
      await api.put(`/blogPost/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await get().fetchBlogs()
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  deleteBlog: async (id: string) => {
    try {
      set({ loading: true, error: null })
      await api.delete(`/blogPost/${id}`)
      await get().fetchBlogs()
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
}))
