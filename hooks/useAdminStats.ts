// hooks/useAdminStats.ts
'use client'
import { useState, useEffect } from 'react'
import { useApi } from './useAuth'

export function useAdminStats() {
  const api = useApi()
  const [stats, setStats] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/admin/stats')
      if (res.success) setStats(res.data)
      else setError(res.error || 'Failed to load stats')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { stats, loading, error, refetch: fetch }
}

export function useAdminApplications(initialFilters = {}) {
  const api = useApi()
  const [applications, setApplications] = useState<unknown[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => Boolean(v))
      ) as Record<string, string>,
    })
    const res = await api.get(`/api/admin/applications?${params}`)
    if (res.success) {
      setApplications(res.data.applications)
      setTotal(res.data.total)
      setPages(res.data.pages)
    }
    setLoading(false)
  }

  useEffect(() => { fetch() }, [page, JSON.stringify(filters)])

  return {
    applications, total, pages, page, loading,
    setPage, filters, setFilters: (f: Record<string, string>) => { setFilters(f); setPage(1) },
    refetch: fetch,
  }
}
