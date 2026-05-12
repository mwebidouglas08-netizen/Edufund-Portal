'use client'
// app/bursaries/page.tsx

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Users, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react'
import { useApi } from '@/hooks/useAuth'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Bursary {
  id: string
  title: string
  description: string
  amount: number
  deadline: string
  isOpen: boolean
  eligibility?: string
  provider: string
}

export default function BursariesPage() {
  const api = useApi()
  const [bursaries, setBursaries] = useState<Bursary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const res = await api.get('/api/bursaries')
      if (res.success) setBursaries(res.data.bursaries)
      setLoading(false)
    }
    fetch()
  }, [])

  const isClosingSoon = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
    return days <= 14 && days > 0
  }

  const isExpired = (deadline: string) => new Date(deadline) < new Date()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Active Bursaries</h1>
        <p className="text-gray-500 text-sm mt-1">
          {bursaries.filter(b => b.isOpen && !isExpired(b.deadline)).length} open funding opportunities
        </p>
      </div>

      {bursaries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No bursaries available at the moment</p>
          <p className="text-gray-400 text-sm mt-1">Check back soon for new opportunities</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {bursaries.map((bursary, i) => {
            const expired = isExpired(bursary.deadline)
            const closingSoon = isClosingSoon(bursary.deadline)
            const daysLeft = Math.ceil((new Date(bursary.deadline).getTime() - Date.now()) / 86400000)

            return (
              <motion.div
                key={bursary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-white rounded-2xl border shadow-sm flex flex-col hover:shadow-md transition-all ${expired ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:-translate-y-0.5'}`}
              >
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-brand-600" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {expired ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                          Closed
                        </span>
                      ) : closingSoon ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 animate-pulse">
                          Closes in {daysLeft}d
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Open
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
                    {bursary.title}
                  </h3>
                  <p className="text-xs text-brand-600 font-semibold mb-3">{bursary.provider}</p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {bursary.description}
                  </p>

                  {bursary.eligibility && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                      <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Eligibility
                      </p>
                      <p className="text-xs text-blue-700 leading-relaxed">{bursary.eligibility}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Award Amount</p>
                      <p className="text-lg font-black text-brand-700">{formatCurrency(bursary.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <Calendar className="w-3.5 h-3.5" /> Deadline
                      </p>
                      <p className={`text-sm font-semibold ${expired ? 'text-gray-400' : closingSoon ? 'text-red-600' : 'text-gray-700'}`}>
                        {formatDate(bursary.deadline)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  {!expired ? (
                    <Link
                      href="/applications/new"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all group"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium text-center">
                      Applications Closed
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
