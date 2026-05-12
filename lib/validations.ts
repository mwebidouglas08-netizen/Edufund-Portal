// lib/validations.ts
import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$/, 'Enter a valid Kenyan phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Step 1: Personal Details
export const personalDetailsSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  idNumber: z.string().min(7, 'Enter a valid ID/Birth Certificate number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  phone: z.string().regex(/^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$/, 'Valid Kenyan phone required'),
  email: z.string().email('Valid email required'),
  county: z.string().min(1, 'County is required'),
  constituency: z.string().optional(),
  hasDisability: z.boolean().default(false),
  disabilityNotes: z.string().optional(),
})

// Step 2: Family Background
export const familyBackgroundSchema = z.object({
  guardianName: z.string().min(2, 'Guardian name is required'),
  guardianOccupation: z.string().min(2, 'Occupation is required'),
  householdIncome: z.number().min(0, 'Income cannot be negative'),
  dependents: z.number().int().min(0, 'Must be 0 or more'),
  isOrphan: z.boolean().default(false),
  orphanStatus: z.string().optional(),
})

// Step 3: Institution Details
export const institutionDetailsSchema = z.object({
  institutionType: z.enum(['UNIVERSITY', 'COLLEGE', 'HIGH_SCHOOL', 'TVET', 'PRIMARY_SCHOOL']),
  institutionName: z.string().min(2, 'Institution name is required'),
  institutionId: z.string().optional(),
  admissionNumber: z.string().min(2, 'Admission number is required'),
  course: z.string().min(2, 'Course/Program is required'),
  yearOfStudy: z.number().int().min(1).max(10),
  totalFees: z.number().positive().optional(),
})

// Step 4: Financial Need
export const financialNeedSchema = z.object({
  feesRequired: z.number().positive('Total fees required must be positive'),
  amountRequested: z.number().positive('Amount requested must be positive'),
  otherFunding: z.number().min(0).default(0),
  otherFundingSource: z.string().optional(),
  personalStatement: z.string().min(100, 'Personal statement must be at least 100 characters'),
})

export const paymentSchema = z.object({
  phone: z.string().regex(/^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$/, 'Valid Kenyan phone required'),
  applicationId: z.string().min(1),
})

export const adminCommentSchema = z.object({
  comment: z.string().min(1, 'Comment is required'),
  status: z.enum(['UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED']),
})

export const institutionSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['UNIVERSITY', 'COLLEGE', 'HIGH_SCHOOL', 'TVET', 'PRIMARY_SCHOOL']),
  county: z.string().min(2),
  code: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
})

// Kenyan counties list
export const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PersonalDetailsInput = z.infer<typeof personalDetailsSchema>
export type FamilyBackgroundInput = z.infer<typeof familyBackgroundSchema>
export type InstitutionDetailsInput = z.infer<typeof institutionDetailsSchema>
export type FinancialNeedInput = z.infer<typeof financialNeedSchema>
