import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, amount, metadata, callback_url, merchant_id } = await req.json()

    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
    if (!PAYSTACK_SECRET) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 })
    }

    // Get merchant subaccount
    const { data: merchant } = await supabase
      .from('merchants')
      .select('paystack_subaccount, business_name')
      .eq('id', merchant_id)
      .single()

    const platformFee = parseFloat(process.env.EARKET_PLATFORM_FEE || '2.5')
    const platformAmount = Math.round(amount * (platformFee / 100))

    const body: Record<string, unknown> = {
      email,
      amount,
      metadata,
      callback_url,
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    }

    // Add subaccount split if merchant has one
    if (merchant?.paystack_subaccount) {
      body.subaccount = merchant.paystack_subaccount
      body.transaction_charge = platformAmount // Earket keeps this amount
      body.bearer = 'account' // merchant bears Paystack fee
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 })
    }

    return NextResponse.json(data.data)
  } catch (e) {
    console.error('Paystack init error:', e)
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
  }
}
