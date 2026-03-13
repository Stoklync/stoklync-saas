'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setError('Auth not configured');
      return;
    }
    const run = async () => {
      if (!supabase) return;
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (session) {
        router.replace('/dashboard');
        return;
      }
      router.replace('/auth/signin');
    };
    run();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <a href="/auth/signin" className="text-emerald-400 hover:text-emerald-300 text-sm">
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-emerald-500" size={32} />
      <p className="text-slate-400 text-sm mt-4">Completing sign in...</p>
    </div>
  );
}
