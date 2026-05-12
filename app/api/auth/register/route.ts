// app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { registerSchema } from '@/lib/validations'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      return apiError(Object.values(errors)[0]?.[0] || 'Validation failed')
    }

    const { fullName, email, phone, password } = result.data

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return apiError('Email already registered. Please login instead.', 409)
    }

    const hashedPassword = await hashPassword(password)

    const user = await db.user.create({
      data: { fullName, email, phone, password: hashedPassword, role: 'STUDENT' },
      select: { id: true, fullName: true, email: true, phone: true, role: true },
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.fullName).catch(console.error)

    const response = apiSuccess({ user, token }, 201)
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return apiError('Registration failed. Please try again.', 500)
  }
}
