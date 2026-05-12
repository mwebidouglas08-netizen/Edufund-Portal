// components/shared/DocumentViewer.tsx
'use client'

import React from 'react'
import { FileText, Download, Image, File, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentItem {
  id: string
  documentType: string
  fileName: string
  filePath: string
  fileSize?: number
}

const DOC_TYPE_LABELS: Record<string, string> = {
  admission_letter: 'Admission Letter',
  fee_structure: 'Fee Structure',
  national_id: 'National ID / Birth Certificate',
  supporting: 'Supporting Documents',
}

function getIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return Image
  if (ext === 'pdf') return FileText
  return File
}

function formatBytes(bytes: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

interface DocumentViewerProps {
  documents: DocumentItem[]
  className?: string
}

export default function DocumentViewer({ documents, className }: DocumentViewerProps) {
  if (!documents || documents.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-400 text-sm', className)}>
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
        No documents uploaded
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}>
      {documents.map((doc) => {
        const Icon = getIcon(doc.fileName)
        const label = DOC_TYPE_LABELS[doc.documentType] || doc.documentType

        return (
          <div
            key={doc.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all group"
          >
            <div className="w-9 h-9 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-brand-300 transition-colors">
              <Icon className="w-4 h-4 text-gray-500 group-hover:text-brand-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{label}</p>
              <p className="text-[11px] text-gray-400 truncate">{doc.fileName}</p>
              {doc.fileSize && (
                <p className="text-[10px] text-gray-300">{formatBytes(doc.fileSize)}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <a
                href={doc.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                title="View document"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={doc.filePath}
                download={doc.fileName}
                className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"
                title="Download document"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
