// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Ping database
    await db.$queryRaw`SELECT 1`
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'EduFund Portal',
      database: 'connected',
    })
  } catch {
    return NextResponse.json(
      { status: 'error', database: 'disconnected' },
      { status: 503 }
    )
  }
}
