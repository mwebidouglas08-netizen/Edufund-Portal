'use client'
// app/admin/logs/page.tsx

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollText, RefreshCw, Search, Shield } from 'lucide-react'
import { useApi } from '@/hooks/useAuth'
import { formatDateTime } from '@/lib/utils'

interface AuditLog {
  id: string
  action: string
  entity: string
  entityId: string
  details?: Record<string, unknown>
  createdAt: string
  admin: { fullName: string; email: string }
}

const ACTION_COLOR: Record<string, string> = {
  STATUS_CHANGED_TO_APPROVED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  STATUS_CHANGED_TO_REJECTED: 'text-red-700 bg-red-50 border-red-200',
  STATUS_CHANGED_TO_DISBURSED: 'text-purple-700 bg-purple-50 border-purple-200',
  STATUS_CHANGED_TO_UNDER_REVIEW: 'text-amber-700 bg-amber-50 border-amber-200',
  DEFAULT: 'text-gray-700 bg-gray-50 border-gray-200',
}

export default function AdminLogsPage() {
  const api = useApi()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => { fetchLogs() }, [page, search])

  async function fetchLogs() {
    setLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: '30' })
    if (search) params.set('search', search)
    const res = await api.get(`/api/admin/logs?${params}`)
    if (res.success) {
      setLogs(res.data.logs)
      setTotal(res.data.total)
    }
    setLoading(false)
  }

  const actionLabel = (action: string) =>
    action.replace(/_/g, ' ').replace('STATUS CHANGED TO ', 'Status → ')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-brand-600" />
            Audit Logs
          </h1>
          <p className="text-gray-500 text-sm mt-1">{total} admin actions recorded</p>
        </div>
        <button onClick={fetchLogs} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
          <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No audit logs found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log, i) => {
              const colorClass = ACTION_COLOR[log.action] || ACTION_COLOR.DEFAULT
              return (
                <motion.div key={log.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colorClass}`}>
                        {actionLabel(log.action)}
                      </span>
                      <span className="text-xs text-gray-400">on {log.entity} #{log.entityId.slice(-8)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-semibold">{log.admin.fullName}</span>
                      <span className="text-gray-400"> ({log.admin.email})</span>
                    </p>
                    {log.details && (
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {Object.entries(log.details).map(([k, v]) => (
                          <span key={k} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {k}: <span className="font-medium">{String(v)}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {formatDateTime(log.createdAt)}
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}
        {total > 30 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40">
                Previous
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={logs.length < 30}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
