// lib/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}

export async function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cookieToken = req.cookies.get('auth_token')?.value

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : cookieToken

  if (!token) return null

  try {
    const payload = verifyToken(token)
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    })

    if (!user || !user.isActive) return null
    return user
  } catch {
    return null
  }
}

export async function requireAuth(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return { user: null, error: 'Unauthorized' }
  }
  return { user, error: null }
}

export async function requireAdmin(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return { user: null, error: 'Unauthorized' }
  if (user.role !== 'ADMIN') return { user: null, error: 'Forbidden: Admin access required' }
  return { user, error: null }
}
