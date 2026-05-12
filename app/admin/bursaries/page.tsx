'use client'
// app/admin/bursaries/page.tsx

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  BookOpen, Plus, Edit2, ToggleLeft, ToggleRight,
  RefreshCw, X, Calendar, DollarSign
} from 'lucide-react'
import { useApi } from '@/hooks/useAuth'
import { formatDate, formatCurrency } from '@/lib/utils'

interface Bursary {
  id: string; title: string; description: string; amount: number
  deadline: string; isOpen: boolean; eligibility?: string; provider: string
}

const DEFAULT_FORM = {
  title: '', description: '', amount: '', deadline: '',
  isOpen: true, eligibility: '', provider: ''
}

export default function AdminBursariesPage() {
  const api = useApi()
  const [bursaries, setBursaries] = useState<Bursary[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Bursary | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)

  useEffect(() => { fetchBursaries() }, [])

  async function fetchBursaries() {
    setLoading(true)
    const res = await api.get('/api/bursaries')
    if (res.success) setBursaries(res.data.bursaries)
    setLoading(false)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(DEFAULT_FORM)
    setShowForm(true)
  }

  const openEdit = (b: Bursary) => {
    setEditing(b)
    setForm({
      title: b.title, description: b.description,
      amount: String(b.amount), deadline: b.deadline.split('T')[0],
      isOpen: b.isOpen, eligibility: b.eligibility || '', provider: b.provider
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.amount || !form.deadline || !form.provider) {
      toast.error('Fill all required fields'); return
    }
    setSaving(true)
    try {
      const payload = { ...form, amount: Number(form.amount) }
      const res = editing
        ? await api.patch('/api/bursaries', { id: editing.id, ...payload })
        : await api.post('/api/bursaries', payload)
      if (res.success) {
        toast.success(editing ? 'Bursary updated!' : 'Bursary created!')
        setShowForm(false)
        fetchBursaries()
      } else toast.error(res.error || 'Save failed')
    } finally { setSaving(false) }
  }

  const toggleOpen = async (b: Bursary) => {
    const res = await api.patch('/api/bursaries', { id: b.id, isOpen: !b.isOpen })
    if (res.success) { toast.success(`Bursary ${b.isOpen ? 'closed' : 'opened'}`); fetchBursaries() }
  }

  const isExpired = (deadline: string) => new Date(deadline) < new Date()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-600" /> Bursaries
          </h1>
          <p className="text-gray-500 text-sm mt-1">{bursaries.length} bursary listings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchBursaries} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            Add Bursary
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-brand-400 animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {bursaries.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{b.title}</h3>
                  <p className="text-xs text-brand-600 font-semibold mt-0.5">{b.provider}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => toggleOpen(b)} className={`p-1.5 rounded-lg transition-colors ${b.isOpen ? 'hover:bg-red-50 text-emerald-600 hover:text-red-500' : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-600'}`}>
                    {b.isOpen ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{b.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  <DollarSign className="w-4 h-4" />
                  {formatCurrency(b.amount)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(b.deadline)}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isExpired(b.deadline) ? 'bg-gray-50 text-gray-500 border-gray-200' :
                  b.isOpen ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-red-50 text-red-600 border-red-200'
                }`}>
                  {isExpired(b.deadline) ? 'Expired' : b.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900">{editing ? 'Edit Bursary' : 'Add Bursary'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Title', key: 'title', placeholder: 'e.g. National Government Bursary 2025', required: true },
                { label: 'Provider', key: 'provider', placeholder: 'e.g. Ministry of Education', required: true },
              ].map(({ label, key, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
                  <input value={form[key as keyof typeof form] as string} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Describe the bursary..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (KES) <span className="text-red-500">*</span></label>
                  <input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    type="number" placeholder="25000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deadline <span className="text-red-500">*</span></label>
                  <input value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Eligibility (optional)</label>
                <textarea value={form.eligibility} onChange={e => setForm(f => ({ ...f, eligibility: e.target.value }))}
                  rows={2} placeholder="Who can apply..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isOpen" checked={form.isOpen}
                  onChange={e => setForm(f => ({ ...f, isOpen: e.target.checked }))}
                  className="rounded border-gray-300 text-brand-600" />
                <label htmlFor="isOpen" className="text-sm font-medium text-gray-700">Open for applications</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Create Bursary'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
