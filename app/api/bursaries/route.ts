// app/api/bursaries/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

export async function GET() {
  const bursaries = await db.bursary.findMany({
    orderBy: [{ isOpen: 'desc' }, { deadline: 'asc' }],
  })
  return apiSuccess({ bursaries })
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAdmin(req)
  if (error || !user) return apiError(error || 'Forbidden', 403)

  const body = await req.json()
  const bursary = await db.bursary.create({
    data: {
      title: body.title,
      description: body.description,
      amount: Number(body.amount),
      deadline: new Date(body.deadline),
      isOpen: body.isOpen ?? true,
      eligibility: body.eligibility,
      provider: body.provider,
    },
  })
  return apiSuccess({ bursary }, 201)
}

export async function PATCH(req: NextRequest) {
  const { user, error } = await requireAdmin(req)
  if (error || !user) return apiError(error || 'Forbidden', 403)

  const body = await req.json()
  const { id, ...data } = body
  const bursary = await db.bursary.update({ where: { id }, data })
  return apiSuccess({ bursary })
}
