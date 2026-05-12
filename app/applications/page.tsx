'use client'
// app/applications/page.tsx

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plus, FileText, RefreshCw, ArrowRight, CheckCircle,
  Clock, AlertCircle, XCircle, DollarSign, Calendar
} from 'lucide-react'
import { useApi } from '@/hooks/useAuth'
import { formatDate, formatCurrency, getStatusLabel, getStatusColor } from '@/lib/utils'

interface Application {
  id: string
  referenceNo: string
  status: string
  institutionName: string
  institutionType: string
  course: string
  amountRequested: number
  createdAt: string
  updatedAt: string
  payment?: { status: string; mpesaReceiptNo?: string }
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  DRAFT: FileText,
  SUBMITTED: Clock,
  UNDER_REVIEW: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  DISBURSED: CheckCircle,
}

export default function ApplicationsPage() {
  const api = useApi()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const res = await api.get('/api/applications?limit=20')
      if (res.success) setApplications(res.data.applications)
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {applications.length} application{applications.length !== 1 ? 's' : ''} on record
          </p>
        </div>
        {applications.length === 0 || applications.every(a => ['REJECTED', 'DISBURSED'].includes(a.status)) ? (
          <Link
            href="/applications/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Link>
        ) : null}
      </div>

      {applications.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"
        >
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Apply for a bursary to fund your education. Our guided form takes about 15 minutes.
          </p>
          <Link
            href="/applications/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-md hover:shadow-lg group"
          >
            <Plus className="w-4 h-4" />
            Start Your Application
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, i) => {
            const Icon = STATUS_ICONS[app.status] || FileText
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/applications/${app.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Status icon */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          app.status === 'APPROVED' || app.status === 'DISBURSED' ? 'bg-emerald-50' :
                          app.status === 'REJECTED' ? 'bg-red-50' :
                          app.status === 'UNDER_REVIEW' ? 'bg-amber-50' :
                          'bg-brand-50'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            app.status === 'APPROVED' || app.status === 'DISBURSED' ? 'text-emerald-600' :
                            app.status === 'REJECTED' ? 'text-red-500' :
                            app.status === 'UNDER_REVIEW' ? 'text-amber-600' :
                            'text-brand-600'
                          }`} />
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-gray-900 text-sm">{app.institutionName}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-600 text-sm">{app.course}</span>
                          </div>
                          <p className="text-xs text-gray-400 font-mono mb-2">{app.referenceNo}</p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <DollarSign className="w-3.5 h-3.5" />
                              {formatCurrency(app.amountRequested)} requested
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(app.createdAt)}
                            </span>
                            {app.payment?.status === 'SUCCESS' && (
                              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Paid
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status badge + arrow */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getStatusColor(app.status)}`}>
                          {getStatusLabel(app.status)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>

                    {/* Draft warning */}
                    {app.status === 'DRAFT' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-amber-600">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-xs font-medium">
                          Application incomplete — click to continue and submit
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
