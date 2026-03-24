'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowLeft, Mail, Phone, MessageSquare, Calendar, User, Inbox } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  service_interest?: string
  message?: string
  created_at: string
}

interface Merchant {
  id: string
  business_name: string
  business_type?: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function LeadsPage() {
  const router = useRouter()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
    const merchantEmail = user?.email || fallbackEmail
    if (!merchantEmail) { router.push('/login'); return }
    const { data: m } = await supabase.from('merchants').select('id, business_name, business_type').eq('email', merchantEmail).single()
    if (!m) { router.push('/onboarding'); return }
    setMerchant(m)
    const { data: l } = await supabase
      .from('leads')
      .select('*')
      .eq('merchant_id', m.id)
      .order('created_at', { ascending: false })
    setLeads(l || [])
    setLoading(false)
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!merchant) return null

  const isService = merchant.business_type === 'services'
  const waBase = `https://wa.me/`

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={15} className="text-gray-500" />
        </Link>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark">Leads</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">{leads.length} total</span>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Empty state */}
        {leads.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-display font-bold text-brand-dark mb-1">No leads yet</p>
            <p className="text-gray-500 text-sm">When someone fills in your contact form, they'll appear here.</p>
          </div>
        )}

        {/* Leads list */}
        {leads.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {leads.map((lead, i) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${i < leads.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center shrink-0 font-bold text-brand-green text-sm">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-gray-800 truncate">{lead.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">{timeAgo(lead.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{lead.email}</p>
                  {lead.service_interest && (
                    <span className="inline-block mt-1.5 text-xs bg-brand-light text-brand-green font-medium px-2 py-0.5 rounded-lg">
                      {lead.service_interest}
                    </span>
                  )}
                  {lead.message && (
                    <p className="text-xs text-gray-400 truncate mt-1">"{lead.message}"</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-brand-green px-5 py-5">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-white text-lg mb-3">
                {selectedLead.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display font-bold text-white text-lg leading-tight">{selectedLead.name}</h2>
              <p className="text-white/70 text-xs mt-0.5">{timeAgo(selectedLead.created_at)}</p>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm font-semibold text-brand-green">{selectedLead.email}</a>
                </div>
              </div>

              {selectedLead.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone / WhatsApp</p>
                    <a href={`tel:${selectedLead.phone}`} className="text-sm font-semibold text-gray-800">{selectedLead.phone}</a>
                  </div>
                </div>
              )}

              {selectedLead.service_interest && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-light rounded-xl flex items-center justify-center shrink-0">
                    <Inbox size={14} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Interested in</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedLead.service_interest}</p>
                  </div>
                </div>
              )}

              {selectedLead.message && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Message</p>
                    <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{selectedLead.message}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Submitted</p>
                  <p className="text-sm text-gray-700">{new Date(selectedLead.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 grid grid-cols-2 gap-2">
              {selectedLead.phone && (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedLead.name}, thanks for your enquiry${selectedLead.service_interest ? ` about ${selectedLead.service_interest}` : ''}. I'd love to help!`)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-sm font-bold py-3 rounded-2xl"
                >
                  💬 WhatsApp
                </a>
              )}
              <a
                href={`mailto:${selectedLead.email}?subject=Re: Your enquiry${selectedLead.service_interest ? ` about ${selectedLead.service_interest}` : ''}&body=Hi ${selectedLead.name},%0D%0A%0D%0AThanks for reaching out!`}
                className={`flex items-center justify-center gap-1.5 bg-brand-green text-white text-sm font-bold py-3 rounded-2xl ${!selectedLead.phone ? 'col-span-2' : ''}`}
              >
                ✉️ Email
              </a>
            </div>

            <button onClick={() => setSelectedLead(null)} className="w-full text-sm text-gray-400 font-medium py-3 border-t border-gray-100">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
