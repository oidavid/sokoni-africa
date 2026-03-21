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
    const { name, email, phone, password } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    const supabase = getSupabase()

    const { data: existing } = await supabase.from('customers').select('id').eq('email', email.toLowerCase()).maybeSingle()
    if (existing) return NextResponse.json({ error: 'Email already registered. Please sign in.' }, { status: 400 })

    const { data: customer, error } = await supabase.from('customers').insert({
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      password_hash: hashPassword(password),
    }).select('id, name, email, phone').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ customer })
  } catch (e) {
    console.error('Register error:', e)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
