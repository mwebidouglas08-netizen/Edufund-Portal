// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = process.env.EMAIL_FROM || 'EduFund Portal <noreply@edufund.co.ke>'

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER) {
    console.log(`📧 Email (mock): To: ${to} | Subject: ${subject}`)
    return { messageId: 'mock-message-id' }
  }

  return transporter.sendMail({ from: FROM, to, subject, html })
}

const emailLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1342e1 0%, #0f2d8e 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: #93b4ff; margin: 6px 0 0; font-size: 14px; }
    .body { padding: 40px; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-blue { background: #e8f0ff; color: #1342e1; }
    .badge-green { background: #ecfdf5; color: #059669; }
    .badge-yellow { background: #fffbeb; color: #d97706; }
    .badge-red { background: #fef2f2; color: #dc2626; }
    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; }
    .info-value { color: #1e293b; font-weight: 500; }
    .cta-button { display: block; width: fit-content; margin: 24px auto; padding: 14px 32px; background: #1342e1; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; }
    .footer { background: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #94a3b8; font-size: 12px; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 EduFund Portal</h1>
      <p>Educational Funding Management System</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} EduFund Portal. All rights reserved.</p>
      <p>If you did not request this email, please ignore it.</p>
    </div>
  </div>
</body>
</html>
`

export async function sendWelcomeEmail(to: string, name: string) {
  const html = emailLayout(`
    <h2 style="color:#1e293b;margin:0 0 8px">Welcome, ${name}! 🎉</h2>
    <p style="color:#64748b;font-size:15px;line-height:1.6">
      Your EduFund Portal account has been successfully created. You can now apply for bursaries
      and educational funding opportunities.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">Go to Dashboard →</a>
    <p style="color:#94a3b8;font-size:13px;text-align:center">
      Need help? Contact us at support@edufund.co.ke
    </p>
  `)
  return sendEmail(to, 'Welcome to EduFund Portal', html)
}

export async function sendApplicationStatusEmail(
  to: string,
  name: string,
  refNo: string,
  status: string,
  comment?: string
) {
  const statusMap: Record<string, { label: string; badge: string; message: string }> = {
    SUBMITTED: {
      label: 'Application Submitted',
      badge: 'badge-blue',
      message: 'Your application has been submitted and is awaiting review.',
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      badge: 'badge-yellow',
      message: 'Your application is currently being reviewed by our team.',
    },
    APPROVED: {
      label: 'Application Approved! 🎉',
      badge: 'badge-green',
      message: 'Congratulations! Your bursary application has been approved.',
    },
    REJECTED: {
      label: 'Application Rejected',
      badge: 'badge-red',
      message: 'Unfortunately, your application has not been successful at this time.',
    },
    DISBURSED: {
      label: 'Funds Disbursed! 🎊',
      badge: 'badge-green',
      message: 'The bursary funds have been disbursed. Please check with your institution.',
    },
  }

  const info = statusMap[status] || statusMap['SUBMITTED']

  const html = emailLayout(`
    <h2 style="color:#1e293b;margin:0 0 16px">Application Status Update</h2>
    <p>Dear ${name},</p>
    <p style="color:#64748b;">Your application status has been updated:</p>
    <div style="text-align:center;margin:24px 0;">
      <span class="badge ${info.badge}">${info.label}</span>
    </div>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Reference Number</span>
        <span class="info-value">${refNo}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status</span>
        <span class="info-value">${info.label}</span>
      </div>
    </div>
    <p style="color:#475569;">${info.message}</p>
    ${comment ? `<div class="info-box"><p style="color:#475569;margin:0;"><strong>Admin Comment:</strong><br>${comment}</p></div>` : ''}
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">View Application →</a>
  `)

  return sendEmail(to, `Application ${info.label} — ${refNo}`, html)
}

export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  amount: number,
  mpesaRef: string,
  refNo: string
) {
  const html = emailLayout(`
    <h2 style="color:#1e293b;margin:0 0 8px">Payment Confirmed ✅</h2>
    <p>Dear ${name},</p>
    <p style="color:#64748b;">Your application fee payment has been received successfully.</p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">M-Pesa Receipt No.</span>
        <span class="info-value">${mpesaRef}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Amount Paid</span>
        <span class="info-value">KES ${amount.toLocaleString()}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Application Ref.</span>
        <span class="info-value">${refNo}</span>
      </div>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">Track Application →</a>
  `)
  return sendEmail(to, `Payment Confirmed — KES ${amount} | ${mpesaRef}`, html)
}
