'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { FirebaseError } from 'firebase/app';

export default function SignUpPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, displayName);
      router.push('/activate');
    } catch (err) {
      console.error("Firebase Sign Up Error:", err);
      setError(err instanceof FirebaseError ? friendlyError(err.code) : `Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/activate');
    } catch (err) {
      console.error("Firebase Google Sign Up Error:", err);
      setError(err instanceof FirebaseError ? friendlyError(err.code) : 'Google sign up failed.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="main-section" style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: '58px', height: '58px', margin: '0 auto 12px', borderRadius: '16px', background: '#1c202d', border: '1px solid var(--border-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}>
          <Image src="/logo.png" alt="BHAAR MOSHAI Logo" width={46} height={46} />
        </div>
        <span className="section-label">BHAAR MOSHAI TEA CLUB</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0', color: '#ffffff' }}>
          Join the Club &amp; Activate Pass
        </h1>
        <p className="muted" style={{ fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto' }}>
          Create your account to activate your 3-stamp digital loyalty card and start earning royal treats.
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="panel" style={{ padding: '28px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label htmlFor="displayName" style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>Full Name</label>
              <input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Subhasis Das" disabled={loading} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(12,14,18,0.85)', border: '1px solid rgba(245,158,11,0.28)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required disabled={loading} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(12,14,18,0.85)', border: '1px solid rgba(245,158,11,0.28)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>Password (min 6 chars)</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(12,14,18,0.85)', border: '1px solid rgba(245,158,11,0.28)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.92rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, marginTop: '4px' }}>
              {loading ? 'Creating Account...' : 'Join Club & Activate Card 🎉'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ padding: '0 10px', fontSize: '0.8rem', color: '#94a3b8' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          <button onClick={handleGoogleSignUp} type="button" disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '11px', borderRadius: '10px', background: '#fff', color: '#0f172a', border: 'none', fontSize: '0.92rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>


          <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.84rem', color: '#94a3b8' }}>
            Already a member?{' '}
            <a href="/sign-in" style={{ color: '#fbbf24', fontWeight: 700, textDecoration: 'none' }}>Sign In 🍵</a>
          </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/" style={{ color: '#94a3b8', fontSize: '0.84rem', textDecoration: 'none' }}>← Back to BHAAR MOSHAI Home</a>
        </div>
      </div>
    </main>
  );
}

function friendlyError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/weak-password': return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/popup-closed-by-user': return 'Google sign-up was cancelled.';
    case 'auth/unauthorized-domain': return 'This domain is not authorized for Google sign-in. Please contact support.';
    case 'auth/operation-not-allowed': return 'Google sign-in is not enabled. Please contact support.';
    case 'auth/network-request-failed': return 'Network error. Please check your connection and try again.';
    default: return `Sign up failed. (${code})`;
  }
}
