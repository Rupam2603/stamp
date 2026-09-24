'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Verify() {
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length >= 4) {
      setVerified(true);
    }
  };

  return (
    <main className="main-section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="panel form" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', margin: '0 auto 16px', borderRadius: '16px', background: '#1c202d', border: '1px solid var(--border-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}>
          <Image
            src="/logo.png"
            alt="BHAAR MOSHAI Logo"
            width={48}
            height={48}
          />
        </div>

        <span className="section-label">MOBILE PASS VERIFICATION</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '6px 0 10px', color: '#ffffff' }}>
          {verified ? 'Pass Verified!' : 'Verify Mobile Pass'}
        </h1>
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
          {verified
            ? 'Your mobile number is securely authenticated with BHAAR MOSHAI.'
            : 'Enter the 4-digit code sent to your phone to access your digital card.'}
        </p>

        {!verified ? (
          <form onSubmit={handleVerify}>
            <input
              className="input"
              inputMode="numeric"
              maxLength={4}
              placeholder="e.g. 1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ fontSize: '1.4rem', letterSpacing: '0.3em', textAlign: 'center', marginBottom: '12px' }}
            />
            <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '20px' }}>
              Tip: Enter any 4-digit code (e.g. 1234) for quick demo verification.
            </p>
            <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
              Verify & Open Pass →
            </button>
          </form>
        ) : (
          <div>
            <div style={{ fontSize: '2.5rem', margin: '10px 0' }}>✅🍵</div>
            <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '1rem', marginBottom: '20px' }}>
              Authentication successful!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link className="btn-primary" href="/loyalty" style={{ justifyContent: 'center' }}>
                Go to My Loyalty Card
              </Link>
              <Link className="btn-secondary" href="/" style={{ justifyContent: 'center' }}>
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
