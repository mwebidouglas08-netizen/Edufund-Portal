'use client'
// app/notifications/page.tsx

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCheck, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useApi, useAuth } from '@/hooks/useAuth'
import { formatDateTime } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

const TYPE_CONFIG: Record<string, { color: string; dot: string }> = {
  success: { color: 'border-l-emerald-400 bg-emerald-50/30', dot: 'bg-emerald-500' },
  error: { color: 'border-l-red-400 bg-red-50/30', dot: 'bg-red-500' },
  warning: { color: 'border-l-amber-400 bg-amber-50/30', dot: 'bg-amber-500' },
  info: { color: 'border-l-blue-400 bg-blue-50/30', dot: 'bg-blue-500' },
}

export default function NotificationsPage() {
  const api = useApi()
  const { fetchMe } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchNotifications() }, [])

  async function fetchNotifications() {
    setLoading(true)
    const res = await api.get('/api/notifications')
    if (res.success) setNotifications(res.data.notifications)
    setLoading(false)
  }

  async function markAllRead() {
    const res = await api.patch('/api/notifications', { markAllRead: true })
    if (res.success) {
      setNotifications(n => n.map(x => ({ ...x, isRead: true })))
      fetchMe()
      toast.success('All notifications marked as read')
    }
  }

  async function markRead(id: string) {
    await api.patch('/api/notifications', { notificationId: id })
    setNotifications(n => n.map(x => x.id === id ? { ...x, isRead: true } : x))
    fetchMe()
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-1">We'll notify you about application updates</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => !notif.isRead && markRead(notif.id)}
                className={`
                  bg-white rounded-2xl border border-l-4 p-5 cursor-pointer transition-all hover:shadow-sm
                  ${cfg.color}
                  ${!notif.isRead ? 'shadow-sm' : 'opacity-70'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot} ${notif.isRead ? 'opacity-30' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <p className={`text-sm font-bold ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notif.title}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDateTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                    {!notif.isRead && (
                      <span className="inline-block mt-2 text-xs text-brand-600 font-semibold">Click to mark as read</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
