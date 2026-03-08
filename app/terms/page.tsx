'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Terms of Service</h1>
        <div className="prose prose-slate text-sm text-slate-600 space-y-4">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>By using this platform and services, you agree to these terms. Please read them carefully.</p>
          <h2 className="text-lg font-semibold text-slate-800 mt-6">Services</h2>
          <p>Stoklync provides business tools including websites, CRM, and support. Your use is subject to these terms unless otherwise agreed in writing.</p>
          <h2 className="text-lg font-semibold text-slate-800 mt-6">Use of our site</h2>
          <p>You agree to use the platform only for lawful purposes and not to misuse or attempt to compromise our systems or data.</p>
          <h2 className="text-lg font-semibold text-slate-800 mt-6">Contact</h2>
          <p>For questions about these terms, contact us through the contact details on our website.</p>
        </div>
      </div>
    </div>
  );
}
