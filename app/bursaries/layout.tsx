// app/bursaries/layout.tsx
import DashboardShell from '@/components/dashboard/DashboardShell'

export default function BursariesLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
