// app/api/admin/payments/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const { user, error } = await requireAdmin(req)
  if (error || !user) return apiError(error || 'Forbidden', 403)

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { mpesaReceiptNo: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { application: { referenceNo: { contains: search, mode: 'insensitive' } } },
      { application: { fullName: { contains: search, mode: 'insensitive' } } },
    ]
  }

  const [payments, total] = await Promise.all([
    db.payment.findMany({
      where,
      include: {
        application: {
          select: { referenceNo: true, fullName: true, institutionName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    db.payment.count({ where }),
  ])

  const [successCount, failedCount, revenueAgg] = await Promise.all([
    db.payment.count({ where: { status: 'SUCCESS' } }),
    db.payment.count({ where: { status: { in: ['FAILED', 'CANCELLED'] } } }),
    db.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
  ])

  return apiSuccess({
    payments,
    total,
    page,
    limit,
    summary: {
      total,
      success: successCount,
      failed: failedCount,
      revenue: revenueAgg._sum.amount || 0,
    },
  })
}
