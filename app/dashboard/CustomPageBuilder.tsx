'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Plus, Trash2, ChevronUp, ChevronDown, Globe, Loader2, CheckCircle2,
  X, ExternalLink, Monitor, Smartphone, Tablet, Eye, ArrowRight,
  LayoutTemplate, Sparkles, ImagePlus,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type SectionType =
  | 'hero' | 'hero_split' | 'features' | 'about' | 'testimonials'
  | 'stats' | 'pricing' | 'cta' | 'contact' | 'video' | 'gallery' | 'footer';

interface BuilderSection {
  id: string;
  type: SectionType;
  fields: Record<string, string>;
}

interface CustomPageBuilderProps {
  primaryColor?: string;
  orgId?: string;
  siteUrl?: string;
  onPublishSuccess?: () => void;
}

// ─── Section library definition ────────────────────────────────────────────────

const SECTION_LIBRARY: { type: SectionType; label: string; icon: string; desc: string }[] = [
  { type: 'hero',         label: 'Hero – Centered',  icon: '🌟', desc: 'Bold headline, subtitle, two buttons' },
  { type: 'hero_split',   label: 'Hero – Split',     icon: '✂️', desc: 'Text left, image placeholder right' },
  { type: 'features',     label: 'Features',         icon: '⚡', desc: '3 feature cards with icon & text' },
  { type: 'about',        label: 'About Us',         icon: '🏢', desc: 'Your story, image + copy' },
  { type: 'testimonials', label: 'Testimonials',     icon: '⭐', desc: '3 customer review cards' },
  { type: 'stats',        label: 'Stats Bar',        icon: '📊', desc: '4 impressive numbers' },
  { type: 'pricing',      label: 'Pricing',          icon: '💰', desc: '3-tier pricing table' },
  { type: 'cta',          label: 'CTA Banner',       icon: '📣', desc: 'Full-width call-to-action' },
  { type: 'contact',      label: 'Contact Form',     icon: '📬', desc: 'Contact form section' },
  { type: 'video',        label: 'Video Section',    icon: '🎬', desc: 'YouTube or video embed' },
  { type: 'gallery',      label: 'Photo Gallery',    icon: '🖼️', desc: '6-image masonry grid' },
  { type: 'footer',       label: 'Footer',           icon: '🦶', desc: 'Links, contact, copyright' },
];

// ─── Default field values per section ──────────────────────────────────────────

