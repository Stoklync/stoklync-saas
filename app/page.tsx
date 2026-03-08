'use client';

import Link from 'next/link';
import { Globe, Users, Mail, LifeBuoy, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">Stoklync</span>
          <Link
            href="/auth/signin"
            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4">
            For consultants & service businesses
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Run your business online
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Website, CRM, marketing, support. One place. Built for how you work.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors"
          >
            Get started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-100 mb-12 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <Globe size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">1. Create your site</h3>
              <p className="text-sm text-slate-400">Brand it, add your content, go live.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <Users size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">2. Get leads in CRM</h3>
              <p className="text-sm text-slate-400">Pipeline, notes, follow-ups.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <Mail size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">3. Send emails</h3>
              <p className="text-sm text-slate-400">Bulk outreach to your leads.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <LifeBuoy size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">4. Handle support</h3>
              <p className="text-sm text-slate-400">Tickets, replies, done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-400 mb-8">
            Create your account. Set up in minutes.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors"
          >
            Sign in or create account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Stoklync</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
