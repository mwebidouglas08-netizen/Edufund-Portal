// lib/mpesa.ts — Lipana M-Pesa STK Push Integration
// Docs: https://developer.safaricom.co.ke/Documentation

function getMpesaBaseUrl() {
  return process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
}

function isMockMode() {
  const key = process.env.MPESA_CONSUMER_KEY || ''
  return !key || key === 'your-mpesa-consumer-key'
}

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
    Item: Array<{ Name: string; Value?: string | number }>
  }
}

async function getAccessToken(): Promise<string> {
  if (isMockMode()) return 'mock-access-token'

  const key = process.env.MPESA_CONSUMER_KEY!
  const secret = process.env.MPESA_CONSUMER_SECRET!
  const credentials = Buffer.from(`${key}:${secret}`).toString('base64')

  const response = await fetch(
    `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    { method: 'GET', headers: { Authorization: `Basic ${credentials}` } }
  )
  if (!response.ok) throw new Error(`M-Pesa token error: ${response.statusText}`)
  const data = await response.json()
  return data.access_token
}

function getTimestamp(): string {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('')
}

function getPassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE || '174379'
  const passkey = process.env.MPESA_PASSKEY ||
    'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) return `254${cleaned.substring(1)}`
  if (cleaned.startsWith('+')) return cleaned.substring(1)
  return cleaned
}

export async function initiateSTKPush(
  phone: string,
  amount: number,
  accountReference: string,
  transactionDesc = 'EduFund Application Fee'
): Promise<StkPushResponse> {
  if (isMockMode()) {
    console.log('🔧 M-Pesa MOCK mode — simulating STK push for:', phone)
    return {
      MerchantRequestID: `MOCK-MR-${Date.now()}`,
      CheckoutRequestID: `MOCK-CR-${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing',
    }
  }

  const accessToken = await getAccessToken()
  const timestamp = getTimestamp()
  const shortcode = process.env.MPESA_SHORTCODE || '174379'
  const callbackUrl = process.env.MPESA_CALLBACK_URL || ''

  const payload = {
    BusinessShortCode: shortcode,
    Password: getPassword(timestamp),
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount),
    PartyA: formatPhone(phone),
    PartyB: shortcode,
    PhoneNumber: formatPhone(phone),
    CallBackURL: callbackUrl,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  }

  const response = await fetch(
    `${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.errorMessage || 'STK Push failed')
  }
  return response.json()
}

export async function querySTKStatus(checkoutRequestId: string) {
  if (isMockMode()) {
    return { ResultCode: '0', ResultDesc: 'The service request is processed successfully.' }
  }

  const accessToken = await getAccessToken()
  const timestamp = getTimestamp()
  const shortcode = process.env.MPESA_SHORTCODE || '174379'

  const response = await fetch(
    `${getMpesaBaseUrl()}/mpesa/stkpushquery/v1/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: getPassword(timestamp),
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    }
  )
  return response.json()
}

export function parseCallbackData(callbackData: StkCallbackData) {
  const items = callbackData.CallbackMetadata?.Item || []
  const get = (name: string) => items.find(i => i.Name === name)?.Value

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
