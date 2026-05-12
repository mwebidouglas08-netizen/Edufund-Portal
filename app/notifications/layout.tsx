// app/notifications/layout.tsx
import DashboardShell from '@/components/dashboard/DashboardShell'

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
