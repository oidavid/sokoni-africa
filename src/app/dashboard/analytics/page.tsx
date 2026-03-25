'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Eye, MessageCircle, ShoppingCart, Star, RefreshCw, ExternalLink, Users, BarChart2, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DayData { date: string; views: number; clicks: number; orders: number }
interface TopItem { name: string; count: number; revenue: number }
interface AnalyticsData {
  totalViews: number; viewsToday: number; viewsThisWeek: number
  totalWhatsappClicks: number; clicksToday: number
  totalOrders: number; ordersToday: number
  totalRevenue: number
  last7Days: DayData[]
  topProducts: TopItem[]
  storeUrl: string
  conversionRate: number
  avgOrderValue: number
  repeatVisitors: number
}

function fmt(n: number) { return n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n) }
function fmtCurrency(kobo: number) { return `₦${(kobo/100).toLocaleString()}` }
function fmtDate(d: string) { return new Date(d).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }) }
function fmtShort(d: string) { return new Date(d).toLocaleDateString('en', { weekday: 'short' }) }

function Trend({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null
  const pct = Math.round(((current - previous) / previous) * 100)
  if (pct === 0) return <span className="flex items-center gap-0.5 text-xs text-gray-400"><Minus size={10} />0%</span>
  return pct > 0
    ? <span className="flex items-center gap-0.5 text-xs text-green-600 font-semibold"><ArrowUp size={10} />{pct}%</span>
    : <span className="flex items-center gap-0.5 text-xs text-red-500 font-semibold"><ArrowDown size={10} />{Math.abs(pct)}%</span>
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${Math.max((v / max) * 100, 4)}%`, backgroundColor: color, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.6 }} />
      ))}
    </div>
  )
}

function BigChart({ days }: { days: DayData[] }) {
  const maxViews = Math.max(...days.map(d => d.views), 1)
  const maxClicks = Math.max(...days.map(d => d.clicks), 1)
  const overall = Math.max(maxViews, maxClicks, 1)
  return (
    <div className="mt-4">
      <div className="flex items-end gap-1.5 h-32">
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full flex items-end gap-0.5 h-28">
              <div className="flex-1 rounded-t-lg bg-brand-green/80 transition-all" style={{ height: `${Math.max((d.views / overall) * 100, 2)}%` }} title={`${d.views} views`} />
              <div className="flex-1 rounded-t-lg bg-blue-400/80 transition-all" style={{ height: `${Math.max((d.clicks / overall) * 100, 2)}%` }} title={`${d.clicks} WhatsApp clicks`} />
            </div>
            <span className="text-[9px] text-gray-400">{fmtShort(d.date)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-brand-green/80" /><span className="text-xs text-gray-500">Store visits</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-400/80" /><span className="text-xs text-gray-500">WhatsApp clicks</span></div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState<'7d' | '30d'>('7d')

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    const { data: { user } } = await supabase.auth.getUser()
    const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
    const merchantEmail = user?.email || fallbackEmail
    if (!merchantEmail) { router.push('/login'); return }

    const { data: m } = await supabase.from('merchants').select('id, slug, business_name').eq('email', merchantEmail).single()
    if (!m) { router.push('/onboarding'); return }

    const days = period === '7d' ? 7 : 30
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const [{ data: analytics }, { data: orders }, { data: products }] = await Promise.all([
      supabase.from('store_analytics').select('date, views, unique_visitors, whatsapp_clicks').eq('merchant_id', m.id).gte('date', since).order('date'),
      supabase.from('orders').select('created_at, subtotal, status, items').eq('merchant_id', m.id).gte('created_at', since + 'T00:00:00').order('created_at'),
      supabase.from('products').select('id, name').eq('merchant_id', m.id),
    ])

    const A = analytics || []
    const O = orders || []

    const totalViews = A.reduce((s, r) => s + (r.views || 0), 0)
    const viewsToday = A.find(r => r.date === today)?.views || 0
    const viewsYesterday = A.find(r => r.date === yesterday)?.views || 0
    const viewsThisWeek = A.filter(r => r.date >= new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]).reduce((s, r) => s + (r.views || 0), 0)
    const totalWhatsappClicks = A.reduce((s, r) => s + (r.whatsapp_clicks || 0), 0)
    const clicksToday = A.find(r => r.date === today)?.whatsapp_clicks || 0
    const repeatVisitors = A.reduce((s, r) => s + Math.max((r.views || 0) - (r.unique_visitors || 0), 0), 0)

    const totalOrders = O.length
    const ordersToday = O.filter(o => o.created_at?.startsWith(today)).length
    const totalRevenue = O.reduce((s, o) => s + (o.subtotal || 0), 0)
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    const conversionRate = totalViews > 0 ? Math.round((totalWhatsappClicks / totalViews) * 100 * 10) / 10 : 0

    // Build last 7 days chart data
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0]
      const row = A.find(r => r.date === d)
      return { date: d, views: row?.views || 0, clicks: row?.whatsapp_clicks || 0, orders: O.filter(o => o.created_at?.startsWith(d)).length }
    })

    // Top products
    const productMap: Record<string, { count: number; revenue: number }> = {}
    O.forEach(o => {
      (o.items || []).forEach((item: { name: string; price: number; qty: number }) => {
        if (!productMap[item.name]) productMap[item.name] = { count: 0, revenue: 0 }
        productMap[item.name].count += item.qty || 1
        productMap[item.name].revenue += (item.price || 0) * (item.qty || 1)
      })
    })
    const topProducts = Object.entries(productMap).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.count - a.count).slice(0, 5)

    setData({ totalViews, viewsToday, viewsThisWeek, totalWhatsappClicks, clicksToday, totalOrders, ordersToday, totalRevenue, last7Days: last7, topProducts, storeUrl: `https://earket.com/store/${m.slug}`, conversionRate, avgOrderValue, repeatVisitors })
    setLoading(false)
    setRefreshing(false)
  }, [router, period])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading your analytics...</p>
      </div>
    </div>
  )

  if (!data) return null

  const prevWeekViews = data.last7Days.slice(0, 3).reduce((s, d) => s + d.views, 0)
  const thisWeekViews = data.last7Days.slice(4).reduce((s, d) => s + d.views, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
              <ArrowLeft size={18} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-gray-900 text-base">Analytics</h1>
              <p className="text-xs text-gray-500">How your store is performing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-xl p-1">
              {(['7d', '30d'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${period === p ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500'}`}>
                  {p === '7d' ? '7 days' : '30 days'}
                </button>
              ))}
            </div>
            <button onClick={() => load(true)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
              <RefreshCw size={16} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* Store link */}
        <a href={data.storeUrl} target="_blank" rel="noreferrer"
          className="flex items-center justify-between bg-brand-green/10 border border-brand-green/20 rounded-2xl px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-brand-green uppercase tracking-wide">Your Store</p>
            <p className="text-sm text-gray-700 font-medium truncate">{data.storeUrl}</p>
          </div>
          <ExternalLink size={16} className="text-brand-green shrink-0" />
        </a>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Store Visits */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-brand-green/10 rounded-xl flex items-center justify-center">
                <Eye size={18} className="text-brand-green" />
              </div>
              <Trend current={thisWeekViews} previous={prevWeekViews} />
            </div>
            <p className="text-2xl font-display font-bold text-gray-900">{fmt(data.totalViews)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Store visits</p>
            <MiniChart data={data.last7Days.map(d => d.views)} color="#1A7A4A" />
            <p className="text-xs text-gray-400 mt-1">{data.viewsToday} today</p>
          </div>

          {/* WhatsApp Clicks */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle size={18} className="text-green-600" />
              </div>
              <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">{data.conversionRate}%</span>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900">{fmt(data.totalWhatsappClicks)}</p>
            <p className="text-xs text-gray-500 mt-0.5">WhatsApp clicks</p>
            <MiniChart data={data.last7Days.map(d => d.clicks)} color="#22c55e" />
            <p className="text-xs text-gray-400 mt-1">{data.clicksToday} today · {data.conversionRate}% conversion</p>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShoppingCart size={18} className="text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900">{data.totalOrders}</p>
            <p className="text-xs text-gray-500 mt-0.5">Orders received</p>
            <MiniChart data={data.last7Days.map(d => d.orders)} color="#3b82f6" />
            <p className="text-xs text-gray-400 mt-1">{data.ordersToday} today</p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-amber-500" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-gray-900">{fmtCurrency(data.totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total revenue</p>
            <div className="mt-2 pt-2 border-t border-gray-50">
              <p className="text-xs text-gray-400">Avg order: {fmtCurrency(data.avgOrderValue)}</p>
            </div>
          </div>
        </div>

        {/* 7-day chart */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-900 text-sm">Last 7 Days</h3>
            <BarChart2 size={16} className="text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">Store visits vs WhatsApp clicks</p>
          <BigChart days={data.last7Days} />
        </div>

        {/* Insight card */}
        <div className="bg-gradient-to-r from-brand-green to-emerald-500 rounded-2xl p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Star size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm mb-1">
                {data.conversionRate >= 10 ? '🔥 Excellent conversion rate!' :
                 data.conversionRate >= 5 ? '👍 Good conversion rate' :
                 data.totalViews === 0 ? '📢 Share your store to get visitors' :
                 '💡 Boost your WhatsApp clicks'}
              </p>
              <p className="text-xs text-white/80">
                {data.conversionRate >= 10 ? `${data.conversionRate}% of visitors click WhatsApp. Keep it up — your store is converting well.` :
                 data.conversionRate >= 5 ? `${data.conversionRate}% of visitors reach out. Add more photos and descriptions to improve this.` :
                 data.totalViews === 0 ? 'Share your store link on WhatsApp Status, Instagram and Facebook to get your first visitors.' :
                 `Only ${data.conversionRate}% of visitors contact you. Try adding a strong tagline and more product photos.`}
              </p>
            </div>
          </div>
        </div>

        {/* Top products */}
        {data.topProducts.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-gray-50">
              <h3 className="font-bold text-gray-900 text-sm">Top Services / Products</h3>
              <p className="text-xs text-gray-500">By number of orders this period</p>
            </div>
            {data.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.count} orders</p>
                </div>
                <p className="text-sm font-bold text-brand-green">{fmtCurrency(p.revenue)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Empty state for no data */}
        {data.totalViews === 0 && data.totalOrders === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <BarChart2 size={24} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">No data yet</h3>
            <p className="text-sm text-gray-500 mb-4">Share your store link to start getting visitors and see your analytics here.</p>
            <a href={data.storeUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-brand-green text-white font-bold text-sm px-5 py-2.5 rounded-xl">
              <ExternalLink size={14} /> View My Store
            </a>
          </div>
        )}

        {/* Repeat visitors */}
        {data.repeatVisitors > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
              <Users size={18} className="text-purple-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{fmt(data.repeatVisitors)} repeat visitors</p>
              <p className="text-xs text-gray-500">People who came back to your store more than once</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
