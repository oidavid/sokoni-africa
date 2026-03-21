import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { customer_id, merchant_id, order_id, subtotal } = await req.json()
    if (!customer_id || !merchant_id || !subtotal) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Get loyalty settings
    const { data: settings } = await supabase.from('loyalty_settings')
      .select('points_per_100, enabled').eq('merchant_id', merchant_id).single()

    if (!settings?.enabled) return NextResponse.json({ points: 0 })

    const pointsEarned = Math.floor((subtotal / 100) / 100) * (settings.points_per_100 || 1)
    if (pointsEarned <= 0) return NextResponse.json({ points: 0 })

    // Upsert customer points
    const { data: existing } = await supabase.from('customer_points')
      .select('id, points, lifetime_points').eq('customer_id', customer_id).eq('merchant_id', merchant_id).single()

    if (existing) {
      await supabase.from('customer_points').update({
        points: existing.points + pointsEarned,
        lifetime_points: existing.lifetime_points + pointsEarned,
      }).eq('id', existing.id)
    } else {
      await supabase.from('customer_points').insert({
        customer_id, merchant_id,
        points: pointsEarned,
        lifetime_points: pointsEarned,
      })
    }

    // Log transaction
    await supabase.from('points_transactions').insert({
      customer_id, merchant_id, order_id,
      points: pointsEarned, type: 'earn',
      note: `Earned from order`,
    })

    return NextResponse.json({ points: pointsEarned })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to award points' }, { status: 500 })
  }
}
