'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Tag, Trash2, ToggleLeft, ToggleRight, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DiscountCode {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  min_order: number
  max_uses: number | null
  uses: number
  active: boolean
  expires_at: string | null
  created_at: string
}

interface Merchant {
  id: string
  business_name: string
  country?: string
}

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  NG: '₦', GH: 'GH₵', KE: 'KSh', ZA: 'R', US: '$', GB: '£',
  CA: 'C$', AU: 'A$', BR: 'R$', IN: '₹', EG: 'E£',
}

export default function DiscountsPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currencySymbol, setCurrencySymbol] = useState('₦')

  // Form state
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percent' | 'fixed'>('percent')
  const [value, setValue] = useState('')
  const [minOrder, setMinOrder] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [formError, setFormError] = useState('')

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
    const merchantEmail = user?.email || fallbackEmail
    if (!merchantEmail) { router.push('/login'); return }
    const { data: m } = await supabase.from('merchants').select('id, business_name, country').eq('email', merchantEmail).single()
    if (!m) { router.push('/onboarding'); return }
    setMerchant(m)
    setCurrencySymbol(CURRENCY_BY_COUNTRY[m.country || ''] || '$')
    const { data: d } = await supabase.from('discount_codes').select('*').eq('merchant_id', m.id).order('created_at', { ascending: false })
    setCodes(d || [])
    setLoading(false)
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const prefix = merchant?.business_name?.slice(0, 3).toUpperCase() || 'EAR'
    const suffix = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setCode(`${prefix}${suffix}`)
  }

  async function handleSave() {
    if (!code.trim()) { setFormError('Please enter a code'); return }
    if (!value || parseFloat(value) <= 0) { setFormError('Please enter a valid discount value'); return }
    if (type === 'percent' && parseFloat(value) > 100) { setFormError('Percentage cannot exceed 100%'); return }
    setSaving(true)
    setFormError('')
    const { error } = await supabase.from('discount_codes').insert({
      merchant_id: merchant!.id,
      code: code.trim().toUpperCase(),
      type,
      value: parseFloat(value),
      min_order: parseFloat(minOrder || '0'),
      max_uses: maxUses ? parseInt(maxUses) : null,
      expires_at: expiresAt || null,
    })
    if (error) {
      setFormError(error.message.includes('unique') ? 'This code already exists' : 'Failed to save. Please try again.')
    } else {
      setCode(''); setValue(''); setMinOrder(''); setMaxUses(''); setExpiresAt('')
      setType('percent'); setShowForm(false)
      await loadData()
    }
    setSaving(false)
  }

  async function toggleActive(id: string, active: boolean) {
    await supabase.from('discount_codes').update({ active: !active }).eq('id', id)
    setCodes(prev => prev.map(c => c.id === id ? { ...c, active: !active } : c))
  }

  async function deleteCode(id: string) {
    if (!confirm('Delete this discount code?')) return
    await supabase.from('discount_codes').delete().eq('id', id)
    setCodes(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={15} className="text-gray-500" />
        </Link>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark">Discount Codes</span>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-brand-green text-white text-xs font-bold px-3 py-2 rounded-xl">
          <Plus size={13} /> New Code
        </button>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Create form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-brand-green px-5 py-4">
                <h2 className="font-display font-bold text-white text-lg">Create Discount Code</h2>
                <p className="text-white/70 text-xs mt-0.5">Customers enter this at checkout</p>
              </div>
              <div className="p-5 space-y-3">
                {/* Code */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Code</label>
                  <div className="flex gap-2">
                    <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SAVE20"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono font-bold uppercase focus:outline-none focus:border-brand-green" />
                    <button onClick={generateCode}
                      className="text-xs font-semibold text-brand-green bg-brand-light px-3 py-2.5 rounded-xl border border-brand-green/20 whitespace-nowrap">
                      Generate
                    </button>
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Discount Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ v: 'percent', label: '% Percentage' }, { v: 'fixed', label: `${currencySymbol} Fixed Amount` }].map(t => (
                      <button key={t.v} onClick={() => setType(t.v as 'percent' | 'fixed')}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors ${type === t.v ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-gray-600 border-gray-200'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Value */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    {type === 'percent' ? 'Discount %' : `Discount Amount (${currencySymbol})`}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                      {type === 'percent' ? '%' : currencySymbol}
                    </span>
                    <input type="number" value={value} onChange={e => setValue(e.target.value)}
                      placeholder={type === 'percent' ? '20' : '500'}
                      className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                  </div>
                </div>

                {/* Min order */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    Minimum Order ({currencySymbol}) <span className="font-normal text-gray-400 normal-case">optional</span>
                  </label>
                  <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                </div>

                {/* Max uses & expiry */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Max Uses <span className="font-normal normal-case text-gray-400">optional</span></label>
                    <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)}
                      placeholder="Unlimited"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Expiry <span className="font-normal normal-case text-gray-400">optional</span></label>
                    <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green" />
                  </div>
                </div>

                {formError && <p className="text-red-500 text-xs">{formError}</p>}

                <button onClick={handleSave} disabled={saving}
                  className="w-full bg-brand-green text-white font-bold py-3 rounded-2xl disabled:opacity-50">
                  {saving ? 'Saving...' : 'Create Code'}
                </button>
                <button onClick={() => setShowForm(false)} className="w-full text-sm text-gray-400 font-medium py-2">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {codes.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">🏷️</div>
            <p className="font-display font-bold text-brand-dark mb-1">No discount codes yet</p>
            <p className="text-gray-500 text-sm mb-4">Create codes to offer discounts to your customers.</p>
            <button onClick={() => setShowForm(true)}
              className="bg-brand-green text-white text-sm font-bold px-5 py-2.5 rounded-xl">
              Create First Code
            </button>
          </div>
        )}

        {/* Codes list */}
        {codes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {codes.map((c, i) => (
              <div key={c.id} className={`px-4 py-4 ${i < codes.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.active ? 'bg-brand-light' : 'bg-gray-100'}`}>
                      <Tag size={16} className={c.active ? 'text-brand-green' : 'text-gray-400'} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-brand-dark text-sm">{c.code}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {c.type === 'percent' ? `${c.value}% off` : `${currencySymbol}${c.value} off`}
                        {c.min_order > 0 && ` · Min ${currencySymbol}${c.min_order}`}
                        {c.max_uses && ` · ${c.uses}/${c.max_uses} uses`}
                        {!c.max_uses && ` · ${c.uses} uses`}
                        {c.expires_at && ` · Expires ${new Date(c.expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleActive(c.id, c.active)}>
                      {c.active
                        ? <ToggleRight size={22} className="text-brand-green" />
                        : <ToggleLeft size={22} className="text-gray-300" />}
                    </button>
                    <button onClick={() => deleteCode(c.id)}
                      className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="bg-brand-light rounded-2xl p-4">
          <p className="text-xs font-semibold text-brand-green mb-2">💡 How discount codes work</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Customers enter the code at checkout</li>
            <li>• Discount is applied automatically to their order total</li>
            <li>• You can set a minimum order, usage limit, and expiry date</li>
            <li>• Toggle codes on/off anytime without deleting them</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
