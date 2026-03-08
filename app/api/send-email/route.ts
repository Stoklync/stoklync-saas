import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export async function POST(req: NextRequest) {
  if (!resend) {
    return NextResponse.json({ error: 'Email not configured. Add RESEND_API_KEY.' }, { status: 503 });
  }
  try {
    const { to, subject, body, replyTo } = await req.json();
    if (!to || typeof to !== 'string' || !subject || !body) {
      return NextResponse.json({ error: 'to, subject, and body required' }, { status: 400 });
    }
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: to.trim(),
      subject: String(subject).slice(0, 500),
      text: String(body).slice(0, 100000),
      replyTo: replyTo && String(replyTo).trim() ? String(replyTo).trim() : undefined,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}
