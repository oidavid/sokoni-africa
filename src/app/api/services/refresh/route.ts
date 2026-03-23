import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSampleServices } from '@/lib/sample-services'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { merchant_id, category } = await req.json()
    if (!merchant_id || !category) {
      return NextResponse.json({ error: 'Missing merchant_id or category' }, { status: 400 })
    }

    // Delete existing products/services for this merchant
    await supabase.from('products').delete().eq('merchant_id', merchant_id)

    // Get fresh sample services for their category
    const services = getSampleServices(category)
    if (services.length === 0) {
      return NextResponse.json({ success: true, count: 0 })
    }

    const items = services.map(s => ({ ...s, merchant_id }))
    const { error } = await supabase.from('products').insert(items)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: items.length })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
