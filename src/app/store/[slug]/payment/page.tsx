'use client'
import { useEffect, useState, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, X, Loader2 } from 'lucide-react'

function PaymentCallbackContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const reference = searchParams.get('reference') || searchParams.get('trxref')

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    async function verify() {
      if (!reference) { setStatus('failed'); return }

      try {
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        })
        const data = await res.json()
        if (data.success) {
          setOrderNumber(data.data?.metadata?.order_number || '')
          setStatus('success')
          // Clear cart
          const { clearCart } = await import('@/lib/cart')
          clearCart(slug)
        } else {
          setStatus('failed')
        }
      } catch {
        setStatus('failed')
      }
    }
    verify()
  }, [reference, slug])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {status === 'verifying' && (
          <>
            <Loader2 size={48} className="text-brand-green animate-spin mx-auto mb-4" />
            <h1 className="font-display text-xl font-bold text-brand-dark mb-2">Verifying payment...</h1>
            <p className="text-gray-500 text-sm">Please wait while we confirm your payment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/30">
              <Check size={36} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Payment Successful! 🎉</h1>
            {orderNumber && (
              <p className="text-gray-500 text-sm mb-2">Order <span className="font-bold text-brand-dark">{orderNumber}</span> has been confirmed.</p>
            )}
            <p className="text-gray-400 text-xs mb-8">The merchant will contact you shortly to arrange delivery.</p>
            <Link href={`/store/${slug}`}
              className="bg-brand-green text-white font-bold px-8 py-3 rounded-2xl inline-block hover:bg-brand-dark transition-colors">
              Continue Shopping
            </Link>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={36} className="text-red-500" />
            </div>
            <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Payment Failed</h1>
            <p className="text-gray-500 text-sm mb-8">Your payment could not be verified. Please try again.</p>
            <Link href={`/store/${slug}/checkout`}
              className="bg-brand-green text-white font-bold px-8 py-3 rounded-2xl inline-block">
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 size={24} className="text-brand-green animate-spin" /></div>}>
      <PaymentCallbackContent />
    </Suspense>
  )
}
