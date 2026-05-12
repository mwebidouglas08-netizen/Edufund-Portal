// components/shared/ApplicationStatusBadge.tsx
import React from 'react'
import { CheckCircle, Clock, XCircle, FileText, Banknote } from 'lucide-react'
import { cn, getStatusLabel } from '@/lib/utils'

const CONFIG: Record<string, { icon: React.ElementType; classes: string }> = {
  DRAFT:        { icon: FileText,    classes: 'bg-gray-50 text-gray-600 border-gray-200' },
  SUBMITTED:    { icon: Clock,       classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  UNDER_REVIEW: { icon: Clock,       classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  APPROVED:     { icon: CheckCircle, classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED:     { icon: XCircle,     classes: 'bg-red-50 text-red-700 border-red-200' },
  DISBURSED:    { icon: Banknote,    classes: 'bg-purple-50 text-purple-700 border-purple-200' },
}

export default function ApplicationStatusBadge({
  status,
  size = 'default',
}: {
  status: string
  size?: 'sm' | 'default' | 'lg'
}) {
  const cfg = CONFIG[status] || CONFIG.DRAFT
  const Icon = cfg.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-semibold rounded-full border',
      cfg.classes,
      size === 'sm' ? 'text-[10px] px-2 py-0.5' :
      size === 'lg' ? 'text-sm px-4 py-1.5' :
      'text-xs px-2.5 py-1'
    )}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {getStatusLabel(status)}
    </span>
  )
}
