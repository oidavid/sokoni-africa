import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
    if (!PAYSTACK_SECRET) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

    const response = await fetch('https://api.paystack.co/bank?country=nigeria&per_page=100', {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    })
    const data = await response.json()
    return NextResponse.json(data.data || [])
  } catch (e) {
    return NextResponse.json([], { status: 500 })
  }
}
