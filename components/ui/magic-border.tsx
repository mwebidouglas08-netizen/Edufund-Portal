// components/ui/magic-border.tsx
// Inspired by magicui.design border beam

import React from 'react'
import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  anchor?: number
  borderWidth?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 2,
  colorFrom = '#3378ff',
  colorTo = '#a855f7',
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': duration,
          '--anchor': anchor,
          '--border-width': borderWidth,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]',
        '[background:linear-gradient(white,white)_padding-box,conic-gradient(from_calc(var(--anchor)*1deg),var(--color-to)_0deg,var(--color-from)_calc(var(--size)*1deg),transparent_calc(var(--size)*1deg))_border-box]',
        '[animation:border-beam_calc(var(--duration)*1s)_var(--delay)_linear_infinite]',
        className
      )}
    />
  )
}

// ── Shimmer Button (Magic UI style) ─────────────────────
interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  children: React.ReactNode
}

export function ShimmerButton({
  shimmerColor = '#ffffff',
  shimmerSize = '0.1em',
  shimmerDuration = '2s',
  borderRadius = '12px',
  background = 'linear-gradient(135deg, #1342e1, #7c3aed)',
  children,
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={{
        '--shimmer-color': shimmerColor,
        '--radius': borderRadius,
        '--shimmer-duration': shimmerDuration,
        '--shimmer-size': shimmerSize,
        '--bg': background,
      } as React.CSSProperties}
      className={cn(
        'relative z-0 flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap px-6 py-3',
        'font-semibold text-white [border-radius:var(--radius)] [background:var(--bg)]',
        'before:absolute before:inset-0 before:z-[-1] before:[border-radius:var(--radius)]',
        'after:absolute after:inset-0 after:z-[1]',
        'after:content-[""] after:[background:linear-gradient(90deg,transparent,var(--shimmer-color),transparent)]',
        'after:[background-size:200%_100%] after:[animation:shimmer_var(--shimmer-duration)_infinite_linear]',
        'transition-all duration-200 hover:scale-105 active:scale-[0.98]',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}

// ── Animated gradient background ────────────────────────
export function AnimatedGradient({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute -inset-[100%] opacity-40"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, #3378ff 0%, #7c3aed 25%, #ec4899 50%, #3378ff 75%, #7c3aed 100%)',
          animation: 'magic-spin 20s linear infinite',
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}

// ── Typing text animation ────────────────────────────────
import { useState, useEffect } from 'react'

export function TypingText({ phrases, className }: { phrases: string[]; className?: string }) {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[currentPhrase]
    const speed = deleting ? 50 : 80
    const pause = deleting ? 500 : 2000

    if (!deleting && currentText === phrase) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }

    if (deleting && currentText === '') {
      setDeleting(false)
      setCurrentPhrase(p => (p + 1) % phrases.length)
      return
    }

    const t = setTimeout(() => {
      setCurrentText(prev =>
        deleting ? prev.slice(0, -1) : phrase.slice(0, prev.length + 1)
      )
    }, speed)
    return () => clearTimeout(t)
  }, [currentText, deleting, currentPhrase, phrases])

  return (
    <span className={className}>
      {currentText}
      <span className="inline-block w-0.5 h-[1em] bg-current ml-0.5 animate-pulse" />
    </span>
  )
}

// ── Number counter animation ─────────────────────────────
export function CountUp({ to, duration = 2000, prefix = '', suffix = '' }: {
  to: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
      setCount(Math.floor(eased * to))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(to)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}
