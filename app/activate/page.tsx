'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Activate() {
  const memberName = 'Valued Guest';
  const memberContact = 'Linked to Account';
  const memberPassId = `BM-2026-0000`;

  return (
    <main className="main-section animate-fade-up" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="panel form" style={{ width: '100%', maxWidth: '520px', textAlign: 'center', position: 'relative' }}>
        <div style={{ width: '68px', height: '68px', margin: '0 auto 16px', borderRadius: '20px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
          <Image src="/logo.png" alt="BHAAR MOSHAI Logo" width={54} height={54} />
        </div>

        <span className="section-label">BHAAR MOSHAI TEA CLUB</span>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 600, margin: '6px 0 10px', color: 'var(--text-primary)' }}>
          Digital Card Activated! 🎉
        </h1>
        <p className="muted" style={{ fontSize: '0.92rem', marginBottom: '24px' }}>
          অভিনন্দন! Your BHAAR MOSHAI digital loyalty pass is active and connected to your account.
        </p>

        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: '20px', padding: '22px', marginBottom: '26px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ color: 'var(--accent-terracotta)', fontWeight: 600, fontSize: '1.15rem' }}>{memberName}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>{memberContact}</div>
            </div>
            <span style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)', color: '#4ade80', fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
              ● ACTIVE PASS
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-base)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Member Pass ID:</span>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--accent-terracotta)', letterSpacing: '0.05em' }}>{memberPassId}</span>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#4ade80', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎁</span>
            <span>Welcome Gift: 1 Complimentary Biscuit with your next Bhar!</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link className="btn btn-primary" href="/loyalty" style={{ justifyContent: 'center' }}>
            Open My Loyalty Card 🍵
          </Link>
          <Link className="btn btn-secondary" href="/offers" style={{ justifyContent: 'center' }}>
            Explore Adda Offers ✨
          </Link>
        </div>
      </div>
    </main>
  );
}
