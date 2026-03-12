export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'prompt required' }, { status: 400 });
    }

    // Extract key info from the prompt
    const lp = prompt.toLowerCase();
    const isService = lp.includes('service') || lp.includes('consult') || lp.includes('agency') || lp.includes('coach') || lp.includes('training');
    const isProduct = lp.includes('product') || lp.includes('wholesale') || lp.includes('supply') || lp.includes('manufactur') || lp.includes('retail') || lp.includes('shop');
    const isTech = lp.includes('software') || lp.includes('tech') || lp.includes('app') || lp.includes('saas') || lp.includes('digital');
    const isFood = lp.includes('food') || lp.includes('restaurant') || lp.includes('catering') || lp.includes('beverage') || lp.includes('drink');

    const businessName = (() => {
      // Try to extract business name from prompt
      const match = prompt.match(/(?:for|called|named|company|business)[:\s]+([A-Z][a-zA-Z0-9\s&]+?)(?:[,.]|$)/);
      return match ? match[1].trim() : 'Our Business';
    })();

    const type = isTech ? 'tech' : isFood ? 'food' : isService ? 'service' : isProduct ? 'product' : 'general';

    const templates: Record<string, { hero: string; sub: string; f1: string; f2: string; f3: string; ctaLabel: string; color: string }> = {
      tech: { hero: 'Software That Works For You', sub: 'Streamline your operations with smart, reliable tools built for modern teams.', f1: '⚡ Fast & Reliable', f2: '🔒 Secure by Default', f3: '📊 Real-time Analytics', ctaLabel: 'Get Started Free', color: '#4F46E5' },
      food: { hero: 'Fresh Quality, Every Order', sub: 'Premium ingredients and reliable supply chain for food businesses that care about quality.', f1: '🌿 Fresh & Natural', f2: '🚚 Fast Delivery', f3: '✅ Verified Suppliers', ctaLabel: 'Order Now', color: '#16A34A' },
      service: { hero: 'Expert Services That Deliver', sub: 'Professional support and strategic guidance to help your business grow faster.', f1: '🎯 Results-Focused', f2: '⏱ Fast Turnaround', f3: '💬 Dedicated Support', ctaLabel: 'Book a Call', color: '#0891B2' },
      product: { hero: 'Quality Products, Wholesale Prices', sub: 'Trusted B2B supplier with competitive pricing, reliable stock and fast delivery.', f1: '📦 Bulk Stock Available', f2: '💲 Competitive Pricing', f3: '🚀 Fast Dispatch', ctaLabel: 'Browse Catalog', color: '#2F8F5B' },
      general: { hero: 'Built For Growth', sub: 'Reliable solutions and dedicated service for businesses of all sizes.', f1: '✅ Proven Track Record', f2: '🤝 Dedicated Support', f3: '💡 Smart Solutions', ctaLabel: 'Get In Touch', color: '#163A63' },
    };

    const t = templates[type];

    const html = `
<section data-gjs-type="section" style="background:linear-gradient(135deg,${t.color} 0%,#0F2847 100%);padding:80px 20px;text-align:center;">
  <h1 data-gjs-type="text" style="color:#fff;font-size:2.8rem;font-weight:800;margin:0 0 16px;line-height:1.2;max-width:700px;margin-left:auto;margin-right:auto;">${t.hero}</h1>
  <p data-gjs-type="text" style="color:rgba(255,255,255,0.85);font-size:1.2rem;margin:0 0 32px;max-width:540px;margin-left:auto;margin-right:auto;">${t.sub}</p>
  <a data-gjs-type="link" href="#contact" style="display:inline-block;background:#fff;color:${t.color};padding:14px 36px;border-radius:8px;font-weight:700;font-size:1rem;text-decoration:none;">${t.ctaLabel}</a>
</section>
<section data-gjs-type="section" style="padding:64px 20px;background:#f8fafc;">
  <h2 data-gjs-type="text" style="text-align:center;font-size:1.8rem;font-weight:700;color:#1e293b;margin:0 0 40px;">Why Choose Us</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;max-width:900px;margin:auto;">
    <div data-gjs-type="cell" style="background:#fff;padding:32px 24px;border-radius:12px;border:1px solid #e2e8f0;text-align:center;">
      <div style="font-size:2rem;margin-bottom:12px;">${t.f1.split(' ')[0]}</div>
      <h3 data-gjs-type="text" style="color:#1e293b;font-weight:700;margin:0 0 8px;">${t.f1.substring(t.f1.indexOf(' ')+1)}</h3>
      <p data-gjs-type="text" style="color:#64748b;font-size:0.9rem;margin:0;">We deliver consistent quality and reliability you can count on every time.</p>
    </div>
    <div data-gjs-type="cell" style="background:#fff;padding:32px 24px;border-radius:12px;border:1px solid #e2e8f0;text-align:center;">
      <div style="font-size:2rem;margin-bottom:12px;">${t.f2.split(' ')[0]}</div>
      <h3 data-gjs-type="text" style="color:#1e293b;font-weight:700;margin:0 0 8px;">${t.f2.substring(t.f2.indexOf(' ')+1)}</h3>
      <p data-gjs-type="text" style="color:#64748b;font-size:0.9rem;margin:0;">Speed and efficiency are at the core of everything we do.</p>
    </div>
    <div data-gjs-type="cell" style="background:#fff;padding:32px 24px;border-radius:12px;border:1px solid #e2e8f0;text-align:center;">
      <div style="font-size:2rem;margin-bottom:12px;">${t.f3.split(' ')[0]}</div>
      <h3 data-gjs-type="text" style="color:#1e293b;font-weight:700;margin:0 0 8px;">${t.f3.substring(t.f3.indexOf(' ')+1)}</h3>
      <p data-gjs-type="text" style="color:#64748b;font-size:0.9rem;margin:0;">Powerful insights and tools to help you make smarter decisions.</p>
    </div>
  </div>
</section>
<section data-gjs-type="section" style="padding:64px 20px;background:#fff;">
  <div style="max-width:800px;margin:auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
    <div>
      <h2 data-gjs-type="text" style="font-size:1.8rem;font-weight:700;color:#1e293b;margin:0 0 16px;">About Us</h2>
      <p data-gjs-type="text" style="color:#475569;line-height:1.7;margin:0 0 16px;">We are a dedicated team committed to delivering exceptional results. With years of experience and a passion for excellence, we help businesses like yours achieve their goals.</p>
      <p data-gjs-type="text" style="color:#475569;line-height:1.7;margin:0;">Our approach combines industry expertise with a genuine focus on your success. We build long-term partnerships based on trust, transparency, and results.</p>
    </div>
    <div style="background:#f8fafc;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
      <div style="font-size:2rem;font-weight:800;color:${t.color};margin-bottom:4px;">500+</div>
      <div style="color:#64748b;font-size:0.9rem;margin-bottom:20px;">Satisfied clients</div>
      <div style="font-size:2rem;font-weight:800;color:${t.color};margin-bottom:4px;">98%</div>
      <div style="color:#64748b;font-size:0.9rem;margin-bottom:20px;">Repeat customers</div>
      <div style="font-size:2rem;font-weight:800;color:${t.color};margin-bottom:4px;">24h</div>
      <div style="color:#64748b;font-size:0.9rem;">Response time</div>
    </div>
  </div>
</section>
<section data-gjs-type="section" id="contact" style="padding:64px 20px;background:#f8fafc;">
  <div style="max-width:560px;margin:auto;text-align:center;">
    <h2 data-gjs-type="text" style="font-size:1.8rem;font-weight:700;color:#1e293b;margin:0 0 12px;">Get In Touch</h2>
    <p data-gjs-type="text" style="color:#64748b;margin:0 0 32px;">Ready to get started? Send us a message and we&apos;ll reply within 24 hours.</p>
    <form data-gjs-type="form" style="background:#fff;padding:32px;border-radius:12px;border:1px solid #e2e8f0;text-align:left;">
      <div style="margin-bottom:16px;"><label style="display:block;font-weight:600;color:#374151;margin-bottom:6px;font-size:0.9rem;">Your name</label><input type="text" placeholder="Full name" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;box-sizing:border-box;" /></div>
      <div style="margin-bottom:16px;"><label style="display:block;font-weight:600;color:#374151;margin-bottom:6px;font-size:0.9rem;">Email address</label><input type="email" placeholder="you@company.com" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;box-sizing:border-box;" /></div>
      <div style="margin-bottom:20px;"><label style="display:block;font-weight:600;color:#374151;margin-bottom:6px;font-size:0.9rem;">Message</label><textarea placeholder="Tell us about your needs..." rows="4" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:0.95rem;box-sizing:border-box;resize:vertical;"></textarea></div>
      <button type="submit" style="width:100%;padding:12px;background:${t.color};color:#fff;font-weight:700;border-radius:8px;border:none;font-size:1rem;cursor:pointer;">${t.ctaLabel}</button>
    </form>
  </div>
</section>`.trim();

    const css = `
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
section { width: 100%; }
h1, h2, h3, p { margin: 0; }
a { text-decoration: none; }
input:focus, textarea:focus { outline: 2px solid ${t.color}; outline-offset: 1px; }
@media (max-width: 640px) {
  h1 { font-size: 2rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
}`.trim();

    return Response.json({ html, css });
  } catch (e) {
    console.warn('ai-scaffold error:', e);
    return Response.json({ error: 'Failed to scaffold' }, { status: 500 });
  }
}
