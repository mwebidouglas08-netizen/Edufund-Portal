// app/applications/layout.tsx
import DashboardShell from '@/components/dashboard/DashboardShell'

export default function ApplicationsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
