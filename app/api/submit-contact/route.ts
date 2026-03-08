import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { org_id, name, email, message, type, source, phone, company } = await req.json();
    if (!org_id || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'org_id, name, email required' }, { status: 400 });
    }
    const isQuote = type === 'QUOTE' || type !== 'SUPPORT';
    const msg = (message || '').trim();
    const leadSource = (source || 'WEBSITE').toUpperCase().replace(/\s+/g, '_').slice(0, 32);

    if (isQuote) {
      const leadRes = await supabase.from('leads').insert({
        org_id,
        name: name.trim(),
        company: (company || 'Website').trim().slice(0, 200),
        email: email.trim(),
        phone: (phone || '').trim().slice(0, 50),
        stage: 'NEW',
        source: leadSource,
        next_action: msg || 'New lead',
      });
      if (leadRes.error) return NextResponse.json({ error: leadRes.error.message }, { status: 500 });
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
    return NextResponse.json({ ok: true, ticketId });
  } catch (e) {
    return NextResponse.json({ error: 'Could not submit' }, { status: 500 });
  }
}
