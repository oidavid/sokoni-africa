import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const bank_code = searchParams.get('bank_code')
    const account_number = searchParams.get('account_number')

    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
    if (!PAYSTACK_SECRET) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    )
    const data = await response.json()
    if (!data.status) return NextResponse.json({ error: data.message }, { status: 400 })
    return NextResponse.json({ account_name: data.data.account_name })
  } catch (e) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
