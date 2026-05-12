// lib/mpesa.ts
// Lipana M-Pesa STK Push Integration
// Docs: https://developer.safaricom.co.ke/Documentation

const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || ''
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || ''
const SHORTCODE = process.env.MPESA_SHORTCODE || '174379'
const PASSKEY = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://example.com/api/payments/callback'

export interface StkPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export interface StkCallbackData {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResultCode: number
  ResultDesc: string
  CallbackMetadata?: {
    Item: Array<{
      Name: string
      Value?: string | number
    }>
  }
}

async function getAccessToken(): Promise<string> {
  // If in mock mode (no real credentials), return mock token
  if (!CONSUMER_KEY || CONSUMER_KEY === 'your-mpesa-consumer-key') {
    return 'mock-access-token'
  }

  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')

  const response = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to get M-Pesa access token: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

function getTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hour}${minute}${second}`
}

function getPassword(timestamp: string): string {
  const data = `${SHORTCODE}${PASSKEY}${timestamp}`
  return Buffer.from(data).toString('base64')
}

function formatPhone(phone: string): string {
  // Convert 07XX or 01XX to 254XXXXXXXXX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    return `254${cleaned.substring(1)}`
  }
  if (cleaned.startsWith('254')) {
    return cleaned
  }
  if (cleaned.startsWith('+254')) {
    return cleaned.substring(1)
  }
  return cleaned
}

export async function initiateSTKPush(
  phone: string,
  amount: number,
  accountReference: string,
  transactionDesc: string = 'EduFund Application Fee'
): Promise<StkPushResponse> {
  // Mock mode — return simulated response if no real credentials
  if (!CONSUMER_KEY || CONSUMER_KEY === 'your-mpesa-consumer-key') {
    console.log('🔧 M-Pesa MOCK mode — simulating STK push')
    return {
      MerchantRequestID: `MOCK-MERCHANT-${Date.now()}`,
      CheckoutRequestID: `MOCK-CHECKOUT-${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing',
    }
  }

  const accessToken = await getAccessToken()
  const timestamp = getTimestamp()
  const password = getPassword(timestamp)
  const formattedPhone = formatPhone(phone)

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount),
    PartyA: formattedPhone,
    PartyB: SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  }

  const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errorMessage || 'STK Push failed')
  }

  return response.json()
}

export async function querySTKStatus(checkoutRequestId: string): Promise<{
  ResultCode: string
  ResultDesc: string
}> {
  // Mock mode
  if (!CONSUMER_KEY || CONSUMER_KEY === 'your-mpesa-consumer-key') {
    return { ResultCode: '0', ResultDesc: 'The service request is processed successfully.' }
  }

  const accessToken = await getAccessToken()
  const timestamp = getTimestamp()
  const password = getPassword(timestamp)

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  }

  const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return response.json()
}

export function parseCallbackData(callbackData: StkCallbackData) {
  const metadata = callbackData.CallbackMetadata?.Item || []

  const get = (name: string) =>
    metadata.find((item) => item.Name === name)?.Value

  return {
    resultCode: callbackData.ResultCode,
    resultDesc: callbackData.ResultDesc,
    mpesaReceiptNo: get('MpesaReceiptNumber') as string | undefined,
    amount: get('Amount') as number | undefined,
    transactionDate: get('TransactionDate') as string | undefined,
    phoneNumber: get('PhoneNumber') as string | undefined,
    checkoutRequestId: callbackData.CheckoutRequestID,
    merchantRequestId: callbackData.MerchantRequestID,
  }
}
