'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function JoinContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ref = searchParams.get('ref')

  useEffect(() => {
    if (ref) {
      localStorage.setItem('earket_referral_code', ref)
    }
    router.push('/onboarding')
  }, [ref, router])

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-2xl">🛍️</span>
        </div>
        <p className="text-brand-dark font-semibold">Setting up your store...</p>
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-light flex items-center justify-center"><p>Loading...</p></div>}>
      <JoinContent />
    </Suspense>
  )
}
