// components/admin/FilterBar.tsx
'use client'

import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  searchValue: string
  onSearchChange: (v: string) => void
  searchPlaceholder?: string
  filters?: Array<{
    key: string
    label: string
    value: string
    onChange: (v: string) => void
    options: FilterOption[]
  }>
  onClear?: () => void
  hasActiveFilters?: boolean
  actions?: React.ReactNode
  className?: string
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onClear,
  hasActiveFilters,
  actions,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm p-4', className)}>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Dropdown filters */}
        {filters.map(filter => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={e => filter.onChange(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-gray-50 focus:bg-white transition-all cursor-pointer min-w-[140px]"
          >
            <option value="">{filter.label}</option>
            {filter.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}

        {/* Clear filters */}
        {hasActiveFilters && onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}

        {/* Right actions slot */}
        {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
      </div>
    </div>
  )
}
