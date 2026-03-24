import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { merchant_id, name, email, service, message, phone } = await req.json()

    if (!merchant_id || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get merchant details to find their email
    const { data: merchant } = await supabase
      .from('merchants')
      .select('business_name, email, whatsapp_number')
      .eq('id', merchant_id)
      .single()

    if (!merchant?.email) {
      // No merchant email found — lead is still saved in DB, just skip email
      return NextResponse.json({ ok: true, email_sent: false })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (!RESEND_API_KEY) {
      // Resend not configured — lead saved, email skipped
      return NextResponse.json({ ok: true, email_sent: false, reason: 'No API key' })
    }

    // Send email via Resend
    const emailBody = {
      from: 'Earket Leads <onboarding@resend.dev>',
      to: [merchant.email],
      subject: `New enquiry from ${name} — ${merchant.business_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
          <div style="background: #1A7A4A; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Lead — ${merchant.business_name}</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">Someone is interested in your services</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #1A7A4A;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Phone</td><td style="padding: 8px 0; font-size: 14px;">${phone}</td></tr>` : ''}
              ${service ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Interested in</td><td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #1A7A4A;">${service}</td></tr>` : ''}
              ${message ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Message</td><td style="padding: 8px 0; font-size: 14px; line-height: 1.6;">${message}</td></tr>` : ''}
            </table>
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <a href="https://wa.me/${merchant.whatsapp_number?.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(name)}, thanks for your enquiry about ${encodeURIComponent(service || 'our services')}. I would love to help!"
                style="display: inline-block; background: #25D366; color: white; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
                Reply via WhatsApp
              </a>
            </div>
            <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">This lead was submitted via your Earket business page. View all leads in your <a href="https://earket.com/dashboard" style="color: #1A7A4A;">dashboard</a>.</p>
          </div>
        </div>
      `,
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    })

    const resendData = await resendRes.json()

    if (!resendRes.ok) {
      console.error('Resend error:', resendData)
      return NextResponse.json({ ok: true, email_sent: false, error: resendData })
    }

    return NextResponse.json({ ok: true, email_sent: true })

  } catch (err) {
    console.error('Lead notify error:', err)
    return NextResponse.json({ ok: true, email_sent: false })
  }
}
