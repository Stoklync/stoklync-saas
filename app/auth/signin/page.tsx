'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, User } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local');
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
      setChecking(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/signin`,
        });
        if (resetError) throw resetError;
        setMessage('Check your email for the reset link.');
        setMode('signin');
        return;
      }
      if (mode === 'signup') {
        if (!name.trim() || !company.trim()) {
          setError('Name and company are required.');
          setLoading(false);
          return;
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim(), company: company.trim() } },
        });
        if (signUpError) throw signUpError;
        setMessage('Check your email to confirm, then sign in.');
        setMode('signin');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        router.replace('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500';
  const labelCls = 'block text-xs font-medium text-slate-400 mb-1.5';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur">
          <div className="text-center mb-8">
            <Link href="/" className="text-lg font-bold text-slate-100 hover:text-emerald-400 transition-colors">
              Stoklync
            </Link>
            <h1 className="text-xl font-bold text-slate-100 mt-6">
              {mode === 'signin' && 'Sign in'}
              {mode === 'signup' && 'Create account'}
              {mode === 'forgot' && 'Reset password'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {mode === 'signin' && 'Welcome back'}
              {mode === 'signup' && 'Start your free account'}
              {mode === 'forgot' && 'We will send you a reset link'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className={labelCls}>Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} required={mode === 'signup'} />
                </div>
                <div>
                  <label className={labelCls}>Company</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company" className={inputCls} required={mode === 'signup'} />
                </div>
              </>
            )}
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={inputCls} required />
            </div>
            {mode !== 'forgot' && (
              <div>
                <label className={labelCls}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} required minLength={6} />
              </div>
            )}
            {mode === 'signin' && (
              <div className="flex justify-end">
                <button type="button" onClick={() => { setMode('forgot'); setError(''); setMessage(''); }} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
            {error && <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
            {message && <p className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg">{message}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 text-slate-950 font-semibold rounded-xl hover:bg-emerald-400 disabled:opacity-70 flex items-center justify-center gap-2 transition-colors">
              {loading ? <Loader2 size={18} className="animate-spin" /> : mode === 'signin' ? <Lock size={18} /> : <User size={18} />}
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage(''); }} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
              {mode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
