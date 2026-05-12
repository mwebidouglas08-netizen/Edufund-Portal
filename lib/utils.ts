// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NextResponse } from 'next/server'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateReferenceNo(): string {
  const prefix = 'EDF'
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 900000) + 100000
  return `${prefix}-${year}-${random}`
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    DISBURSED: 'bg-purple-100 text-purple-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    DISBURSED: 'Disbursed',
  }
  return labels[status] || status
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    SUCCESS: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function calculateAge(dateOfBirth: Date | string): number {
  const today = new Date()
  const birth = new Date(dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function fileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const APPLICATION_STEPS = [
  { id: 1, label: 'Personal Details', description: 'Your personal information' },
  { id: 2, label: 'Family Background', description: 'Guardian and household info' },
  { id: 3, label: 'Institution Details', description: 'Your school information' },
  { id: 4, label: 'Financial Need', description: 'Fees and funding details' },
  { id: 5, label: 'Documents', description: 'Upload required documents' },
  { id: 6, label: 'Payment', description: 'Pay application fee' },
]

export const STATUS_STEPS = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'DISBURSED',
]
