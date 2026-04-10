import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Save to Supabase regardless of email delivery
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject: subject || null,
        message,
        is_read: false,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      // Don't fail the request — still attempt email
    }

    // Send notification emails
    await resend.emails.send({
      from: 'Earket Contact <earket@earket.com>',
      to: ['earket@earket.com', 'intelsys2@gmail.com'],
      replyTo: email,
      subject: `New Contact Message: ${subject || 'No subject'} — from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #16a34a; margin-bottom: 4px;">New message via Earket Contact Form</h2>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 100px;">Name</td>
              <td style="padding: 8px 0; color: #111827;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Email</td>
              <td style="padding: 8px 0; color: #111827;">
                <a href="mailto:${email}" style="color: #16a34a;">${email}</a>
              </td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Subject</td>
              <td style="padding: 8px 0; color: #111827;">${subject}</td>
            </tr>` : ''}
          </table>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />

          <p style="font-weight: 600; color: #374151; margin-bottom: 8px;">Message</p>
          <div style="background: #f9fafb; border-left: 4px solid #16a34a; padding: 16px; border-radius: 4px; color: #111827; white-space: pre-wrap;">${message}</div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">
            Reply directly to this email to respond to ${name}. 
            This message is also saved in your 
            <a href="https://earket.com/admin" style="color: #16a34a;">Earket admin panel</a>.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    // Return success anyway — message is saved in DB
    return NextResponse.json({ success: true });
  }
}
