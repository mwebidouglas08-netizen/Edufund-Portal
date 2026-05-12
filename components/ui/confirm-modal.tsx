// components/ui/confirm-modal.tsx
'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
  loading?: boolean
}

export default function ConfirmModal({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'default', loading = false,
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  const buttonClass = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    default: 'bg-brand-600 hover:bg-brand-700 text-white',
  }[variant]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="p-6">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                variant === 'danger' ? 'bg-red-50' :
                variant === 'warning' ? 'bg-amber-50' :
                'bg-brand-50'
              )}>
                <AlertTriangle className={cn(
                  'w-6 h-6',
                  variant === 'danger' ? 'text-red-500' :
                  variant === 'warning' ? 'text-amber-500' :
                  'text-brand-600'
                )} />
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2',
                  buttonClass
                )}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
