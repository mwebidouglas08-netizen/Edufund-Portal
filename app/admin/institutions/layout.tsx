// app/institutions/layout.tsx
import DashboardShell from '@/components/dashboard/DashboardShell'

export default function InstitutionsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
