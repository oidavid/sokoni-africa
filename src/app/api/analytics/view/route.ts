import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { merchant_id, type } = await req.json()
    if (!merchant_id) return NextResponse.json({ ok: false })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const today = new Date().toISOString().split('T')[0]

    await supabase.rpc('increment_analytics', {
      p_merchant_id: merchant_id,
      p_date: today,
      p_field: type === 'whatsapp_click' ? 'whatsapp_clicks' : 'views'
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