const DEFAULTS: Record<SectionType, Record<string, string>> = {
  hero: {
    heading: 'Grow Your Business Online', subheading: 'Reach more customers and increase sales with a professional online presence built in minutes.',
    cta1: 'Get Started Free', cta2: 'Learn More',
  },
  hero_split: {
    eyebrow: 'Solutions for your business', heading: 'Everything You Need to Succeed',
    body: 'We provide the tools and support to help your business thrive.', cta: 'Start Free Trial',
    image_url: '',
  },
  features: {
    heading: 'Why Choose Us', subheading: 'Everything your business needs to grow online.',
    f1_icon: '🚀', f1_title: 'Fast & Reliable', f1_desc: 'Industry-leading speed and reliability your customers can count on.',
    f2_icon: '🔒', f2_title: 'Secure & Trusted', f2_desc: 'Enterprise-grade security protecting your business and customers.',
    f3_icon: '📈', f3_title: 'Results Driven', f3_desc: 'Proven strategies that deliver measurable growth for your business.',
  },
  about: {
    eyebrow: 'Our Story', heading: 'Built With Purpose, Driven by Results',
    body1: 'We started with a simple goal: to help businesses like yours succeed without the complexity or high costs.',
    body2: 'Our team works tirelessly to deliver solutions that actually move the needle for your business.', cta: 'Learn More',
    image_url: '',
  },
  testimonials: {
    heading: 'What Our Customers Say', subheading: 'Real results from real businesses just like yours.',
    t1_name: 'Sarah M.', t1_role: 'Restaurant Owner', t1_text: 'Doubled our bookings in 3 months. The platform is incredible!',
    t2_name: 'James K.', t2_role: 'Retail Store', t2_text: 'Best investment we ever made for our business. Highly recommend.',
    t3_name: 'Linda P.', t3_role: 'Service Business', t3_text: 'Professional, fast and it actually works. 10 out of 10.',
  },
  stats: {
    heading: '',
    s1_num: '500+', s1_label: 'Happy Clients',
    s2_num: '98%',  s2_label: 'Satisfaction Rate',
    s3_num: '3×',   s3_label: 'Average Growth',
    s4_num: '24/7', s4_label: 'Support',
  },
  pricing: {
    heading: 'Simple, Transparent Pricing', subheading: 'Choose the plan that fits your business. No hidden fees.',
    p1_name: 'Starter', p1_price: '$29/mo', p1_features: 'Up to 5 products\n100 leads/month\nEmail support',
    p2_name: 'Business', p2_price: '$79/mo', p2_features: 'Unlimited products\n1,000 leads/month\nPriority support\nAdvanced analytics',
    p3_name: 'Enterprise', p3_price: '$199/mo', p3_features: 'Everything in Business\nUnlimited everything\nDedicated manager\nCustom integrations',
  },
  cta: {
    heading: 'Ready to Grow Your Business?', subheading: 'Join hundreds of businesses already growing with us. Start your free trial today.', button: 'Start Free Today →',
  },
  contact: {
    heading: 'Get In Touch', subheading: "Leave your details and we'll get back to you within 24 hours.", button: 'Send Message',
  },
  video: {
    heading: 'See It In Action', subheading: 'Watch how we help businesses just like yours grow online.', youtube_url: '',
  },
  gallery: {
    heading: 'Our Work', subheading: "A showcase of what we've built for our clients.",
    img_1: '', img_2: '', img_3: '', img_4: '', img_5: '', img_6: '',
  },
  footer: {
    company: 'Your Business', tagline: 'Helping businesses grow online with professional digital solutions.',
    email: 'hello@yourbusiness.com', phone: '+1 (876) 000-0000',
    link1: 'About', link2: 'Services', link3: 'Pricing', link4: 'Contact',
  },
};

// ─── Field labels for the edit panel ───────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  heading: 'Main Heading', subheading: 'Subtitle', eyebrow: 'Eyebrow text (small)', body: 'Body text',
  body1: 'Paragraph 1', body2: 'Paragraph 2', cta: 'Button text', cta1: 'Primary button', cta2: 'Secondary button',
  button: 'Button label', f1_icon: 'Feature 1 emoji', f1_title: 'Feature 1 title', f1_desc: 'Feature 1 description',
  f2_icon: 'Feature 2 emoji', f2_title: 'Feature 2 title', f2_desc: 'Feature 2 description',
  f3_icon: 'Feature 3 emoji', f3_title: 'Feature 3 title', f3_desc: 'Feature 3 description',
  t1_name: 'Review 1 name', t1_role: 'Review 1 title', t1_text: 'Review 1 text',
  t2_name: 'Review 2 name', t2_role: 'Review 2 title', t2_text: 'Review 2 text',
  t3_name: 'Review 3 name', t3_role: 'Review 3 title', t3_text: 'Review 3 text',
  s1_num: 'Stat 1 number', s1_label: 'Stat 1 label', s2_num: 'Stat 2 number', s2_label: 'Stat 2 label',
  s3_num: 'Stat 3 number', s3_label: 'Stat 3 label', s4_num: 'Stat 4 number', s4_label: 'Stat 4 label',
  p1_name: 'Plan 1 name', p1_price: 'Plan 1 price', p1_features: 'Plan 1 features (one per line)',
  p2_name: 'Plan 2 name', p2_price: 'Plan 2 price', p2_features: 'Plan 2 features (one per line)',
  p3_name: 'Plan 3 name', p3_price: 'Plan 3 price', p3_features: 'Plan 3 features (one per line)',
  youtube_url: 'YouTube URL', company: 'Company name', tagline: 'Tagline / description',
  email: 'Email address', phone: 'Phone number', link1: 'Link 1', link2: 'Link 2', link3: 'Link 3', link4: 'Link 4',
  image_url: 'Section photo', img_1: 'Photo 1', img_2: 'Photo 2', img_3: 'Photo 3',
  img_4: 'Photo 4', img_5: 'Photo 5', img_6: 'Photo 6',
};

