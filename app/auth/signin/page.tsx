'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, User, Mail } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    setGoogleLoading(true);
    setError('');
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl || window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (oauthError) throw oauthError;
      // Redirect handled by Supabase
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { error: magicError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${(process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '')}/auth/callback` },
      });
      if (magicError) throw magicError;
      setMessage('Check your email. We sent a magic sign-in link!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not send link.');
    } finally {
      setLoading(false);
    }
  };

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
        if (!name.trim() || !company.trim()) { setError('Name and company are required.'); setLoading(false); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { name: name.trim(), company: company.trim() } },
        });
        if (signUpError) throw signUpError;
        setMessage('Check your email to confirm, then sign in.');
        setMode('signin');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
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
          {/* Header */}
          <div className="text-center mb-6">
            <Link href="/" className="text-lg font-bold text-slate-100 hover:text-emerald-400 transition-colors">
              Stoklync
            </Link>
            <h1 className="text-xl font-bold text-slate-100 mt-4">
              {mode === 'signin' && 'Sign in to your workspace'}
              {mode === 'signup' && 'Create your free account'}
              {mode === 'forgot' && 'Reset your password'}
              {mode === 'magic' && 'Sign in with magic link'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {mode === 'signin' && 'Welcome back. Pick your sign-in method'}
              {mode === 'signup' && '14-day free trial · No credit card required'}
              {mode === 'forgot' && "We'll send a reset link to your email"}
              {mode === 'magic' && "One click and you're in. No password needed"}
            </p>
          </div>

          {/* Social sign-in — shown for signin and signup */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="space-y-3 mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-300 transition-colors disabled:opacity-60"
              >
                {googleLoading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
                {googleLoading ? 'Connecting...' : `${mode === 'signup' ? 'Sign up' : 'Sign in'} with Google`}
              </button>
              <button
                type="button"
                onClick={() => { setMode('magic'); setError(''); setMessage(''); }}
                className="w-full flex items-center justify-center gap-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <Mail size={18} />
                {mode === 'signup' ? 'Sign up' : 'Sign in'} with magic link
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-xs text-slate-500 font-medium">or use email & password</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>
            </div>
          )}

          {/* Magic link form */}
          {mode === 'magic' && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className={labelCls}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" className={inputCls} required autoFocus />
              </div>
              {error && <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
              {message && <p className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg">{message}</p>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 text-slate-950 font-semibold rounded-xl hover:bg-emerald-400 disabled:opacity-70 flex items-center justify-center gap-2 transition-colors">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
              <button type="button" onClick={() => { setMode('signin'); setError(''); setMessage(''); }} className="w-full text-sm text-slate-400 hover:text-emerald-400 transition-colors py-2">← Back to all sign-in options</button>
            </form>
          )}

          {/* Email/password form */}
          {mode !== 'magic' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className={labelCls}>Full name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Company name</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your business name" className={inputCls} required />
                  </div>
                </>
              )}
              <div>
                <label className={labelCls}>Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={inputCls} required />
              </div>
              {mode !== 'forgot' && (
                <>
                  <div>
                    <label className={labelCls}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} required minLength={6} />
                  </div>
                  {mode === 'signup' && (
                    <div>
                      <label className={labelCls}>Confirm password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputCls} required minLength={6} />
                    </div>
                  )}
                </>
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
              {mode === 'forgot' && (
                <button type="button" onClick={() => { setMode('signin'); setError(''); setMessage(''); }} className="w-full text-sm text-slate-400 hover:text-emerald-400 transition-colors py-2">← Back to sign in</button>
              )}
            </form>
          )}

          {/* Footer toggle */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="mt-6 text-center border-t border-slate-800 pt-4">
              <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage(''); setConfirmPassword(''); }} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                {mode === 'signin' ? "Don't have an account? Sign up free →" : 'Already have an account? Sign in'}
              </button>
            </div>
          )}
        </div>

        {/* Trust badges */}
        {mode === 'signup' && (
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">✓ Free 14-day trial</span>
            <span className="flex items-center gap-1">✓ No credit card needed</span>
            <span className="flex items-center gap-1">✓ Cancel anytime</span>
          </div>
        )}
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
