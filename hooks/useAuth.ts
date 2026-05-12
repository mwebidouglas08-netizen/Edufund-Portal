// hooks/useAuth.ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

interface User {
  id: string
  fullName: string
  email: string
  phone: string
  role: 'STUDENT' | 'PARENT' | 'ADMIN'
  isVerified: boolean
  unreadNotifications?: number
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

interface RegisterData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          if (!data.success) {
            toast.error(data.error || 'Login failed')
            return false
          }
          set({ user: data.data.user, token: data.data.token })
          toast.success(`Welcome back, ${data.data.user.fullName.split(' ')[0]}!`)
          return true
        } catch {
          toast.error('Network error. Please try again.')
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (formData) => {
        set({ isLoading: true })
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
          const data = await res.json()
          if (!data.success) {
            toast.error(data.error || 'Registration failed')
            return false
          }
          set({ user: data.data.user, token: data.data.token })
          toast.success('Account created successfully!')
          return true
        } catch {
          toast.error('Network error. Please try again.')
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        await fetch('/api/auth/me', { method: 'DELETE' })
        set({ user: null, token: null })
        toast.success('Logged out successfully')
        window.location.href = '/'
      },

      fetchMe: async () => {
        const token = get().token
        if (!token) return
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!res.ok) {
            set({ user: null, token: null })
            return
          }
          const data = await res.json()
          if (data.success) set({ user: data.data })
        } catch {
          // silently fail
        }
      },
    }),
    {
      name: 'edufund-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

// API helper with auth headers
export function useApi() {
  const token = useAuth((s) => s.token)

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const get = async (url: string) => {
    const res = await fetch(url, { headers })
    return res.json()
  }

  const post = async (url: string, body: unknown) => {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
    return res.json()
  }

  const patch = async (url: string, body: unknown) => {
    const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) })
    return res.json()
  }

  const del = async (url: string) => {
    const res = await fetch(url, { method: 'DELETE', headers })
    return res.json()
  }

  return { get, post, patch, del, headers }
}
