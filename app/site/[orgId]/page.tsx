'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, Mail, Phone, MapPin, Send, MessageCircle, Instagram, Facebook, Star, ArrowRight, Zap, Shield, Users, TrendingUp, Award, Clock, Globe } from 'lucide-react';
import Link from 'next/link';

interface SiteData {
  branding: {
    companyName: string; logoUrl: string; primaryColor: string;
    logoSize?: string; ctaText?: string;
    infoEmail: string; supportEmail: string; salesEmail: string;
    phone: string; whatsapp: string; address: string;
    instagramUrl: string; facebookUrl: string; businessType: string;
    facebookPixelId?: string; gaId?: string;
  };
  cms: {
    heroTitle: string; heroSubtitle: string; valueLine: string;
    processTitle: string; processSubtitle: string;
    aboutTitle: string; aboutBody1: string; aboutBody2: string;
    stockQuoteTitle: string; stockQuoteSubtitle: string;
    template?: string;
    heroImageUrl?: string | null;
    heroImageFit?: string;
    heroImageOpacity?: number;
  };
}

// Scroll-reveal hook
function useScrollReveal() {
  const observer = useRef<IntersectionObserver | null>(null);
  const init = useCallback(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => observer.current?.observe(el));
  }, []);
  useEffect(() => {
    init();
    return () => observer.current?.disconnect();
  }, [init]);
  return init;
}

