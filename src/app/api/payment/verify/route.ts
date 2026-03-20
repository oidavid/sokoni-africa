import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json()
    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
    if (!PAYSTACK_SECRET) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 })
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    })

    const data = await response.json()
    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful', status: data.data?.status }, { status: 400 })
    }

    const orderId = data.data.metadata?.order_id
    if (orderId) {
      await supabase.from('orders').update({
        payment_status: 'paid',
        payment_reference: reference,
        status: 'confirmed',
      }).eq('id', orderId)
    }

    return NextResponse.json({ success: true, data: data.data })
  } catch (e) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
