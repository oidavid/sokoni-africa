import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, businessName } = await req.json()

    if (!message?.trim() || !name?.trim()) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
    }

    // 1. Save to Supabase first — this always works regardless of email
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email?.trim() || null,
      message: message.trim(),
      read: false,
    })

    if (dbError) {
      console.error('DB save error:', dbError)
      // Don't return error — still try email
    }

    // 2. Try to send email notification — non-blocking if it fails
    try {
      await resend.emails.send({
        from: 'Earket Contact Form <onboarding@resend.dev>',
        to: 'earket@earket.com',
        replyTo: email || undefined,
        subject: `New contact message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a7a4a;">New Contact Message</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 13px; width: 100px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 13px;">Email</td>
                <td style="padding: 8px 0;">${email || '—'}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <p style="font-size: 14px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <p style="font-size: 12px; color: #999;">View all messages at earket.com/admin → Contact tab</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Email send failed (message was saved to DB):', emailErr)
      // Don't fail the request — message is already saved
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
