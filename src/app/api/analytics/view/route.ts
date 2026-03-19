import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { merchant_id } = await req.json()
    if (!merchant_id) return NextResponse.json({ ok: false })

    const today = new Date().toISOString().split('T')[0]
    const { data: existing } = await supabase
      .from('store_analytics')
      .select('id, views')
      .eq('merchant_id', merchant_id)
      .eq('date', today)
      .single()

    if (existing) {
      await supabase.from('store_analytics').update({ views: existing.views + 1 }).eq('id', existing.id)
    } else {
      await supabase.from('store_analytics').insert({ merchant_id, date: today, views: 1 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false })
  }
}
