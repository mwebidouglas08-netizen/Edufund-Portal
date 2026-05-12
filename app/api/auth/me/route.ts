// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return apiError('Unauthorized', 401)

  // Get unread notification count
  const unreadCount = await db.notification.count({
    where: { userId: user.id, isRead: false },
  })

  return apiSuccess({ ...user, unreadNotifications: unreadCount })
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true, data: { message: 'Logged out successfully' } })
  response.cookies.delete('auth_token')
  return response
}
