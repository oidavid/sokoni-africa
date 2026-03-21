'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Star } from 'lucide-react'

export default function CustomerRegisterPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister() {
    setLoading(true); setError('')
    const res = await fetch('/api/customer/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    localStorage.setItem(`earket_customer_${slug}`, JSON.stringify(data.customer))
    router.push(`/store/${slug}/account`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Link href={`/store/${slug}`} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display font-bold text-brand-dark">Create Account</h1>
      </div>
      <div className="max-w-sm mx-auto px-4 py-6">
        {/* Loyalty incentive */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Star size={24} className="text-amber-500 shrink-0" fill="currentColor" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Earn loyalty points!</p>
            <p className="text-amber-600 text-xs">Get 1 point for every ₦100 you spend. Redeem for discounts.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Phone (optional)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08012345678"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green outline-none" />
          </div>
          {error && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
          <button onClick={handleRegister} disabled={loading || !name || !email || !password || password.length < 6}
            className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : '✓ Create Account & Start Earning'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link href={`/store/${slug}/login`} className="text-brand-green font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
