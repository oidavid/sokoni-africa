'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Star, MessageCircle, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Customer {
  id: string; name: string; email: string; phone?: string
  points: number; lifetime_points: number
  order_count: number; total_spent: number; last_order: string
}

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email || localStorage.getItem('earket_merchant_email')
      if (!email) { router.push('/login'); return }
      const { data: m } = await supabase.from('merchants').select('id').eq('email', email).single()
      if (!m) return

      // Get customers with points
      const { data: points } = await supabase.from('customer_points')
        .select('customer_id, points, lifetime_points').eq('merchant_id', m.id)

      if (!points?.length) { setLoading(false); return }

      const customerIds = points.map(p => p.customer_id)
      const { data: customerData } = await supabase.from('customers')
        .select('id, name, email, phone').in('id', customerIds)

      // Get order stats per customer
      const { data: orders } = await supabase.from('orders')
        .select('customer_id, subtotal, created_at').eq('merchant_id', m.id)
        .in('customer_id', customerIds).neq('status', 'cancelled')

      const merged = (customerData || []).map(c => {
        const pts = points.find(p => p.customer_id === c.id)
        const cOrders = (orders || []).filter(o => o.customer_id === c.id)
        return {
          ...c,
          points: pts?.points || 0,
          lifetime_points: pts?.lifetime_points || 0,
          order_count: cOrders.length,
          total_spent: cOrders.reduce((s, o) => s + o.subtotal, 0),
          last_order: cOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.created_at || '',
        }
      }).sort((a, b) => b.total_spent - a.total_spent)

      setCustomers(merged)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 size={24} className="text-brand-green animate-spin" /></div>

  return (
    <div className="min-h-screen bg-gray-50 max-w-3xl mx-auto pb-10">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="font-display font-bold text-brand-dark">Customers</h1>
        <p className="text-xs text-gray-400">{customers.length} registered customer{customers.length !== 1 ? 's' : ''}</p>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-20 px-4">
          <Users size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-semibold text-gray-600 mb-2">No registered customers yet</p>
          <p className="text-gray-400 text-sm">Customers who create accounts on your store will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 bg-white mt-2 rounded-2xl overflow-hidden mx-4">
          {customers.map(c => (
            <div key={c.id} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-brand-green">{c.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                <p className="text-xs text-gray-400 truncate">{c.email}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">{c.order_count} order{c.order_count !== 1 ? 's' : ''}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-500">₦{(c.total_spent/100).toLocaleString()} spent</span>
                  {c.points > 0 && (
                    <>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-amber-600 flex items-center gap-0.5 font-semibold">
                        <Star size={10} fill="currentColor" /> {c.points} pts
                      </span>
                    </>
                  )}
                </div>
              </div>
              {c.phone && (
                <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${c.name}! 👋`)}`}
                  target="_blank" rel="noreferrer"
                  className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle size={16} className="text-white" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
