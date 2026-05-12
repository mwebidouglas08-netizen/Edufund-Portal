// components/landing/AnimatedStats.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}

const STATS: Stat[] = [
  { label: 'Students Funded', value: 12400, suffix: '+' },
  { label: 'Total Disbursed', value: 180, prefix: 'KES ', suffix: 'M+' },
  { label: 'Counties Served', value: 47 },
  { label: 'Satisfaction Rate', value: 98, suffix: '%' },
]

function CountUp({ to, prefix = '', suffix = '', duration = 2200 }: {
  to: number; prefix?: string; suffix?: string; duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * to))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(to)
    }
    requestAnimationFrame(tick)
  }, [inView, to, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function AnimatedStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-3xl lg:text-4xl font-black text-white">
            <CountUp
              to={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          </p>
          <p className="text-blue-200 text-sm mt-1 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
