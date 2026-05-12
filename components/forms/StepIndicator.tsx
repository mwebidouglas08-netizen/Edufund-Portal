// components/forms/StepIndicator.tsx
'use client'

import React from 'react'
import { Check, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Step {
  id: number
  label: string
  description: string
  icon: LucideIcon
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  variant?: 'horizontal' | 'vertical'
}

export default function StepIndicator({
  steps, currentStep, variant = 'horizontal'
}: StepIndicatorProps) {
  if (variant === 'vertical') {
    return (
      <div className="space-y-1">
        {steps.map((step) => {
          const isComplete = currentStep > step.id
          const isCurrent = currentStep === step.id
          const Icon = step.icon
          return (
            <div key={step.id} className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
              isCurrent ? 'bg-brand-50' : ''
            )}>
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all',
                isComplete ? 'bg-emerald-500 text-white' :
                isCurrent ? 'bg-brand-600 text-white ring-4 ring-brand-100' :
                'bg-gray-100 text-gray-400'
              )}>
                {isComplete ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0">
                <p className={cn('text-xs font-semibold leading-tight',
                  isCurrent ? 'text-brand-700' :
                  isComplete ? 'text-emerald-700' :
                  'text-gray-400')}>
                  {step.label}
                </p>
                <p className={cn('text-[11px] truncate',
                  isCurrent ? 'text-brand-500' : 'text-gray-400')}>
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex items-center w-full overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const isComplete = currentStep > step.id
        const isCurrent = currentStep === step.id
        const Icon = step.icon
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-shrink-0">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isComplete ? '#10b981' : isCurrent ? '#1342e1' : '#f3f4f6',
                }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm',
                  isCurrent ? 'ring-4 ring-brand-100' : ''
                )}
              >
                {isComplete
                  ? <Check className="w-4 h-4 text-white" />
                  : <Icon className={cn('w-4 h-4', isCurrent ? 'text-white' : 'text-gray-400')} />
                }
              </motion.div>
              <span className={cn(
                'mt-1.5 text-[10px] font-semibold whitespace-nowrap hidden sm:block',
                isCurrent ? 'text-brand-700' :
                isComplete ? 'text-emerald-600' :
                'text-gray-400'
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-1 rounded-full transition-all min-w-[16px]',
                isComplete ? 'bg-emerald-400' : 'bg-gray-100'
              )} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
