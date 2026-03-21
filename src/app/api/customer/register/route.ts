import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

function hashPassword(password: string) {
  return createHash('sha256').update(password + process.env.SUPABASE_SERVICE_ROLE_KEY!.slice(0, 8)).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 })

    const { data: existing } = await supabase.from('customers').select('id').eq('email', email.toLowerCase()).single()
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

    const { data: customer, error } = await supabase.from('customers').insert({
      name,
      email: email.toLowerCase(),
      phone,
      password_hash: hashPassword(password),
    }).select('id, name, email, phone').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ customer })
  } catch (e) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
