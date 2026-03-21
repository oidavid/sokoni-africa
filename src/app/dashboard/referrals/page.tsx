'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Copy, Check, Users, Gift, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Referral {
  id: string
  created_at: string
  status: string
  referred: { business_name: string; location: string }
}

export default function ReferralsPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<{ id: string; business_name: string; referral_code: string } | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email || localStorage.getItem('earket_merchant_email')
      if (!email) { router.push('/login'); return }

      let { data: m } = await supabase.from('merchants')
        .select('id, business_name, referral_code').eq('email', email).single()
      if (!m) return

      // Generate referral code if missing
      if (!m.referral_code) {
        const code = m.business_name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) + 
          Math.floor(Math.random() * 90 + 10)
        await supabase.from('merchants').update({ referral_code: code }).eq('id', m.id)
        m = { ...m, referral_code: code }
      }
      setMerchant(m)

      // Load referrals
      const { data: refs } = await supabase.from('referrals')
        .select('id, created_at, status, referred:referred_id(business_name, location)')
        .eq('referrer_id', m.id)
        .order('created_at', { ascending: false })
      setReferrals((refs || []) as unknown as Referral[])
      setLoading(false)
    }
    load()
  }, [router])

  const referralLink = `https://earket.com/join?ref=${merchant?.referral_code}`

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    const msg = `🛍️ Start selling online FREE with Earket!\n\nI use Earket to run my online store — it's free, works on WhatsApp, and takes 5 minutes to set up.\n\nJoin using my link and we both get rewarded:\n${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-brand-green" /></div>

  const activeReferrals = referrals.filter(r => r.status === 'active' || r.status === 'rewarded').length

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto pb-10">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="font-display font-bold text-brand-dark">Refer & Earn</h1>
        <p className="text-xs text-gray-400">Invite merchants, earn rewards together</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="font-display font-bold text-3xl text-brand-green">{referrals.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Referrals</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="font-display font-bold text-3xl text-brand-green">{activeReferrals}</p>
            <p className="text-xs text-gray-500 mt-1">Active Stores</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-display font-bold text-brand-dark text-sm mb-3">How it works</h2>
          <div className="space-y-3">
            {[
              { icon: '🔗', title: 'Share your link', desc: 'Send your unique referral link to friends and fellow merchants' },
              { icon: '🏪', title: 'They open a store', desc: 'When they sign up and create their store using your link' },
              { icon: '🎁', title: 'Both get rewarded', desc: 'You earn referral credit, they get a head start on Earket' },
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

        {/* Referral link */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <h2 className="font-display font-bold text-brand-dark text-sm">Your referral link</h2>
          <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-600 truncate flex-1 font-mono">{referralLink}</p>
            <button onClick={copyLink} className="shrink-0 w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} className="text-white" />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={copyLink}
              className="flex items-center justify-center gap-2 bg-brand-light text-brand-green font-semibold text-sm py-3 rounded-xl">
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
            </button>
            <button onClick={shareWhatsApp}
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold text-sm py-3 rounded-xl">
              <Share2 size={14} /> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* Referral list */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            <h2 className="font-semibold text-gray-800 text-sm">Merchants you referred</h2>
          </div>
          {referrals.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Gift size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-semibold">No referrals yet</p>
              <p className="text-gray-400 text-xs mt-1">Share your link to start earning</p>
            </div>
          ) : referrals.map(r => (
            <div key={r.id} className="px-4 py-3 flex items-center justify-between border-b border-gray-50 last:border-0">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{r.referred?.business_name}</p>
                <p className="text-xs text-gray-400">{r.referred?.location} · {new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                r.status === 'active' ? 'bg-green-100 text-green-700' :
                r.status === 'rewarded' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-500'
              }`}>
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
