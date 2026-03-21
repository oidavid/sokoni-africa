import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { ShoppingBag, MapPin } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: m } = await supabase.from('merchants').select('business_name, description, logo_url').eq('slug', params.slug).single()
  return {
    title: m ? `${m.business_name} — Shop on Earket` : 'Earket Store',
    description: m?.description || 'Shop online and order via WhatsApp',
    openGraph: { title: m?.business_name, description: m?.description || 'Shop online', images: m?.logo_url ? [m.logo_url] : [] }
  }
}

export default async function SharePage({ params }: { params: { slug: string } }) {
  const { data: merchant } = await supabase.from('merchants')
    .select('id, business_name, slug, description, location, whatsapp_number, theme_color, logo_url, category, business_type')
    .eq('slug', params.slug).single()

  const { data: products } = await supabase.from('products')
    .select('id, name, price_display, image_url, in_stock')
    .eq('merchant_id', merchant?.id).eq('in_stock', true)
    .order('sort_order').limit(6)

  if (!merchant) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Store not found</p></div>

  const themeColor = merchant.theme_color || '#1A7A4A'
  const isService = merchant.business_type === 'services'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${themeColor}ee, ${themeColor}aa)` }}>
        <div className="relative max-w-sm mx-auto px-6 py-12 text-center">
          {merchant.logo_url ? (
            <img src={merchant.logo_url} alt={merchant.business_name} className="w-24 h-24 rounded-3xl object-cover mx-auto mb-5 shadow-xl border-4 border-white/30" />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-5 shadow-xl">
              <ShoppingBag size={40} className="text-white" />
            </div>
          )}
          <h1 className="font-display text-3xl font-bold text-white mb-2">{merchant.business_name}</h1>
          {merchant.description && <p className="text-white/80 text-sm mb-3 leading-relaxed">{merchant.description}</p>}
          <div className="flex items-center justify-center gap-1 text-white/70 text-sm">
            <MapPin size={14} /><span>{merchant.location}</span>
          </div>
        </div>
      </div>

      {products && products.length > 0 && (
        <div className="max-w-sm mx-auto px-4 py-6">
          <h2 className="font-display font-bold text-gray-800 text-lg mb-4">{isService ? '🔧 Our Services' : '🛍️ Featured Products'}</h2>
          <div className="grid grid-cols-2 gap-3">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-28 object-cover" />
                  : <div className="w-full h-28 bg-gray-100 flex items-center justify-center text-3xl">{isService ? '🔧' : '🛍️'}</div>}
                <div className="p-2.5">
                  <p className="font-semibold text-xs text-gray-800 line-clamp-2 leading-tight">{p.name}</p>
                  <p className="font-bold text-sm mt-1" style={{ color: themeColor }}>{p.price_display}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-sm mx-auto px-4 pb-8 space-y-3">
        <Link href={`/store/${merchant.slug}`} style={{ backgroundColor: themeColor }}
          className="w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base shadow-lg">
          <ShoppingBag size={20} />
          {isService ? 'View All Services & Book' : 'Visit Store & Shop Now'}
        </Link>
        <a href={`https://wa.me/${merchant.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${merchant.business_name}! I found you on Earket and I'd like to enquire.`)}`}
          target="_blank" rel="noreferrer"
          className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          {isService ? 'Book via WhatsApp' : 'Order via WhatsApp'}
        </a>
        <p className="text-center text-xs text-gray-400">
          Powered by <a href="https://earket.com" className="text-brand-green font-semibold">Earket</a>
        </p>
      </div>
    </div>
  )
}