// ─── HTML generator ─────────────────────────────────────────────────────────────

function generateSectionHtml(section: BuilderSection, pc: string): string {
  const f = section.fields;
  const btn = (label: string, url = '#', outline = false) =>
    `<a href="${url}" style="display:inline-block;padding:13px 28px;background:${outline ? 'transparent' : pc};color:${outline ? '#fff' : '#fff'};border-radius:8px;font-weight:700;text-decoration:none;font-size:15px;${outline ? `border:2px solid rgba(255,255,255,0.6);` : ''}">${label}</a>`;

  switch (section.type) {
    case 'hero':
      return `<section style="padding:100px 24px;text-align:center;background:linear-gradient(135deg,${pc} 0%,#0F2847 100%);color:#fff;"><p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;opacity:0.6;margin:0 0 14px;">${f.eyebrow||'Welcome'}</p><h1 style="font-size:clamp(36px,6vw,68px);font-weight:900;margin:0 0 20px;line-height:1.1;">${f.heading}</h1><p style="font-size:18px;max-width:580px;margin:0 auto 40px;opacity:0.85;line-height:1.7;">${f.subheading}</p><div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">${btn(f.cta1)}&nbsp;${btn(f.cta2,'#',true)}</div></section>`;

    case 'hero_split':
      return `<section style="padding:80px 24px;background:#f8fafc;"><div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;"><div><p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${pc};font-weight:700;margin:0 0 14px;">${f.eyebrow}</p><h1 style="font-size:clamp(30px,4vw,54px);font-weight:900;color:#0f172a;margin:0 0 20px;line-height:1.15;">${f.heading}</h1><p style="font-size:17px;color:#475569;margin:0 0 36px;line-height:1.75;">${f.body}</p><a href="#" style="display:inline-block;padding:13px 28px;background:${pc};color:#fff;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px;">${f.cta}</a></div><div style="border-radius:20px;aspect-ratio:4/3;overflow:hidden;">${f.image_url ? `<img src="${f.image_url}" style="width:100%;height:100%;object-fit:cover;display:block;" alt="" />` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,${pc},#0F2847);display:flex;align-items:center;justify-content:center;"><p style="color:rgba(255,255,255,0.4);font-size:14px;font-weight:500;">📸 Upload a photo</p></div>`}</div></div></section>`;

    case 'features':
      return `<section style="padding:80px 24px;background:#fff;"><div style="max-width:1100px;margin:0 auto;text-align:center;"><h2 style="font-size:clamp(28px,4vw,42px);font-weight:900;color:#0f172a;margin:0 0 12px;">${f.heading}</h2><p style="font-size:17px;color:#64748b;margin:0 auto 56px;max-width:520px;">${f.subheading}</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;">${[1,2,3].map(i=>`<div style="padding:36px 28px;background:#f8fafc;border-radius:20px;border:1px solid #e2e8f0;text-align:left;"><div style="font-size:44px;margin-bottom:16px;">${f[`f${i}_icon`]}</div><h3 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 10px;">${f[`f${i}_title`]}</h3><p style="color:#64748b;line-height:1.7;margin:0;font-size:15px;">${f[`f${i}_desc`]}</p></div>`).join('')}</div></div></section>`;

    case 'about':
      return `<section style="padding:80px 24px;background:#f8fafc;"><div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;"><div style="border-radius:20px;aspect-ratio:4/3;overflow:hidden;">${f.image_url ? `<img src="${f.image_url}" style="width:100%;height:100%;object-fit:cover;display:block;" alt="" />` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,${pc},#0F2847);display:flex;align-items:center;justify-content:center;"><p style="color:rgba(255,255,255,0.4);font-size:14px;">📸 Upload a photo</p></div>`}</div><div><p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${pc};font-weight:700;margin:0 0 14px;">${f.eyebrow}</p><h2 style="font-size:clamp(28px,4vw,42px);font-weight:900;color:#0f172a;margin:0 0 20px;">${f.heading}</h2><p style="font-size:16px;color:#475569;line-height:1.8;margin:0 0 14px;">${f.body1}</p><p style="font-size:16px;color:#475569;line-height:1.8;margin:0 0 32px;">${f.body2}</p><a href="#" style="display:inline-block;padding:13px 28px;background:${pc};color:#fff;border-radius:8px;font-weight:700;text-decoration:none;font-size:15px;">${f.cta}</a></div></div></section>`;

    case 'testimonials':
      return `<section style="padding:80px 24px;background:#fff;"><div style="max-width:1100px;margin:0 auto;text-align:center;"><h2 style="font-size:clamp(28px,4vw,42px);font-weight:900;color:#0f172a;margin:0 0 12px;">${f.heading}</h2><p style="font-size:17px;color:#64748b;margin:0 auto 56px;max-width:520px;">${f.subheading}</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">${[1,2,3].map(i=>`<div style="padding:32px;background:#f8fafc;border-radius:20px;border:1px solid #e2e8f0;text-align:left;"><p style="color:#fbbf24;font-size:18px;margin:0 0 14px;">★★★★★</p><p style="font-size:15px;color:#334155;line-height:1.75;margin:0 0 24px;font-style:italic;">"${f[`t${i}_text`]}"</p><div><p style="font-weight:800;color:#0f172a;margin:0;font-size:15px;">${f[`t${i}_name`]}</p><p style="font-size:13px;color:#64748b;margin:4px 0 0;">${f[`t${i}_role`]}</p></div></div>`).join('')}</div></div></section>`;

    case 'stats':
      return `<section style="padding:64px 24px;background:${pc};"><div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center;">${[1,2,3,4].map(i=>`<div><p style="font-size:clamp(36px,5vw,56px);font-weight:900;color:#fff;margin:0 0 8px;">${f[`s${i}_num`]}</p><p style="font-size:15px;color:rgba(255,255,255,0.72);margin:0;">${f[`s${i}_label`]}</p></div>`).join('')}</div></section>`;

    case 'pricing':
      return `<section style="padding:80px 24px;background:#f8fafc;"><div style="max-width:960px;margin:0 auto;text-align:center;"><h2 style="font-size:clamp(28px,4vw,42px);font-weight:900;color:#0f172a;margin:0 0 12px;">${f.heading}</h2><p style="font-size:17px;color:#64748b;margin:0 auto 56px;max-width:440px;">${f.subheading}</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">${[1,2,3].map((i,idx)=>{const featured=idx===1;return `<div style="padding:36px 28px;background:${featured?pc:'#fff'};border-radius:20px;border:${featured?'none':'1px solid #e2e8f0'};${featured?'transform:scale(1.04);box-shadow:0 20px 60px rgba(0,0,0,0.15)':''}"><p style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:${featured?'rgba(255,255,255,0.7)':'#64748b'};margin:0 0 12px;">${f[`p${i}_name`]}</p><p style="font-size:42px;font-weight:900;color:${featured?'#fff':'#0f172a'};margin:0 0 24px;line-height:1;">${f[`p${i}_price`]}</p><ul style="list-style:none;padding:0;margin:0 0 28px;text-align:left;">${(f[`p${i}_features`]||'').split('\n').filter(Boolean).map(feat=>`<li style="padding:7px 0;color:${featured?'rgba(255,255,255,0.85)':'#475569'};font-size:14px;border-bottom:1px solid ${featured?'rgba(255,255,255,0.1)':'#f1f5f9'};">✓ ${feat}</li>`).join('')}</ul><a href="#contact" style="display:block;padding:13px;background:${featured?'#fff':pc};color:${featured?pc:'#fff'};border-radius:10px;font-weight:800;text-decoration:none;font-size:14px;">Get Started</a></div>`}).join('')}</div></div></section>`;

    case 'cta':
      return `<section style="padding:80px 24px;background:${pc};text-align:center;"><h2 style="font-size:clamp(28px,4vw,48px);font-weight:900;color:#fff;margin:0 0 16px;">${f.heading}</h2><p style="font-size:18px;color:rgba(255,255,255,0.8);margin:0 auto 40px;max-width:540px;line-height:1.7;">${f.subheading}</p><a href="#contact" style="display:inline-block;padding:16px 40px;background:#fff;color:${pc};border-radius:10px;font-weight:900;text-decoration:none;font-size:17px;box-shadow:0 10px 30px rgba(0,0,0,0.2);">${f.button}</a></section>`;

    case 'contact':
      return `<section style="padding:80px 24px;background:#f8fafc;" id="contact"><div style="max-width:620px;margin:0 auto;text-align:center;"><h2 style="font-size:clamp(28px,4vw,40px);font-weight:900;color:#0f172a;margin:0 0 12px;">${f.heading}</h2><p style="font-size:17px;color:#64748b;margin:0 auto 40px;">${f.subheading}</p><form style="text-align:left;background:#fff;padding:40px;border-radius:20px;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);"><div style="margin-bottom:18px;"><label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px;">Full Name</label><input type="text" placeholder="Your name" style="width:100%;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:15px;box-sizing:border-box;outline:none;" /></div><div style="margin-bottom:18px;"><label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px;">Email Address</label><input type="email" placeholder="your@email.com" style="width:100%;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:15px;box-sizing:border-box;" /></div><div style="margin-bottom:24px;"><label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px;">Message</label><textarea placeholder="How can we help?" style="width:100%;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:15px;box-sizing:border-box;height:120px;resize:vertical;"></textarea></div><button type="submit" style="width:100%;padding:14px;background:${pc};color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:800;cursor:pointer;">${f.button} →</button></form></div></section>`;

    case 'video': {
      const ytId = f.youtube_url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&\s]+)/)?.[1];
      return `<section style="padding:80px 24px;background:#fff;text-align:center;"><h2 style="font-size:clamp(28px,4vw,42px);font-weight:900;color:#0f172a;margin:0 0 12px;">${f.heading}</h2><p style="font-size:17px;color:#64748b;margin:0 auto 48px;max-width:520px;">${f.subheading}</p><div style="max-width:860px;margin:0 auto;border-radius:20px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.15);background:#000;aspect-ratio:16/9;">${ytId?`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${ytId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display:block;"></iframe>`:`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1e293b;"><p style="color:#64748b;font-size:15px;">▶ Paste a YouTube URL above to embed your video</p></div>`}</div></section>`;
    }

    case 'gallery':
      return `<section style="padding:80px 24px;background:#f8fafc;"><div style="max-width:1100px;margin:0 auto;text-align:center;"><h2 style="font-size:clamp(28px,4vw,42px);font-weight:900;color:#0f172a;margin:0 0 12px;">${f.heading}</h2><p style="font-size:17px;color:#64748b;margin:0 auto 48px;max-width:480px;">${f.subheading}</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">${Array(6).fill(0).map((_,i)=>{const imgUrl=f[`img_${i+1}`];return `<div style="aspect-ratio:4/3;border-radius:14px;overflow:hidden;">${imgUrl?`<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;display:block;" alt="Gallery ${i+1}" />`:`<div style="width:100%;height:100%;background:${i%2===0?pc:'#e2e8f0'};display:flex;align-items:center;justify-content:center;"><span style="font-size:28px;">📸</span></div>`}</div>`;}).join('')}</div></div></section>`;

    case 'footer':
      return `<footer style="padding:60px 24px 28px;background:#0f172a;color:#fff;"><div style="max-width:1100px;margin:0 auto;"><div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;margin-bottom:48px;"><div><h3 style="font-size:22px;font-weight:900;color:#fff;margin:0 0 14px;">${f.company}</h3><p style="color:#94a3b8;line-height:1.75;margin:0 0 20px;font-size:15px;">${f.tagline}</p><p style="color:#64748b;font-size:13px;line-height:1.8;margin:0;">📧 ${f.email}<br/>📱 ${f.phone}</p></div><div><h4 style="font-size:14px;font-weight:800;color:#fff;margin:0 0 18px;text-transform:uppercase;letter-spacing:1px;">Company</h4><ul style="list-style:none;padding:0;margin:0;">${[f.link1,f.link2,f.link3,f.link4].map(l=>`<li style="margin-bottom:10px;"><a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;hover:color:#fff;">${l}</a></li>`).join('')}</ul></div><div><h4 style="font-size:14px;font-weight:800;color:#fff;margin:0 0 18px;text-transform:uppercase;letter-spacing:1px;">Connect</h4><ul style="list-style:none;padding:0;margin:0;"><li style="margin-bottom:10px;"><a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">Facebook</a></li><li style="margin-bottom:10px;"><a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">Instagram</a></li><li style="margin-bottom:10px;"><a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">WhatsApp</a></li></ul></div></div><div style="border-top:1px solid #1e293b;padding-top:24px;text-align:center;"><p style="color:#475569;font-size:13px;margin:0;">© ${new Date().getFullYear()} ${f.company}. All rights reserved.</p></div></div></footer>`;

    default:
      return '';
  }
}

