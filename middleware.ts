// middleware.ts — Vercel Edge-compatible route protection
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't need authentication
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/payments/callback',
  '/api/health',
]

// Routes that need ADMIN role
const ADMIN_PATHS = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow static files, images, Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/uploads') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Always allow public API routes
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/api/auth'))) {
    return NextResponse.next()
  }

  // Allow M-Pesa callback (public webhook)
  if (pathname.startsWith('/api/payments/callback')) {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get('auth_token')?.value

  // No token → redirect to login
  if (!token) {
    // API routes → return 401 instead of redirect
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Token exists — allow through
  // Role checks (ADMIN) are enforced in individual API route handlers
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
