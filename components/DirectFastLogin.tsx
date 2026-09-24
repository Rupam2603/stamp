'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';

interface DirectFastLoginProps {
  redirectUrl?: string;
}

export default function DirectFastLogin({ redirectUrl = '/activate' }: DirectFastLoginProps) {
  const { signIn } = useSignIn();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered email address or username.');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // 1. Request direct login token from our backend API
      const res = await fetch('/api/auth/direct-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to authenticate. Please check your email or username.');
        setLoading(false);
        return;
      }

      setSuccessMessage(`Welcome back, ${data.user.name || 'Member'}! Connecting your session directly...`);

      // 2. Direct authentication using Clerk Core 3 ticket strategy
      if (signIn?.ticket) {
        try {
          const { error: ticketError } = await signIn.ticket({
            ticket: data.token,
          });

          if (!ticketError) {
            window.location.href = redirectUrl;
            return;
          }
          console.warn('Direct ticket error, falling back to secure URL:', ticketError);
        } catch (tErr) {
          console.warn('Ticket execution error:', tErr);
        }
      }

      // 3. Fallback: direct navigation to the Clerk session URL with redirect
      const finalRedirect = `${window.location.origin}${redirectUrl}`;
      window.location.href = `${data.url}&after_sign_in_url=${encodeURIComponent(finalRedirect)}`;
    } catch (err: any) {
      console.error('Direct login error:', err);
      setError(err.message || 'An error occurred during direct login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 83, 41, 0.06) 100%)',
        border: '1px solid var(--border-highlight)',
        borderRadius: '18px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#fbbf24', letterSpacing: '0.02em' }}>
            Instant Direct Login
          </span>
        </div>
        <span
          style={{
            background: 'rgba(74, 222, 128, 0.15)',
            border: '1px solid rgba(74, 222, 128, 0.4)',
            color: '#4ade80',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
            letterSpacing: '0.04em',
          }}
        >
          NO EMAIL LINK NEEDED
        </span>
      </div>

      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.45 }}>
        Existing loyalty members can sign in directly to their digital card without waiting for any verification links.
      </p>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '12px',
          }}
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            background: 'rgba(74, 222, 128, 0.15)',
            border: '1px solid rgba(74, 222, 128, 0.4)',
            color: '#86efac',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '12px',
          }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleDirectLogin}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label
              htmlFor="direct-identifier"
              style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}
            >
              Registered Email or Username
            </label>
            <input
              id="direct-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. jeet80172@gmail.com or rupam2603"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(12, 14, 18, 0.85)',
                border: '1px solid rgba(245, 158, 11, 0.28)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '11px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? 'Authenticating Directly...' : 'Direct Sign In (Instant) ⚡'}
          </button>
        </div>
      </form>
    </div>
  );
}
