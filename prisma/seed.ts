// prisma/seed.ts
import { PrismaClient, InstitutionType, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed admin user
  const hashedAdminPassword = await bcrypt.hash('Admin@1234', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edufund.co.ke' },
    update: {},
    create: {
      fullName: 'EduFund Administrator',
      email: 'admin@edufund.co.ke',
      phone: '0700000000',
      password: hashedAdminPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  })
  console.log(`✅ Admin user: ${admin.email}`)

  // Seed test student
  const hashedStudentPassword = await bcrypt.hash('Student@1234', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@test.co.ke' },
    update: {},
    create: {
      fullName: 'Jane Wanjiru Kamau',
      email: 'student@test.co.ke',
      phone: '0712345678',
      password: hashedStudentPassword,
      role: Role.STUDENT,
      isVerified: true,
    },
  })
  console.log(`✅ Test student: ${student.email}`)

  // Seed institutions
  const institutions = [
    { name: 'University of Nairobi', type: InstitutionType.UNIVERSITY, county: 'Nairobi', code: 'UON', website: 'https://www.uonbi.ac.ke' },
    { name: 'Kenyatta University', type: InstitutionType.UNIVERSITY, county: 'Nairobi', code: 'KU', website: 'https://www.ku.ac.ke' },
    { name: 'Moi University', type: InstitutionType.UNIVERSITY, county: 'Uasin Gishu', code: 'MU', website: 'https://www.mu.ac.ke' },
    { name: 'Jomo Kenyatta University of Agriculture and Technology', type: InstitutionType.UNIVERSITY, county: 'Kiambu', code: 'JKUAT', website: 'https://www.jkuat.ac.ke' },
    { name: 'Strathmore University', type: InstitutionType.UNIVERSITY, county: 'Nairobi', code: 'SU', website: 'https://www.strathmore.edu' },
    { name: 'Kenya Medical Training College (Nairobi)', type: InstitutionType.COLLEGE, county: 'Nairobi', code: 'KMTC-NRB', website: 'https://www.kmtc.ac.ke' },
    { name: 'Technical University of Kenya', type: InstitutionType.UNIVERSITY, county: 'Nairobi', code: 'TUK', website: 'https://www.tukenya.ac.ke' },
    { name: 'Egerton University', type: InstitutionType.UNIVERSITY, county: 'Nakuru', code: 'EU', website: 'https://www.egerton.ac.ke' },
    { name: 'Maseno University', type: InstitutionType.UNIVERSITY, county: 'Kisumu', code: 'MASENO', website: 'https://www.maseno.ac.ke' },
    { name: 'Kisii University', type: InstitutionType.UNIVERSITY, county: 'Kisii', code: 'KISII', website: 'https://www.kisiiuniversity.ac.ke' },
    { name: 'Nairobi Aviation College', type: InstitutionType.COLLEGE, county: 'Nairobi', code: 'NAC' },
    { name: 'Kenya Utalii College', type: InstitutionType.COLLEGE, county: 'Nairobi', code: 'KUC', website: 'https://www.utalii.ac.ke' },
    { name: 'Alliance High School', type: InstitutionType.HIGH_SCHOOL, county: 'Kiambu', code: 'ALLIANCE' },
    { name: 'Starehe Boys Centre', type: InstitutionType.HIGH_SCHOOL, county: 'Nairobi', code: 'SBC' },
    { name: 'Kenya Institute of Management', type: InstitutionType.COLLEGE, county: 'Nairobi', code: 'KIM', website: 'https://www.kim.ac.ke' },
    { name: 'Nairobi Technical Training Institute', type: InstitutionType.TVET, county: 'Nairobi', code: 'NTTI' },
    { name: 'Kabete National Polytechnic', type: InstitutionType.TVET, county: 'Kiambu', code: 'KNP' },
    { name: 'Eldoret Polytechnic', type: InstitutionType.TVET, county: 'Uasin Gishu', code: 'EP' },
    { name: 'Mombasa Technical Training Institute', type: InstitutionType.TVET, county: 'Mombasa', code: 'MTTI' },
    { name: 'Kisumu National Polytechnic', type: InstitutionType.TVET, county: 'Kisumu', code: 'KNP-KSM' },
  ]

  for (const inst of institutions) {
    await prisma.institution.upsert({
      where: { id: inst.code || inst.name },
      update: inst,
      create: { ...inst, id: inst.code || inst.name.replace(/\s+/g, '-').toLowerCase() },
    })
  }
  console.log(`✅ ${institutions.length} institutions seeded`)

  // Seed bursaries
  const bursaries = [
    {
      title: 'National Government Bursary 2025',
      description: 'Annual bursary award for needy students from all constituencies across Kenya. Priority given to orphans and vulnerable children.',
      amount: 25000,
      deadline: new Date('2025-08-31'),
      provider: 'National Government',
      eligibility: 'Kenyan citizen, enrolled in accredited institution, household income below KES 50,000/month',
      isOpen: true,
    },
    {
      title: 'County Education Fund — Nairobi',
      description: 'Nairobi County Government bursary for students pursuing tertiary education.',
      amount: 20000,
      deadline: new Date('2025-07-15'),
      provider: 'Nairobi County Government',
      eligibility: 'Nairobi County resident, Form 4 certificate or equivalent',
      isOpen: true,
    },
    {
      title: 'CDF Bursary 2025',
      description: 'Constituency Development Fund bursary for local needy students.',
      amount: 15000,
      deadline: new Date('2025-09-30'),
      provider: 'CDF Board',
      eligibility: 'Must be from the respective constituency',
      isOpen: true,
    },
    {
      title: 'Women in STEM Scholarship',
      description: 'Supporting female students pursuing Science, Technology, Engineering and Mathematics courses.',
      amount: 40000,
      deadline: new Date('2025-06-30'),
      provider: 'Kenya ICT Authority',
      eligibility: 'Female students enrolled in STEM programs',
      isOpen: true,
    },
    {
      title: 'Kenya Orphans Education Bursary',
      description: 'Dedicated support for orphaned students at any level of education.',
      amount: 30000,
      deadline: new Date('2025-10-31'),
      provider: 'Ministry of Education',
      eligibility: 'Orphans or children from child-headed households',
      isOpen: true,
    },
  ]

  for (const bursary of bursaries) {
    await prisma.bursary.create({ data: bursary }).catch(() => {})
  }
  console.log(`✅ ${bursaries.length} bursaries seeded`)

  console.log('\n🎉 Seed complete!')
  console.log('Admin credentials: admin@edufund.co.ke / Admin@1234')
  console.log('Student credentials: student@test.co.ke / Student@1234')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
