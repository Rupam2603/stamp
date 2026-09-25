'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, AlertTriangle, Hourglass, Coffee, PartyPopper, RotateCw, Zap, Trophy, Gift, Lock, Circle, CheckCircle2 } from 'lucide-react';

const COOLDOWN_MINUTES = 10;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;
const MIN_SPEND_RS = 50;

export default function StampSimulator() {
  const [stamps, setStamps] = useState<number>(0);
  const [completedCards, setCompletedCards] = useState<number>(0);
  const [lastStampTime, setLastStampTime] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalStamps = 3;

  // formatTime removed because timer is hidden

  useEffect(() => {
    if (!lastStampTime || stamps === 0) {
      setSecondsRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastStampTime;
      const remaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
      setSecondsRemaining(remaining);

      if (remaining === 0 && stamps === totalStamps) {
        setStamps(0);
        setCompletedCards((prev) => prev + 1);
        setLastStampTime(null);
        setIsResetting(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastStampTime, stamps, totalStamps]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isLocked = secondsRemaining > 0 && stamps > 0;

  const handleAddStamp = () => {
    if (isResetting) return;



    if (isLocked) {
      return;
    }

    const nextStamp = stamps + 1;
    const now = Date.now();

    if (nextStamp < totalStamps) {
      setStamps(nextStamp);
      setAnimatingIndex(stamps);
      setTimeout(() => setAnimatingIndex(null), 600);
      setLastStampTime(now);
      setSecondsRemaining(COOLDOWN_MINUTES * 60);
    } else {
      // 3rd stamp collected -> all 3 collected! Wait 10 mins before new card.
      setStamps(3);
      setAnimatingIndex(stamps);
      setTimeout(() => setAnimatingIndex(null), 600);
      setLastStampTime(now);
      setSecondsRemaining(COOLDOWN_MINUTES * 60);
      setIsResetting(false);
    }
  };


  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStamps(0);
    setLastStampTime(null);
    setSecondsRemaining(0);
    setIsResetting(false);
  };

  return (
    <div className="demo-card-container">
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
      <div className="demo-card-header">
        <div className="demo-card-brand">
          <div className="demo-logo-mini">
            <Image
              src="/logo.png"
              alt="BHAAR MOSHAI Mini"
              width={38}
              height={38}
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', lineHeight: 1.2 }}>
              BHAAR MOSHAI CLUB
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {completedCards > 0 && (
            <span
              style={{
                background: 'rgba(74, 222, 128, 0.16)',
                border: '1px solid #4ade80',
                color: '#4ade80',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '999px',
              }}
            >
              <span className="flex items-center gap-1"><Trophy size={14} className="inline-block" /> {completedCards} {completedCards === 1 ? 'Card' : 'Cards'} Won!</span>
            </span>
          )}
          <span className="demo-member-badge flex items-center gap-1">
            {stamps === totalStamps ? <><PartyPopper size={14} className="inline-block" /> GET OFFERS!</> : isLocked ? <><Lock size={14} className="inline-block" /> LOCKED</> : 'GOLD ADDA MEMBER'}
          </span>
        </div>
      </div>



      <div className="stamp-grid">
        {Array.from({ length: totalStamps }).map((_, index) => {
          const isStamped = index < stamps;
          const isReward = index === totalStamps - 1;
          const isNextSlotLocked = index === stamps && isLocked;

          return (
            <div
              key={index}
              className={`stamp-slot ${isStamped ? 'stamped' : ''} ${isReward ? 'reward-slot' : ''}`}
              onClick={handleAddStamp}
              title={
                isStamped
                  ? `Stamp ${index + 1} collected!`
                  : isNextSlotLocked
                    ? `Locked`
                    : `Collect stamp ${index + 1} (Min ₹50 spend)`
              }
              style={{
                cursor: isResetting || isLocked ? 'not-allowed' : 'pointer',
                transform: isStamped ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease',
                opacity: isNextSlotLocked ? 0.75 : 1,
              }}
            >
              <div className="stamp-number">
                {isReward ? 'Grab Your Offer' : `BHAR #${index + 1}`}
              </div>
              <div className="stamp-icon">
                {isStamped ? (
                  isReward ? <Gift size={28} className={animatingIndex === index ? 'stamp-animate' : ''} /> : <Coffee size={28} className={animatingIndex === index ? 'stamp-animate' : ''} />
                ) : isNextSlotLocked ? (
                  <Lock size={28} />
                ) : (
                  isReward ? <Sparkles size={28} /> : <Circle size={28} />
                )}
              </div>
              <div style={{ fontSize: '0.7rem', color: isStamped ? '#f59e0b' : isNextSlotLocked ? '#ea580c' : '#64748b', fontWeight: 600 }}>
                {isStamped
                  ? isReward
                    ? 'Grab Your Offer'
                    : 'Stamped'
                  : isNextSlotLocked
                    ? `Locked`
                    : isReward
                      ? '3rd Reward'
                      : 'Min ₹50'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="stamp-action-bar" style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="interactive-stamp-btn"
            onClick={handleAddStamp}
            disabled={isResetting || isLocked}
            style={{ opacity: isResetting || isLocked ? 0.65 : 1, cursor: isResetting || isLocked ? 'not-allowed' : 'pointer' }}
          >
            <span className="flex items-center justify-center gap-1">
              {isResetting
                ? <>Auto-resetting... <RotateCw size={16} className="animate-spin inline-block" /></>
                : stamps === totalStamps
                  ? <>Get Offers! (New card locked) <Lock size={16} className="inline-block" /></>
                  : isLocked
                    ? <>Locked <Lock size={16} className="inline-block" /></>
                    : stamps === 0
                      ? <>Tap to Stamp #1 <Coffee size={16} className="inline-block" /></>
                      : stamps < totalStamps
                        ? <>Tap for Stamp #{stamps + 1} <Coffee size={16} className="inline-block" /></>
                        : <>Card Complete! <Gift size={16} className="inline-block" /></>}
            </span>
          </button>



          {stamps > 0 && !isResetting && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#94a3b8',
                borderRadius: '999px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link
          href="/loyalty"
          style={{
            color: '#f59e0b',
            fontSize: '0.88rem',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          View your full 3-stamp digital card & rewards →
        </Link>
      </div>
    </div>
  );
}
