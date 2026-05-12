'use client'
// components/dashboard/DashboardShell.tsx
// Shared sidebar + top bar used by all student pages

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, LayoutDashboard, FileText, BookOpen,
  Building2, Bell, LogOut, Menu, X, ChevronRight, User,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/applications', icon: FileText, label: 'My Application' },
  { href: '/bursaries', icon: BookOpen, label: 'Bursaries' },
  { href: '/institutions', icon: Building2, label: 'Institutions' },
  { href: '/notifications', icon: Bell, label: 'Notifications', badge: true },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, fetchMe } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => { fetchMe() }, [])
  useEffect(() => {
    if (!user) router.push('/auth/login')
    if (user?.role === 'ADMIN') router.push('/admin')
  }, [user])

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const initials = user?.fullName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-none">EduFund</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Student Portal</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-3 py-3 border-b border-gray-100">
        <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{user?.fullName}</p>
            <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = active(item.href, item.exact)
          const unread = item.badge ? (user?.unreadNotifications || 0) : 0
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
              <span className="flex-1">{item.label}</span>
              {unread > 0 && (
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                  isActive ? 'bg-white/25 text-white' : 'bg-red-500 text-white')}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />}
            </Link>
          )
        })}
      </nav>

      {/* Active bursary teaser */}
      <div className="px-3 py-3">
        <div className="bg-gradient-to-br from-brand-600 to-blue-700 rounded-xl p-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-xs font-semibold">Applications Open!</span>
          </div>
          <p className="text-[11px] text-blue-100 leading-relaxed">
            5 bursaries available for 2025 academic year.
          </p>
          <Link href="/bursaries"
            className="mt-2 inline-block text-[11px] font-bold text-white underline underline-offset-2 hover:text-blue-200 transition-colors">
            View opportunities →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
        <Link href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all group">
          <User className="w-[18px] h-[18px] text-gray-400 group-hover:text-gray-600" />
          Profile
        </Link>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl">
              <button onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10">
                <X className="w-4 h-4 text-gray-500" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
              <span>Hello,</span>
              <span className="font-semibold text-gray-900">{user?.fullName?.split(' ')[0]}</span>
              <span>👋</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {(user?.unreadNotifications || 0) > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </Link>
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} EduFund Portal · Lipa Na M-Pesa Integrated
          </p>
        </footer>
      </main>
    </div>
  )
}
