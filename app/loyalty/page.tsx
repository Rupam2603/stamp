'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, AlertTriangle, Hourglass, Coffee, PartyPopper, RotateCw, Zap, Trophy, Gift, Lock, Circle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { updateLoyaltyData } from '@/app/actions/loyalty';
import { useRouter } from 'next/navigation';

const COOLDOWN_MINUTES = 10;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000; // 10 minutes = 600,000 ms

const STORAGE_KEYS = {
  STAMPS: 'bhaar_moshai_loyalty_stamps',
  LAST_TIME: 'bhaar_moshai_last_stamp_timestamp',
  COMPLETED: 'bhaar_moshai_completed_cards',
};

export default function Loyalty() {
  const [stamps, setStamps] = useState<number>(0);
  const [completedCards, setCompletedCards] = useState<number>(0);
  const [lastStampTime, setLastStampTime] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isAutoResetting, setIsAutoResetting] = useState<boolean>(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'reward' | 'info' | 'warning'; text: string } | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [user, isLoaded, router]);

  const totalStamps = 3;
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from Firestore or localStorage
  useEffect(() => {
    if (!isLoaded) return;

    const loadData = async () => {
      try {
        let validStamps = 0;
        let validTime: number | null = null;
        let validCards = 0;

        if (user) {
          validStamps = typeof user.stamps === 'number' ? user.stamps : 0;
          validTime = typeof user.lastStampTime === 'number' && user.lastStampTime > 0 ? user.lastStampTime : null;
          validCards = typeof user.completedCards === 'number' ? user.completedCards : 0;
        } else {
          const savedStamps = parseInt(localStorage.getItem(STORAGE_KEYS.STAMPS) || '0', 10);
          const savedTime = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_TIME) || '0', 10);
          const savedCards = parseInt(localStorage.getItem(STORAGE_KEYS.COMPLETED) || '0', 10);

          validStamps = isNaN(savedStamps) ? 0 : Math.min(3, Math.max(0, savedStamps));
          validTime = isNaN(savedTime) || savedTime <= 0 ? null : savedTime;
          validCards = isNaN(savedCards) ? 0 : Math.max(0, savedCards);
        }

        setStamps(validStamps);
        setCompletedCards(validCards);
        setLastStampTime(validTime);

      if (validTime && validStamps > 0 && validStamps < totalStamps) {
        const elapsed = Date.now() - validTime;
        const remaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
        setSecondsRemaining(remaining);

        if (remaining > 0) {
          setNotification({
            type: 'warning',
            text: `⏳ 10-Minute Adda Rule: Please wait a few minutes before collecting your next stamp.`,
          });
        } else {
          setNotification({
            type: 'info',
            text: `✨ Welcome back! 10 minutes have passed since your last cup. Stamp ${validStamps + 1} is now unlocked! (Min ₹50 spend required)`,
          });
        }
      }
      } catch (e) {
        console.error('Error loading loyalty storage', e);
      }
      setHasMounted(true);
    };
    loadData();
  }, [user, isLoaded]);

  // Live countdown timer ticking every 1 second
  useEffect(() => {
    if (!lastStampTime || stamps === 0) {
      setSecondsRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastStampTime;
      const remaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
      setSecondsRemaining(remaining);

      if (remaining === 0) {
        if (stamps === totalStamps) {
          // Time to auto-reset the card!
          const nextCompleted = completedCards + 1;
          setStamps(0);
          setCompletedCards(nextCompleted);
          setLastStampTime(null);
          
          try {
            if (user) {
              updateLoyaltyData(0, nextCompleted, null).catch(console.error);
            }
            localStorage.setItem(STORAGE_KEYS.STAMPS, '0');
            localStorage.removeItem(STORAGE_KEYS.LAST_TIME);
            localStorage.setItem(STORAGE_KEYS.COMPLETED, String(nextCompleted));
          } catch (e) {
            console.error(e);
          }

          setNotification({
            type: 'info',
            text: `↺ Card automatically reset! Ready for Round ${nextCompleted + 1}. Spend min ₹50 on your next 3 orders to earn another free treat!`,
          });
          setTimeout(() => setNotification(null), 5000);
        } else {
          setNotification((prev) => {
            if (prev?.type === 'warning') {
              return {
                type: 'info',
                text: '✨ 10 minutes have passed! Your next stamp is now ready to collect with a ₹50+ order.',
              };
            }
            return prev;
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastStampTime, stamps, completedCards, user]);

  // Clean up auto-reset timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Remove formatTime as timer is hidden
  const formatTime = (totalSecs: number) => {
    return "";
  };

  const isLocked = secondsRemaining > 0 && stamps > 0 && stamps < totalStamps;

  // Stamp collection handler
  const handleAddStamp = () => {
    if (isAutoResetting) return;

    // Check 10-minute cooldown rule
    if (isLocked) {
      setNotification({
        type: 'warning',
        text: `⏳ Cooldown active! Please wait or re-open the website later to collect your next stamp.`,
      });
      return;
    }

    const nextStamp = stamps + 1;
    const now = Date.now();

    if (nextStamp < totalStamps) {
      // Stamp 1 or 2 collected -> lock for 10 minutes!
      setStamps(nextStamp);
      setAnimatingIndex(stamps);
      setTimeout(() => setAnimatingIndex(null), 600);
      setLastStampTime(now);
      setSecondsRemaining(COOLDOWN_MINUTES * 60);

      try {
        if (user) {
          updateLoyaltyData(nextStamp, completedCards, now).catch(console.error);
        }
        localStorage.setItem(STORAGE_KEYS.STAMPS, String(nextStamp));
        localStorage.setItem(STORAGE_KEYS.LAST_TIME, String(now));
      } catch (e) {
        console.error(e);
      }

      setNotification({
        type: 'warning',
        text: `🍵 Qualified! Stamp ${nextStamp} of 3 collected! 10-minute cooldown started. Re-open the website after 10 minutes for Stamp ${nextStamp + 1}!`,
      });
    } else {
      // 3rd stamp collected -> wait 10 mins before new card
      setStamps(3);
      setAnimatingIndex(stamps);
      setTimeout(() => setAnimatingIndex(null), 600);
      setLastStampTime(now);
      setSecondsRemaining(COOLDOWN_MINUTES * 60);
      setIsAutoResetting(false);

      setNotification({
        type: 'reward',
        text: '🎉 Congratulations! Grab Your Offer! New card will be available after 10 minutes.',
      });
      
      try {
        if (user) {
          updateLoyaltyData(3, completedCards, now).catch(console.error);
        }
        localStorage.setItem(STORAGE_KEYS.STAMPS, '3');
        localStorage.setItem(STORAGE_KEYS.LAST_TIME, String(now));
      } catch (e) {
        console.error(e);
      }

      // No auto reset, just wait 10 mins. It will naturally reset when timer expires (handled in useEffect)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    }
  };

  // Demo helper: fast-forward 10 minutes to instantly unlock next stamp
  const handleFastForwardDemo = () => {
    const simulatedPastTime = Date.now() - COOLDOWN_MS - 1000;
    setLastStampTime(simulatedPastTime);
    setSecondsRemaining(0);
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_TIME, String(simulatedPastTime));
    } catch (e) {
      console.error(e);
    }
    setNotification({
      type: 'info',
      text: '⚡ [Demo Mode] Fast-forwarded 10 minutes! You can now collect your next stamp without waiting.',
    });
  };

  // Reset entire card
  const handleManualReset = () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setStamps(0);
    setLastStampTime(null);
    setSecondsRemaining(0);
    setIsAutoResetting(false);
    try {
      if (user) {
        updateLoyaltyData(0, completedCards, null).catch(console.error);
      }
      localStorage.setItem(STORAGE_KEYS.STAMPS, '0');
      localStorage.removeItem(STORAGE_KEYS.LAST_TIME);
    } catch (e) {
      console.error(e);
    }
    setNotification({
      type: 'info',
      text: '↺ Card reset to 0 stamps. Ready to start fresh!',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <main className="main-section" style={{ maxWidth: '860px' }}>
      <div className="section-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span className="section-label" style={{ margin: 0 }}>MY DIGITAL LOYALTY CARD</span>
          <span style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid #f59e0b',
            color: '#fbbf24',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
          }}>
            Min ₹50 Spend / Stamp
          </span>
          <span style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38bdf8',
            color: '#38bdf8',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
          }}>
            10-Min Wait
          </span>
          <span style={{
            background: 'rgba(74, 222, 128, 0.15)',
            border: '1px solid #4ade80',
            color: '#4ade80',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
          }}>
            3 Stamps = Free Bhar
          </span>
        </div>

        <h1 className="section-title">BHAAR MOSHAI Tea Pass</h1>
        <p className="section-desc">
          Every customer collects 3 stamps per card with a <strong>minimum ₹50 order spend</strong> per stamp. After each stamp, wait 10 minutes and re-open the website for the next cup. After 3 stamps, your card automatically resets for your next cycle!
        </p>
      </div>

      {/* NOTIFICATION BANNER */}
      {notification && (
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 18px',
            borderRadius: '16px',
            fontSize: '0.92rem',
            fontWeight: 700,
            background:
              notification.type === 'reward'
                ? 'rgba(245, 158, 11, 0.18)'
                : notification.type === 'warning'
                ? 'rgba(234, 88, 12, 0.16)'
                : 'rgba(56, 189, 248, 0.12)',
            border:
              notification.type === 'reward'
                ? '1px solid #f59e0b'
                : notification.type === 'warning'
                ? '1px solid #ea580c'
                : '1px solid rgba(56, 189, 248, 0.3)',
            color:
              notification.type === 'reward'
                ? '#fbbf24'
                : notification.type === 'warning'
                ? '#fdba74'
                : '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{notification.text}</span>
          </div>

          {isAutoResetting && (
            <span
              style={{
                background: '#f59e0b',
                color: '#000000',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
              }}
            >
              Auto-resetting...
            </span>
          )}
        </div>
      )}



      {/* VIRTUAL MEMBERSHIP CARD */}
      <style>{`
        @keyframes stampDrop {
          0% { transform: scale(3) rotate(-30deg); opacity: 0; }
          40% { transform: scale(0.8) rotate(10deg); opacity: 1; }
          70% { transform: scale(1.1) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .stamp-animate {
          animation: stampDrop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          color: #f59e0b;
        }
      `}</style>
      <div
        style={{
          background: 'linear-gradient(135deg, #242938 0%, #151824 50%, #0f1118 100%)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '28px',
          padding: '34px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px -10px var(--chai-amber-glow)',
          marginBottom: '36px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#1c202d', border: '1px solid var(--border-highlight)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src="/logo.png"
                alt="BHAAR MOSHAI Logo"
                width={42}
                height={42}
              />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>
                BHAAR MOSHAI
              </div>
              <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                ৩-ভাঁড় লয়ালটি পাস · Min ₹50 Spend / Stamp
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {completedCards > 0 && (
              <span style={{
                background: 'rgba(74, 222, 128, 0.16)',
                border: '1px solid #4ade80',
                color: '#4ade80',
                fontSize: '0.82rem',
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Trophy size={16} /> {completedCards} {completedCards === 1 ? 'Card' : 'Cards'} Completed
              </span>
            )}
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--border-highlight)', color: '#fbbf24', fontSize: '0.82rem', fontWeight: 700, padding: '6px 14px', borderRadius: '999px', display: 'inline-block' }}>
              Pass #BM-2026-8842
            </span>
          </div>
        </div>

        {/* STAMP SLOTS */}
        <div style={{ marginBottom: '24px' }}>


          <div className="stamp-grid">
            {Array.from({ length: totalStamps }).map((_, i) => {
              const isStamped = i < stamps;
              const isReward = i === totalStamps - 1;
              const isNextSlotLocked = i === stamps && isLocked;

              return (
                <div
                  key={i}
                  className={`stamp-slot ${isStamped ? 'stamped' : ''} ${isReward ? 'reward-slot' : ''}`}
                  onClick={handleAddStamp}
                  style={{
                    minHeight: '110px',
                    cursor: isAutoResetting || isLocked ? 'not-allowed' : 'pointer',
                    transform: isStamped ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    opacity: isNextSlotLocked ? 0.75 : 1,
                    position: 'relative',
                  }}
                  title={
                    isStamped
                      ? `Stamp ${i + 1} collected!`
                      : isNextSlotLocked
                      ? `Locked: wait 10 minutes`
                      : `Collect stamp ${i + 1} (Min ₹50 spend)`
                  }
                >
                  <span className="stamp-number">
                    {isReward ? 'Grab Your Offer' : `CUP #${i + 1}`}
                  </span>
                  <span className="stamp-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isStamped ? (
                      isReward ? <Gift size={32} className={animatingIndex === i ? 'stamp-animate' : ''} /> : <Coffee size={32} className={animatingIndex === i ? 'stamp-animate' : ''} />
                    ) : isNextSlotLocked ? (
                      <Lock size={32} />
                    ) : (
                      isReward ? <Sparkles size={32} /> : <Circle size={32} />
                    )}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: isStamped ? '#f59e0b' : isNextSlotLocked ? '#ea580c' : '#64748b', fontWeight: 600 }}>
                    {isStamped
                      ? isReward
                        ? 'Grab Your Offer'
                        : 'Stamped'
                      : isNextSlotLocked
                      ? `Locked`
                      : isReward
                      ? '3rd Reward'
                      : 'Min ₹50'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(12, 14, 18, 0.6)', borderRadius: '16px', padding: '14px 20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="interactive-stamp-btn"
              onClick={handleAddStamp}
              disabled={isAutoResetting || isLocked}
              style={{
                opacity: isAutoResetting || isLocked ? 0.65 : 1,
                cursor: isAutoResetting || isLocked ? 'not-allowed' : 'pointer',
              }}
            >
              {isAutoResetting
                ? 'Card Auto-resetting...'
                : isLocked
                ? 'Locked'
                : stamps === 0
                ? 'Collect First Stamp'
                : stamps < totalStamps
                ? `Collect Stamp #${stamps + 1}`
                : '3/3 Collected! Resetting...'}
            </button>



            {stamps > 0 && !isAutoResetting && (
              <button
                type="button"
                onClick={handleManualReset}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#94a3b8',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Reset Card
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 RULES EXPLANATION PANEL */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>📋</span>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              BHAAR MOSHAI 3-Stamp Card Rules
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Minimum spend · 10-minute wait · Automatic card renewal
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>
              1. Spend Min ₹50 per Stamp
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
              Every customer must spend at least ₹50 on tea and snacks per order to qualify for 1 digital loyalty stamp.
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#ea580c', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>
              2. 10-Minute Adda Wait
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
              Card locks for 10 minutes between stamps. Re-open or refresh the website after 10 minutes to stamp your next ₹50+ cup.
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>
              3. 3rd Stamp Free & Auto-Reset
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
              On collecting 3/3 stamps, your free treat is awarded and the card automatically resets for your next reward cycle!
            </p>
          </div>
        </div>
      </div>

      {/* REWARD VAULT & COUNTER SCAN */}
      <div className="feature-grid" style={{ marginBottom: '40px' }}>
        <div className="feature-card">
          <div className="feature-icon-badge">🎟️</div>
          <h3 className="feature-title">Counter Scan Code</h3>
          <p className="feature-desc" style={{ marginBottom: '16px' }}>
            Give this code or show your screen to the cashier during billing (min ₹50 spend).
          </p>
          <div style={{ background: '#0a0c10', border: '1px dashed var(--border-highlight)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.15em' }}>
              BM-9821
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Linked to WhatsApp: +91 98XXX-XXXXX
            </div>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-badge">🎁</div>
          <h3 className="feature-title">Available Rewards</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid var(--border-highlight)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>Welcome Adda Biscuit</strong>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Free with any bhar chai</div>
              </div>
              <span style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 700 }}>UNLOCKED</span>
            </li>
            <li style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>Special Earthen Cup Chai</strong>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Unlocks at 3 stamps (₹50+ each) · Auto-resets</div>
              </div>
              <span style={{ color: stamps === totalStamps ? '#4ade80' : '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
                {stamps === totalStamps ? 'READY!' : `${totalStamps - stamps} MORE`}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link className="btn-secondary" href="/offers">
          Browse Current Adda Offers & Combos →
        </Link>
      </div>
    </main>
  );
}