// Template configs
const TEMPLATES: Record<string, {
  heroGradient: (c: string) => string;
  accentLight: (c: string) => string;
  features: { icon: React.ReactNode; title: string; desc: string }[];
  stats: { value: string; label: string }[];
  testimonials: { name: string; role: string; text: string }[];
}> = {
  modern: {
    heroGradient: (c) => `linear-gradient(135deg, ${c} 0%, #0f172a 60%, #1e1b4b 100%)`,
    accentLight: (c) => `${c}18`,
    features: [
      { icon: <Zap size={24} />, title: 'Fast & Reliable', desc: 'Delivering results on time, every time. Speed and quality never compromised.' },
      { icon: <Shield size={24} />, title: 'Trusted & Secure', desc: 'Your business and customers are always protected with us.' },
      { icon: <TrendingUp size={24} />, title: 'Growth-Focused', desc: 'Everything we do is designed to help your business grow consistently.' },
    ],
    stats: [{ value: '500+', label: 'Happy Clients' }, { value: '98%', label: 'Satisfaction Rate' }, { value: '24h', label: 'Response Time' }, { value: '5★', label: 'Average Rating' }],
    testimonials: [
      { name: 'Marcus A.', role: 'Business Owner', text: 'Working with this team completely transformed how we operate. Professional, fast, and genuinely results-driven.' },
      { name: 'Priya S.', role: 'Marketing Director', text: 'Exceptional service and attention to detail. We saw measurable results within weeks of getting started.' },
      { name: 'James C.', role: 'CEO', text: 'I have worked with many providers, but none have delivered like this. Highly recommend.' },
    ],
  },
  minimal: {
    heroGradient: (c) => `linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)`,
    accentLight: (c) => `${c}12`,
    features: [
      { icon: <Award size={24} />, title: 'Expert Quality', desc: 'Industry-leading expertise applied to every project we take on.' },
      { icon: <Users size={24} />, title: 'Client-First', desc: 'Your success drives every decision we make. We are here for you.' },
      { icon: <Clock size={24} />, title: 'Always On Time', desc: 'Deadlines are commitments. We deliver on schedule, every time.' },
    ],
    stats: [{ value: '10+', label: 'Years Experience' }, { value: '200+', label: 'Projects Done' }, { value: '100%', label: 'Client Focused' }, { value: '24/7', label: 'Support Available' }],
    testimonials: [
      { name: 'Sarah L.', role: 'Entrepreneur', text: 'Simple, clean, and incredibly effective. Exactly what my business needed.' },
      { name: 'David M.', role: 'Founder', text: 'The attention to detail is unmatched. Great experience from start to finish.' },
      { name: 'Lisa K.', role: 'Manager', text: 'Reliable and transparent. A true partner for business growth.' },
    ],
  },
  bold: {
    heroGradient: (c) => `linear-gradient(135deg, #0f172a 0%, ${c} 50%, #0f172a 100%)`,
    accentLight: (c) => `${c}22`,
    features: [
      { icon: <Zap size={24} />, title: 'High Impact', desc: 'Bold solutions that get noticed. We cut through the noise.' },
      { icon: <Shield size={24} />, title: 'Uncompromising', desc: 'No shortcuts. Only quality that stands the test of time.' },
      { icon: <TrendingUp size={24} />, title: 'Rapid Results', desc: 'Move fast. Execute with precision. Deliver on promise.' },
    ],
    stats: [{ value: '99%', label: 'Success Rate' }, { value: '50+', label: 'Industries' }, { value: '2×', label: 'Average Growth' }, { value: '24h', label: 'Response' }],
    testimonials: [
      { name: 'Alex T.', role: 'Founder', text: 'Bold, direct, and exactly what we needed. They delivered beyond expectations.' },
      { name: 'Jordan R.', role: 'CMO', text: 'The energy and professionalism are unmatched. Highly recommend for growth-focused brands.' },
      { name: 'Morgan K.', role: 'Director', text: 'Confident execution from day one. A true partner in scaling.' },
    ],
  },
  dark: {
    heroGradient: () => `linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
    accentLight: (c) => `${c}25`,
    features: [
      { icon: <Shield size={24} />, title: 'Premium Quality', desc: 'Sleek, professional, built for brands that demand excellence.' },
      { icon: <Users size={24} />, title: 'Discrete & Trusted', desc: 'Your success, our priority. Confidential and results-driven.' },
      { icon: <Award size={24} />, title: 'Refined Results', desc: 'Sophisticated solutions for discerning clients.' },
    ],
    stats: [{ value: '500+', label: 'Clients' }, { value: 'A+', label: 'Reputation' }, { value: '10+', label: 'Years' }, { value: '∞', label: 'Support' }],
    testimonials: [
      { name: 'Chris N.', role: 'Executive', text: 'Sophisticated and effective. Exactly the premium experience we expected.' },
      { name: 'Sam P.', role: 'Partner', text: 'Discrete, professional, and delivers. Rare combination.' },
      { name: 'Taylor L.', role: 'VP', text: 'Refined approach with measurable outcomes. Highly recommended.' },
    ],
  },
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default function SitePage() {
  const params = useParams();
  const orgId = (params?.orgId as string) || '';
  const [data, setData] = useState<SiteData | null>(null);
  const [customHtml, setCustomHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const reinitReveal = useScrollReveal();

  useEffect(() => {
    if (!orgId) { setLoading(false); return; }
    fetch(`/api/public-site?org_id=${encodeURIComponent(orgId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.customHtml) setCustomHtml(d.customHtml);
        if (d.branding || d.cms) setData(d);
        setLoading(false);
        // Track page view (fire and forget — never blocks rendering)
        try {
          fetch('/api/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              org_id: orgId,
              path: window.location.pathname,
              referrer: document.referrer || null,
            }),
          }).catch(() => {});
        } catch { /* silent */ }
      })
      .catch(() => setLoading(false));
  }, [orgId]);

  // Set favicon + page title from branding
  useEffect(() => {
    if (!data?.branding) return;
    const { companyName, logoUrl } = data.branding;
    if (companyName) document.title = companyName;
    if (logoUrl) {
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = logoUrl;
    }
  }, [data?.branding]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setHeroVisible(true), 100);
      // Init immediately + re-init after render settles
      reinitReveal();
      setTimeout(() => reinitReveal(), 300);
      setTimeout(() => reinitReveal(), 800);
    }
  }, [loading, reinitReveal]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSending(true);
    try {
      // Capture UTM source from URL if present (e.g. from Facebook/Google ads)
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const utmSource = params.get('utm_source') || params.get('source') || 'WEBSITE';
      const source = utmSource.toUpperCase().replace(/[\s-]/g, '_').slice(0, 32);

      await fetch('/api/submit-contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ org_id: orgId, name: form.name.trim(), email: form.email.trim(), message: (form.message || form.company || 'Contact from website').trim(), phone: form.phone, company: form.company, type: 'QUOTE', source }),
      });
      setSent(true);
      setForm({ name: '', company: '', email: '', phone: '', message: '' });
      // Fire Facebook Pixel lead event if connected
      if (typeof window !== 'undefined' && (window as { fbq?: (a: string, b: string) => void }).fbq) {
        (window as { fbq?: (a: string, b: string) => void }).fbq?.('track', 'Lead');
      }
    } catch (_) {}
    setSending(false);
  };

  const primary = data?.branding?.primaryColor || '#163A63';
  const templateKey = (data?.cms?.template || 'modern') as keyof typeof TEMPLATES;
  const tpl = TEMPLATES[templateKey] ?? TEMPLATES['modern'];
  const isLightHero = templateKey === 'minimal';
  const heroImageUrl = data?.cms?.heroImageUrl;
  const heroImageOpacity = Math.min(90, Math.max(5, data?.cms?.heroImageOpacity ?? 40)) / 100;
  const heroImageFit = data?.cms?.heroImageFit || 'cover';
  const contactEmail = data?.branding?.supportEmail || data?.branding?.salesEmail || data?.branding?.infoEmail || '';
  const whatsappLink = data?.branding?.whatsapp ? `https://wa.me/${data.branding.whatsapp.replace(/\D/g, '')}` : null;
  const fbPixelId = data?.branding?.facebookPixelId || '';
  const gaId = data?.branding?.gaId || '';

  // Inject tracking scripts once data loads
  useEffect(() => {
    if (fbPixelId && typeof window !== 'undefined') {
      const s = document.createElement('script');
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixelId}');fbq('track','PageView');`;
      document.head.appendChild(s);
    }
    if (gaId && typeof window !== 'undefined') {
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s1);
      const s2 = document.createElement('script');
      s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`;
      document.head.appendChild(s2);
    }
  }, [fbPixelId, gaId]);

  const globalStyles = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; background: #fff; color: #1e293b; }
    .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
    .reveal.revealed { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
    .reveal-left.revealed { opacity: 1; transform: translateX(0); }
    .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
    .reveal-right.revealed { opacity: 1; transform: translateX(0); }
    .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1); }
    .reveal-scale.revealed { opacity: 1; transform: scale(1); }
    .hero-bg { background: ${heroImageUrl ? 'transparent' : tpl.heroGradient(primary)}; }
    @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
    @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-15px) rotate(-3deg)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes pulse-ring { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.6);opacity:0} }
    @keyframes counter { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
    .hero-title { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) both; animation-delay: 0.1s; }
    .hero-subtitle { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) both; animation-delay: 0.25s; }
    .hero-cta { animation: fadeUp 0.9s cubic-bezier(.22,1,.36,1) both; animation-delay: 0.4s; }
    .hero-badge { animation: fadeIn 0.8s both; animation-delay: 0.6s; }
    .float-1 { animation: float 6s ease-in-out infinite; }
    .float-2 { animation: float2 8s ease-in-out infinite; animation-delay: -2s; }
    .nav-anim { animation: slideDown 0.5s cubic-bezier(.22,1,.36,1) both; }
    .card-hover { transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease; }
    .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
    .btn-primary { transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
    .btn-primary:active { transform: translateY(0); }
    .gradient-text { background: linear-gradient(135deg, ${primary}, ${primary}88); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .stat-card { animation: counter 0.6s cubic-bezier(.22,1,.36,1) both; }
    .tag-pulse::before { content:''; position:absolute; inset:0; border-radius:9999px; background:currentColor; animation: pulse-ring 2s ease-out infinite; }
  `;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${primary}30`, borderTop: `3px solid ${primary}`, animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  );

  // If the org has published a custom page via the Page Builder, serve it directly
  if (customHtml) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <iframe
          srcDoc={customHtml}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title={data?.branding?.companyName || 'Website'}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: '100vh', background: '#fff' }}>

        {/* Navigation */}
        <nav className="nav-anim" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.4s ease', padding: '0 24px',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {data?.branding?.logoUrl && (
                <img src={data.branding.logoUrl} alt={data.branding.companyName} style={{ height: data.branding.logoSize === 'large' ? 48 : data.branding.logoSize === 'small' ? 28 : 36, width: 'auto', objectFit: 'contain' }} />
              )}
              <span style={{ fontSize: 20, fontWeight: 800, color: scrolled ? primary : (isLightHero ? '#0f172a' : '#fff'), letterSpacing: '-0.3px', transition: 'color 0.3s' }}>
                {data?.branding?.companyName || 'Your Company'}
              </span>
            </div>
            {/* Desktop nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {['Services', 'About', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{
                  color: scrolled ? '#64748b' : (isLightHero ? '#475569' : 'rgba(255,255,255,0.85)'),
                  fontWeight: 500, fontSize: 14, textDecoration: 'none',
                  transition: 'color 0.2s', display: 'none',
                }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = scrolled ? primary : (isLightHero ? primary : '#fff')}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = scrolled ? '#64748b' : (isLightHero ? '#475569' : 'rgba(255,255,255,0.85)')}
                  className="desktop-nav-link"
                >{item}</a>
              ))}
              <a href="#contact" style={{
                background: primary, color: '#fff', padding: '10px 22px', borderRadius: 50,
                fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'block',
              }} className="btn-primary">{data?.branding?.ctaText || 'Get Started'}</a>
            </div>
          </div>
        </nav>

        <style>{`
          @media (min-width: 768px) { .desktop-nav-link { display: block !important; } }
          @media (max-width: 767px) { .hero-grid { grid-template-columns: 1fr !important; } .stats-grid { grid-template-columns: repeat(2,1fr) !important; } .features-grid { grid-template-columns: 1fr !important; } .testimonials-grid { grid-template-columns: 1fr !important; } .about-grid { grid-template-columns: 1fr !important; } .contact-grid { grid-template-columns: 1fr !important; } }
        `}</style>

        {/* Hero */}
        <section className="hero-bg" style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 80,
          ...(heroImageUrl ? {
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,${1 - heroImageOpacity}), rgba(0,0,0,${0.85 - heroImageOpacity * 0.5})), url("${heroImageUrl.replace(/"/g, '%22')}")`,
            backgroundSize: heroImageFit === 'contain' ? 'contain' : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          } : {}),
        }}>
          {/* Animated background elements - only when no hero image */}
          {!heroImageUrl && !isLightHero && <div className="float-1" style={{ position: 'absolute', top: '10%', right: '8%', width: 300, height: 300, borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', background: `rgba(255,255,255,0.05)`, pointerEvents: 'none' }} />}
          {!isLightHero && <div className="float-2" style={{ position: 'absolute', bottom: '15%', left: '5%', width: 200, height: 200, borderRadius: '40% 60% 30% 70% / 60% 40% 50% 50%', background: `rgba(255,255,255,0.04)`, pointerEvents: 'none' }} />}
          {!isLightHero && <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${primary}40 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />}

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
              <div>
                {data?.branding?.businessType && (
                  <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: isLightHero ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: 50, marginBottom: 24, border: isLightHero ? '1px solid rgba(15,23,42,0.12)' : '1px solid rgba(255,255,255,0.2)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'block', position: 'relative' }} className="tag-pulse" />
                    <span style={{ fontSize: 13, color: isLightHero ? '#334155' : '#fff', fontWeight: 500 }}>
                      {data.branding.businessType === 'service' ? '✦ Professional Services' : data.branding.businessType === 'consulting' ? '✦ Strategic Consulting' : '✦ Wholesale & Supply'}
                    </span>
                  </div>
                )}
                <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, color: isLightHero ? '#0f172a' : '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
                  {data?.cms?.heroTitle || 'Build Your Business Online'}
                </h1>
                <p className="hero-subtitle" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: isLightHero ? '#475569' : 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 12 }}>
                  {data?.cms?.heroSubtitle || 'We help businesses grow with reliable service and real results.'}
                </p>
                {data?.cms?.valueLine && (
                  <p className="hero-subtitle" style={{ fontSize: 14, color: isLightHero ? '#64748b' : 'rgba(255,255,255,0.6)', marginBottom: 36, fontStyle: 'italic' }}>
                    {data.cms.valueLine}
                  </p>
                )}
                <div className="hero-cta" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <a href="#contact" style={{ background: isLightHero ? primary : '#fff', color: isLightHero ? '#fff' : primary, padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }} className="btn-primary">
                    {data?.branding?.ctaText || 'Get Started'} <ArrowRight size={18} />
                  </a>
                  {whatsappLink && (
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }} className="btn-primary">
                      <MessageCircle size={18} /> WhatsApp Us
                    </a>
                  )}
                </div>
              </div>

              {/* Hero card visual */}
              <div className="hero-cta" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: isLightHero ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: isLightHero ? '1px solid rgba(15,23,42,0.08)' : '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 360 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    {data?.branding?.logoUrl ? (
                      <img src={data.branding.logoUrl} alt="" style={{ width: data.branding.logoSize === 'large' ? 64 : data.branding.logoSize === 'small' ? 32 : 48, height: data.branding.logoSize === 'large' ? 64 : data.branding.logoSize === 'small' ? 32 : 48, borderRadius: 12, objectFit: 'contain' }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: isLightHero ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: isLightHero ? primary : '#fff' }}>
                        {(data?.branding?.companyName || 'B')[0]}
                      </div>
                    )}
                    <div>
                      <p style={{ color: isLightHero ? '#0f172a' : '#fff', fontWeight: 700, fontSize: 16 }}>{data?.branding?.companyName || 'Your Company'}</p>
                      <p style={{ color: isLightHero ? '#64748b' : 'rgba(255,255,255,0.6)', fontSize: 12 }}>Verified Business</p>
                    </div>
                  </div>
                  {tpl.stats.slice(0, 3).map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? (isLightHero ? '1px solid rgba(15,23,42,0.08)' : '1px solid rgba(255,255,255,0.1)') : 'none' }}>
                      <span style={{ color: isLightHero ? '#64748b' : 'rgba(255,255,255,0.6)', fontSize: 13 }}>{s.label}</span>
                      <span style={{ color: isLightHero ? '#0f172a' : '#fff', fontWeight: 700, fontSize: 15 }}>{s.value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, display: 'flex', gap: 4 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} style={{ fill: '#fbbf24', color: '#fbbf24' }} />)}
                    <span style={{ color: isLightHero ? '#64748b' : 'rgba(255,255,255,0.7)', fontSize: 12, marginLeft: 6 }}>Excellent service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave */}
          <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
            </svg>
          </div>
        </section>

        {/* Stats bar */}
        <section style={{ background: '#fff', padding: '32px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="stats-grid reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {tpl.stats.map((s, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '24px 16px', borderRadius: 16, background: `${tpl.accentLight(primary)}`, animationDelay: `${i * 0.1}s` }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: primary, letterSpacing: '-1px' }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services / Features */}
        <section id="services" style={{ padding: '80px 24px', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ color: primary, fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>What We Offer</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 16 }}>
                {data?.cms?.processTitle || 'Why Choose Us'}
              </h2>
              <p style={{ color: '#64748b', fontSize: 16, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
                {data?.cms?.processSubtitle || 'We combine expertise with dedication to deliver outstanding results every time.'}
              </p>
            </div>
            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {tpl.features.map((f, i) => (
                <div key={i} className={`reveal card-hover`} style={{
                  background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #e2e8f0',
                  transitionDelay: `${i * 0.1}s`,
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `${primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary, marginBottom: 20 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" style={{ padding: '80px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              <div className="reveal-left">
                <p style={{ color: primary, fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Our Story</p>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: '#0f172a', marginBottom: 20, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                  {data?.cms?.aboutTitle || 'About Us'}
                </h2>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 16, marginBottom: 16 }}>
                  {data?.cms?.aboutBody1 || 'We are a dedicated team committed to delivering exceptional results. With years of experience and a passion for excellence, we help businesses achieve their goals.'}
                </p>
                {data?.cms?.aboutBody2 && (
                  <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 16, marginBottom: 24 }}>{data.cms.aboutBody2}</p>
                )}
                <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: primary, fontWeight: 700, fontSize: 15, textDecoration: 'none' }} className="btn-primary">
                  Work with us <ArrowRight size={18} />
                </a>
              </div>
              <div className="reveal-right">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Mission', text: 'To empower businesses with tools and services that drive real, measurable growth.' },
                    { label: 'Vision', text: 'A world where every business, regardless of size, can compete and thrive.' },
                    { label: 'Values', text: 'Integrity, innovation, and a relentless focus on client success guide everything.' },
                    { label: 'Promise', text: 'We deliver on our commitments. On time, on budget, and beyond expectations.' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: i % 2 === 0 ? `${primary}10` : '#f8fafc', borderRadius: 16, padding: '20px 18px', border: `1px solid ${i % 2 === 0 ? `${primary}20` : '#e2e8f0'}` }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: primary, marginBottom: 8 }}>{item.label}</div>
                      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: '80px 24px', background: tpl.heroGradient(primary) }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Testimonials</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>What Our Clients Say</h2>
            </div>
            <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {tpl.testimonials.map((t, i) => (
                <div key={i} className="reveal card-hover" style={{
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 20, padding: 28, transitionDelay: `${i * 0.1}s`,
                }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} style={{ fill: '#fbbf24', color: '#fbbf24' }} />)}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 16 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" style={{ padding: '80px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
              <p style={{ color: primary, fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Get In Touch</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>
                {data?.cms?.stockQuoteTitle || 'Start a Conversation'}
              </h2>
              <p style={{ color: '#64748b', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
                {data?.cms?.stockQuoteSubtitle || "Tell us what you need and we'll get back to you within 24 hours."}
              </p>
            </div>
            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'start' }}>
              {/* Contact info */}
              <div className="reveal-left">
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Contact Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {contactEmail && (
                      <a href={`mailto:${contactEmail}`} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', padding: '14px 18px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }} className="card-hover">
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: `${primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary }}>
                          <Mail size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</div>
                          <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 500 }}>{contactEmail}</div>
                        </div>
                      </a>
                    )}
                    {data?.branding?.phone && (
                      <a href={`tel:${data.branding.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', padding: '14px 18px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }} className="card-hover">
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: `${primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary }}>
                          <Phone size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone</div>
                          <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 500 }}>{data.branding.phone}</div>
                        </div>
                      </a>
                    )}
                    {data?.branding?.address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: `${primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary }}>
                          <MapPin size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Address</div>
                          <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 500 }}>{data.branding.address}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {(data?.branding?.instagramUrl || data?.branding?.facebookUrl || whatsappLink) && (
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>Follow Us</h4>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {whatsappLink && (
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ width: 44, height: 44, borderRadius: 12, background: '#25D36620', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', textDecoration: 'none' }} className="card-hover">
                          <MessageCircle size={22} />
                        </a>
                      )}
                      {data?.branding?.instagramUrl && (
                        <a href={data.branding.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ width: 44, height: 44, borderRadius: 12, background: '#E114741A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11474', textDecoration: 'none' }} className="card-hover">
                          <Instagram size={22} />
                        </a>
                      )}
                      {data?.branding?.facebookUrl && (
                        <a href={data.branding.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ width: 44, height: 44, borderRadius: 12, background: '#1877F21A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1877F2', textDecoration: 'none' }} className="card-hover">
                          <Facebook size={22} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact form */}
              <div className="reveal-right">
                <div style={{ background: '#f8fafc', borderRadius: 24, padding: 32, border: '1px solid #e2e8f0' }}>
                  {sent ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'fadeUp 0.5s both' }}>
                        <CheckCircle2 size={36} color="#16a34a" />
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Message Sent!</h3>
                      <p style={{ color: '#64748b', fontSize: 15 }}>Thank you! We&apos;ll be in touch very soon.</p>
                      <button onClick={() => setSent(false)} style={{ marginTop: 20, padding: '10px 24px', background: primary, color: '#fff', border: 'none', borderRadius: 50, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                        Send another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Name *</label>
                          <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, background: '#fff', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = primary} onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Company</label>
                          <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, background: '#fff', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = primary} onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email *</label>
                        <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, background: '#fff', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = primary} onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Phone</label>
                        <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, background: '#fff', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = primary} onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>How can we help?</label>
                        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your needs..." rows={4} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, background: '#fff', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = primary} onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = '#e2e8f0'} />
                      </div>
                      <button type="submit" disabled={sending} style={{ width: '100%', padding: '14px', background: primary, color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: sending ? 0.7 : 1 }} className="btn-primary">
                        {sending ? 'Sending...' : <><Send size={18} /> Send Message</>}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating WhatsApp button */}
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
            position: 'fixed', bottom: 32, right: 32, width: 60, height: 60, borderRadius: '50%', background: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 90,
            boxShadow: '0 8px 24px rgba(37,211,102,0.4)', textDecoration: 'none',
          }} className="btn-primary">
            <MessageCircle size={28} />
          </a>
        )}

        {/* Footer */}
        <footer style={{ background: '#0f172a', padding: '56px 24px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  {data?.branding?.logoUrl && <img src={data.branding.logoUrl} alt="" style={{ height: data.branding.logoSize === 'large' ? 40 : data.branding.logoSize === 'small' ? 24 : 32, width: 'auto', objectFit: 'contain' }} />}
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{data?.branding?.companyName || 'Your Company'}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
                  {data?.cms?.heroSubtitle?.slice(0, 100) || 'Helping businesses grow with reliable solutions and dedicated service.'}
                </p>
                {(contactEmail || data?.branding?.phone) && (
                  <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {contactEmail && <a href={`mailto:${contactEmail}`} style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} />{contactEmail}</a>}
                    {data?.branding?.phone && <a href={`tel:${data.branding.phone}`} style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} />{data.branding.phone}</a>}
                  </div>
                )}
              </div>
              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Company</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['About Us', 'Services', 'Contact'].map(l => (
                    <a key={l} href={`#${l.toLowerCase().replace(' ', '')}`} style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>{l}</a>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Legal</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link href="/terms" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>Terms of Service</Link>
                  <Link href="/privacy" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>Privacy Policy</Link>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ color: '#475569', fontSize: 13 }}>© {new Date().getFullYear()} {data?.branding?.companyName || 'Your Company'}. All rights reserved.</span>
              <span style={{ color: '#334155', fontSize: 12 }}>Powered by <Link href="https://stoklync.com" style={{ color: '#64748b' }}>Stoklync</Link></span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
