// components/ui/input.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border bg-gray-50 px-4 py-2 text-sm ring-offset-background',
        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white',
        'disabled:cursor-not-allowed disabled:opacity-50 transition-all',
        error ? 'border-red-300 bg-red-50' : 'border-gray-200',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

// ── Label ────────────────────────────────────────────────
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-sm font-semibold text-gray-700 mb-1.5', className)}
    {...props}
  />
))
Label.displayName = 'Label'

// ── Textarea ─────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[96px] w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm ring-offset-background',
        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white',
        'disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none',
        error ? 'border-red-300 bg-red-50' : 'border-gray-200',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

// ── Select ────────────────────────────────────────────────
export interface SelectNativeProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, error, ...props }, ref) => (
    <select
      className={cn(
        'flex h-10 w-full rounded-xl border bg-gray-50 px-4 py-2 text-sm ring-offset-background appearance-none',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white',
        'disabled:cursor-not-allowed disabled:opacity-50 transition-all',
        error ? 'border-red-300 bg-red-50' : 'border-gray-200',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
SelectNative.displayName = 'SelectNative'

// ── FormField wrapper ─────────────────────────────────────
function FormField({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export { Input, Label, Textarea, SelectNative, FormField }
