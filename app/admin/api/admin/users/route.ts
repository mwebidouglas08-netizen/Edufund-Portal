// app/api/admin/users/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const { user, error } = await requireAdmin(req)
  if (error || !user) return apiError(error || 'Forbidden', 403)

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const role = searchParams.get('role')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 50

  const where: Record<string, unknown> = {}
  if (role) where.role = role
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ]
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true, fullName: true, email: true, phone: true,
        role: true, isActive: true, isVerified: true, createdAt: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.user.count({ where }),
  ])

  return apiSuccess({ users, total })
}

export async function PATCH(req: NextRequest) {
  const { user, error } = await requireAdmin(req)
  if (error || !user) return apiError(error || 'Forbidden', 403)

  const body = await req.json()
  const { userId, isActive, role } = body

  if (!userId) return apiError('userId is required')

  const target = await db.user.findUnique({ where: { id: userId } })
  if (!target) return apiError('User not found', 404)
  if (target.role === 'ADMIN') return apiError('Cannot modify admin users', 403)

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      ...(typeof isActive === 'boolean' && { isActive }),
      ...(role && { role }),
    },
    select: { id: true, fullName: true, email: true, isActive: true, role: true },
  })

  await db.auditLog.create({
    data: {
      adminId: user.id,
      action: `USER_${isActive ? 'ACTIVATED' : 'DEACTIVATED'}`,
      entity: 'User',
      entityId: userId,
      details: { isActive, role },
    },
  })

  return apiSuccess(updated)
}
