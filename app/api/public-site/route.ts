import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('org_id');
  if (!orgId) return NextResponse.json({ error: 'org_id required' }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !key) return NextResponse.json({ error: 'Missing env' }, { status: 500 });
  const supabase = createClient(url, key);
  const [brandRes, cmsRes] = await Promise.all([
    supabase.from('branding').select('*').eq('org_id', orgId).maybeSingle(),
    supabase.from('website_cms').select('*').eq('org_id', orgId).maybeSingle(),
  ]);
  const branding = brandRes.data as Record<string, string> | null;
  const cms = cmsRes.data;
  const companyName = branding?.company_name || 'Your Company';
  return NextResponse.json({
    branding: branding ? {
      companyName: branding.company_name || companyName,
      logoUrl: branding.logo_url || '',
      primaryColor: branding.primary_color || '#163A63',
      infoEmail: branding.info_email || '',
      supportEmail: branding.support_email || '',
      salesEmail: branding.sales_email || '',
      phone: branding.phone || '',
      whatsapp: branding.whatsapp || '',
      address: branding.address || '',
      instagramUrl: branding.instagram_url || '',
      facebookUrl: branding.facebook_url || '',
      businessType: branding.business_type || 'product',
      facebookPixelId: branding.facebook_pixel_id || '',
      gaId: branding.ga_id || '',
    } : null,
    cms: cms ? {
      heroTitle: cms.hero_title || `Grow ${companyName} online`,
      heroSubtitle: cms.hero_subtitle || 'We help you reach more customers.',
      valueLine: (cms as { value_line?: string }).value_line || 'Simple. Modern. Effective.',
      processTitle: cms.process_title || 'How we help',
      processSubtitle: cms.process_subtitle || '',
      aboutTitle: cms.about_title || 'About us',
      aboutBody1: cms.about_body1 || '',
      aboutBody2: cms.about_body2 || '',
      stockQuoteTitle: cms.stock_quote_title || 'Get in touch',
      stockQuoteSubtitle: cms.stock_quote_subtitle || "Leave your details and we'll reach out.",
    } : null,
    customHtml: (cms as Record<string, unknown>)?.custom_html as string | null || null,
  });
}
