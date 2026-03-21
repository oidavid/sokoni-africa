import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

function hashPassword(password: string) {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 8) || 'earket24'
  return createHash('sha256').update(password + salt).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const supabase = getSupabase()
    const { data: customer } = await supabase.from('customers')
      .select('id, name, email, phone, password_hash')
      .eq('email', email.toLowerCase()).maybeSingle()

    if (!customer || customer.password_hash !== hashPassword(password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const { password_hash, ...safe } = customer
    return NextResponse.json({ customer: safe })
  } catch (e) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
