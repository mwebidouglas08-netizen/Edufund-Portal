// components/ui/toast.tsx
// Re-exports react-hot-toast with typed helpers for consistent usage

import toast from 'react-hot-toast'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import React from 'react'

export function showSuccess(message: string) {
  return toast.success(message, {
    icon: React.createElement(CheckCircle, { className: 'w-4 h-4 text-emerald-600' }),
  })
}

export function showError(message: string) {
  return toast.error(message, {
    icon: React.createElement(XCircle, { className: 'w-4 h-4 text-red-500' }),
  })
}

export function showWarning(message: string) {
  return toast(message, {
    icon: React.createElement(AlertCircle, { className: 'w-4 h-4 text-amber-500' }),
  })
}

export function showInfo(message: string) {
  return toast(message, {
    icon: React.createElement(Info, { className: 'w-4 h-4 text-blue-500' }),
  })
}

export function showLoading(message: string) {
  return toast.loading(message)
}

export { toast }
