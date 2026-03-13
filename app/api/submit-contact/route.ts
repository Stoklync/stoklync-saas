import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function sendNotificationEmail(to: string, leadName: string, leadEmail: string, leadPhone: string, leadCompany: string, message: string, orgName: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3030';
    await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: `🔔 New lead from your website: ${leadName}`,
        body: `Hi there,\n\nYou have a new lead from your ${orgName} website!\n\n👤 Name: ${leadName}\n📧 Email: ${leadEmail}\n📱 Phone: ${leadPhone || 'Not provided'}\n🏢 Company: ${leadCompany || 'Not provided'}\n\n💬 Message:\n${message || 'No message provided'}\n\n---\nLog in to your dashboard to view and follow up with this lead.\n\nThe Stoklync Team`,
      }),
    });
  } catch (_) {
    // Don't fail the lead insert if email fails
  }
}

async function sendWelcomeEmail(to: string, toName: string, orgName: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3030';
    await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: `Thanks for reaching out to ${orgName}!`,
        body: `Hi ${toName.split(' ')[0]},\n\nThank you for contacting ${orgName}! We've received your message and one of our team members will be in touch within 1–2 business days.\n\nIn the meantime, feel free to reply to this email if you have any questions.\n\nWarm regards,\nThe ${orgName} Team`,
      }),
    });
  } catch (_) {
    // Don't fail if email fails
  }
}

export async function POST(req: NextRequest) {
  try {
    const { org_id, name, email, message, type, source, phone, company } = await req.json();
    if (!org_id || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'org_id, name, email required' }, { status: 400 });
    }
    const isQuote = type === 'QUOTE' || type !== 'SUPPORT';
    const msg = (message || '').trim();
    const leadSource = (source || 'WEBSITE').toUpperCase().replace(/\s+/g, '_').slice(0, 32);

    // Get org branding for notification email + auto-welcome setting
    const { data: brandData } = await supabase.from('branding').select('contact_email, company_name, auto_welcome_email').eq('org_id', org_id).maybeSingle();
    const notifyEmail = brandData?.contact_email || '';
    const orgName = brandData?.company_name || 'Your Business';
    const autoWelcome = brandData?.auto_welcome_email;

    if (isQuote) {
      const leadRes = await supabase.from('leads').insert({
        org_id,
        name: name.trim(),
        company: (company || '').trim().slice(0, 200),
        email: email.trim(),
        phone: (phone || '').trim().slice(0, 50),
        stage: 'NEW',
        source: leadSource,
        next_action: msg || 'New lead from website',
      });
      if (leadRes.error) return NextResponse.json({ error: leadRes.error.message }, { status: 500 });

      // Fire-and-forget: notify business owner
      if (notifyEmail) {
        sendNotificationEmail(notifyEmail, name.trim(), email.trim(), phone || '', company || '', msg, orgName);
      }
      // Fire-and-forget: auto welcome email to lead
      if (autoWelcome) {
        sendWelcomeEmail(email.trim(), name.trim(), orgName);
      }

      return NextResponse.json({ ok: true });
    }

    const ticketId = `TKT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const ticketPayload: Record<string, unknown> = {
      id: ticketId,
      org_id,
      subject: `Contact: ${name.trim()}`,
      customer: name.trim(),
      contact_email: email.trim(),
      priority: 'MEDIUM',
      status: 'OPEN',
    };
    let ticketRes = await supabase.from('tickets').insert({ ...ticketPayload, source: 'WEBSITE', message: message.trim() });
    if (ticketRes.error?.message?.includes('column')) {
      const { contact_email, ...base } = ticketPayload as { contact_email?: string };
      ticketRes = await supabase.from('tickets').insert({ ...base, source: 'WEBSITE', message: message.trim() });
    }
    if (ticketRes.error?.message?.includes('column')) {
      const { contact_email, ...base } = ticketPayload as { contact_email?: string };
      ticketRes = await supabase.from('tickets').insert({ ...base, source: 'WEBSITE' });
    }
    if (ticketRes.error) return NextResponse.json({ error: ticketRes.error.message }, { status: 500 });

    if (notifyEmail) {
      sendNotificationEmail(notifyEmail, name.trim(), email.trim(), phone || '', company || '', msg, orgName);
    }
    return NextResponse.json({ ok: true, ticketId });
  } catch (e) {
    return NextResponse.json({ error: 'Could not submit' }, { status: 500 });
  }
}
