'use client'
// app/dashboard/page.tsx

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText, Clock, CheckCircle, ArrowRight, Plus,
  TrendingUp, BookOpen, Bell, AlertCircle, RefreshCw
} from 'lucide-react'
import { useAuth, useApi } from '@/hooks/useAuth'
import { formatDate, formatCurrency, getStatusLabel, getStatusColor } from '@/lib/utils'

interface Application {
  id: string
  referenceNo: string
  status: string
  institutionName: string
  course: string
  amountRequested: number
  createdAt: string
  updatedAt: string
  payment?: { status: string; mpesaReceiptNo?: string }
  statusLogs?: Array<{ status: string; createdAt: string; comment?: string }>
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

const STATUS_STEPS = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED']

export default function DashboardPage() {
  const { user } = useAuth()
  const api = useApi()
  const [application, setApplication] = useState<Application | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [appRes, notifRes] = await Promise.all([
        api.get('/api/applications?limit=1'),
        api.get('/api/notifications'),
      ])
      if (appRes.success && appRes.data.applications.length > 0) {
        setApplication(appRes.data.applications[0])
      }
      if (notifRes.success) {
        setNotifications(notifRes.data.notifications.slice(0, 4))
      }
    } finally {
      setLoading(false)
    }
  }

  const statusIndex = application
    ? STATUS_STEPS.indexOf(application.status)
    : -1

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {application
            ? 'Track your bursary application below.'
            : 'Ready to start your bursary application?'}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* No application — CTA */}
          {!application && (
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="bg-gradient-to-br from-brand-600 to-blue-700 rounded-2xl p-8 text-white"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Apply for a Bursary</h2>
                  <p className="text-blue-100 text-sm max-w-md">
                    Fill out our guided 5-step application form and submit your bursary request.
                    It takes about 15 minutes.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {['Personal Details', 'Family Background', 'Institution Info', 'Financial Need', 'Documents'].map((step, i) => (
                      <span key={step} className="flex items-center gap-1.5 text-xs text-blue-200">
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">{i + 1}</span>
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/applications/new"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Start Application
                </Link>
              </div>
            </motion.div>
          )}

          {/* Application status card */}
          {application && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">My Application</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Ref: {application.referenceNo}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}>
                      {getStatusLabel(application.status)}
                    </span>
                    <Link href={`/applications/${application.id}`} className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
                      View Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {/* Progress Timeline */}
                  {application.status !== 'DRAFT' && application.status !== 'REJECTED' && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100">
                          <motion.div
                            className="h-full bg-brand-500 transition-all"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(0, (statusIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                        {STATUS_STEPS.map((step, i) => (
                          <div key={step} className="relative flex flex-col items-center z-10">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${i <= statusIndex ? 'bg-brand-600 border-brand-600' : 'bg-white border-gray-200'}`}>
                              {i < statusIndex ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : i === statusIndex ? (
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                              )}
                            </div>
                            <span className={`mt-2 text-xs font-medium whitespace-nowrap hidden sm:block ${i <= statusIndex ? 'text-brand-700' : 'text-gray-400'}`}>
                              {getStatusLabel(step)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {application.status === 'REJECTED' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-semibold text-sm">Application Rejected</p>
                        <p className="text-red-600 text-xs mt-1">
                          {application.statusLogs?.[0]?.comment || 'Your application was not successful. Please contact support for details.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {application.status === 'DRAFT' && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-800 font-semibold text-sm">Application Incomplete</p>
                        <p className="text-amber-600 text-xs mt-1">
                          Your application is saved as a draft. Complete and pay the application fee to submit.
                        </p>
                        <Link href={`/applications/${application.id}/edit`} className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold mt-2 hover:underline">
                          Continue Application <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Institution', value: application.institutionName },
                      { label: 'Course', value: application.course },
                      { label: 'Amount Requested', value: formatCurrency(application.amountRequested) },
                      { label: 'Submitted On', value: formatDate(application.createdAt) },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: FileText,
                title: 'My Application',
                desc: application ? getStatusLabel(application.status) : 'Start a new application',
                href: application ? `/applications/${application.id}` : '/applications/new',
                color: 'brand',
                custom: 2,
              },
              {
                icon: BookOpen,
                title: 'Active Bursaries',
                desc: 'Browse open funding opportunities',
                href: '/bursaries',
                color: 'emerald',
                custom: 3,
              },
              {
                icon: Bell,
                title: 'Notifications',
                desc: `${user?.unreadNotifications || 0} unread messages`,
                href: '/notifications',
                color: 'amber',
                custom: 4,
              },
            ].map(({ icon: Icon, title, desc, href, color, custom }) => (
              <motion.div key={title} initial="hidden" animate="visible" variants={fadeUp} custom={custom}>
                <Link href={href} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-${color}-50 group-hover:bg-${color}-100 transition-colors`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{desc}</p>
                  </div>
                  <ChevronRightIcon className="ml-auto w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent notifications */}
          {notifications.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 text-sm">Recent Notifications</h2>
                  <Link href="/notifications" className="text-xs text-brand-600 font-medium hover:underline">View all</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`px-6 py-4 flex items-start gap-3 ${!notif.isRead ? 'bg-brand-50/30' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notif.type === 'success' ? 'bg-emerald-500' :
                        notif.type === 'error' ? 'bg-red-500' :
                        notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
