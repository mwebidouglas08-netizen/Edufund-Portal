// components/ui/pagination.tsx
'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, pages, total, limit, onPageChange }: PaginationProps) {
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const getPageNumbers = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '...', pages]
    if (page >= pages - 3) return [1, '...', pages - 4, pages - 3, pages - 2, pages - 1, pages]
    return [1, '...', page - 1, page, page + 1, '...', pages]
  }

  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-900">{from}–{to}</span> of{' '}
        <span className="font-semibold text-gray-900">{total}</span> results
      </p>

      <div className="flex items-center gap-1">
        <PaginationButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </PaginationButton>

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1 text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </span>
          ) : (
            <PaginationButton
              key={p}
              onClick={() => onPageChange(Number(p))}
              active={page === p}
            >
              {p}
            </PaginationButton>
          )
        )}

        <PaginationButton
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </PaginationButton>
      </div>
    </div>
  )
}

function PaginationButton({
  children, onClick, disabled, active, 'aria-label': ariaLabel
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
  'aria-label'?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all',
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
      )}
    >
      {children}
    </button>
  )
}
