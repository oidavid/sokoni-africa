import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, businessName } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Earket Support Form <onboarding@resend.dev>',
      to: 'earket@earket.com',
      replyTo: email || undefined,
      subject: `Support request from ${businessName || name || 'a merchant'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a7a4a;">New Support Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 13px; width: 120px;">Business</td>
              <td style="padding: 8px 0; font-weight: 600;">${businessName || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 13px;">Name</td>
              <td style="padding: 8px 0;">${name || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 13px;">Reply to</td>
              <td style="padding: 8px 0;">${email || '—'}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="font-size: 14px; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
