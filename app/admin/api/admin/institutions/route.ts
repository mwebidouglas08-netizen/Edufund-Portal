// app/api/admin/institutions/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const { user, error } = await requireAdmin(req)
  if (error || !user) return apiError(error || 'Forbidden', 403)

  const { searchParams } = new URL(req.url)
  const includeInactive = searchParams.get('includeInactive') === 'true'
  const search = searchParams.get('search')
  const type = searchParams.get('type')

  const institutions = await db.institution.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(type && { type: type as never }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { county: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { name: 'asc' },
  })

  const counts = await db.application.groupBy({
    by: ['institutionName'],
    _count: { id: true },
  })

  const withCounts = institutions.map(inst => ({
    ...inst,
    applicationCount: counts.find(c => c.institutionName === inst.name)?._count.id || 0,
  }))

  return apiSuccess({ institutions: withCounts })
}
