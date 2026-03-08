'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

interface SiteData {
  branding: { companyName: string; logoUrl: string; primaryColor: string; infoEmail: string; supportEmail: string; salesEmail: string; phone: string; address: string };
  cms: { heroTitle: string; heroSubtitle: string; valueLine: string; processTitle: string; processSubtitle: string; aboutTitle: string; aboutBody1: string; aboutBody2: string; stockQuoteTitle: string; stockQuoteSubtitle: string };
}

export default function SitePage() {
  const params = useParams();
  const orgId = (params?.orgId as string) || '';
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!orgId) { setLoading(false); return; }
    fetch(`/api/public-site?org_id=${encodeURIComponent(orgId)}`).then((r) => r.json()).then((d) => { if (d.branding || d.cms) setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [orgId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/submit-contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ org_id: orgId, name: form.name.trim(), email: form.email.trim(), message: (form.message || form.company || 'Contact from website').trim(), type: 'QUOTE' }) });
      if (!res.ok) throw new Error('Failed');
      try { await fetch('/api/send-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: form.email.trim(), subject: `Thank you for contacting ${data?.branding?.companyName || 'us'}`, body: `Hi ${form.name.trim()},\n\nThank you for getting in touch. We've received your message and will reply within 1 to 3 business days.\n\nBest regards,\nThe ${data?.branding?.companyName || 'team'} Team` }) }); } catch (_) {}
      setSent(true); setForm({ name: '', company: '', email: '', phone: '', message: '' });
    } catch (_) {}
    finally { setSending(false); }
  };

  const primary = data?.branding?.primaryColor || '#163A63';

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse text-slate-400 text-sm">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            {data?.branding?.logoUrl && <img src={data.branding.logoUrl} alt={data.branding.companyName} className="h-10 w-auto" />}
            <span className="text-xl font-bold" style={{ color: primary }}>{data?.branding?.companyName || 'Your Company'}</span>
          </div>
          <Link href="/auth/signin" className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100">Sign In</Link>
        </div>
      </nav>
      <section className="relative overflow-hidden text-white py-20 md:py-28" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${primary}dd 50%, ${primary}99 100%)` }}>
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">{data?.cms?.heroTitle || 'Build your business online'}</h1>
          <p className="text-lg md:text-xl text-white/90">{data?.cms?.heroSubtitle || 'We help you grow.'}</p>
          <p className="text-white/80 mt-2">{data?.cms?.valueLine || 'Simple. Modern. Effective.'}</p>
        </div>
      </section>
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{data?.cms?.stockQuoteTitle || 'Get in touch'}</h2>
            <p className="text-slate-600 mb-8">{data?.cms?.stockQuoteSubtitle || "Leave your details and we'll reach out."}</p>
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
                <CheckCircle2 className="mx-auto text-emerald-600 mb-4" size={48} />
                <p className="font-semibold text-emerald-800">Thank you!</p>
                <p className="text-sm text-emerald-700 mt-1">We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" required placeholder="Your name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300" />
                <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300" />
                <input type="email" required placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300" />
                <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300" />
                <textarea placeholder="How can we help?" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none" />
                <button type="submit" disabled={sending} className="w-full py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: primary }}>{sending ? 'Sending...' : 'Send'} <Send size={18} /></button>
              </form>
            )}
          </div>
          <div className="space-y-8">
            <div><h3 className="text-lg font-bold text-slate-900 mb-4">{data?.cms?.processTitle || 'How we help'}</h3><p className="text-slate-600">{data?.cms?.processSubtitle || 'We listen, plan, and execute—so you get outcomes that matter.'}</p></div>
            <div><h3 className="text-lg font-bold text-slate-900 mb-4">{data?.cms?.aboutTitle || 'About us'}</h3><p className="text-slate-600">{(data?.cms?.aboutBody1 || '').trim() ? `${data?.cms?.aboutBody1 || ''} ${data?.cms?.aboutBody2 || ''}`.trim() : `${data?.branding?.companyName || 'We'} deliver results. Use the form to get started or contact us directly.`}</p></div>
            <div><h3 className="text-lg font-bold text-slate-900 mb-4">What clients say</h3><div className="space-y-3"><blockquote className="pl-4 border-l-2 border-slate-200 text-slate-600 italic">&quot;Professional and reliable.&quot;</blockquote><blockquote className="pl-4 border-l-2 border-slate-200 text-slate-600 italic">&quot;Great results.&quot;</blockquote></div></div>
            {((data?.branding?.infoEmail || data?.branding?.supportEmail || data?.branding?.salesEmail) || data?.branding?.phone) && (
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                {(data?.branding?.infoEmail || data?.branding?.supportEmail || data?.branding?.salesEmail) && <a href={`mailto:${data.branding.infoEmail || data.branding.supportEmail || data.branding.salesEmail}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900"><Mail size={18} />{data.branding.infoEmail || data.branding.supportEmail || data.branding.salesEmail}</a>}
                {data?.branding?.phone && <a href={`tel:${data.branding.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900"><Phone size={18} />{data.branding.phone}</a>}
                {data?.branding?.address && <span className="flex items-center gap-2 text-slate-600"><MapPin size={18} />{data.branding.address}</span>}
              </div>
            )}
          </div>
        </div>
      </section>
      <footer className="py-10 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div><p className="font-semibold text-slate-800">{data?.branding?.companyName || 'Your Company'}</p><div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">{(data?.branding?.infoEmail || data?.branding?.supportEmail || data?.branding?.salesEmail) && <a href={`mailto:${data?.branding?.infoEmail || data?.branding?.supportEmail || data?.branding?.salesEmail}`} className="hover:text-slate-900">{data?.branding?.infoEmail || data?.branding?.supportEmail || data?.branding?.salesEmail}</a>}{data?.branding?.phone && <a href={`tel:${data?.branding?.phone}`} className="hover:text-slate-900">{data?.branding?.phone}</a>}</div></div>
            <div className="flex flex-col gap-2 text-sm text-slate-500"><Link href="/terms" className="hover:text-slate-700">Terms</Link><Link href="/privacy" className="hover:text-slate-700">Privacy</Link><Link href="/auth/signin" className="hover:text-slate-700">Sign In</Link></div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-slate-400 text-xs">© {new Date().getFullYear()} {data?.branding?.companyName || 'Your Company'}</span>
            <span className="text-slate-400 text-xs">Powered by <Link href="https://stoklync.com" className="text-slate-500 hover:underline">Stoklync</Link></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
