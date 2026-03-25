'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search, Star, MessageCircle, Users, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Customer {
  id: string
  name: string
  whatsapp_number: string | null
  email: string | null
  loyalty_points: number
  total_spent: number
  visit_count: number
  last_seen_at: string
  created_at: string
}

const LOYALTY_REWARD_THRESHOLD = 50

export default function CustomersPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<{ id: string; business_name: string; currency: string; slug: string } | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'whatsapp' | 'loyal'>('all')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null)
      if (!email) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('id, business_name, country, slug').eq('email', email).single()
      if (!m) { router.push('/onboarding'); return }
      const currencyMap: Record<string, string> = { 'NG': '₦', 'GH': 'GH₵', 'KE': 'KSh', 'ZA': 'R', 'US': '$', 'GB': '£' }
      setMerchant({ id: m.id, business_name: m.business_name, currency: currencyMap[m.country || 'NG'] || '₦', slug: m.slug })
      const { data: custs } = await supabase.from('customers').select('*').eq('merchant_id', m.id).order('last_seen_at', { ascending: false })
      setCustomers(custs || [])
      setLoading(false)
    }
    load()
  }, [router])

  const fmt = (kobo: number) => `${merchant?.currency}${(kobo / 100).toLocaleString()}`

  const filtered = customers
    .filter(c => {
      if (filter === 'whatsapp') return !!c.whatsapp_number
      if (filter === 'loyal') return c.loyalty_points >= LOYALTY_REWARD_THRESHOLD
      return true
    })
    .filter(c => {
      if (!search) return true
      const q = search.toLowerCase()
      return c.name?.toLowerCase().includes(q) || c.whatsapp_number?.includes(q) || c.email?.toLowerCase().includes(q)
    })

  const withWhatsApp = customers.filter(c => c.whatsapp_number).length
  const loyalCount = customers.filter(c => c.loyalty_points >= LOYALTY_REWARD_THRESHOLD).length
  const totalRevenue = customers.reduce((s, c) => s + c.total_spent, 0)

  function buildBroadcastMessage(businessName: string, slug: string) {
    return encodeURIComponent(
      `👋 Hello from *${businessName}*!\n\nWe have exciting new products and offers waiting for you.\n\n🛍️ Shop now: earket.com/store/${slug}\n\nReply to this message if you have any questions. Thank you for your loyalty! 🙏`
    )
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center"><ArrowLeft size={18} className="text-gray-600" /></Link>
            <div>
              <h1 className="font-display font-bold text-gray-900 text-base">Customers</h1>
              <p className="text-xs text-gray-500">{customers.length} total customers</p>
            </div>
          </div>
          {/* Broadcast to all WhatsApp customers */}
          {withWhatsApp > 0 && merchant && (
            <a href={`https://wa.me/?text=${buildBroadcastMessage(merchant.business_name, merchant.slug)}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-3 py-2 rounded-xl">
              <MessageCircle size={13} /> Broadcast
            </a>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="font-display font-bold text-xl text-brand-dark">{customers.length}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="font-display font-bold text-xl text-[#25D366]">{withWhatsApp}</div>
            <div className="text-xs text-gray-500">On WhatsApp</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="font-display font-bold text-xl text-amber-500">{loyalCount}</div>
            <div className="text-xs text-gray-500">Reward Ready</div>
          </div>
        </div>

        {/* Total revenue from known customers */}
        <div className="bg-brand-light border border-brand-green/20 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-green" />
            <p className="text-sm font-semibold text-brand-dark">Revenue from tracked customers</p>
          </div>
          <p className="font-bold text-brand-green">{fmt(totalRevenue)}</p>
        </div>

        {/* Search + filter */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or number..."
            className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-4 py-3 text-sm outline-none focus:border-brand-green" />
        </div>

        <div className="flex gap-2">
          {(['all', 'whatsapp', 'loyal'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === f ? 'bg-brand-green text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
              {f === 'all' ? 'All' : f === 'whatsapp' ? '📱 WhatsApp' : '⭐ Reward Ready'}
            </button>
          ))}
        </div>

        {/* Customer list */}
        {customers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Users size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium mb-1">No customers yet</p>
            <p className="text-gray-400 text-xs mb-4">Customers are added automatically when you record a cash sale with their WhatsApp number.</p>
            <Link href="/dashboard/cash-sale" className="inline-block bg-brand-green text-white text-xs font-bold px-5 py-2.5 rounded-xl">
              Record a Cash Sale →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
            <p className="text-gray-400 text-sm">No customers match your search</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => {
              const rewardReady = c.loyalty_points >= LOYALTY_REWARD_THRESHOLD
              const toReward = LOYALTY_REWARD_THRESHOLD - c.loyalty_points
              return (
                <div key={c.id} className={`bg-white rounded-2xl p-4 border ${rewardReady ? 'border-amber-300 bg-amber-50' : 'border-gray-100'}`}>
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center font-bold text-brand-green shrink-0">
                      {(c.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm text-gray-900 truncate">{c.name || 'Unknown'}</p>
                        {rewardReady && <span className="text-[10px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">🎁 Reward!</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{c.visit_count} visit{c.visit_count !== 1 ? 's' : ''}</span>
                        <span>·</span>
                        <span className="font-medium text-brand-green">{fmt(c.total_spent)} spent</span>
                      </div>
                      {/* Loyalty bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (c.loyalty_points / LOYALTY_REWARD_THRESHOLD) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {rewardReady ? '⭐ Ready!' : `${toReward} pts to reward`}
                        </span>
                      </div>
                    </div>
                    {/* WhatsApp action */}
                    {c.whatsapp_number && (
                      <a href={`https://wa.me/${c.whatsapp_number}`} target="_blank" rel="noreferrer"
                        className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
                        <MessageCircle size={16} className="text-white" />
                      </a>
                    )}
                  </div>
                  {c.whatsapp_number && (
                    <p className="text-xs text-gray-400 mt-2 ml-13">📱 +{c.whatsapp_number}</p>
                  )}
                  {c.email && (
                    <p className="text-xs text-gray-400 mt-0.5 ml-13">✉️ {c.email}</p>
                  )}
                  <p className="text-xs text-gray-300 mt-1 ml-13">Last seen {new Date(c.last_seen_at).toLocaleDateString('en', { day: 'numeric', month: 'short' })}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
