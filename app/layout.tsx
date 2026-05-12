// app/layout.tsx
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: '14px',
              borderRadius: '10px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
