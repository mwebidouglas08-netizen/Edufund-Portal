// app/not-found.tsx
import Link from 'next/link'
import { GraduationCap, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 to-blue-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-9 h-9 text-white" />
        </div>
        <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-2">EduFund Portal</p>
      </div>
      <h1 className="text-8xl font-black text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-blue-200 max-w-sm mb-8 leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-blue-50 transition-all">
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </div>
    </div>
  )
}
