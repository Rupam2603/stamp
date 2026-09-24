'use client';

import { useState, useEffect } from 'react';
import { useUser, SignIn, SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import DirectFastLogin from '@/components/DirectFastLogin';

export default function Activate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  // Detect ?mode=signin from URL if navigated directly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'signin') {
        setAuthMode('signin');
      }
    }
  }, []);

  // Loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <main className="main-section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🍵</div>
          <div>Loading BHAAR MOSHAI Card Activation...</div>
        </div>
      </main>
    );
  }

  // If customer is signed in, show their active card!
  if (isSignedIn && user) {
    const memberName = user.fullName || user.firstName || 'Valued Guest';
    const memberContact = user.primaryPhoneNumber?.phoneNumber || user.primaryEmailAddress?.emailAddress || 'Linked to Account';
    const memberPassId = user.id ? `BM-2026-${user.id.slice(-4).toUpperCase()}` : 'BM-2026-8842';

    return (
      <main className="main-section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="panel form" style={{ width: '100%', maxWidth: '520px', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: '68px', height: '68px', margin: '0 auto 16px', borderRadius: '20px', background: '#1c202d', border: '1px solid var(--border-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
            <Image
              src="/logo.png"
              alt="BHAAR MOSHAI Logo"
              width={54}
              height={54}
            />
          </div>

          <span className="section-label">BHAAR MOSHAI TEA CLUB</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '6px 0 10px', color: '#ffffff' }}>
            Digital Card Activated! 🎉
          </h1>
          <p className="muted" style={{ fontSize: '0.92rem', marginBottom: '24px' }}>
            অভিনন্দন! Your BHAAR MOSHAI digital loyalty pass is active and connected to your account.
          </p>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 83, 41, 0.12) 100%)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '20px',
              padding: '22px',
              marginBottom: '26px',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.15rem' }}>
                  {memberName}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                  {memberContact}
                </div>
              </div>
              <span style={{
                background: 'rgba(74, 222, 128, 0.2)',
                border: '1px solid #4ade80',
                color: '#4ade80',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '999px',
              }}>
                ● ACTIVE PASS
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Member Pass ID:</span>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em' }}>
                {memberPassId}
              </span>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎁</span>
              <span>Welcome Gift: 1 Complimentary Biscuit with your next Bhar!</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link className="btn-primary" href="/loyalty" style={{ justifyContent: 'center' }}>
              Open My Loyalty Card 🍵
            </Link>
            <Link className="btn-secondary" href="/offers" style={{ justifyContent: 'center' }}>
              Explore Adda Offers ✨
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // If customer is NOT signed in (new customer / no account):
  // Directly show the "Join Club" or "Sign In" section!
  return (
    <main className="main-section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="panel" style={{ width: '100%', maxWidth: '480px', position: 'relative', textAlign: 'center' }}>
        {/* Brand header */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 14px', borderRadius: '18px', background: '#1c202c', border: '1px solid var(--border-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
            <Image
              src="/logo.png"
              alt="BHAAR MOSHAI Logo"
              width={52}
              height={52}
            />
          </div>
          <span className="section-label">BHAAR MOSHAI TEA CLUB</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '6px 0', color: '#ffffff' }}>
            {authMode === 'signup' ? 'Join Club & Activate Card' : 'Sign In to Your Card'}
          </h1>
          <p className="muted" style={{ fontSize: '0.9rem', margin: '0 0 18px' }}>
            {authMode === 'signup'
              ? 'New to BHAAR MOSHAI? Create your account below to activate your digital card and unlock free rewards!'
              : 'Already have an account? Sign in to view and collect your loyalty stamps.'}
          </p>

          {/* Toggle between Join Club (Sign Up) and Sign In */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: authMode === 'signup' ? 'var(--gradient-brand)' : 'transparent',
                color: authMode === 'signup' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Join Club (New) ✨
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: authMode === 'signin' ? 'var(--gradient-brand)' : 'transparent',
                color: authMode === 'signin' ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In (Existing) 🍵
            </button>
          </div>
        </div>

        {/* Embedded Clerk Auth Component & Direct Login */}
        <div style={{ width: '100%' }}>
          {authMode === 'signup' ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SignUp routing="hash" fallbackRedirectUrl="/activate" />
            </div>
          ) : (
            <div>
              {/* Direct Fast Login for Existing Customers - Zero Email Links Required */}
              <DirectFastLogin redirectUrl="/activate" />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '18px 0',
                  color: '#94a3b8',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ padding: '0 12px' }}>Or 1-Click Google / Password</span>
                <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SignIn routing="hash" fallbackRedirectUrl="/activate" />
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: '#94a3b8' }}>
          Protected by BHAAR MOSHAI Club Authentication. Instant digital card activation upon joining.
        </div>
      </div>
    </main>
  );
}
