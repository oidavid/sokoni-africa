'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, CreditCard, Building2, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Bank { id: number; name: string; code: string }

export default function PaymentsPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<{ id: string; business_name: string; paystack_subaccount?: string; bank_name?: string; account_number?: string } | null>(null)
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [bankCode, setBankCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
      const merchantEmail = user?.email || fallbackEmail
      if (!merchantEmail) { router.push('/login'); return }

      // Try exact match first, then case-insensitive
      let { data: m } = await supabase
        .from('merchants')
        .select('id, business_name, paystack_subaccount, bank_name, account_number')
        .eq('email', merchantEmail)
        .single()

      if (!m) {
        const { data: m2 } = await supabase
          .from('merchants')
          .select('id, business_name, paystack_subaccount, bank_name, account_number')
          .ilike('email', merchantEmail)
          .maybeSingle()
        m = m2
      }

      if (!m) { setLoading(false); return }

      setMerchant(m)
      if (m.account_number) setAccountNumber(m.account_number)

      try {
        const res = await fetch('/api/payment/banks')
        const bankList = await res.json()
        setBanks(Array.isArray(bankList) ? bankList : [])
      } catch (e) {
        console.error('Banks load error:', e)
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function verifyAccount() {
    if (!bankCode || accountNumber.length !== 10) return
    setVerifying(true)
    setAccountName('')
    setError('')
    const res = await fetch(`/api/payment/verify-account?bank_code=${bankCode}&account_number=${accountNumber}`)
    const data = await res.json()
    if (data.account_name) setAccountName(data.account_name)
    else setError('Could not verify account. Please check details.')
    setVerifying(false)
  }

  async function handleSave() {
    if (!merchant || !bankCode || accountNumber.length !== 10) {
      setError('Please select a bank and enter a valid 10-digit account number')
      return
    }
    setSaving(true)
    setError('')
    const res = await fetch('/api/payment/subaccount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchant.id,
        business_name: merchant.business_name,
        bank_code: bankCode,
        account_number: accountNumber,
      }),
    })
    const data = await res.json()
    if (data.error) setError(data.error)
    else {
      setSaved(true)
      setMerchant(prev => prev ? { ...prev, paystack_subaccount: data.subaccount_code } : prev)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 size={24} className="text-brand-green animate-spin" /></div>
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-600 font-semibold">Could not load your store details.</p>
        <Link href="/dashboard" className="bg-brand-green text-white font-bold px-6 py-3 rounded-xl text-sm">← Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto pb-10">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark flex-1">Payment Setup</h1>
        {saved && <div className="flex items-center gap-1 text-brand-green text-xs font-semibold"><Check size={14} /> Saved!</div>}
      </div>

      <div className="p-4 space-y-4">
        {/* Status */}
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${merchant?.paystack_subaccount ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${merchant?.paystack_subaccount ? 'bg-green-100' : 'bg-amber-100'}`}>
            {merchant?.paystack_subaccount ? <Check size={20} className="text-green-600" /> : <CreditCard size={20} className="text-amber-600" />}
          </div>
          <div>
            <p className={`font-semibold text-sm ${merchant?.paystack_subaccount ? 'text-green-700' : 'text-amber-700'}`}>
              {merchant?.paystack_subaccount ? 'Payments Active ✅' : 'Bank Account Required'}
            </p>
            <p className={`text-xs ${merchant?.paystack_subaccount ? 'text-green-600' : 'text-amber-600'}`}>
              {merchant?.paystack_subaccount ? `${merchant.bank_name} · ****${merchant.account_number?.slice(-4)}` : 'Connect your bank to accept card payments'}
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-display font-bold text-brand-dark text-sm mb-3">How payments work</h2>
          <div className="space-y-3">
            {[
              { icon: '💳', title: 'Customer pays online', desc: 'Card, bank transfer, USSD, mobile money' },
              { icon: '⚡', title: 'Instant settlement to your bank', desc: 'Money goes directly to your account — no middleman' },
              { icon: '📊', title: 'Earket platform fee: 2.5%', desc: 'Automatically deducted per transaction' },
              { icon: '🔒', title: 'Secured by Paystack', desc: 'CBN-licensed and PCI-DSS compliant' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
          <h2 className="font-display font-bold text-brand-dark text-sm">
            {merchant?.paystack_subaccount ? 'Update Bank Account' : 'Connect Bank Account'}
          </h2>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Bank</label>
            <select value={bankCode} onChange={e => { setBankCode(e.target.value); setAccountName('') }}
              className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:border-brand-green outline-none">
              <option value="">Select your bank...</option>
              {banks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Account Number</label>
            <div className="flex gap-2">
              <input type="text" maxLength={10} value={accountNumber}
                onChange={e => { setAccountNumber(e.target.value.replace(/\D/g, '')); setAccountName('') }}
                placeholder="10-digit account number"
                className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:border-brand-green outline-none tracking-widest" />
              {bankCode && accountNumber.length === 10 && !accountName && (
                <button onClick={verifyAccount} disabled={verifying}
                  className="bg-brand-green text-white text-xs font-bold px-4 rounded-xl whitespace-nowrap">
                  {verifying ? <Loader2 size={14} className="animate-spin" /> : 'Verify'}
                </button>
              )}
            </div>
            {accountName && (
              <p className="text-brand-green text-xs font-semibold mt-1.5 flex items-center gap-1">
                <Check size={12} /> {accountName}
              </p>
            )}
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-600 text-xs">{error}</p></div>}

          <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
            <Shield size={14} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">Your bank details are securely processed by Paystack. Earket never stores your full account credentials.</p>
          </div>

          <button onClick={handleSave} disabled={saving || !bankCode || accountNumber.length !== 10}
            className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={18} className="animate-spin" /> Connecting...</> : <><Building2 size={18} /> Connect Bank Account</>}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center px-4">
          By connecting your bank account, you agree to Paystack's terms. Paystack is licensed by the Central Bank of Nigeria.
        </p>
      </div>
    </div>
  )
}
