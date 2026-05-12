'use client'
// app/admin/page.tsx — Admin Dashboard Overview

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText, Users, Building2, CreditCard, TrendingUp,
  Clock, CheckCircle, XCircle, ArrowRight, RefreshCw,
  BarChart3, DollarSign, AlertCircle
} from 'lucide-react'
import { useApi } from '@/hooks/useAuth'
import { formatCurrency, formatDateTime, getStatusLabel, getStatusColor } from '@/lib/utils'

interface Stats {
  summary: {
    total: number; submitted: number; underReview: number
    approved: number; rejected: number; disbursed: number
    totalUsers: number; totalInstitutions: number; totalRevenue: number
  }
  recentApplications: Array<{
    id: string; referenceNo: string; fullName: string; status: string
    institutionName: string; amountRequested: number; createdAt: string
    user: { fullName: string; email: string }
    payment: { status: string } | null
  }>
  recentPayments: Array<{
    id: string; amount: number; mpesaReceiptNo: string; createdAt: string
    application: { referenceNo: string }
  }>
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
}

export default function AdminDashboard() {
  const api = useApi()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/stats')
      if (res.success) setStats(res.data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    )
  }

  const s = stats?.summary

  const statCards = [
    { label: 'Total Applications', value: s?.total || 0, icon: FileText, color: 'brand', change: '+12 this week' },
    { label: 'Pending Review', value: (s?.submitted || 0) + (s?.underReview || 0), icon: Clock, color: 'amber', change: 'Needs attention' },
    { label: 'Approved', value: s?.approved || 0, icon: CheckCircle, color: 'emerald', change: `${s?.disbursed || 0} disbursed` },
    { label: 'Revenue Collected', value: formatCurrency(s?.totalRevenue || 0), icon: DollarSign, color: 'purple', change: 'Application fees' },
    { label: 'Total Students', value: s?.totalUsers || 0, icon: Users, color: 'blue', change: 'Registered users' },
    { label: 'Institutions', value: s?.totalInstitutions || 0, icon: Building2, color: 'teal', change: 'Active institutions' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">EduFund Portal administration dashboard</p>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </motion.div>

      {/* Status bar */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-sm">Application Pipeline</h2>
          <Link href="/admin/applications" className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Submitted', value: s?.submitted || 0, color: 'bg-blue-100 text-blue-700 border-blue-200' },
            { label: 'Under Review', value: s?.underReview || 0, color: 'bg-amber-100 text-amber-700 border-amber-200' },
            { label: 'Approved', value: s?.approved || 0, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
            { label: 'Rejected', value: s?.rejected || 0, color: 'bg-red-100 text-red-700 border-red-200' },
            { label: 'Disbursed', value: s?.disbursed || 0, color: 'bg-purple-100 text-purple-700 border-purple-200' },
          ].map((item) => (
            <div key={item.label} className={`text-center rounded-xl p-3 border ${item.color}`}>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs font-medium mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial="hidden" animate="visible" variants={fadeUp} custom={i + 2}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 text-${card.color}-600`} />
                </div>
                <span className="text-xs text-gray-400">{card.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Applications + Payments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                Recent Applications
              </h2>
              <Link href="/admin/applications" className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {stats?.recentApplications?.slice(0, 6).map((app) => (
                <Link key={app.id} href={`/admin/applications?id=${app.id}`}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs flex-shrink-0">
                    {app.user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{app.user.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{app.institutionName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{formatCurrency(app.amountRequested)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Payments */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={9}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Recent Payments
              </h2>
              <Link href="/admin/payments" className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {stats?.recentPayments?.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-400 text-sm">No payments yet</div>
              )}
              {stats?.recentPayments?.map((payment) => (
                <div key={payment.id} className="flex items-center gap-3 px-6 py-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 font-mono">{payment.mpesaReceiptNo}</p>
                    <p className="text-xs text-gray-400">{payment.application.referenceNo}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-700">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(payment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={10}>
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Review Pending', href: '/admin/applications?status=SUBMITTED', icon: AlertCircle },
              { label: 'Manage Institutions', href: '/admin/institutions', icon: Building2 },
              { label: 'View Payments', href: '/admin/payments', icon: CreditCard },
              { label: 'Audit Logs', href: '/admin/logs', icon: BarChart3 },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href}
                className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all">
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
