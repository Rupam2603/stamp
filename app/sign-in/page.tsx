'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { FirebaseError } from 'firebase/app';

export default function SignInPage() {
  const { signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/activate');
    } catch (err) {
      setError(err instanceof FirebaseError ? friendlyError(err.code) : 'Sign in failed. Please try again.');
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
          Sign In to Your Digital Pass
        </h1>
        <p className="muted" style={{ fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto' }}>
          Access your digital stamp progress, active rewards, and member benefits.
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="panel" style={{ padding: '28px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required disabled={loading} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(12,14,18,0.85)', border: '1px solid rgba(245,158,11,0.28)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(12,14,18,0.85)', border: '1px solid rgba(245,158,11,0.28)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.92rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1 }}>
              {loading ? 'Signing In...' : 'Sign In to My Card 🍵'}
            </button>
          </form>

          <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.84rem', color: '#94a3b8' }}>
            New to BHAAR MOSHAI?{' '}
            <a href="/sign-up" style={{ color: '#fbbf24', fontWeight: 700, textDecoration: 'none' }}>Join the Club ✨</a>
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
    case 'auth/user-not-found':
    case 'auth/invalid-credential': return 'No account found. Please check your email & password.';
    case 'auth/wrong-password': return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.';
    case 'auth/unauthorized-domain': return 'This domain is not authorized for Google sign-in. Please contact support.';
    case 'auth/operation-not-allowed': return 'Google sign-in is not enabled. Please contact support.';
    case 'auth/network-request-failed': return 'Network error. Please check your connection and try again.';
    default: return 'Sign in failed. Please check your details and try again.';
  }
}
