import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── CONFIGURATION ─────────────────────────────────────────────────────────
// Update NOTIFY_WHATSAPP to change the notification number
// Format: country code + number, no + or spaces
const NOTIFY_WHATSAPP = '14793219433'
const NOTIFY_EMAIL = 'contact@intelsystechnology.com'
const PRICE = '$25'
const PRICE_DISPLAY = 'USD 25.00 (one-time)'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchant_id, merchant_name, merchant_email, merchant_whatsapp, subdomain } = body

    if (!merchant_id || !subdomain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Double-check availability
    const { data: existing } = await supabase
      .from('merchants')
      .select('id')
      .eq('subdomain', subdomain)
      .neq('id', merchant_id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Subdomain already taken' }, { status: 409 })
    }

    // 2. Save request to subdomain_requests table
    const { error: insertError } = await supabase
      .from('subdomain_requests')
      .upsert({
        merchant_id,
        subdomain,
        status: 'pending',
        requested_at: new Date().toISOString(),
        notified: false,
      }, { onConflict: 'merchant_id' })

    if (insertError) {
      console.error('Insert error:', insertError)
      // Continue even if insert fails — still send notifications
    }

    // 3. Build notification messages
    const waMessage = encodeURIComponent(
      `🔔 *New Subdomain Request — Earket Pro*\n\n` +
      `Business: ${merchant_name}\n` +
      `Email: ${merchant_email}\n` +
      `WhatsApp: ${merchant_whatsapp || 'Not provided'}\n` +
      `Branded link: *earket.com/go/${subdomain}*\n` +
      `Price: ${PRICE_DISPLAY}\n\n` +
      `To activate:\n` +
      `1. Collect payment (${PRICE} via Paystack or bank transfer)\n` +
      `2. Run in Supabase:\n` +
      `UPDATE merchants SET subdomain='${subdomain}', is_premium=true WHERE id='${merchant_id}';\n\n` +
      `Reply to merchant: ${merchant_whatsapp || merchant_email}`
    )

    // 4. Send WhatsApp notification (via wa.me link stored for admin to tap)
    // We store the WA message URL in the request so admin can tap to open WhatsApp
    const waLink = `https://wa.me/${NOTIFY_WHATSAPP}?text=${waMessage}`

    // 5. Send email via Supabase Edge Function or direct SMTP
    // For now we'll use a simple fetch to a notification service
    // or store in the table for admin to check
    try {
      await supabase.from('subdomain_requests').update({
        wa_link: waLink,
        notified: true,
        notification_sent_at: new Date().toISOString(),
      }).eq('merchant_id', merchant_id)
    } catch {}

    // 6. Trigger email notification via Supabase built-in email
    // or via your email service (Resend, SendGrid, etc.)
    // For manual phase we log to console and rely on Supabase dashboard
    console.log(`[SUBDOMAIN REQUEST] ${merchant_name} wants ${subdomain}.earket.com`)
    console.log(`[NOTIFY] WhatsApp: ${waLink}`)

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      wa_link: waLink, // returned to client so merchant can also see confirmation
    })

  } catch (error) {
    console.error('Subdomain request error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

// Admin endpoint to activate a subdomain after payment confirmed
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { merchant_id, subdomain, admin_key } = body

    // Simple admin key check — replace with proper auth in production
    if (admin_key !== process.env.EARKET_ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Activate the subdomain
    const { error } = await supabase
      .from('merchants')
      .update({ subdomain, is_premium: true })
      .eq('id', merchant_id)

    if (error) throw error

    // Update request status
    await supabase
      .from('subdomain_requests')
      .update({ status: 'activated', activated_at: new Date().toISOString() })
      .eq('merchant_id', merchant_id)

    return NextResponse.json({ success: true, message: `${subdomain}.earket.com is now live` })

  } catch (error) {
    console.error('Activation error:', error)
    return NextResponse.json({ error: 'Failed to activate' }, { status: 500 })
  }
}
