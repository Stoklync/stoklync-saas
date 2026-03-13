'use client';

import Link from 'next/link';
import {
  Globe, Users, Package, Truck, BarChart3, ShoppingCart,
  ArrowRight, CheckCircle2, Zap, Star, Shield, MessageCircle,
  Layers, Receipt, TrendingUp, Sparkles, ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Your Own Branded Marketplace',
    desc: 'Launch a professional B2B storefront with your logo, colors, and domain. Customers shop, compare, and order — all under your brand.',
  },
  {
    icon: Package,
    title: 'Product Catalog + Bulk Pricing',
    desc: 'Upload products, set tiered wholesale prices, manage stock, and showcase deals. No coding required.',
  },
  {
    icon: ShoppingCart,
    title: 'Online Ordering & Checkout',
    desc: 'Customers order anytime — pay by card or request Net Terms. Orders land straight into your dashboard.',
  },
  {
    icon: Users,
    title: 'Customer Portal',
    desc: 'Each customer gets their own portal: order history, invoices, quote requests, and standing orders (Never Run Out).',
  },
  {
    icon: Truck,
    title: 'Delivery & Logistics',
    desc: 'Dispatch drivers, track shipments, update statuses, and notify customers via WhatsApp — all from one screen.',
  },
  {
    icon: BarChart3,
    title: 'Full Operations Dashboard',
    desc: 'Your Trade OS — KPIs, order pipeline, CRM, inventory, promotions, audit logs, and team management in one place.',
  },
];

const steps = [
  { num: '01', title: 'Set up your store', desc: 'Add your branding, upload products, and configure pricing tiers.' },
  { num: '02', title: 'Invite customers', desc: 'Share your marketplace link. Customers sign up, browse, and order online.' },
  { num: '03', title: 'Manage everything', desc: 'Process orders, dispatch deliveries, handle quotes — from your dashboard.' },
  { num: '04', title: 'Grow with data', desc: 'Track revenue, monitor stock, identify trends, and run targeted promotions.' },
];

const planFeatures = [
  'Branded B2B marketplace',
  'Product catalog (unlimited SKUs)',
  'Bulk pricing tiers',
  'Customer portal & accounts',
  'Order management pipeline',
  'Quote / RFQ system',
  'Delivery dispatch & tracking',
  'Promotions & ad banners',
  'CRM + lead management',
  'Team roles & permissions',
  'WhatsApp notifications',
  'Audit logs & reporting',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Layers size={14} className="text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight">STOKLYNC</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#features" className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition-colors">How it works</Link>
            <Link href="#pricing" className="hidden sm:block text-sm text-slate-400 hover:text-slate-200 transition-colors">Pricing</Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition-colors"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-[#163A63]/30 blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={12} />
            B2B Wholesale Marketplace Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Sell Wholesale.
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Run Everything.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Launch your own branded B2B marketplace, manage orders and deliveries,
            and grow your wholesale business — all from one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all hover:scale-[1.02] text-sm"
            >
              Start Your Store <ArrowRight size={16} />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 transition-colors text-sm border border-slate-700"
            >
              See How It Works <ChevronRight size={16} />
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            {['No code needed', 'Set up in under 2 hours', 'Works on any device', 'WhatsApp & email built in'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="py-12 px-6 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '37+', label: 'SKUs managed per store' },
            { value: '100%', label: 'Branded — your logo' },
            { value: '24/7', label: 'Online ordering' },
            { value: 'JMD', label: 'Local currency native' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black text-emerald-400 mb-1">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
              One platform. Complete wholesale operations.
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              From storefront to delivery, STOKLYNC covers every part of running a wholesale business online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-4 group-hover:bg-emerald-500/25 transition-colors">
                  <f.icon size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-slate-100 mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Simple Setup</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Live in a day. Selling by the week.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%+12px)] w-6 text-slate-700">
                    <ArrowRight size={16} />
                  </div>
                )}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 h-full">
                  <div className="text-4xl font-black text-slate-800 mb-3 font-mono">{s.num}</div>
                  <h3 className="font-bold text-slate-100 mb-2 text-sm">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built for Jamaica ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#163A63] to-[#0F2847] border border-[#1e4a7a] p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🇯🇲</span>
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Built for Jamaica & the Caribbean</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  Wholesale the way Jamaica does business
                </h2>
                <p className="text-blue-200 text-sm leading-relaxed mb-6">
                  JMD pricing, Net Terms payments, WhatsApp customer communication, local delivery dispatch,
                  and GCT-ready invoicing — everything your buyers and team already expect.
                </p>
                <Link href="/auth/signin" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors">
                  Get Started <ArrowRight size={15} />
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Receipt, text: 'JMD & multi-currency pricing with GCT calculations' },
                  { icon: MessageCircle, text: 'WhatsApp order alerts and delivery notifications' },
                  { icon: Truck, text: 'Local driver dispatch with real-time status updates' },
                  { icon: TrendingUp, text: 'Net Terms (30/60/90 day) and card payment options' },
                  { icon: Shield, text: 'Secure customer accounts with order history' },
                ].map(item => (
                  <div key={item.text} className="flex items-start gap-3 text-sm text-blue-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={13} className="text-emerald-400" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Simple, transparent pricing</h2>
            <p className="text-slate-400 mt-4 text-sm">Everything included. No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 mb-1">Starter</h3>
              <p className="text-xs text-slate-500 mb-5">For businesses just going digital</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-white">Free</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {planFeatures.slice(0, 6).map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signin" className="block w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold text-center transition-colors border border-slate-700">
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-emerald-900/40 to-slate-900/80 border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-full">Popular</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">Pro</h3>
              <p className="text-xs text-slate-400 mb-5">Full platform, full power</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-white">$49</span>
                <span className="text-slate-400 text-sm mb-1">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {planFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signin" className="block w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold text-center transition-colors">
                Start Pro trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial / Social proof ────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-lg md:text-xl text-slate-300 italic leading-relaxed mb-5">
            &ldquo;Finally, a platform that understands how we sell. Our customers order online now — it&apos;s saved us hours of phone calls every week.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">S</div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-200">Sarah Mitchell</p>
              <p className="text-xs text-slate-500">Founder, STOKLYNC Jamaica</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
            <Zap size={24} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            Ready to sell wholesale online?
          </h2>
          <p className="text-slate-400 mb-10 text-sm leading-relaxed max-w-xl mx-auto">
            Join wholesale businesses across Jamaica using STOKLYNC to manage their entire operation — from first browse to last-mile delivery.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all hover:scale-[1.02] text-sm"
          >
            Launch Your Marketplace <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-slate-600 mt-5">No credit card required for Starter plan</p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/50 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                  <Layers size={12} className="text-slate-950" />
                </div>
                <span className="font-bold text-slate-200">STOKLYNC</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                The B2B wholesale marketplace platform for businesses in Jamaica and the Caribbean.
              </p>
            </div>
            <div className="flex gap-12 text-sm text-slate-500">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Platform</p>
                <Link href="#features" className="block hover:text-slate-300 transition-colors">Features</Link>
                <Link href="#how-it-works" className="block hover:text-slate-300 transition-colors">How it works</Link>
                <Link href="#pricing" className="block hover:text-slate-300 transition-colors">Pricing</Link>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Company</p>
                <Link href="/terms" className="block hover:text-slate-300 transition-colors">Terms</Link>
                <Link href="/privacy" className="block hover:text-slate-300 transition-colors">Privacy</Link>
                <Link href="/auth/signin" className="block hover:text-slate-300 transition-colors">Sign In</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} STOKLYNC. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Built for wholesale businesses in Jamaica
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
