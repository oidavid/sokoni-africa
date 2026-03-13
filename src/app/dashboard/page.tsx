'use client'
import Link from 'next/link'
import { ShoppingBag, Package, ShoppingCart, TrendingUp, Plus, ExternalLink, Settings, MessageCircle } from 'lucide-react'

const stats = [
  { label: "Total Products", value: "7", icon: Package, color: "bg-blue-50 text-blue-600" },
  { label: "Orders Today", value: "3", icon: ShoppingCart, color: "bg-brand-light text-brand-green" },
  { label: "This Month", value: "₦124,500", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
  { label: "Total Orders", value: "47", icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
]

const recentOrders = [
  { id: "ORD-047", customer: "Adaeze N.", product: "Palm Oil (4 litres)", amount: 5200, status: "new", time: "10 mins ago" },
  { id: "ORD-046", customer: "Emeka O.", product: "Dried Stockfish (medium)", amount: 6500, status: "confirmed", time: "1 hour ago" },
  { id: "ORD-045", customer: "Blessing I.", product: "Egusi Seeds 1kg", amount: 4200, status: "delivered", time: "Yesterday" },
]

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark">Sokoni</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/store/tropical-market" target="_blank"
            className="flex items-center gap-1.5 text-xs text-brand-green font-medium border border-brand-green/20 
                       bg-brand-light rounded-xl px-3 py-2 hover:bg-brand-green hover:text-white transition-colors">
            <ExternalLink size={12} />
            View Store
          </Link>
          <Link href="/dashboard/settings"
            className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
            <Settings size={16} className="text-gray-500" />
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-5">
        {/* Welcome */}
        <div className="mb-5">
          <h1 className="font-display font-bold text-xl text-brand-dark">Welcome back! 👋</h1>
          <p className="text-gray-500 text-sm">Tropical Market · Lagos, Nigeria</p>
        </div>

        {/* Quick action: Add product */}
        <Link href="/dashboard/products/new"
          className="flex items-center gap-3 bg-brand-green text-white rounded-2xl p-4 mb-5 
                     hover:bg-brand-dark transition-colors active:scale-[0.98]">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <div className="font-display font-bold">Add New Product</div>
            <div className="text-xs text-white/70">Photo + AI writes the description for you</div>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div className="font-display font-bold text-2xl text-brand-dark">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Store link share */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
          <div className="text-xs font-semibold text-gray-500 mb-2">YOUR STORE LINK</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-brand-light rounded-xl px-3 py-2.5 text-sm font-medium text-brand-green truncate">
              sokoni.africa/tropical-market
            </div>
            <a href={`https://wa.me/?text=Check out my store: https://sokoni.africa/tropical-market`}
              target="_blank" rel="noreferrer"
              className="btn-whatsapp shrink-0 py-2.5">
              📲 Share
            </a>
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-display font-bold text-brand-dark">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-xs text-brand-green font-medium">See all</Link>
          </div>
          {recentOrders.map((order, i) => (
            <div key={i} className={`px-4 py-3 flex items-center gap-3 ${i < recentOrders.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="w-9 h-9 bg-brand-light rounded-xl flex items-center justify-center text-sm font-bold text-brand-green shrink-0">
                {order.customer.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800 truncate">{order.customer}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 truncate">{order.product} · {order.time}</div>
              </div>
              <div className="text-sm font-display font-bold text-brand-green shrink-0">
                ₦{order.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Bot status */}
        <div className="bg-[#075E54] text-white rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-sm">WhatsApp Bot Active</div>
            <div className="text-xs text-white/70">Handling orders on +234 801 234 5678</div>
          </div>
          <div className="w-2.5 h-2.5 bg-[#25D366] rounded-full animate-pulse-slow" />
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex max-w-lg mx-auto">
        {[
          { icon: TrendingUp, label: "Dashboard", href: "/dashboard", active: true },
          { icon: Package, label: "Products", href: "/dashboard/products", active: false },
          { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders", active: false },
          { icon: Settings, label: "Settings", href: "/dashboard/settings", active: false },
        ].map((item, i) => (
          <Link key={i} href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              item.active ? 'text-brand-green' : 'text-gray-400'
            }`}>
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="h-16" /> {/* bottom nav spacer */}
    </div>
  )
}
