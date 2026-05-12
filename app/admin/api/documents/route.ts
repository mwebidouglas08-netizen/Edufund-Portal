// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '5') * 1024 * 1024

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const applicationId = formData.get('applicationId') as string
    const documentType = formData.get('documentType') as string

    if (!file || !applicationId || !documentType) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: `File too large. Max ${process.env.MAX_FILE_SIZE_MB || 5}MB` }, { status: 400 })
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. PDF, JPG, PNG only' }, { status: 400 })
    }

    // Verify application belongs to user
    const application = await db.application.findUnique({
      where: { id: applicationId },
      select: { userId: true },
    })

    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 })
    }

    if (application.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // Create upload directory
    const uploadPath = path.join(process.cwd(), UPLOAD_DIR, applicationId)
    await fs.mkdir(uploadPath, { recursive: true })

    // Save file
    const ext = file.name.split('.').pop()
    const fileName = `${documentType}-${Date.now()}.${ext}`
    const filePath = path.join(uploadPath, fileName)
    const bytes = await file.arrayBuffer()
    await fs.writeFile(filePath, Buffer.from(bytes))

    // Save to DB (upsert by documentType to allow re-upload)
    const existing = await db.document.findFirst({
      where: { applicationId, documentType },
    })

    const doc = existing
      ? await db.document.update({
          where: { id: existing.id },
          data: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            filePath: `/uploads/${applicationId}/${fileName}`,
          },
        })
      : await db.document.create({
          data: {
            applicationId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            filePath: `/uploads/${applicationId}/${fileName}`,
            documentType,
          },
        })

    return NextResponse.json({ success: true, data: { document: doc } }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const applicationId = searchParams.get('applicationId')
  if (!applicationId) {
    return NextResponse.json({ success: false, error: 'applicationId required' }, { status: 400 })
  }

  const documents = await db.document.findMany({
    where: { applicationId },
    orderBy: { uploadedAt: 'desc' },
  })

  return NextResponse.json({ success: true, data: { documents } })
}
