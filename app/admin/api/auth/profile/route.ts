// app/api/auth/profile/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  fullName: z.string().min(3).optional(),
  phone: z.string().regex(/^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$/).optional(),
})

export async function PATCH(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error || !user) return apiError(error || 'Unauthorized', 401)

  const body = await req.json()
  const result = profileUpdateSchema.safeParse(body)
  if (!result.success) {
    return apiError(Object.values(result.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed')
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: result.data,
    select: { id: true, fullName: true, email: true, phone: true, role: true },
  })

  return apiSuccess(updated)
}
