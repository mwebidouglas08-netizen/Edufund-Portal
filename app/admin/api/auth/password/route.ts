// app/api/auth/password/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, verifyPassword, hashPassword } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error || !user) return apiError(error || 'Unauthorized', 401)

  const body = await req.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    const msg = Object.values(result.error.flatten().fieldErrors)[0]?.[0]
      || result.error.flatten().formErrors[0]
      || 'Validation failed'
    return apiError(msg)
  }

  // Fetch full user to get hashed password
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  })

  if (!fullUser) return apiError('User not found', 404)

  const valid = await verifyPassword(result.data.currentPassword, fullUser.password)
  if (!valid) return apiError('Current password is incorrect', 401)

  const hashed = await hashPassword(result.data.newPassword)
  await db.user.update({
    where: { id: user.id },
    data: { password: hashed },
  })

  return apiSuccess({ message: 'Password updated successfully' })
}
