// components/shared/StatusTimeline.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Circle } from 'lucide-react'
import { cn, getStatusLabel, STATUS_STEPS } from '@/lib/utils'

interface StatusTimelineProps {
  currentStatus: string
  logs?: Array<{ status: string; createdAt: string; comment?: string }>
  compact?: boolean
}

export default function StatusTimeline({ currentStatus, logs, compact }: StatusTimelineProps) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus)

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {STATUS_STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className={cn(
              'w-2 h-2 rounded-full transition-all',
              i < currentIndex ? 'bg-emerald-500' :
              i === currentIndex ? 'bg-brand-600 scale-125' :
              'bg-gray-200'
            )} />
            {i < STATUS_STEPS.length - 1 && (
              <div className={cn('h-0.5 flex-1 rounded transition-all', i < currentIndex ? 'bg-emerald-300' : 'bg-gray-100')} />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {STATUS_STEPS.map((step, i) => {
        const isDone = i < currentIndex
        const isCurrent = i === currentIndex
        const isPending = i > currentIndex
        const log = logs?.find(l => l.status === step)

        return (
          <div key={step} className="flex gap-4">
            {/* Icon column */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 transition-all',
                  isDone ? 'bg-emerald-500 border-emerald-500' :
                  isCurrent ? 'bg-white border-brand-600 ring-4 ring-brand-50' :
                  'bg-white border-gray-200'
                )}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Clock className="w-4 h-4 text-brand-600" />
                  </motion.div>
                ) : (
                  <Circle className="w-4 h-4 text-gray-300" />
                )}
              </motion.div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={cn(
                  'w-0.5 flex-1 my-1 rounded transition-all min-h-[24px]',
                  isDone ? 'bg-emerald-300' : 'bg-gray-100'
                )} />
              )}
            </div>

            {/* Content column */}
            <div className="pb-6 flex-1 min-w-0">
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  'text-sm font-semibold',
                  isDone ? 'text-emerald-700' :
                  isCurrent ? 'text-brand-700' :
                  'text-gray-400'
                )}>
                  {getStatusLabel(step)}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                    Current
                  </span>
                )}
              </div>
              {log && (
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  {log.comment && (
                    <p className="text-xs text-gray-600 leading-relaxed">{log.comment}</p>
                  )}
                </div>
              )}
              {isPending && !log && (
                <p className="text-xs text-gray-300 mt-0.5">Pending</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
