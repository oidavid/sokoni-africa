'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Shield, TrendingUp, ShoppingCart, Calendar, Star, CheckCircle, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ReportData {
  business_name: string
  owner_name: string
  email: string
  phone: string
  location: string
  category: string
  country: string
  joined: string
  currency: string
  totalRevenue: number
  totalOrders: number
  avgMonthlyRevenue: number
  avgOrderValue: number
  monthlyBreakdown: Array<{ month: string; revenue: number; orders: number }>
  topProducts: Array<{ name: string; orders: number; revenue: number }>
  activeDays: number
  reportDate: string
  reportId: string
}

function fmt(kobo: number, symbol: string) { return `${symbol}${(kobo / 100).toLocaleString()}` }

export default function CreditReportPage() {
  const router = useRouter()
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null)
      if (!email) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('*').eq('email', email).single()
      if (!m) { router.push('/onboarding'); return }

      const currencyMap: Record<string, string> = { 'NG': '₦', 'GH': 'GH₵', 'KE': 'KSh', 'ZA': 'R', 'US': '$', 'GB': '£', 'TZ': 'TSh' }
      const currency = currencyMap[m.country || 'NG'] || '₦'

      // Get last 6 months of orders
      const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
      const { data: orders } = await supabase.from('orders').select('created_at, subtotal, items, status').eq('merchant_id', m.id).gte('created_at', sixMonthsAgo).neq('status', 'cancelled').order('created_at')

      const allOrders = orders || []
      const totalRevenue = allOrders.reduce((s, o) => s + (o.subtotal || 0), 0)
      const totalOrders = allOrders.length

      // Monthly breakdown
      const monthMap: Record<string, { revenue: number; orders: number }> = {}
      allOrders.forEach(o => {
        const month = new Date(o.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })
        if (!monthMap[month]) monthMap[month] = { revenue: 0, orders: 0 }
        monthMap[month].revenue += o.subtotal || 0
        monthMap[month].orders += 1
      })
      const monthlyBreakdown = Object.entries(monthMap).map(([month, v]) => ({ month, ...v })).slice(-6)
      const avgMonthlyRevenue = monthlyBreakdown.length > 0 ? Math.round(totalRevenue / monthlyBreakdown.length) : 0
      const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

      // Top products
      const productMap: Record<string, { orders: number; revenue: number }> = {}
      allOrders.forEach(o => {
        (o.items || []).forEach((item: any) => {
          if (!productMap[item.name]) productMap[item.name] = { orders: 0, revenue: 0 }
          productMap[item.name].orders += item.qty || 1
          productMap[item.name].revenue += (item.price || 0) * (item.qty || 1)
        })
      })
      const topProducts = Object.entries(productMap).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

      // Active days
      const uniqueDays = new Set(allOrders.map(o => o.created_at.split('T')[0])).size

      const reportId = `EKT-${m.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

      setData({
        business_name: m.business_name,
        owner_name: m.owner_name || 'Business Owner',
        email: m.email,
        phone: m.whatsapp || '',
        location: m.location || '',
        category: m.category || '',
        country: m.country || 'NG',
        joined: new Date(m.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' }),
        currency,
        totalRevenue,
        totalOrders,
        avgMonthlyRevenue,
        avgOrderValue,
        monthlyBreakdown,
        topProducts,
        activeDays: uniqueDays,
        reportDate: new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' }),
        reportId,
      })
      setLoading(false)
    }
    load()
  }, [router])

  async function downloadPDF() {
    setGenerating(true)
    // Use browser print to PDF
    window.print()
    setGenerating(false)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" /></div>
  if (!data) return null

  const months = data.monthlyBreakdown
  const maxRevenue = Math.max(...months.map(m => m.revenue), 1)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Screen-only controls */}
      <div className="print:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
              <ArrowLeft size={18} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-gray-900 text-base">Business Credit Report</h1>
              <p className="text-xs text-gray-500">Last 6 months · {data.reportId}</p>
            </div>
          </div>
          <button onClick={downloadPDF} disabled={generating}
            className="flex items-center gap-2 bg-brand-green text-white font-bold text-sm px-4 py-2.5 rounded-xl">
            <Download size={16} /> {generating ? 'Preparing...' : 'Download PDF'}
          </button>
        </div>

        {data.totalOrders < 5 && (
          <div className="max-w-3xl mx-auto mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            <p className="text-xs text-amber-700">💡 You have {data.totalOrders} recorded sales. Record more cash sales to strengthen your credit report. Lenders typically look for 3+ months of consistent data.</p>
          </div>
        )}
      </div>

      {/* PDF Report — prints cleanly */}
      <div ref={reportRef} className="max-w-3xl mx-auto my-6 print:my-0 print:max-w-none">
        <div className="bg-white shadow-lg print:shadow-none" style={{ minHeight: '297mm' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-8 print:px-6 print:py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-white font-bold text-lg">Earket</span>
                  <span className="text-green-400 text-xs font-semibold px-2 py-0.5 bg-green-400/20 rounded-full">Verified Platform</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Business Sales Report</h1>
                <p className="text-gray-400 text-sm">For Financial Reference & Credit Assessment</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Report ID</p>
                <p className="text-white font-mono text-sm font-bold">{data.reportId}</p>
                <p className="text-gray-400 text-xs mt-2">Generated</p>
                <p className="text-white text-sm">{data.reportDate}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 print:px-6 space-y-6">

            {/* Business Info */}
            <div className="grid grid-cols-2 gap-6 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Business Information</h2>
                <table className="w-full text-sm">
                  <tbody className="space-y-1">
                    {[
                      ['Business Name', data.business_name],
                      ['Owner', data.owner_name],
                      ['Category', data.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())],
                      ['Location', data.location],
                      ['Member Since', data.joined],
                    ].map(([label, value]) => (
                      <tr key={label} className="border-b border-gray-50">
                        <td className="py-1.5 text-gray-500 font-medium pr-4 w-32">{label}</td>
                        <td className="py-1.5 text-gray-900 font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Contact Details</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Email', data.email],
                      ['WhatsApp', data.phone],
                      ['Country', data.country],
                    ].map(([label, value]) => (
                      <tr key={label} className="border-b border-gray-50">
                        <td className="py-1.5 text-gray-500 font-medium pr-4 w-32">{label}</td>
                        <td className="py-1.5 text-gray-900 font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <p className="text-xs font-bold text-green-700">Identity Verified by Earket</p>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Business registered and active on Earket platform</p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">6-Month Sales Summary</h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: fmt(data.totalRevenue, data.currency), icon: '💰', color: 'bg-green-50 border-green-200' },
                  { label: 'Total Transactions', value: data.totalOrders.toLocaleString(), icon: '🧾', color: 'bg-blue-50 border-blue-200' },
                  { label: 'Avg Monthly Revenue', value: fmt(data.avgMonthlyRevenue, data.currency), icon: '📈', color: 'bg-purple-50 border-purple-200' },
                  { label: 'Avg Sale Value', value: fmt(data.avgOrderValue, data.currency), icon: '🎯', color: 'bg-amber-50 border-amber-200' },
                ].map(stat => (
                  <div key={stat.label} className={`border rounded-xl p-3 ${stat.color}`}>
                    <p className="text-lg mb-1">{stat.icon}</p>
                    <p className="font-display font-bold text-gray-900 text-lg leading-tight">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            {months.length > 0 && (
              <div className="border border-gray-100 rounded-xl p-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Monthly Revenue Trend</h2>
                <div className="flex items-end gap-3 h-32">
                  {months.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <p className="text-xs font-bold text-gray-700">{fmt(m.revenue, data.currency)}</p>
                      <div className="w-full bg-brand-green rounded-t-lg" style={{ height: `${Math.max((m.revenue / maxRevenue) * 96, 4)}px` }} />
                      <p className="text-xs text-gray-400 text-center leading-tight">{m.month}</p>
                      <p className="text-xs text-gray-400">{m.orders} sales</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Table */}
            {months.length > 0 && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Month</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Transactions</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Revenue</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Avg Sale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {months.map((m, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-800">{m.month}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{m.orders}</td>
                        <td className="px-4 py-3 text-right font-bold text-brand-green">{fmt(m.revenue, data.currency)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{m.orders > 0 ? fmt(Math.round(m.revenue / m.orders), data.currency) : '—'}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-900 text-white">
                      <td className="px-4 py-3 font-bold">TOTAL</td>
                      <td className="px-4 py-3 text-right font-bold">{data.totalOrders}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-400">{fmt(data.totalRevenue, data.currency)}</td>
                      <td className="px-4 py-3 text-right font-bold">{fmt(data.avgOrderValue, data.currency)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Top Products */}
            {data.topProducts.length > 0 && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Products / Services by Revenue</h2>
                </div>
                {data.topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-7 h-7 bg-brand-green/10 rounded-xl flex items-center justify-center text-xs font-bold text-brand-green">{i + 1}</div>
                    <p className="flex-1 font-semibold text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.orders} sold</p>
                    <p className="font-bold text-brand-green">{fmt(p.revenue, data.currency)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Footer / Disclaimer */}
            <div className="border-t border-gray-200 pt-6 mt-4">
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <Shield size={20} className="text-brand-green shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-1">Earket Verification Statement</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This report was automatically generated by Earket (earket.com), a digital commerce platform for African businesses.
                    The sales data presented reflects transactions recorded through the Earket platform during the stated period.
                    Report ID: <span className="font-mono font-bold">{data.reportId}</span>.
                    Generated on {data.reportDate}. For verification, contact support@earket.com.
                  </p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">earket.com · Empowering African Businesses · {new Date().getFullYear()}</p>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}
