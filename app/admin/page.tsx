'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Admin() {
  const [customerPhone, setCustomerPhone] = useState('');
  const [stampCount, setStampCount] = useState(1);
  const [billAmount, setBillAmount] = useState<string>('60');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);
  const [stampedHistory, setStampedHistory] = useState<Record<string, number>>({});

  const COOLDOWN_MS = 10 * 60 * 1000;
  const MIN_SPEND_RS = 50;

  const handleIssueStamp = (e: React.FormEvent, force = false) => {
    e.preventDefault();
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const amount = parseFloat(billAmount);

    if (cleanPhone.length >= 10) {
      // Validate minimum 50 Rs spend rule
      if ((isNaN(amount) || amount < MIN_SPEND_RS) && !force) {
        setMessage({
          type: 'warning',
          text: `⚠️ Minimum Spend Rule: Customer bill is ₹${isNaN(amount) ? 0 : amount}. A minimum order of ₹50 is required to earn a stamp (Short by ₹${(MIN_SPEND_RS - (amount || 0)).toFixed(0)}).`,
        });
        return;
      }

      // Check 10-minute cooldown rule
      const lastStamp = stampedHistory[cleanPhone];
      if (lastStamp && !force) {
        const elapsed = Date.now() - lastStamp;
        if (elapsed < COOLDOWN_MS) {
          const remainingMins = Math.ceil((COOLDOWN_MS - elapsed) / 60000);
          setMessage({
            type: 'warning',
            text: `⏳ 10-Minute Rule Alert: +91 ${cleanPhone} received a stamp ${Math.floor(elapsed / 60000)}m ago. Customer must wait ${remainingMins} more minute(s) and re-open their pass.`,
          });
          return;
        }
      }

      setStampedHistory((prev) => ({ ...prev, [cleanPhone]: Date.now() }));

      if (stampCount >= 3) {
        setMessage({
          type: 'success',
          text: `🎉 Bill ₹${amount}: All 3 Bhar stamps awarded to +91 ${cleanPhone}! Free chai reward unlocked & card automatically reset for their next visits.`,
        });
      } else {
        setMessage({
          type: 'success',
          text: `✓ Bill ₹${amount} (Qualified): Awarded ${stampCount} Bhar stamp(s) to +91 ${cleanPhone}! 10-minute cooldown started on their pass.`,
        });
      }
      setCustomerPhone('');
      setTimeout(() => setMessage(null), 6000);
    }
  };

  return (
    <main className="main-section">
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#1c202d', border: '1px solid var(--border-highlight)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src="/logo.png"
              alt="BHAAR MOSHAI Logo"
              width={34}
              height={34}
            />
          </div>
          <div>
            <span className="section-label" style={{ margin: 0 }}>COUNTER DESK & PORTAL</span>
            <h1 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>
              BHAAR MOSHAI Barista Console
            </h1>
          </div>
        </div>
        <p className="section-desc" style={{ margin: '8px 0 0' }}>
          Real-time counter management for issuing earthen-cup stamps, validating customer passes, and redeeming tea rewards.
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="feature-grid" style={{ marginBottom: '32px' }}>
        <div className="feature-card" style={{ padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>TODAY&apos;S BHAR CUPS</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: '6px 0' }}>
            184 <span style={{ fontSize: '1.1rem', color: '#f59e0b' }}>🍵</span>
          </div>
          <div style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>
            +22% higher than yesterday
          </div>
        </div>

        <div className="feature-card" style={{ padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>ACTIVE ADDA MEMBERS</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: '6px 0' }}>
            312 <span style={{ fontSize: '1.1rem', color: '#38bdf8' }}>👥</span>
          </div>
          <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>
            14 new registrations today
          </div>
        </div>

        <div className="feature-card" style={{ padding: '24px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>REWARDS REDEEMED</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: '6px 0' }}>
            28 <span style={{ fontSize: '1.1rem', color: '#e26a38' }}>🎁</span>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600 }}>
            22 Free Bhars, 6 Singaras
          </div>
        </div>
      </div>

      {/* ACTION PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        {/* COUNTER STAMP ISSUER */}
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#ffffff' }}>Issue Stamp at Counter</h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>For walk-in customers placing an order</span>
            </div>
          </div>

          {message && (
            <div
              style={{
                background: message.type === 'warning' ? 'rgba(234, 88, 12, 0.16)' : 'rgba(74, 222, 128, 0.15)',
                border: message.type === 'warning' ? '1px solid #ea580c' : '1px solid #4ade80',
                color: message.type === 'warning' ? '#fdba74' : '#4ade80',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span>{message.text}</span>
              {message.type === 'warning' && (
                <button
                  type="button"
                  onClick={(e) => handleIssueStamp(e, true)}
                  style={{
                    background: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Manager Override ⚡
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleIssueStamp}>
            <label className="form-label" htmlFor="adminCustomerPhone">
              Customer Mobile Number
            </label>
            <input
              id="adminCustomerPhone"
              className="input"
              type="tel"
              placeholder="e.g. 9830012345"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" htmlFor="adminBillAmount" style={{ margin: 0 }}>
                  Order Bill Amount (₹) *
                </label>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: parseFloat(billAmount) >= 50 ? '#4ade80' : '#ea580c',
                  background: parseFloat(billAmount) >= 50 ? 'rgba(74, 222, 128, 0.12)' : 'rgba(234, 88, 12, 0.12)',
                  border: parseFloat(billAmount) >= 50 ? '1px solid #4ade80' : '1px solid #ea580c',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}>
                  {parseFloat(billAmount) >= 50
                    ? '✓ Qualifies for Stamp (₹50+)'
                    : `⚠️ Min ₹50 required (Short by ₹${(50 - (parseFloat(billAmount) || 0)).toFixed(0)})`}
                </span>
              </div>
              <input
                id="adminBillAmount"
                className="input"
                type="number"
                min={0}
                placeholder="Enter bill amount in ₹"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                required
                style={{ marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {['50', '80', '120', '200'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBillAmount(preset)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: billAmount === preset ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: billAmount === preset ? '#fbbf24' : '#94a3b8',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>

            <label className="form-label">
              Stamps to Award
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setStampCount(num)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    border: stampCount === num ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                    background: stampCount === num ? 'rgba(245,158,11,0.2)' : 'rgba(12,14,18,0.5)',
                    color: stampCount === num ? '#fbbf24' : '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  +{num} {num === 1 ? 'Bhar' : 'Bhars'}
                </button>
              ))}
            </div>

            <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
              Confirm & Stamp Pass 🍵
            </button>
          </form>
        </div>

        {/* RECENT COUNTER ACTIVITY */}
        <div className="panel">
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 16px', color: '#ffffff' }}>
            Live Adda Feed
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '0.88rem' }}>Subhasis (+91 98301-XXXXX)</strong>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Ordered 2x Special Kesar Malai Bhar</div>
              </div>
              <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>+2 Stamps</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '0.88rem' }}>Priyanka (+91 97482-XXXXX)</strong>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Redeemed 3rd Visit Free Chai · Card Auto-reset</div>
              </div>
              <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 700 }}>REDEEMED & RESET</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '0.88rem' }}>Rohan (+91 90518-XXXXX)</strong>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>New Club Activation</div>
              </div>
              <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700 }}>NEW PASS</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
