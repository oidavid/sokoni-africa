'use client'
import { useState } from 'react'
import { Check, Loader2, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SubdomainSettingsProps {
  merchantId: string
  merchantSlug: string
  currentSubdomain?: string | null
  isPremium?: boolean
}

const RESERVED = ['www', 'app', 'api', 'admin', 'dashboard', 'earket', 'store', 'help', 'support', 'blog', 'mail']

export default function SubdomainSettings({
  merchantId,
  merchantSlug,
  currentSubdomain,
  isPremium = false,
}: SubdomainSettingsProps) {
  const [subdomain, setSubdomain] = useState(currentSubdomain || '')
  const [checking, setChecking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'available' | 'taken' | 'invalid' | 'reserved' | 'saved'>('idle')
  const [savedSubdomain, setSavedSubdomain] = useState(currentSubdomain || '')

  function validate(value: string): string | null {
    if (!value) return null
    if (value.length < 3) return 'Too short — minimum 3 characters'
    if (value.length > 30) return 'Too long — maximum 30 characters'
    if (!/^[a-z0-9-]+$/.test(value)) return 'Only lowercase letters, numbers and hyphens'
    if (value.startsWith('-') || value.endsWith('-')) return 'Cannot start or end with a hyphen'
    if (RESERVED.includes(value)) return 'That name is reserved'
    return null
  }

  async function checkAvailability() {
    const val = subdomain.toLowerCase().trim()
    const error = validate(val)
    if (error) { setStatus('invalid'); return }
    if (val === savedSubdomain) { setStatus('saved'); return }

    setChecking(true)
    setStatus('idle')
    const { data } = await supabase
      .from('merchants')
      .select('id')
      .eq('subdomain', val)
      .neq('id', merchantId)
      .maybeSingle()
    setChecking(false)
    setStatus(data ? 'taken' : 'available')
  }

  async function save() {
    const val = subdomain.toLowerCase().trim()
    if (status !== 'available') return
    setSaving(true)
    const { error } = await supabase
      .from('merchants')
      .update({ subdomain: val })
      .eq('id', merchantId)
    if (!error) {
      setSavedSubdomain(val)
      setStatus('saved')
    }
    setSaving(false)
  }

  async function remove() {
    setSaving(true)
    await supabase.from('merchants').update({ subdomain: null }).eq('id', merchantId)
    setSubdomain('')
    setSavedSubdomain('')
    setStatus('idle')
    setSaving(false)
  }

  const validationError = subdomain ? validate(subdomain.toLowerCase()) : null

  if (!isPremium) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">⭐</span>
          <div>
            <h3 className="font-display font-bold text-indigo-900 text-sm">Custom Subdomain</h3>
            <p className="text-xs text-indigo-600 mt-0.5">Premium feature — coming soon</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 mb-4 border border-indigo-100">
          <p className="text-xs text-gray-500 mb-1">Instead of:</p>
          <p className="text-xs font-mono text-gray-400 line-through">earket.com/store/{merchantSlug}</p>
          <p className="text-xs text-gray-500 mt-2 mb-1">You get:</p>
          <p className="text-xs font-mono text-indigo-700 font-bold">yourbrand.earket.com</p>
        </div>
        <p className="text-xs text-indigo-600 mb-3">
          Your own branded link. Looks professional, easier to share, and builds brand recognition with every customer visit.
        </p>
        <button className="w-full bg-indigo-600 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors opacity-60 cursor-not-allowed">
          Upgrade to Earket Pro
        </button>
        <p className="text-xs text-center text-indigo-400 mt-2">Join the Pro waitlist from your dashboard</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div>
        <h3 className="font-display font-bold text-brand-dark text-sm">Custom Subdomain</h3>
        <p className="text-xs text-gray-400 mt-0.5">Your own branded link on earket.com</p>
      </div>

      {savedSubdomain && (
        <div className="bg-brand-light rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-green mb-0.5">✓ Active subdomain</p>
            <a href={`https://${savedSubdomain}.earket.com`} target="_blank" rel="noreferrer"
              className="text-sm font-bold text-brand-green hover:underline flex items-center gap-1">
              {savedSubdomain}.earket.com <ExternalLink size={11} />
            </a>
          </div>
          <button onClick={remove} disabled={saving}
            className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">
            Remove
          </button>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
          {savedSubdomain ? 'Change subdomain' : 'Choose your subdomain'}
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={subdomain}
              onChange={e => { setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setStatus('idle') }}
              placeholder="yourbrand"
              maxLength={30}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green pr-24 font-mono"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">.earket.com</span>
          </div>
          <button
            onClick={checkAvailability}
            disabled={!subdomain || checking || !!validationError}
            className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-40 shrink-0">
            {checking ? <Loader2 size={14} className="animate-spin" /> : 'Check'}
          </button>
        </div>

        {/* Validation error */}
        {validationError && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">❌ {validationError}</p>
        )}

        {/* Availability status */}
        {!validationError && status === 'available' && (
          <p className="text-xs text-brand-green mt-1.5 flex items-center gap-1">
            <Check size={12} /> {subdomain}.earket.com is available!
          </p>
        )}
        {status === 'taken' && (
          <p className="text-xs text-red-500 mt-1.5">❌ That subdomain is already taken</p>
        )}
        {status === 'saved' && (
          <p className="text-xs text-brand-green mt-1.5 flex items-center gap-1">
            <Check size={12} /> This is your current subdomain
          </p>
        )}
      </div>

      {status === 'available' && (
        <button onClick={save} disabled={saving}
          className="w-full bg-brand-green text-white text-sm font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : `Claim ${subdomain}.earket.com`}
        </button>
      )}

      <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
        <p className="font-semibold text-gray-600">How it works:</p>
        <p>• Your store becomes accessible at <span className="font-mono text-brand-green">{subdomain || 'yourbrand'}.earket.com</span></p>
        <p>• Your original link <span className="font-mono text-gray-400">earket.com/store/{merchantSlug}</span> still works</p>
        <p>• Share the shorter link with customers and in your marketing</p>
      </div>
    </div>
  )
}
