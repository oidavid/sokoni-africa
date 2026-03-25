'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  sku?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  whatsapp_number: string;
  email?: string;
  loyalty_points: number;
  total_spent: number;
  visit_count: number;
}

interface TodaySale {
  id: string;
  created_at: string;
  total_amount: number;
  customer_name?: string;
  customer_phone?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export default function CashSalePage() {
  const router = useRouter();

  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);
  const [lookingUpCustomer, setLookingUpCustomer] = useState(false);

  const [todaySales, setTodaySales] = useState<TodaySale[]>([]);
  const [activeTab, setActiveTab] = useState<'sale' | 'today'>('sale');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('earket_merchant_email') : null);
      if (!email) { router.push('/login'); return; }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('id, business_name')
        .eq('email', email)
        .single();

      if (!merchant) { router.push('/onboarding'); return; }

      setMerchantId(merchant.id);
      setMerchantName(merchant.business_name);

      const { data: prods } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity, sku')
        .eq('merchant_id', merchant.id)
        .eq('is_active', true)
        .order('name');

      setProducts(prods || []);
      setLoading(false);
      loadTodaySales(merchant.id);
    }
    init();
  }, []);

  const loadTodaySales = async (mId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from('orders')
      .select('id, created_at, total_amount, customer_name, customer_phone, order_items(quantity, unit_price, products(name))')
      .eq('merchant_id', mId)
      .eq('source', 'cash_pos')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });

    if (data) {
      const formatted = data.map((o: any) => ({
        id: o.id,
        created_at: o.created_at,
        total_amount: o.total_amount,
        customer_name: o.customer_name,
        customer_phone: o.customer_phone,
        items: (o.order_items || []).map((i: any) => ({
          name: i.products?.name || 'Unknown',
          quantity: i.quantity,
          price: i.unit_price,
        })),
      }));
      setTodaySales(formatted);
    }
  };

  const lookupCustomer = useCallback(async (number: string) => {
    if (!merchantId || number.length < 7) {
      setExistingCustomer(null);
      return;
    }
    setLookingUpCustomer(true);
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('whatsapp_number', number)
      .single();

    if (data) {
      setExistingCustomer(data);
      setCustomerName(data.name || '');
      setCustomerEmail(data.email || '');
    } else {
      setExistingCustomer(null);
    }
    setLookingUpCustomer(false);
  }, [merchantId]);

  useEffect(() => {
    const timer = setTimeout(() => lookupCustomer(customerWhatsApp), 600);
    return () => clearTimeout(timer);
  }, [customerWhatsApp, lookupCustomer]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, product.stock_quantity) }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setCart(prev => prev.map(i =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const subtotalKobo = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const loyaltyPoints = Math.floor((subtotalKobo / 100) / 100);
  const totalNaira = subtotalKobo / 100;

  const handleSaveSale = async () => {
    if (cart.length === 0) {
      setErrorMessage('Add at least one item to the cart.');
      return;
    }
    setSaving(true);
    setErrorMessage('');

    try {
      let customerId: string | null = null;
      if (customerWhatsApp && merchantId) {
        const { data: custData, error: custErr } = await supabase.rpc('upsert_customer', {
          p_merchant_id: merchantId,
          p_whatsapp_number: customerWhatsApp,
          p_name: customerName || null,
          p_email: customerEmail || null,
          p_spent_kobo: subtotalKobo,
          p_loyalty_points: loyaltyPoints,
        });
        if (!custErr && custData) customerId = custData;
      }

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          merchant_id: merchantId,
          customer_name: customerName || null,
          customer_phone: customerWhatsApp || null,
          customer_email: customerEmail || null,
          customer_id: customerId,
          total_amount: subtotalKobo,
          status: 'completed',
          source: 'cash_pos',
          payment_status: 'cash',
        })
        .select('id')
        .single();

      if (orderErr || !order) throw orderErr || new Error('Failed to create order');

      const orderItems = cart.map(i => ({
        order_id: order.id,
        product_id: i.product.id,
        quantity: i.quantity,
        unit_price: i.product.price,
        subtotal: i.product.price * i.quantity,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;

      for (const item of cart) {
        await supabase
          .from('products')
          .update({ stock_quantity: item.product.stock_quantity - item.quantity })
          .eq('id', item.product.id);
      }

      if (customerWhatsApp) {
        const lines = cart.map(i =>
          `• ${i.product.name} x${i.quantity} — ₦${((i.product.price * i.quantity) / 100).toLocaleString()}`
        ).join('\n');
        const points = existingCustomer
          ? existingCustomer.loyalty_points + loyaltyPoints
          : loyaltyPoints;
        const msg = encodeURIComponent(
          `🧾 *Receipt from ${merchantName}*\n\n${lines}\n\n*Total: ₦${totalNaira.toLocaleString()}*\n\n🎯 Loyalty points: ${points} pts${points >= 50 ? '\n🎉 You have a reward waiting!' : ''}\n\nThank you for shopping with us!`
        );
        window.open(`https://wa.me/${customerWhatsApp.replace(/\D/g, '')}?text=${msg}`, '_blank');
      }

      setCart([]);
      setCustomerName('');
      setCustomerWhatsApp('');
      setCustomerEmail('');
      setExistingCustomer(null);
      setSuccessMessage('Sale saved! ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
      if (merchantId) loadTodaySales(merchantId);

      const { data: prods } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity, sku')
        .eq('merchant_id', merchantId)
        .eq('is_active', true)
        .order('name');
      setProducts(prods || []);

    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const todayTotal = todaySales.reduce((sum, s) => sum + s.total_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-700">
            ← Back
          </button>
          <h1 className="font-semibold text-gray-900">Cash Sale</h1>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('sale')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'sale' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            New Sale
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'today' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Today ({todaySales.length})
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mx-4 mt-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errorMessage}</div>
      )}

      {activeTab === 'sale' && (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-medium text-gray-900 mb-3">Products</h2>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No products found</p>
                )}
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock_quantity === 0}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800">{product.name}</div>
                      <div className="text-xs text-gray-400">Stock: {product.stock_quantity}</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ₦{(product.price / 100).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-medium text-gray-900 mb-3">Cart</h2>
              {cart.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Tap products to add them here</p>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{item.product.name}</div>
                        <div className="text-xs text-gray-500">₦{(item.product.price / 100).toLocaleString()} each</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold flex items-center justify-center"
                        >−</button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-bold flex items-center justify-center"
                        >+</button>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 w-20 text-right">
                        ₦{((item.product.price * item.quantity) / 100).toLocaleString()}
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₦{totalNaira.toLocaleString()}</span>
                  </div>
                  {cart.length > 0 && (
                    <div className="text-xs text-blue-600">+{loyaltyPoints} loyalty points for this purchase</div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-medium text-gray-900 mb-3">Customer <span className="text-gray-400 font-normal text-xs">(optional)</span></h2>

              {existingCustomer && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
                  👤 Returning customer — {existingCustomer.loyalty_points} pts · {existingCustomer.visit_count} visits
                </div>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="WhatsApp number"
                    value={customerWhatsApp}
                    onChange={e => setCustomerWhatsApp(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {lookingUpCustomer && (
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400">looking up...</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Customer name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSale}
              disabled={saving || cart.length === 0}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {saving ? 'Saving...' : `Save Sale · ₦${totalNaira.toLocaleString()}`}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'today' && (
        <div className="max-w-2xl mx-auto p-4 space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Today's Revenue</div>
              <div className="text-2xl font-bold text-gray-900">₦{(todayTotal / 100).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Sales</div>
              <div className="text-2xl font-bold text-gray-900">{todaySales.length}</div>
            </div>
          </div>

          {todaySales.length === 0 ? (
            <div className="text-center text-gray-400 py-10 text-sm">No sales yet today</div>
          ) : (
            todaySales.map(sale => (
              <div key={sale.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{sale.customer_name || 'Walk-in'}</div>
                    {sale.customer_phone && (
                      <div className="text-xs text-gray-400">{sale.customer_phone}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">₦{(sale.total_amount / 100).toLocaleString()}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  {sale.items.map((item, idx) => (
                    <div key={idx}>{item.name} ×{item.quantity}</div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
