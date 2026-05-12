'use client'
// app/admin/applications/page.tsx

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Clock, Eye, RefreshCw, MessageSquare, X
} from 'lucide-react'
import { useApi } from '@/hooks/useAuth'
import { formatCurrency, formatDateTime, getStatusLabel, getStatusColor } from '@/lib/utils'

interface Application {
  id: string; referenceNo: string; status: string
  fullName: string; email: string; phone: string
  institutionName: string; institutionType: string; course: string
  amountRequested: number; county: string; createdAt: string
  adminComment?: string
  user: { fullName: string; email: string; phone: string }
  payment: { status: string; mpesaReceiptNo?: string; amount: number } | null
  statusLogs: Array<{ status: string; createdAt: string; comment?: string; changedBy: string }>
  personalStatement: string; guardianName: string; householdIncome: number
  isOrphan: boolean; hasDisability: boolean; yearOfStudy: number
  feesRequired: number; otherFunding: number
}

const STATUSES = ['', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED']
const INST_TYPES = ['', 'UNIVERSITY', 'COLLEGE', 'HIGH_SCHOOL', 'TVET']

export default function AdminApplicationsPage() {
  const api = useApi()
  const [applications, setApplications] = useState<Application[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Application | null>(null)
  const [filters, setFilters] = useState({ status: '', institutionType: '', search: '' })
  const [actionLoading, setActionLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '15',
      ...(filters.status && { status: filters.status }),
      ...(filters.institutionType && { institutionType: filters.institutionType }),
      ...(filters.search && { search: filters.search }),
    })
    try {
      const res = await api.get(`/api/admin/applications?${params}`)
      if (res.success) {
        setApplications(res.data.applications)
        setTotal(res.data.total)
        setPages(res.data.pages)
      }
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus || !comment.trim()) {
      toast.error('Please select a status and add a comment')
      return
    }
    setActionLoading(true)
    try {
      const res = await api.patch('/api/admin/applications', {
        applicationId: selected.id,
        status: newStatus,
        comment,
      })
      if (res.success) {
        toast.success('Application status updated!')
        setShowModal(false)
        setComment('')
        setNewStatus('')
        setSelected(null)
        fetchApplications()
      } else {
        toast.error(res.error || 'Update failed')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const openModal = (app: Application, status: string) => {
    setSelected(app)
    setNewStatus(status)
    setComment('')
    setShowModal(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total applications</p>
        </div>
        <button onClick={fetchApplications} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search by name, email, reference..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-white">
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
          </select>
          <select value={filters.institutionType} onChange={e => setFilters(f => ({ ...f, institutionType: e.target.value }))}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-white">
            <option value="">All Types</option>
            {INST_TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileTextIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Applicant', 'Reference', 'Institution', 'Amount', 'Status', 'Payment', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{app.user.fullName}</p>
                        <p className="text-xs text-gray-400">{app.user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-600">{app.referenceNo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-gray-800 truncate max-w-[140px]">{app.institutionName}</p>
                        <p className="text-xs text-gray-400">{app.institutionType?.replace('_', ' ')}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {formatCurrency(app.amountRequested)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {app.payment ? (
                        <span className={`text-xs font-medium ${app.payment.status === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {app.payment.status === 'SUCCESS' ? `✓ ${app.payment.mpesaReceiptNo}` : 'Pending'}
                        </span>
                      ) : <span className="text-gray-300 text-xs">None</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {formatDateTime(app.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelected(app)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {['SUBMITTED', 'UNDER_REVIEW'].includes(app.status) && (
                          <>
                            <button onClick={() => openModal(app, 'UNDER_REVIEW')} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="Set Under Review">
                              <Clock className="w-4 h-4" />
                            </button>
                            <button onClick={() => openModal(app, 'APPROVED')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => openModal(app, 'REJECTED')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {app.status === 'APPROVED' && (
                          <button onClick={() => openModal(app, 'DISBURSED')} className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600 transition-colors" title="Mark Disbursed">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {pages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Panel */}
      {selected && !showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-start justify-end"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-bold text-gray-900">Application Details</h2>
                <p className="text-xs text-gray-400 font-mono">{selected.referenceNo}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(selected.status)}`}>
                  {getStatusLabel(selected.status)}
                </span>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <Section title="Applicant">
                <Field label="Name" value={selected.user.fullName} />
                <Field label="Email" value={selected.user.email} />
                <Field label="Phone" value={selected.user.phone} />
                <Field label="County" value={selected.county} />
                <Field label="Orphan" value={selected.isOrphan ? 'Yes' : 'No'} />
                <Field label="Disability" value={selected.hasDisability ? 'Yes' : 'No'} />
              </Section>

              <Section title="Institution">
                <Field label="Name" value={selected.institutionName} />
                <Field label="Type" value={selected.institutionType?.replace('_', ' ')} />
                <Field label="Course" value={selected.course} />
                <Field label="Year" value={`Year ${selected.yearOfStudy}`} />
              </Section>

              <Section title="Financial">
                <Field label="Fees Required" value={formatCurrency(selected.feesRequired)} />
                <Field label="Amount Requested" value={formatCurrency(selected.amountRequested)} />
                <Field label="Other Funding" value={formatCurrency(selected.otherFunding)} />
                <Field label="Guardian" value={selected.guardianName} />
                <Field label="Household Income" value={`KES ${selected.householdIncome?.toLocaleString()}/mo`} />
              </Section>

              {selected.personalStatement && (
                <Section title="Personal Statement">
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.personalStatement}</p>
                </Section>
              )}

              {selected.adminComment && (
                <Section title="Admin Comment">
                  <p className="text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-xl p-3">{selected.adminComment}</p>
                </Section>
              )}

              {/* Status Logs */}
              {selected.statusLogs?.length > 0 && (
                <Section title="Status History">
                  <div className="space-y-2">
                    {selected.statusLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(log.status).includes('emerald') ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <div>
                          <p className="font-semibold text-gray-800">{getStatusLabel(log.status)}</p>
                          <p className="text-gray-400">{formatDateTime(log.createdAt)}</p>
                          {log.comment && <p className="text-gray-600 mt-0.5">{log.comment}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Action buttons */}
              {['SUBMITTED', 'UNDER_REVIEW'].includes(selected.status) && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => openModal(selected, 'APPROVED')}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openModal(selected, 'UNDER_REVIEW')}
                    className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-all"
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => openModal(selected, 'REJECTED')}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
              {selected.status === 'APPROVED' && (
                <button
                  onClick={() => openModal(selected, 'DISBURSED')}
                  className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all"
                >
                  Mark as Disbursed
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Status Update Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Update Status</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  Changing <strong>{selected.user.fullName}</strong>'s application to:
                </p>
                <span className={`mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(newStatus)}`}>
                  {getStatusLabel(newStatus)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Comment / Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder={
                    newStatus === 'APPROVED' ? 'Congratulations! Your application has been approved...' :
                    newStatus === 'REJECTED' ? 'Reason for rejection...' :
                    newStatus === 'DISBURSED' ? 'Funds have been disbursed to your institution...' :
                    'Add a comment or note...'
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={actionLoading || !comment.trim()}
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  Confirm Update
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-gray-500 font-medium flex-shrink-0">{label}</span>
      <span className="text-xs text-gray-800 font-semibold text-right">{value}</span>
    </div>
  )
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}
