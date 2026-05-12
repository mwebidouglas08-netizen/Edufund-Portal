// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // Public routes — no auth needed
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/api/auth/login', '/api/auth/register']
  const isPublic = publicRoutes.some(r => pathname === r || pathname.startsWith('/api/payments/callback'))

  // API routes — handled by individual route guards
  if (pathname.startsWith('/api/')) return NextResponse.next()

  // Unauthenticated user trying to access protected route
  if (!token && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|uploads|public).*)',
  ],
}
