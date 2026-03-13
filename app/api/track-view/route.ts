import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SAAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { org_id, path, referrer } = await req.json();
    if (!org_id) return NextResponse.json({ ok: false }, { status: 400 });

    // Get country from Vercel headers (available in production)
    const country = req.headers.get('x-vercel-ip-country') || null;

    await supabase.from('page_views').insert({
      org_id,
      path: path || '/',
      referrer: referrer || null,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
