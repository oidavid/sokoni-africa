'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createHash } from 'crypto'
import { supabase } from '@/lib/supabase'

function hashPassword(password: string) {
  return createHash('sha256').update(password + 'earket24').digest('hex')
}

export default function CustomerLoginPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true); setError('')

    const { data: customer } = await supabase.from('customers')
      .select('id, name, email, phone, password_hash')
      .eq('email', email.toLowerCase()).maybeSingle()

    if (!customer || customer.password_hash !== hashPassword(password)) {
      setError('Invalid email or password')
      setLoading(false); return
    }

    const { password_hash, ...safe } = customer
    localStorage.setItem(`earket_customer_${slug}`, JSON.stringify(safe))
    router.push(`/store/${slug}/account`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Link href={`/store/${slug}`} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="font-display font-bold text-brand-dark">Sign In</h1>
      </div>
      <div className="max-w-sm mx-auto px-4 py-8 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green outline-none" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green outline-none" />
        </div>
        {error && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
        <button onClick={handleLogin} disabled={loading || !email || !password}
          className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl disabled:opacity-40 flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
        </button>
        <p className="text-center text-sm text-gray-500">
          No account? <Link href={`/store/${slug}/register`} className="text-brand-green font-semibold">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
