// types/index.ts

export type UserRole = 'STUDENT' | 'PARENT' | 'ADMIN'
export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
export type InstitutionType = 'UNIVERSITY' | 'COLLEGE' | 'HIGH_SCHOOL' | 'TVET' | 'PRIMARY_SCHOOL'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  createdAt: string
  unreadNotifications?: number
}

export interface Application {
  id: string
  userId: string
  referenceNo: string
  status: ApplicationStatus

  // Step 1 – Personal
  fullName: string
  idNumber: string
  dateOfBirth: string
  gender: Gender
  phone: string
  email: string
  county: string
  constituency?: string
  hasDisability: boolean
  disabilityNotes?: string

  // Step 2 – Family
  guardianName: string
  guardianOccupation: string
  householdIncome: number
  dependents: number
  isOrphan: boolean
  orphanStatus?: string

  // Step 3 – Institution
  institutionType: InstitutionType
  institutionName: string
  institutionId?: string
  admissionNumber: string
  course: string
  yearOfStudy: number
  totalFees?: number

  // Step 4 – Financial
  feesRequired: number
  amountRequested: number
  otherFunding: number
  otherFundingSource?: string
  personalStatement: string

  // Admin
  adminComment?: string
  reviewedBy?: string
  reviewedAt?: string
  approvedAt?: string
  disbursedAt?: string

  createdAt: string
  updatedAt: string

  // Relations
  user?: Pick<User, 'fullName' | 'email' | 'phone'>
  payment?: Payment
  documents?: Document[]
  statusLogs?: StatusLog[]
}

export interface Payment {
  id: string
  applicationId: string
  userId: string
  amount: number
  phone: string
  merchantRequestId?: string
  checkoutRequestId?: string
  mpesaReceiptNo?: string
  transactionDate?: string
  status: PaymentStatus
  resultCode?: string
  resultDesc?: string
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  applicationId: string
  fileName: string
  fileType: string
  fileSize: number
  filePath: string
  documentType: string
  uploadedAt: string
}

export interface StatusLog {
  id: string
  applicationId: string
  status: ApplicationStatus
  changedBy: string
  comment?: string
  createdAt: string
}

export interface Institution {
  id: string
  name: string
  type: InstitutionType
  county: string
  code?: string
  website?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Bursary {
  id: string
  title: string
  description: string
  amount: number
  deadline: string
  isOpen: boolean
  eligibility?: string
  provider: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}

export interface AuditLog {
  id: string
  adminId: string
  action: string
  entity: string
  entityId: string
  details?: Record<string, unknown>
  ipAddress?: string
  createdAt: string
  admin: Pick<User, 'fullName' | 'email'>
}

// API response wrappers
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}
