import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  try {
    const { merchant_id, type } = await req.json()
    if (!merchant_id) return NextResponse.json({ ok: false })

    const today = new Date().toISOString().split('T')[0]

    if (type === 'whatsapp_click') {
      // Increment whatsapp_clicks
      await supabase.rpc('increment_analytics', {
        p_merchant_id: merchant_id,
        p_date: today,
        p_field: 'whatsapp_clicks'
      })
    } else {
      // Increment views
      await supabase.rpc('increment_analytics', {
        p_merchant_id: merchant_id,
        p_date: today,
        p_field: 'views'
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
