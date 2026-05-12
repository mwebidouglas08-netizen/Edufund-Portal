// app/layout.tsx
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | EduFund Portal',
    default: 'EduFund Portal — Educational Funding Management',
  },
  description:
    'Apply for bursaries, track your application, and access educational funding opportunities across Kenya.',
  keywords: ['bursary', 'education fund', 'Kenya', 'scholarship', 'CDF', 'student funding'],
  authors: [{ name: 'EduFund Portal' }],
  openGraph: {
    title: 'EduFund Portal',
    description: 'Your gateway to educational funding in Kenya',
    type: 'website',
    locale: 'en_KE',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              borderRadius: '10px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
