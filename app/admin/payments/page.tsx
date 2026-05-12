'use client'
// app/admin/payments/page.tsx

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Search, RefreshCw, Download } from 'lucide-react'
import { useApi } from '@/hooks/useAuth'
import { formatCurrency, formatDateTime } from '@/lib/utils'

interface Payment {
  id: string
  amount: number
  phone: string
  status: string
  mpesaReceiptNo?: string
  transactionDate?: string
  createdAt: string
  resultDesc?: string
  application: {
    referenceNo: string
    fullName: string
    institutionName: string
  }
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  SUCCESS: { label: 'Success', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  PENDING: { label: 'Pending', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock },
  FAILED: { label: 'Failed', color: 'text-red-700 bg-red-50 border-red-200', icon: XCircle },
  CANCELLED: { label: 'Cancelled', color: 'text-gray-700 bg-gray-50 border-gray-200', icon: XCircle },
}

export default function AdminPaymentsPage() {
  const api = useApi()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [summary, setSummary] = useState({ total: 0, success: 0, failed: 0, revenue: 0 })

  useEffect(() => { fetchPayments() }, [search, statusFilter])

  async function fetchPayments() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get(`/api/admin/payments?${params}`)
      if (res.success) {
        setPayments(res.data.payments)
        setSummary(res.data.summary || { total: 0, success: 0, failed: 0, revenue: 0 })
      }
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Reference', 'Applicant', 'Phone', 'Amount', 'M-Pesa Receipt', 'Status', 'Date']
    const rows = payments.map(p => [
      p.application.referenceNo, p.application.fullName, p.phone,
      p.amount, p.mpesaReceiptNo || '', p.status, formatDateTime(p.createdAt)
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const summaryCards = [
    { label: 'Total Payments', value: summary.total, color: 'brand' },
    { label: 'Successful', value: summary.success, color: 'emerald' },
    { label: 'Failed/Cancelled', value: summary.failed, color: 'red' },
    { label: 'Revenue', value: formatCurrency(summary.revenue), color: 'purple' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Logs</h1>
          <p className="text-gray-500 text-sm mt-1">M-Pesa transaction records</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchPayments} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search by receipt, reference, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No payment records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Applicant', 'Reference', 'Phone', 'Amount', 'M-Pesa Receipt', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((payment, i) => {
                  const cfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING
                  const Icon = cfg.icon
                  return (
                    <motion.tr key={payment.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{payment.application.fullName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">{payment.application.institutionName}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{payment.application.referenceNo}</td>
                      <td className="px-4 py-3 text-gray-700">{payment.phone}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3">
                        {payment.mpesaReceiptNo ? (
                          <span className="font-mono text-xs text-emerald-700 font-semibold">{payment.mpesaReceiptNo}</span>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDateTime(payment.createdAt)}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
