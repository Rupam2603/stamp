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
    <div className="demo-card-container animate-fade-up">
      <style>{`
        @keyframes stampDrop {
          0% { transform: scale(2) rotate(-20deg); opacity: 0; }
          40% { transform: scale(0.9) rotate(5deg); opacity: 1; }
          70% { transform: scale(1.05) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .stamp-animate {
          animation: stampDrop 0.6s var(--ease-spring) forwards;
        }
      `}</style>
      <div className="demo-card-header">
        <div className="demo-card-brand">
          <div className="demo-logo-mini">
            <Image
              src="/logo.png"
              alt="BHAAR MOSHAI Mini"
              width={32}
              height={32}
            />
          </div>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '1rem' }}>
              BHAAR MOSHAI CLUB
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {completedCards > 0 && (
            <span
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trophy size={14} /> {completedCards} {completedCards === 1 ? 'Card' : 'Cards'} Won
            </span>
          )}
          <span className="demo-member-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {stamps === totalStamps ? <><PartyPopper size={14} /> REWARDS READY</> : isLocked ? <><Lock size={14} /> LOCKED</> : 'GOLD MEMBER'}
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
                opacity: isNextSlotLocked ? 0.6 : 1,
              }}
            >
              <div className="stamp-number">
                {isReward ? 'Reward' : `BHAR #${index + 1}`}
              </div>
              <div className="stamp-icon">
                {isStamped ? (
                  isReward ? <Gift size={28} className={animatingIndex === index ? 'stamp-animate' : ''} /> : <Coffee size={28} className={animatingIndex === index ? 'stamp-animate' : ''} />
                ) : isNextSlotLocked ? (
                  <Lock size={28} style={{ color: 'var(--text-tertiary)' }} />
                ) : (
                  isReward ? <Sparkles size={28} style={{ color: 'var(--text-tertiary)' }} /> : <Circle size={28} style={{ color: 'var(--text-tertiary)' }} />
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: isStamped ? 'var(--accent-terracotta)' : isNextSlotLocked ? 'var(--text-tertiary)' : 'var(--text-secondary)' }}>
                {isStamped
                  ? isReward
                    ? 'Available'
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

      <div className="stamp-action-bar" style={{ justifyContent: 'center', borderTop: 'none', padding: 0 }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddStamp}
            disabled={isResetting || isLocked}
            style={{ opacity: isResetting || isLocked ? 0.65 : 1, cursor: isResetting || isLocked ? 'not-allowed' : 'pointer' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isResetting
                ? <>Resetting... <RotateCw size={16} className="animate-spin" /></>
                : stamps === totalStamps
                  ? <>Get Offers! <Lock size={16} /></>
                  : isLocked
                    ? <>Locked <Lock size={16} /></>
                    : stamps === 0
                      ? <>Tap to Stamp #1 <Coffee size={16} /></>
                      : stamps < totalStamps
                        ? <>Tap for Stamp #{stamps + 1} <Coffee size={16} /></>
                        : <>Card Complete! <Gift size={16} /></>}
            </span>
          </button>

          {stamps > 0 && !isResetting && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link
          href="/loyalty"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.3s'
          }}
        >
          View your full 3-stamp digital card & rewards →
        </Link>
      </div>
    </div>
  );
}
