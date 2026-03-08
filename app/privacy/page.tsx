'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate text-sm text-slate-600 space-y-4">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>We respect your privacy. This policy explains how we collect, use, and protect your information when you use our platform and services.</p>
          <h2 className="text-lg font-semibold text-slate-800 mt-6">Information we collect</h2>
          <p>We collect information you provide directly, such as when you sign up, submit a contact form, or request support, including name, email, company, and message content.</p>
          <h2 className="text-lg font-semibold text-slate-800 mt-6">How we use it</h2>
          <p>We use your information to respond to inquiries, provide services, and improve our offerings. We do not sell your data to third parties.</p>
          <h2 className="text-lg font-semibold text-slate-800 mt-6">Contact</h2>
          <p>For questions about this policy, contact us through the contact details on our website.</p>
        </div>
      </div>
    </div>
  );
}
