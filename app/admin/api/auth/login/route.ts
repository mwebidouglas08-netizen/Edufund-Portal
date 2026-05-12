// app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, signToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { loginSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return apiError('Invalid email or password format')
    }

    const { email, password } = result.data

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        password: true,
        isActive: true,
        isVerified: true,
      },
    })

    if (!user) return apiError('Invalid email or password', 401)
    if (!user.isActive) return apiError('Account is disabled. Contact support.', 403)

    const validPassword = await verifyPassword(password, user.password)
    if (!validPassword) return apiError('Invalid email or password', 401)

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    const { password: _, ...userWithoutPassword } = user

    const response = apiSuccess({ user: userWithoutPassword, token })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return apiError('Login failed. Please try again.', 500)
  }
}
