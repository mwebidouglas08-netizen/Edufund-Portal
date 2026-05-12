// app/api/applications/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { apiError, apiSuccess, generateReferenceNo } from '@/lib/utils'
import { sendApplicationStatusEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error || !user) return apiError(error || 'Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit

  const where = user.role === 'ADMIN' ? {} : { userId: user.id }

  const [applications, total] = await Promise.all([
    db.application.findMany({
      where,
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        payment: { select: { status: true, mpesaReceiptNo: true, amount: true } },
        documents: { select: { id: true, documentType: true, fileName: true } },
        statusLogs: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    db.application.count({ where }),
  ])

  return apiSuccess({ applications, total, page, limit, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error || !user) return apiError(error || 'Unauthorized', 401)

  try {
    const body = await req.json()

    // Check if user already has a DRAFT or SUBMITTED application
    const existing = await db.application.findFirst({
      where: {
        userId: user.id,
        status: { in: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW'] },
      },
    })

    if (existing) {
      return apiError('You already have an active application. Complete or withdraw it first.', 409)
    }

    const referenceNo = generateReferenceNo()

    const application = await db.application.create({
      data: {
        userId: user.id,
        referenceNo,
        status: 'DRAFT',
        // Step 1
        fullName: body.fullName,
        idNumber: body.idNumber,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        phone: body.phone,
        email: body.email,
        county: body.county,
        constituency: body.constituency,
        hasDisability: body.hasDisability || false,
        disabilityNotes: body.disabilityNotes,
        // Step 2
        guardianName: body.guardianName,
        guardianOccupation: body.guardianOccupation,
        householdIncome: body.householdIncome,
        dependents: body.dependents,
        isOrphan: body.isOrphan || false,
        orphanStatus: body.orphanStatus,
        // Step 3
        institutionType: body.institutionType,
        institutionName: body.institutionName,
        institutionId: body.institutionId,
        admissionNumber: body.admissionNumber,
        course: body.course,
        yearOfStudy: body.yearOfStudy,
        totalFees: body.totalFees,
        // Step 4
        feesRequired: body.feesRequired,
        amountRequested: body.amountRequested,
        otherFunding: body.otherFunding || 0,
        otherFundingSource: body.otherFundingSource,
        personalStatement: body.personalStatement,
      },
    })

    return apiSuccess({ application, referenceNo }, 201)
  } catch (err) {
    console.error('Application create error:', err)
    return apiError('Failed to create application', 500)
  }
}

export async function PATCH(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error || !user) return apiError(error || 'Unauthorized', 401)

  try {
    const body = await req.json()
    const { applicationId, ...updateData } = body

    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: { user: { select: { email: true, fullName: true } } },
    })

    if (!application) return apiError('Application not found', 404)
    if (application.userId !== user.id && user.role !== 'ADMIN') {
      return apiError('Forbidden', 403)
    }
    if (!['DRAFT'].includes(application.status) && user.role !== 'ADMIN') {
      return apiError('Cannot edit a submitted application', 400)
    }

    const updated = await db.application.update({
      where: { id: applicationId },
      data: updateData,
    })

    // If status changed to SUBMITTED
    if (updateData.status === 'SUBMITTED' && application.status !== 'SUBMITTED') {
      await db.statusLog.create({
        data: {
          applicationId,
          status: 'SUBMITTED',
          changedBy: user.id,
          comment: 'Application submitted by student',
        },
      })
      await db.notification.create({
        data: {
          userId: application.userId,
          title: 'Application Submitted',
          message: `Your application ${application.referenceNo} has been submitted successfully.`,
          type: 'success',
        },
      })
      sendApplicationStatusEmail(
        application.user.email,
        application.user.fullName,
        application.referenceNo,
        'SUBMITTED'
      ).catch(console.error)
    }

    return apiSuccess(updated)
  } catch (err) {
    console.error('Application update error:', err)
    return apiError('Failed to update application', 500)
  }
}