function generateFullHtml(sections: BuilderSection[], pc: string, title = 'My Website', faviconUrl = ''): string {
  const faviconTag = faviconUrl ? `<link rel="icon" href="${faviconUrl}">` : '';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${faviconTag}<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#0f172a;}img{max-width:100%;}</style></head><body>${sections.map(s => generateSectionHtml(s, pc)).join('\n')}</body></html>`;
}

// ─── Starters (pre-built page layouts) ─────────────────────────────────────────

const STARTERS: { label: string; icon: string; sections: SectionType[] }[] = [
  { label: 'Service Business', icon: '🔧', sections: ['hero', 'features', 'about', 'testimonials', 'cta', 'contact', 'footer'] },
  { label: 'Clothing / Fashion', icon: '👗', sections: ['hero_split', 'gallery', 'features', 'testimonials', 'pricing', 'cta', 'contact', 'footer'] },
  { label: 'Restaurant / Food', icon: '🍽️', sections: ['hero', 'about', 'gallery', 'testimonials', 'stats', 'contact', 'footer'] },
  { label: 'Consulting / Pro', icon: '💼', sections: ['hero_split', 'stats', 'features', 'about', 'testimonials', 'pricing', 'cta', 'contact', 'footer'] },
  { label: 'Event / Summit', icon: '🎤', sections: ['hero', 'stats', 'features', 'video', 'testimonials', 'pricing', 'contact', 'footer'] },
];

