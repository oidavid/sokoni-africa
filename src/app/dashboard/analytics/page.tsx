'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, ShoppingCart, Eye, TrendingUp as RevenueIcon, Package, RefreshCw, MessageCircle, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
  totalViews: number
  viewsToday: number
  viewsThisWeek: number
  totalOrders: number
  ordersToday: number
  totalRevenue: number
  revenueThisMonth: number
  topProducts: Array<{ name: string; orders: number; revenue: number }>
  ordersByStatus: Record<string, number>
  totalWhatsappClicks: number
  clicksToday: number
  conversionRate: number
  dailyViews: Array<{ date: string; views: number }>
  dailyOrders: Array<{ date: string; orders: number; revenue: number }>
  totalCOGS: number
  totalProfit: number
  profitMargin: number
}

function formatCurrency(kobo: number, symbol: string) {
  const amount = kobo / 100
  return `${symbol}${amount.toLocaleString()}`
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [merchantSlug, setMerchantSlug] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState('₦')
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [quickRange, setQuickRange] = useState<'7d'|'30d'|'90d'|'1y'|'custom'>('30d')

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    const { data: { user } } = await supabase.auth.getUser()
    const fallbackEmail = typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null
    const merchantEmail = user?.email || fallbackEmail
    if (!merchantEmail) { router.push('/login'); return }

    const { data: m } = await supabase.from('merchants').select('id, slug, country').eq('email', merchantEmail).single()
    if (!m) { router.push('/onboarding'); return }
    setMerchantSlug(m.slug)
    // Set currency based on country
    const currencyMap: Record<string, string> = {
      'NG': '₦', 'GH': 'GH₵', 'KE': 'KSh', 'ZA': 'R', 'US': '$', 'GB': '£',
      'CA': 'CA$', 'AU': 'A$', 'DE': '€', 'FR': '€', 'IT': '€', 'ES': '€',
      'TZ': 'TSh', 'UG': 'USh', 'ET': 'Br', 'SN': 'CFA', 'CM': 'FCFA',
      'IN': '₹', 'AE': 'AED', 'SA': 'SAR', 'JP': '¥', 'CN': '¥', 'BR': 'R$',
    }
    setCurrencySymbol(currencyMap[m.country || 'NG'] || '₦')

    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Analytics views
    const { data: analytics } = await supabase
      .from('store_analytics')
      .select('date, views, whatsapp_clicks')
      .eq('merchant_id', m.id)
      .gte('date', dateFrom)
      .lte('date', dateTo)
      .order('date', { ascending: true })

    // Orders
    const { data: orders } = await supabase
      .from('orders')
      .select('created_at, subtotal, status, items')
      .eq('merchant_id', m.id)
      .gte('created_at', dateFrom + 'T00:00:00')
      .lte('created_at', dateTo + 'T23:59:59')
      .order('created_at', { ascending: true })

    const allAnalytics = analytics || []
    const allOrders = orders || []

    const totalViews = allAnalytics.reduce((s, r) => s + r.views, 0)
    const viewsToday = allAnalytics.find(r => r.date === today)?.views || 0
    const viewsThisWeek = allAnalytics.filter(r => r.date >= weekAgo).reduce((s, r) => s + r.views, 0)

    const totalOrders = allOrders.length
    const ordersToday = allOrders.filter(o => o.created_at.startsWith(today)).length
    const totalRevenue = allOrders.reduce((s, o) => s + (o.subtotal || 0), 0)
    const revenueThisMonth = allOrders.reduce((s, o) => s + (o.subtotal || 0), 0)

    const totalWhatsappClicks = allAnalytics.reduce((s, r) => s + (r.whatsapp_clicks || 0), 0)
    const clicksToday = allAnalytics.find(r => r.date === today)?.whatsapp_clicks || 0
    const conversionRate = totalViews > 0 ? Math.round((totalWhatsappClicks / totalViews) * 100 * 10) / 10 : 0

    // Orders by status
    const ordersByStatus: Record<string, number> = {}
    allOrders.forEach(o => { ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1 })

    // Top products from order items
    const productMap: Record<string, { orders: number; revenue: number }> = {}
    allOrders.forEach(o => {
      (o.items || []).forEach((item: { name: string; price: number; qty: number }) => {
        if (!productMap[item.name]) productMap[item.name] = { orders: 0, revenue: 0 }
        productMap[item.name].orders += item.qty
        productMap[item.name].revenue += item.price * item.qty
      })
    })
    const topProducts = Object.entries(productMap)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Daily views for chart (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      return d.toISOString().split('T')[0]
    })
    const dailyViews = last7Days.map(date => ({
      date,
      views: allAnalytics.find(r => r.date === date)?.views || 0
    }))

    // Daily orders for chart (last 7 days)
    const dailyOrders = last7Days.map(date => {
      const dayOrders = allOrders.filter(o => o.created_at.startsWith(date))
      return {
        date,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + (o.subtotal || 0), 0)
      }
    })

    // Calculate COGS from products cost_price
    const { data: products } = await supabase
      .from('products')
      .select('id, cost_price')
      .eq('merchant_id', m.id)
    
    const productCostMap: Record<string, number> = {}
    ;(products || []).forEach((p: { id: string; cost_price: number | null }) => {
      if (p.cost_price) productCostMap[p.id] = p.cost_price
    })

    let totalCOGS = 0
    allOrders.forEach(o => {
      ;(o.items || []).forEach((item: { product_id?: string; price: number; qty: number }) => {
        const costPrice = item.product_id ? productCostMap[item.product_id] : null
        if (costPrice) totalCOGS += costPrice * item.qty
      })
    })

    const totalProfit = totalRevenue - totalCOGS
    const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0

    setData({ totalViews, viewsToday, viewsThisWeek, totalWhatsappClicks, clicksToday, conversionRate, totalOrders, ordersToday, totalRevenue, revenueThisMonth, topProducts, ordersByStatus, dailyViews, dailyOrders, totalCOGS, totalProfit, profitMargin })
    setLoading(false)
    setRefreshing(false)
  }, [router])

  useEffect(() => { load() }, [load, dateFrom, dateTo])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const maxViews = Math.max(...(data?.dailyViews.map(d => d.views) || [1]), 1)
  const maxOrders = Math.max(...(data?.dailyOrders.map(d => d.orders) || [1]), 1)

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <h1 className="font-display font-bold text-brand-dark flex-1">Analytics</h1>
        <button onClick={() => load(true)} disabled={refreshing}
          className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <RefreshCw size={14} className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Date range picker */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          {(['7d','30d','90d','1y'] as const).map(r => (
            <button key={r} onClick={() => {
              setQuickRange(r)
              const days = r === '7d' ? 7 : r === '30d' ? 30 : r === '90d' ? 90 : 365
              setDateFrom(new Date(Date.now() - days * 86400000).toISOString().split('T')[0])
              setDateTo(new Date().toISOString().split('T')[0])
            }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${quickRange === r ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'}`}>
              {r}
            </button>
          ))}
          <button onClick={() => { setQuickRange('custom'); setShowDatePicker(!showDatePicker) }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${quickRange === 'custom' ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500'}`}>
            <Calendar size={11} /> Custom
          </button>
        </div>
        {showDatePicker && (
          <div className="flex items-center gap-2 mt-2">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-green" />
            <span className="text-xs text-gray-400">to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-green" />
            <button onClick={() => load()} className="bg-brand-green text-white text-xs font-bold px-3 py-2 rounded-xl">Go</button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                <Eye size={16} className="text-blue-500" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Store Views</span>
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{data?.totalViews.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">
              <span className="text-brand-green font-semibold">{data?.viewsToday}</span> today · <span className="text-brand-green font-semibold">{data?.viewsThisWeek}</span> this week
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <MessageCircle size={16} className="text-green-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500">WhatsApp Clicks</span>
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{data?.totalWhatsappClicks.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">
              <span className="text-brand-green font-semibold">{data?.clicksToday}</span> today · <span className="text-brand-green font-semibold">{data?.conversionRate}%</span> conversion
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                <ShoppingCart size={16} className="text-amber-500" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Orders</span>
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{data?.totalOrders}</div>
            <div className="text-xs text-gray-400 mt-1">
              <span className="text-brand-green font-semibold">{data?.ordersToday}</span> today
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Revenue ({quickRange === "custom" ? "custom" : quickRange})</span>
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{formatCurrency(data?.revenueThisMonth || 0, currencySymbol)}</div>
            <div className="text-xs text-gray-400 mt-1">{dateFrom} → {dateTo}</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={16} className="text-purple-500" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Conversion</span>
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">
              {data?.totalViews ? Math.round((data.totalOrders / data.totalViews) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-400 mt-1">Views → Orders</div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="font-display font-bold text-brand-dark text-sm">Financial Summary (30 days)</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-sm text-gray-700">Revenue</span>
              </div>
              <span className="font-display font-bold text-blue-600">{formatCurrency(data?.revenueThisMonth || 0, currencySymbol)}</span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="text-sm text-gray-700">Cost of Goods (COGS)</span>
              </div>
              <span className="font-display font-bold text-red-500">
                {data?.totalCOGS ? `- ${formatCurrency(data.totalCOGS, currencySymbol)}` : '—'}
              </span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center bg-brand-light/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-green rounded-full" />
                <span className="text-sm font-semibold text-gray-800">Gross Profit</span>
              </div>
              <span className="font-display font-bold text-brand-green">
                {data?.totalCOGS ? formatCurrency(data.totalProfit || 0, currencySymbol) : '—'}
              </span>
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-700">Profit Margin</span>
              </div>
              <span className="font-display font-bold text-purple-600">
                {data?.totalCOGS ? `${data.profitMargin}%` : '—'}
              </span>
            </div>
          </div>
          {!data?.totalCOGS && (
            <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
              <p className="text-xs text-amber-700">
                💡 Add cost prices to your products to see profit calculations.
              </p>
            </div>
          )}
        </div>

        {/* Views chart */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h2 className="font-display font-bold text-brand-dark text-sm mb-4">Store Views — Last 7 Days</h2>
          <div className="flex items-end gap-2 h-24">
            {data?.dailyViews.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 font-medium">{d.views || ''}</span>
                <div className="w-full bg-blue-100 rounded-t-lg transition-all"
                  style={{ height: `${Math.max(4, (d.views / maxViews) * 72)}px` }} />
                <span className="text-xs text-gray-400">{formatDate(d.date).split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders chart */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h2 className="font-display font-bold text-brand-dark text-sm mb-4">Orders — Last 7 Days</h2>
          <div className="flex items-end gap-2 h-24">
            {data?.dailyOrders.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 font-medium">{d.orders || ''}</span>
                <div className="w-full bg-brand-light rounded-t-lg transition-all"
                  style={{ height: `${Math.max(4, (d.orders / maxOrders) * 72)}px`, backgroundColor: '#d1fae5' }} />
                <span className="text-xs text-gray-400">{formatDate(d.date).split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h2 className="font-display font-bold text-brand-dark text-sm mb-3">Orders by Status</h2>
          <div className="space-y-2">
            {Object.entries({
              new: { label: 'New', color: 'bg-blue-100 text-blue-700' },
              confirmed: { label: 'Confirmed', color: 'bg-amber-100 text-amber-700' },
              dispatched: { label: 'Dispatched', color: 'bg-purple-100 text-purple-700' },
              delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
              cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
            }).map(([key, { label, color }]) => {
              const count = data?.ordersByStatus[key] || 0
              const total = data?.totalOrders || 1
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-20 text-center ${color}`}>{label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-brand-green h-2 rounded-full transition-all"
                      style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-600 w-4 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Products */}
        {data && data.topProducts.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h2 className="font-display font-bold text-brand-dark text-sm mb-3">Top Products</h2>
            <div className="space-y-2">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-brand-light rounded-lg flex items-center justify-center text-xs font-bold text-brand-green">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.orders} sold</p>
                  </div>
                  <span className="font-display font-bold text-brand-green text-sm">{formatCurrency(p.revenue, currencySymbol)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store link */}
        <div className="bg-brand-light rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold">Your store link</p>
            <p className="text-sm font-bold text-brand-green">earket.com/store/{merchantSlug}</p>
          </div>
          <button onClick={() => {
            navigator.clipboard.writeText(`https://earket.com/store/${merchantSlug}`)
            alert('Link copied!')
          }} className="bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-xl">
            Copy Link
          </button>
        </div>
      </div>
    </div>
  )
}
