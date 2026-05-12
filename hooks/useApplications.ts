// hooks/useApplications.ts
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useApi } from './useAuth'

interface UseApplicationsOptions {
  limit?: number
  autoFetch?: boolean
}

export function useApplications({ limit = 10, autoFetch = true }: UseApplicationsOptions = {}) {
  const api = useApi()
  const [applications, setApplications] = useState<unknown[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async (p = page) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/api/applications?page=${p}&limit=${limit}`)
      if (res.success) {
        setApplications(res.data.applications)
        setTotal(res.data.total)
        setPage(p)
      } else {
        setError(res.error || 'Failed to load applications')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [limit, api])

  useEffect(() => { if (autoFetch) fetch() }, [autoFetch])

  return { applications, total, page, loading, error, refetch: fetch, setPage: (p: number) => fetch(p) }
}

export function useApplication(id: string | null) {
  const api = useApi()
  const [application, setApplication] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/api/applications/${id}`)
      .then(res => {
        if (res.success) setApplication(res.data.application)
        else setError(res.error || 'Not found')
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [id])

  return { application, loading, error }
}

export function useNotifications() {
  const api = useApi()
  const [notifications, setNotifications] = useState<unknown[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    const res = await api.get('/api/notifications')
    if (res.success) {
      setNotifications(res.data.notifications)
      setUnreadCount(res.data.notifications.filter((n: { isRead: boolean }) => !n.isRead).length)
    }
    setLoading(false)
  }, [api])

  useEffect(() => { fetch() }, [])

  const markRead = async (id: string) => {
    await api.patch('/api/notifications', { notificationId: id })
    fetch()
  }

  const markAllRead = async () => {
    await api.patch('/api/notifications', { markAllRead: true })
    fetch()
  }

  return { notifications, unreadCount, loading, refetch: fetch, markRead, markAllRead }
}

export function useInstitutions(params: Record<string, string> = {}) {
  const api = useApi()
  const [institutions, setInstitutions] = useState<unknown[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const query = new URLSearchParams(params).toString()
    api.get(`/api/institutions?${query}`)
      .then(res => { if (res.success) setInstitutions(res.data.institutions) })
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { institutions, loading }
}
