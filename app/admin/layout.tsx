'use client'
// app/admin/layout.tsx

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, LayoutDashboard, FileText, Building2,
  CreditCard, ScrollText, Users, LogOut, Menu, X, Shield,
  ChevronRight, Bell, BookOpen
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/applications', icon: FileText, label: 'Applications' },
  { href: '/admin/institutions', icon: Building2, label: 'Institutions' },
  { href: '/admin/bursaries', icon: BookOpen, label: 'Bursaries' },
  { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/logs', icon: ScrollText, label: 'Audit Logs' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, fetchMe } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchMe() }, [])

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.push('/dashboard')
    if (!user) router.push('/auth/login')
  }, [user])

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">EduFund Admin</p>
          <p className="text-white/50 text-xs">Management Portal</p>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">{user?.fullName}</p>
            <p className="text-white/50 text-xs">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{item.label}</span>
              {active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all">
          <GraduationCap className="w-4.5 h-4.5" />
          View Public Site
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex lg:w-64 flex-col bg-gradient-to-b from-brand-950 to-brand-900 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-brand-950 to-brand-900 z-50 lg:hidden"
            >
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-gray-700">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full font-semibold border border-brand-200">
              Admin
            </span>
          </div>
        </header>
        <div className="flex-1 p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
