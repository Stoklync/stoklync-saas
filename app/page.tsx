'use client';

import Link from 'next/link';
import {
  Globe, Users, Mail, LifeBuoy, ArrowRight, CheckCircle2,
  Sparkles, ChevronRight, Layers, BarChart3, Megaphone,
  Star, Zap, Shield, MessageCircle,
} from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Your Own Website',
    desc: 'Build a professional website in minutes — add sections, upload photos, and go live under your own brand.',
  },
  {
    icon: Users,
    title: 'CRM & Lead Management',
    desc: 'Track every lead, add notes, set follow-ups, and move deals through your pipeline effortlessly.',
  },
  {
    icon: Megaphone,
    title: 'Marketing & Outreach',
    desc: 'Send bulk emails, run campaigns, and reach your customers at the right time.',
  },
  {
    icon: LifeBuoy,
    title: 'Customer Support',
    desc: 'Manage support tickets, reply to customers, and track every issue until it\'s resolved.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Insights',
    desc: 'See what\'s working — leads, conversions, traffic, and revenue — all in one dashboard.',
  },
  {
    icon: MessageCircle,
    title: 'Contact Forms & Enquiries',
    desc: 'Every enquiry from your website lands directly in your inbox and CRM automatically.',
  },
];

const planFeatures = [
  'Branded website with custom sections',
  'Photo gallery & content blocks',
  'Contact forms + auto CRM capture',
  'Lead pipeline & notes',
  'Bulk email campaigns',
  'Support ticket management',
  'Reports & analytics',
  'Custom domain support',
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-emerald-500/8 blur-[120px]" />
          <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-[#163A63]/25 blur-[90px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles size={12} />
            Solutions for Your Business
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5 leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              to Succeed.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-4 max-w-2xl mx-auto leading-relaxed">
            Run your business online. Website, CRM, marketing, and support — one place, built for how you work.
          </p>
          <p className="text-sm text-slate-500 mb-10 max-w-xl mx-auto">
            We provide the tools and support to help your business thrive.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all hover:scale-[1.02] text-sm"
            >
              Start for free <ArrowRight size={16} />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 transition-colors text-sm border border-slate-700"
            >
              See features <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            {['No code needed', 'Set up in minutes', 'Works on any device', 'Support included'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Built for Business</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
              One platform. Your whole business.
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Website, CRM, email marketing, and customer support — everything connected, everything in one dashboard.
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

      {/* ── Trust / Benefits ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#163A63] to-[#0F2847] border border-[#1e4a7a] p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  Everything your business needs, right out of the box
                </h2>
                <p className="text-blue-200 text-sm leading-relaxed mb-6">
                  Stop juggling five different tools. STOKLYNC brings your website, leads, emails, and support into one clean platform — so you can focus on growing your business.
                </p>
                <Link href="/auth/signin" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors">
                  Start for free <ArrowRight size={15} />
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Globe,     text: 'Build and publish your website without writing code' },
                  { icon: Users,     text: 'Never lose track of a lead or follow-up again' },
                  { icon: Mail,      text: 'Reach your whole customer list with one click' },
                  { icon: LifeBuoy,  text: 'Resolve support tickets fast and keep customers happy' },
                  { icon: Shield,    text: 'Your data is secure, backed up, and always yours' },
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

      {/* ── Start for free ───────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Get Started</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Start for free</h2>
          <p className="text-slate-400 text-sm mb-8">Everything included. No credit card required. Set up in minutes.</p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 text-sm text-slate-400">
            {planFeatures.slice(0, 6).map(f => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all hover:scale-[1.02] text-sm"
          >
            Start for free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-lg md:text-xl text-slate-300 italic leading-relaxed mb-5">
            &ldquo;This is the easiest platform I&apos;ve used. My website was live the same day and I had my first enquiry within a week.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">M</div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-200">Michelle Clarke</p>
              <p className="text-xs text-slate-500">Small Business Owner, Kingston</p>
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
            Ready to grow your business?
          </h2>
          <p className="text-slate-400 mb-10 text-sm leading-relaxed max-w-xl mx-auto">
            Join businesses already using STOKLYNC to run their website, manage their leads, and serve their customers — all in one place.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all hover:scale-[1.02] text-sm"
          >
            Start for free <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-slate-600 mt-5">No credit card required</p>
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
                The all-in-one business platform. Website, CRM, marketing, and support — built for you.
              </p>
            </div>
            <div className="flex gap-12 text-sm text-slate-500">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Platform</p>
                <Link href="#features" className="block hover:text-slate-300 transition-colors">Features</Link>
                <Link href="#pricing" className="block hover:text-slate-300 transition-colors">Get Started</Link>
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
              Built for growing businesses
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
