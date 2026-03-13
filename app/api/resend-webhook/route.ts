import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SAAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Resend webhook event types we care about
type ResendEvent = {
  type: 'email.sent' | 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained';
  data: {
    email_id: string;
    to: string[];
    from: string;
    subject?: string;
    tags?: { name: string; value: string }[];
  };
  created_at: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: ResendEvent = await req.json();

    // Extract org_id from email tags (we set this when sending)
    const orgTag = body.data?.tags?.find(t => t.name === 'org_id');
    const org_id = orgTag?.value || null;

    const recipient = body.data?.to?.[0] || null;
    const email_id = body.data?.email_id || null;
    const event_type = body.type || 'unknown';

    await supabase.from('email_events').insert({
      org_id,
      email_id,
      event_type,
      recipient,
      subject: body.data?.subject || null,
      created_at: body.created_at || new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend webhook error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
