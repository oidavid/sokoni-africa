import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { merchant_id, business_name, bank_code, account_number } = await req.json()

    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
    if (!PAYSTACK_SECRET) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

    // Create subaccount on Paystack
    const response = await fetch('https://api.paystack.co/subaccount', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name,
        bank_code,
        account_number,
        percentage_charge: parseFloat(process.env.EARKET_PLATFORM_FEE || '2.5'),
      }),
    })

    const data = await response.json()
    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 })
    }

    // Save subaccount code to merchant
    await supabase.from('merchants').update({
      paystack_subaccount: data.data.subaccount_code,
      bank_name: data.data.settlement_bank,
      account_number: data.data.account_number,
    }).eq('id', merchant_id)

    return NextResponse.json({ success: true, subaccount_code: data.data.subaccount_code })
  } catch (e) {
    console.error('Subaccount error:', e)
    return NextResponse.json({ error: 'Failed to create subaccount' }, { status: 500 })
  }
}
