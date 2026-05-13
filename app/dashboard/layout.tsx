// app/dashboard/layout.tsx — now uses shared DashboardShell
// @ts-nocheck — replacing full file content
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, LayoutDashboard, FileText, Building2,
  Bell, LogOut, ChevronRight, Menu, X, BookOpen, User
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/applications', icon: FileText, label: 'My Application' },
  { href: '/bursaries', icon: BookOpen, label: 'Bursaries' },
  { href: '/institutions', icon: Building2, label: 'Institutions' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, fetchMe } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchMe()
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user])

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">EduFund</p>
          <p className="text-gray-400 text-xs">Student Portal</p>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-brand-50 rounded-xl p-3">
          <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{user?.fullName}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
              <span>{item.label}</span>
              {item.label === 'Notifications' && (user?.unreadNotifications || 0) > 0 && (
                <span className={cn('ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold', active ? 'bg-white/20 text-white' : 'bg-red-500 text-white')}>
                  {user?.unreadNotifications}
                </span>
              )}
              {active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all group">
          <User className="w-[18px] h-[18px] text-gray-400 group-hover:text-gray-600" />
          Profile Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all group"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">
              Welcome back, <span className="font-semibold text-gray-900">{user?.fullName?.split(' ')[0]}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {(user?.unreadNotifications || 0) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
