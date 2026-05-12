// components/shared/StatCard.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  change?: string
  changePositive?: boolean
  color?: 'brand' | 'emerald' | 'amber' | 'red' | 'purple' | 'teal' | 'blue'
  index?: number
  onClick?: () => void
}

const COLOR_MAP = {
  brand:   { bg: 'bg-brand-50',   icon: 'text-brand-600',   ring: 'ring-brand-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   ring: 'ring-amber-100' },
  red:     { bg: 'bg-red-50',     icon: 'text-red-500',     ring: 'ring-red-100' },
  purple:  { bg: 'bg-purple-50',  icon: 'text-purple-600',  ring: 'ring-purple-100' },
  teal:    { bg: 'bg-teal-50',    icon: 'text-teal-600',    ring: 'ring-teal-100' },
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    ring: 'ring-blue-100' },
}

export default function StatCard({
  label, value, icon: Icon, change, changePositive, color = 'brand', index = 0, onClick
}: StatCardProps) {
  const colors = COLOR_MAP[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all',
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.icon)} />
        </div>
        {change && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            changePositive === true ? 'bg-emerald-50 text-emerald-700' :
            changePositive === false ? 'bg-red-50 text-red-600' :
            'bg-gray-100 text-gray-600'
          )}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </motion.div>
  )
}
