'use client'
// components/forms/MPesaPayment.tsx

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Smartphone, CheckCircle, XCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { useApi } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'

interface MPesaPaymentProps {
  applicationId: string
  userPhone: string
  onSuccess: () => void
}

type PaymentState = 'idle' | 'initiating' | 'pending' | 'polling' | 'success' | 'failed'

const APPLICATION_FEE = 500

export default function MPesaPayment({ applicationId, userPhone, onSuccess }: MPesaPaymentProps) {
  const api = useApi()
  const [phone, setPhone] = useState(userPhone || '')
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)
  const [isMock, setIsMock] = useState(false)
  const MAX_POLLS = 12 // Poll for 60 seconds (12 * 5s)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (paymentState === 'polling' && pollCount < MAX_POLLS) {
      interval = setInterval(async () => {
        await checkPaymentStatus()
        setPollCount(p => p + 1)
      }, 5000)
    } else if (pollCount >= MAX_POLLS && paymentState === 'polling') {
      setPaymentState('idle')
      setError('Payment timed out. Please try again.')
    }
    return () => clearInterval(interval)
  }, [paymentState, pollCount])

  const initiate = async () => {
    if (!phone.trim()) {
      toast.error('Enter your M-Pesa phone number')
      return
    }
    setError(null)
    setPaymentState('initiating')

    try {
      const res = await api.post('/api/payments/initiate', {
        phone,
        applicationId,
      })

      if (!res.success) {
        setError(res.error || 'Payment initiation failed')
        setPaymentState('idle')
        return
      }

      setCheckoutRequestId(res.data.payment.checkoutRequestId)
      setIsMock(res.data.isMock)
      setPaymentState('pending')
      setPollCount(0)

      if (!res.data.isMock) {
        // Start polling after 3 seconds
        setTimeout(() => setPaymentState('polling'), 3000)
      }
    } catch {
      setError('Network error. Please try again.')
      setPaymentState('idle')
    }
  }

  const checkPaymentStatus = async () => {
    const res = await api.get(`/api/payments/status?applicationId=${applicationId}`)
    if (res.success && res.data.payment) {
      const { status, mpesaReceiptNo } = res.data.payment
      if (status === 'SUCCESS') {
        setReceipt(mpesaReceiptNo)
        setPaymentState('success')
        setTimeout(onSuccess, 2500)
      } else if (status === 'FAILED' || status === 'CANCELLED') {
        setPaymentState('failed')
        setError('Payment was not completed. Please try again.')
      }
    }
  }

  const confirmMock = async () => {
    setPaymentState('initiating')
    try {
      const res = await api.post('/api/payments/status', { applicationId })
      if (res.success) {
        setReceipt(res.data.mpesaReceiptNo)
        setPaymentState('success')
        toast.success('Mock payment confirmed!')
        setTimeout(onSuccess, 2000)
      }
    } catch {
      setError('Failed to confirm mock payment')
      setPaymentState('idle')
    }
  }

  const reset = () => {
    setPaymentState('idle')
    setError(null)
    setCheckoutRequestId(null)
    setPollCount(0)
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-green-600" /> Application Fee Payment
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Pay the application fee via M-Pesa to submit your application
        </p>
      </div>

      {/* Fee summary */}
      <div className="bg-gray-50 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">Application Processing Fee</p>
          <p className="text-xs text-gray-400 mt-0.5">One-time, non-refundable fee</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(APPLICATION_FEE)}</p>
          <p className="text-xs text-gray-400">Lipa Na M-Pesa</p>
        </div>
      </div>

      {/* Mock indicator */}
      {isMock && paymentState !== 'idle' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            🔧 Sandbox Mode — Real M-Pesa not triggered. Use the "Confirm Mock Payment" button.
          </p>
        </div>
      )}

      {/* States */}
      {paymentState === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              M-Pesa Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+254</span>
              <input
                value={phone.replace(/^(?:\+254|254|0)/, '')}
                onChange={(e) => setPhone(`0${e.target.value.replace(/\D/g, '')}`)}
                placeholder="7XX XXX XXX"
                className="w-full pl-16 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">You will receive a prompt on this number</p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <Smartphone className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">How M-Pesa Payment Works</p>
              <ol className="mt-1 space-y-0.5 text-xs text-green-700">
                <li>1. Click "Pay via M-Pesa" below</li>
                <li>2. Check your phone for the M-Pesa PIN prompt</li>
                <li>3. Enter your M-Pesa PIN to authorize payment</li>
                <li>4. Your application will be submitted automatically</li>
              </ol>
            </div>
          </div>

          <button
            onClick={initiate}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            Pay KES {APPLICATION_FEE.toLocaleString()} via M-Pesa
          </button>
        </motion.div>
      )}

      {paymentState === 'initiating' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto" />
          <p className="font-semibold text-gray-900">Initiating M-Pesa payment...</p>
          <p className="text-sm text-gray-500">Please wait</p>
        </motion.div>
      )}

      {(paymentState === 'pending' || paymentState === 'polling') && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <Smartphone className="w-8 h-8 text-green-600" />
          </motion.div>
          <div>
            <p className="font-bold text-gray-900 text-lg">Check your phone!</p>
            <p className="text-sm text-gray-500 mt-1">
              An M-Pesa payment request has been sent to <strong>{phone}</strong>
            </p>
            <p className="text-sm text-gray-500">Enter your M-Pesa PIN to complete payment</p>
          </div>

          {paymentState === 'polling' && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Checking payment status...
            </div>
          )}

          {isMock && (
            <div className="space-y-3">
              <p className="text-xs text-amber-600 font-medium">Sandbox mode — click to simulate payment</p>
              <button
                onClick={confirmMock}
                className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all text-sm"
              >
                Confirm Mock Payment
              </button>
            </div>
          )}

          <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 underline">
            Cancel and try again
          </button>
        </motion.div>
      )}

      {paymentState === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-9 h-9 text-emerald-600" />
          </motion.div>
          <div>
            <p className="font-bold text-gray-900 text-xl">Payment Successful!</p>
            {receipt && (
              <div className="mt-2 px-4 py-2 bg-gray-100 rounded-lg inline-block">
                <p className="text-xs text-gray-500">M-Pesa Receipt</p>
                <p className="font-mono font-bold text-gray-900">{receipt}</p>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-3">
              Your application has been submitted! Redirecting to dashboard...
            </p>
          </div>
        </motion.div>
      )}

      {paymentState === 'failed' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-9 h-9 text-red-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">Payment Failed</p>
            <p className="text-sm text-gray-500 mt-1">{error || 'The payment was not completed.'}</p>
          </div>
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all text-sm"
          >
            Try Again
          </button>
        </motion.div>
      )}
    </div>
  )
}
