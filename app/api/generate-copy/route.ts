export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'prompt required' }, { status: 400 });
    }
    const field = (type || 'hero') as 'hero' | 'about' | 'tagline';

    const lp = prompt.toLowerCase();
    const words = prompt.trim().split(/\s+/);
    // Attempt to get business name (first capitalised words before any descriptors)
    const bizName = words.slice(0, 3).filter(w => /^[A-Z]/.test(w)).join(' ') || 'Our Business';

    const isService = lp.includes('service') || lp.includes('consult') || lp.includes('agency') || lp.includes('coach');
    const isProduct = lp.includes('product') || lp.includes('wholesale') || lp.includes('supply') || lp.includes('manufactur') || lp.includes('retail');
    const isTech = lp.includes('software') || lp.includes('tech') || lp.includes('app') || lp.includes('saas');
    const isFood = lp.includes('food') || lp.includes('restaurant') || lp.includes('catering') || lp.includes('beverage');

    if (field === 'hero') {
      let headline = '';
      let subheadline = '';

      if (isTech) {
        headline = 'Software That Scales With You';
        subheadline = 'Automate, grow, and thrive with tools built for modern businesses.';
      } else if (isFood) {
        headline = 'Fresh Quality, Every Order';
        subheadline = 'Premium ingredients delivered fast. Trusted by food businesses island-wide.';
      } else if (isService) {
        headline = 'Expert Services That Deliver';
        subheadline = 'Get results faster with a team that knows your industry inside out.';
      } else if (isProduct) {
        headline = 'Quality Products, Wholesale Prices';
        subheadline = 'Reliable B2B supply with competitive pricing and fast delivery.';
      } else {
        headline = 'Built For Business Growth';
        subheadline = 'Smart solutions and dedicated support to take your business further.';
      }

      return Response.json({ headline, subheadline });
    }

    if (field === 'about') {
      let body = '';

      if (isTech) {
        body = `We build powerful, intuitive software for businesses that want to operate smarter. Founded by people who understand the challenges of growing a business, we create tools that save time, reduce errors, and give you the insights to make confident decisions. ${bizName !== 'Our Business' ? `At ${bizName}, your success is our success.` : ''}`.trim();
      } else if (isFood) {
        body = `We are a trusted supplier of high-quality food products, serving restaurants, caterers, and food businesses across the region. Our commitment to freshness, fair pricing, and reliable delivery means you can focus on what you do best. Creating great food. ${bizName !== 'Our Business' ? `${bizName} has been a cornerstone supplier for years.` : ''}`.trim();
      } else if (isService) {
        body = `We are a professional services firm dedicated to helping businesses achieve measurable results. Our experienced team works closely with each client to understand their unique challenges and deliver tailored solutions. ${bizName !== 'Our Business' ? `${bizName} has built a reputation for excellence and trust.` : ''}`.trim();
      } else if (isProduct) {
        body = `We are a leading wholesale supplier providing quality products at competitive prices to businesses of all sizes. With a streamlined supply chain and dedicated account management, we make B2B purchasing simple, reliable, and cost-effective. ${bizName !== 'Our Business' ? `${bizName}. Your trusted supply partner.` : ''}`.trim();
      } else {
        body = `We are a dedicated team focused on delivering outstanding results for our clients. With deep expertise and a genuine commitment to your success, we combine strategy with execution to help your business thrive. ${bizName !== 'Our Business' ? `${bizName}. Where great work happens.` : ''}`.trim();
      }

      return Response.json({ body });
    }

    if (field === 'tagline') {
      let tagline = '';

      if (isTech) tagline = 'Smarter tools. Better results.';
      else if (isFood) tagline = 'Fresh. Reliable. Delivered.';
      else if (isService) tagline = 'Results you can count on.';
      else if (isProduct) tagline = 'Quality supply, every time.';
      else tagline = 'Built for business growth.';

      return Response.json({ tagline });
    }

    return Response.json({ error: 'Unknown type' }, { status: 400 });
  } catch (e) {
    console.warn('generate-copy error:', e);
    return Response.json({ error: 'Failed to generate' }, { status: 500 });
  }
}