// ─── Main component ─────────────────────────────────────────────────────────────

export default function CustomPageBuilder({ primaryColor = '#163A63', orgId, siteUrl, onPublishSuccess }: CustomPageBuilderProps) {
  const [sections, setSections] = useState<BuilderSection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const selected = sections.find(s => s.id === selectedId) ?? null;
  const pc = primaryColor;

  const addSection = useCallback((type: SectionType) => {
    const newSection: BuilderSection = {
      id: crypto.randomUUID(),
      type,
      fields: { ...DEFAULTS[type] },
    };
    setSections(prev => [...prev, newSection]);
    setSelectedId(newSection.id);
    setShowLibrary(false);
  }, []);

  const applyStarter = (types: SectionType[]) => {
    const newSections = types.map(type => ({
      id: crypto.randomUUID(),
      type,
      fields: { ...DEFAULTS[type] },
    }));
    setSections(newSections);
    setSelectedId(newSections[0]?.id ?? null);
    setShowLibrary(false);
  };

  const updateField = (key: string, value: string) => {
    if (!selectedId) return;
    setSections(prev => prev.map(s => s.id === selectedId ? { ...s, fields: { ...s.fields, [key]: value } } : s));
  };

  const uploadImage = async (file: File, fieldKey: string) => {
    setUploadingField(fieldKey);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${orgId || 'public'}/${Date.now()}-${fieldKey}.${ext}`;
      const { error } = await sb.storage.from('site-images').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = sb.storage.from('site-images').getPublicUrl(path);
      updateField(fieldKey, data.publicUrl);
    } catch (e) {
      console.error('Image upload failed:', e);
    } finally {
      setUploadingField(null);
    }
  };

  const moveUp = (idx: number) => setSections(prev => { const n = [...prev]; [n[idx-1],n[idx]] = [n[idx],n[idx-1]]; return n; });
  const moveDown = (idx: number) => setSections(prev => { const n = [...prev]; [n[idx],n[idx+1]] = [n[idx+1],n[idx]]; return n; });
  const remove = (id: string) => { setSections(prev => prev.filter(s => s.id !== id)); if (selectedId === id) setSelectedId(null); };

  const publish = async () => {
    if (!orgId) return;
    setPublishing(true);
    setPublishError('');
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      // Fetch branding for title + favicon
      const { data: brand } = await sb.from('branding').select('company_name, logo_url').eq('org_id', orgId).maybeSingle();
      const siteTitle = (brand as { company_name?: string } | null)?.company_name || 'My Website';
      const faviconUrl = (brand as { logo_url?: string } | null)?.logo_url || '';
      const html = generateFullHtml(sections, pc, siteTitle, faviconUrl);
      const css = '';
      const { error } = await sb.from('website_cms').upsert({ org_id: orgId, custom_html: html, custom_css: css }, { onConflict: 'org_id' });
      if (error) throw error;
      setPublished(true);
      onPublishSuccess?.();
      setTimeout(() => setPublished(false), 6000);
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : 'Publish failed. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const previewHtml = generateFullHtml(sections, pc);
  const deviceWidth = device === 'mobile' ? '375px' : device === 'tablet' ? '768px' : '100%';

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (sections.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Website Builder</h2>
            <p className="text-sm text-slate-500 mt-0.5">Build your website by adding and editing sections below</p>
          </div>
          {siteUrl && (
            <a href={siteUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <Globe size={13} /> View live site <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Starter layouts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: pc + '15' }}>
              <LayoutTemplate size={28} style={{ color: pc }} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Start with a template</h3>
            <p className="text-slate-500 text-sm">Choose a layout and we'll add all the sections. Customise every word and colour.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {STARTERS.map(s => (
              <button key={s.label} onClick={() => applyStarter(s.sections)}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all text-left group">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-slate-900">{s.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.sections.length} sections</p>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500 mb-4">Or start from scratch. Add sections one by one</p>
            <button onClick={() => setShowLibrary(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: pc }}>
              <Plus size={16} /> Add your first section
            </button>
          </div>
        </div>

        {showLibrary && (
          <SectionLibraryPanel onAdd={addSection} onClose={() => setShowLibrary(false)} />
        )}
      </div>
    );
  }

  // ── Builder view ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {[
            { id: 'desktop', icon: Monitor, label: 'Desktop' },
            { id: 'tablet',  icon: Tablet,  label: 'Tablet' },
            { id: 'mobile',  icon: Smartphone, label: 'Mobile' },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setDevice(id as typeof device)} title={label}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${device === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {published && (
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
              <CheckCircle2 size={13} /> Live & published!
            </span>
          )}
          {publishError && (
            <span className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">{publishError}</span>
          )}
          {siteUrl && (
            <a href={siteUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <Eye size={13} /> Preview <ExternalLink size={11} />
            </a>
          )}
          <button onClick={publish} disabled={publishing || sections.length === 0}
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ background: pc }}>
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            {publishing ? 'Publishing…' : 'Publish Site'}
          </button>
        </div>
      </div>

      {published && siteUrl && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Your site is live!</p>
              <p className="text-xs text-emerald-600 font-mono">{siteUrl}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigator.clipboard?.writeText(siteUrl)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">Copy link</button>
            <a href={siteUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1">
              Open <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}

      {/* Builder layout */}
      <div className="flex gap-4" style={{ minHeight: 600 }}>
        {/* Left: sections list */}
        <div className="w-52 shrink-0 flex flex-col gap-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Page Sections</p>
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
            {sections.map((s, idx) => {
              const def = SECTION_LIBRARY.find(d => d.type === s.type);
              return (
                <div key={s.id} onClick={() => setSelectedId(s.id)} role="button" tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setSelectedId(s.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 group cursor-pointer select-none ${selectedId === s.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <span className="text-base shrink-0">{def?.icon}</span>
                  <span className="flex-1 truncate">{def?.label}</span>
                  <div className={`flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 ${selectedId === s.id ? 'opacity-100' : ''}`}>
                    {idx > 0 && <button onClick={e => { e.stopPropagation(); moveUp(idx); }} className={`p-0.5 rounded ${selectedId === s.id ? 'hover:bg-white/20' : 'hover:bg-slate-200'}`}><ChevronUp size={11} /></button>}
                    {idx < sections.length - 1 && <button onClick={e => { e.stopPropagation(); moveDown(idx); }} className={`p-0.5 rounded ${selectedId === s.id ? 'hover:bg-white/20' : 'hover:bg-slate-200'}`}><ChevronDown size={11} /></button>}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowLibrary(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 text-sm font-medium transition-colors">
            <Plus size={14} /> Add section
          </button>
          {selected && (
            <button onClick={() => remove(selected.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors">
              <Trash2 size={14} /> Remove section
            </button>
          )}
        </div>

        {/* Center: preview */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 bg-slate-200 rounded-xl overflow-hidden flex items-start justify-center p-3">
            <div style={{ width: deviceWidth, transition: 'width 0.3s', maxWidth: '100%' }} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <iframe
                ref={previewRef}
                srcDoc={previewHtml}
                title="Page preview"
                className="w-full border-0"
                style={{ height: 620, pointerEvents: 'none' }}
              />
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            <Sparkles size={11} className="inline mr-1" /> Select a section on the left to edit its content
          </p>
        </div>

        {/* Right: edit panel */}
        {selected && (
          <div className="w-72 shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{SECTION_LIBRARY.find(d => d.type === selected.type)?.icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{SECTION_LIBRARY.find(d => d.type === selected.type)?.label}</p>
                  <p className="text-[11px] text-slate-400">Edit section content</p>
                </div>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {Object.entries(selected.fields).map(([key, val]) => {
                const isImage = key === 'image_url' || key.startsWith('img_');
                const isLong = !isImage && (key.includes('desc') || key.includes('text') || key.includes('body') || key.includes('subheading') || key.includes('features') || key.includes('tagline'));
                return (
                  <div key={key}>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      {FIELD_LABELS[key] || key.replace(/_/g, ' ')}
                    </label>
                    {isImage ? (
                      <div className="space-y-2">
                        {val && (
                          <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50" style={{ aspectRatio: '4/3' }}>
                            <img src={val} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => updateField(key, '')}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                              <X size={11} />
                            </button>
                          </div>
                        )}
                        <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed cursor-pointer transition-all text-xs font-semibold ${uploadingField === key ? 'border-slate-300 bg-slate-50 text-slate-400' : 'border-slate-300 hover:border-slate-500 hover:bg-slate-50 text-slate-600'}`}>
                          {uploadingField === key
                            ? <Loader2 size={13} className="animate-spin" />
                            : <ImagePlus size={13} />}
                          {uploadingField === key ? 'Uploading…' : val ? 'Change photo' : 'Upload photo'}
                          <input type="file" accept="image/*" className="hidden" disabled={uploadingField === key}
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, key); }} />
                        </label>
                      </div>
                    ) : isLong ? (
                      <textarea
                        value={val}
                        onChange={e => updateField(key, e.target.value)}
                        rows={key.includes('features') ? 5 : 3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none transition-all"
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={e => updateField(key, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ArrowRight size={10} /> Changes update the preview automatically
              </p>
            </div>
          </div>
        )}
      </div>

      {showLibrary && (
        <SectionLibraryPanel onAdd={addSection} onClose={() => setShowLibrary(false)} />
      )}
    </div>
  );
}

// ─── Section library panel ──────────────────────────────────────────────────────

function SectionLibraryPanel({ onAdd, onClose }: { onAdd: (t: SectionType) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Add a Section</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any section to add it to your page</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SECTION_LIBRARY.map(({ type, label, icon, desc }) => (
            <button key={type} onClick={() => onAdd(type)}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all text-left group">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm font-bold text-slate-900">{label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
