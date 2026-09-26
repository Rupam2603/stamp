'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, AlertTriangle, Hourglass, Coffee, PartyPopper, RotateCw, Zap, Trophy, Gift, Lock, Circle, CheckCircle2 } from 'lucide-react';
import { getLoyaltyData, updateLoyaltyData } from '@/app/actions/loyalty';
import { generateRegOptions, verifyRegResponse } from '@/app/actions/webauthn';
import { startRegistration } from '@simplewebauthn/browser';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
const COOLDOWN_MINUTES = 10;
const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000; // 10 minutes = 600,000 ms

const STORAGE_KEYS = {
  STAMPS: 'bhaar_moshai_loyalty_stamps',
  LAST_TIME: 'bhaar_moshai_last_stamp_timestamp',
  COMPLETED: 'bhaar_moshai_completed_cards',
};

const SHOP_LOCATION = {
  latitude: 22.7513902,
  longitude: 88.3537697
};
const MAX_DISTANCE_METERS = 50;

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

export default function Loyalty() {
  const [stamps, setStamps] = useState<number>(0);
  const [completedCards, setCompletedCards] = useState<number>(0);
  const [lastStampTime, setLastStampTime] = useState<number | null>(null);
  const [stampHistory, setStampHistory] = useState<number[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isAutoResetting, setIsAutoResetting] = useState<boolean>(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRegisteringBiometrics, setIsRegisteringBiometrics] = useState<boolean>(false);
  const [biometricsSuccess, setBiometricsSuccess] = useState<string | null>(null);
  const router = useRouter();

  const totalStamps = 3;
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from database or localStorage
  useEffect(() => {
    const loadData = async () => {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);

      let validStamps = 0;
      let validTime: number | null = null;
      let validCards = 0;
      let validHistory: number[] = [];

      if (storedUserId) {
        const res = await getLoyaltyData(storedUserId);
        if (res.success && res.data) {
          validStamps = res.data.stamps;
          validTime = res.data.lastStampTime;
          validCards = res.data.completedCards;
          if (res.data.stampHistory && Array.isArray(res.data.stampHistory)) {
            validHistory = res.data.stampHistory as number[];
          }
        }
      } else {
        try {
          const savedStamps = parseInt(localStorage.getItem(STORAGE_KEYS.STAMPS) || '0', 10);
          const savedTime = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_TIME) || '0', 10);
          const savedCards = parseInt(localStorage.getItem(STORAGE_KEYS.COMPLETED) || '0', 10);

          validStamps = isNaN(savedStamps) ? 0 : Math.min(3, Math.max(0, savedStamps));
          validTime = isNaN(savedTime) || savedTime <= 0 ? null : savedTime;
          validCards = isNaN(savedCards) ? 0 : Math.max(0, savedCards);
        } catch (e) {
          console.error('Error loading loyalty storage', e);
        }
      }

      setStamps(validStamps);
      setCompletedCards(validCards);
      setLastStampTime(validTime);
      setStampHistory(validHistory);

      if (validTime && validStamps > 0 && validStamps < totalStamps) {
        const elapsed = Date.now() - validTime;
        const remaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
        setSecondsRemaining(remaining);
      }
      setHasMounted(true);
    };
    loadData();
  }, []);

  // Live countdown timer ticking every 1 second
  useEffect(() => {
    if (!lastStampTime || stamps === 0) {
      setSecondsRemaining(0);
      return;
    }

    const interval = setInterval(async () => {
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
          setStampHistory([]);
          
          if (userId) {
            await updateLoyaltyData(userId, {
              stamps: 0,
              completedCards: nextCompleted,
              lastStampTime: null,
              stampHistory: []
            });
          } else {
            try {
              localStorage.setItem(STORAGE_KEYS.STAMPS, '0');
              localStorage.removeItem(STORAGE_KEYS.LAST_TIME);
              localStorage.setItem(STORAGE_KEYS.COMPLETED, String(nextCompleted));
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastStampTime, stamps, completedCards, userId]);

  // Clean up auto-reset timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const isLocked = secondsRemaining > 0 && stamps > 0 && stamps < totalStamps;

  const triggerSmallConfetti = () => {
    const colors = ['#ea580c', '#c2410c', '#fb923c'];
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: colors,
      zIndex: 100,
    });
  };

  const triggerBigConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ea580c', '#c2410c', '#fb923c', '#22c55e', '#eab308']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ea580c', '#c2410c', '#fb923c', '#22c55e', '#eab308']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleRegisterBiometrics = async () => {
    if (!userId) return;
    setIsRegisteringBiometrics(true);
    setLocationError(null);
    setBiometricsSuccess(null);
    
    try {
      const optionsRes = await generateRegOptions(userId);
      if (!optionsRes.success || !optionsRes.options) {
        throw new Error(optionsRes.message || 'Failed to get registration options');
      }

      let attResp;
      try {
        attResp = await startRegistration({ optionsJSON: optionsRes.options });
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          throw new Error('Biometric registration was cancelled.');
        }
        throw err;
      }

      const verifyRes = await verifyRegResponse(userId, attResp);
      if (verifyRes.success) {
        setBiometricsSuccess('Biometric login enabled successfully!');
        setTimeout(() => setBiometricsSuccess(null), 3000);
      } else {
        throw new Error(verifyRes.message || 'Biometric verification failed');
      }
    } catch (err: any) {
      setLocationError(err.message || 'Something went wrong during biometric registration.');
    } finally {
      setIsRegisteringBiometrics(false);
    }
  };

  // Stamp collection handler
  const handleAddStamp = async () => {
    if (isAutoResetting) return;
    
    if (!userId) {
      router.push('/login');
      return;
    }

    if (stamps >= totalStamps) {
      return;
    }

    // Check 10-minute cooldown rule
    if (isLocked) {
      return;
    }

    setLocationError(null);
    setIsLocating(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const distance = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        SHOP_LOCATION.latitude,
        SHOP_LOCATION.longitude
      );

      if (distance > MAX_DISTANCE_METERS) {
        setLocationError(`You must be at the shop to collect a stamp! (Distance: ${Math.round(distance)}m)`);
        setIsLocating(false);
        return;
      }
    } catch (error: any) {
      console.error(error);
      setLocationError("Failed to get your location. Please enable location services.");
      setIsLocating(false);
      return;
    }

    setIsLocating(false);

    const nextStamp = stamps + 1;
    const now = Date.now();

    if (nextStamp < totalStamps) {
      // Stamp 1 or 2 collected -> lock for 10 minutes!
      triggerSmallConfetti();
      setStamps(nextStamp);
      setAnimatingIndex(stamps);
      setTimeout(() => setAnimatingIndex(null), 800); // Wait for animation
      setLastStampTime(now);
      const newHistory = stamps === 0 ? [now] : [...stampHistory, now];
      setStampHistory(newHistory);
      setSecondsRemaining(COOLDOWN_MINUTES * 60);

      if (userId) {
        await updateLoyaltyData(userId, { stamps: nextStamp, completedCards, lastStampTime: now, stampHistory: newHistory });
      } else {
        try {
          localStorage.setItem(STORAGE_KEYS.STAMPS, String(nextStamp));
          localStorage.setItem(STORAGE_KEYS.LAST_TIME, String(now));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      // 3rd stamp collected -> wait 10 mins before new card
      triggerBigConfetti();
      setStamps(3);
      setAnimatingIndex(stamps);
      setTimeout(() => setAnimatingIndex(null), 800);
      setLastStampTime(now);
      const newHistory = stamps === 0 ? [now] : [...stampHistory, now];
      setStampHistory(newHistory);
      setSecondsRemaining(COOLDOWN_MINUTES * 60);
      setIsAutoResetting(false);
      
      if (userId) {
        await updateLoyaltyData(userId, { stamps: 3, completedCards, lastStampTime: now, stampHistory: newHistory });
      } else {
        try {
          localStorage.setItem(STORAGE_KEYS.STAMPS, '3');
          localStorage.setItem(STORAGE_KEYS.LAST_TIME, String(now));
        } catch (e) {
          console.error(e);
        }
      }

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    }
  };

  // Reset entire card
  const handleManualReset = async () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setStamps(0);
    setLastStampTime(null);
    setSecondsRemaining(0);
    setIsAutoResetting(false);
    setStampHistory([]);
    
    if (userId) {
      await updateLoyaltyData(userId, { stamps: 0, completedCards, lastStampTime: null, stampHistory: [] });
    } else {
      try {
        localStorage.setItem(STORAGE_KEYS.STAMPS, '0');
        localStorage.removeItem(STORAGE_KEYS.LAST_TIME);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!hasMounted) return null;

  return (
    <main className="main-section animate-fade-up" style={{ maxWidth: '860px' }}>
      <div className="section-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span className="section-label" style={{ margin: 0 }}>MY DIGITAL LOYALTY CARD</span>
          <span style={{
            background: 'var(--accent-terracotta-dim)',
            border: '1px solid var(--border-medium)',
            color: 'var(--accent-terracotta)',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}>
            Min ₹50 Spend / Stamp
          </span>
          <span style={{
            background: 'rgba(0,0,0,0.05)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-secondary)',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}>
            10-Min Wait
          </span>
        </div>

        <h1 className="section-title">BHAAR MOSHAI Tea Pass</h1>
        <p className="section-desc">
          Every customer collects 3 stamps per card with a <strong>minimum ₹50 order spend</strong> per stamp. After each stamp, wait 10 minutes. After 3 stamps, your card automatically resets for your next cycle!
        </p>
      </div>

      {/* VIRTUAL MEMBERSHIP CARD */}
      <style>{`
        @keyframes stampDrop {
          0% { 
            transform: scale(2.5) rotate(-30deg); 
            opacity: 0; 
            filter: drop-shadow(0 20px 10px rgba(0,0,0,0.2));
          }
          40% { 
            transform: scale(0.9) rotate(8deg); 
            opacity: 1; 
            filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));
          }
          60% { 
            transform: scale(1.1) rotate(-4deg); 
          }
          80% { 
            transform: scale(0.95) rotate(2deg); 
          }
          100% { 
            transform: scale(1) rotate(0deg); 
            filter: drop-shadow(0 0 0 rgba(0,0,0,0));
          }
        }

        @keyframes inkPulse {
          0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.4); }
          70% { box-shadow: 0 0 0 25px rgba(234, 88, 12, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
        }

        @keyframes cardShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px) rotate(-1deg); }
          40% { transform: translateX(4px) rotate(1deg); }
          60% { transform: translateX(-2px) rotate(-0.5deg); }
          80% { transform: translateX(2px) rotate(0.5deg); }
        }

        .stamp-animate {
          animation: stampDrop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .slot-animate {
          animation: inkPulse 0.8s ease-out forwards;
        }

        .card-shake {
          animation: cardShake 0.4s ease-in-out;
        }
      `}</style>
      <div
        className={animatingIndex !== null ? 'card-shake' : ''}
        style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '34px',
          marginBottom: '36px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--bg-base)', border: '1px solid var(--border-medium)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src="/logo.png"
                alt="BHAAR MOSHAI Logo"
                width={42}
                height={42}
              />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                BHAAR MOSHAI
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              background: 'var(--accent-terracotta-dim)',
              border: '1px solid var(--border-medium)',
              color: 'var(--accent-terracotta)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              display: 'inline-block'
            }}>
              Stamp {stamps} on Card {completedCards + 1} is collected
            </span>
          </div>
        </div>

        {/* STAMP SLOTS */}
        {!isLocked && (
          <div style={{ marginBottom: '24px' }}>
          <div className="stamp-grid">
            {Array.from({ length: totalStamps }).map((_, i) => {
              const isStamped = i < stamps;
              const isReward = i === totalStamps - 1;
              const isNextSlotLocked = i === stamps && isLocked;
              const isAnimating = animatingIndex === i;

              return (
                <div
                  key={i}
                  className={`stamp-slot ${isStamped ? 'stamped' : ''} ${isReward ? 'reward-slot' : ''} ${isAnimating ? 'slot-animate' : ''}`}
                  onClick={handleAddStamp}
                  style={{
                    cursor: isAutoResetting || isLocked ? 'not-allowed' : 'pointer',
                    opacity: isNextSlotLocked ? 0.6 : 1,
                    position: 'relative',
                    borderRadius: '50%',
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
                      isReward ? <Gift size={32} className={isAnimating ? 'stamp-animate' : ''} /> : <Coffee size={32} className={isAnimating ? 'stamp-animate' : ''} />
                    ) : isNextSlotLocked ? (
                      <Lock size={32} style={{ color: 'var(--text-tertiary)' }} />
                    ) : (
                      isReward ? <Sparkles size={32} style={{ color: 'var(--text-tertiary)' }} /> : <Circle size={32} style={{ color: 'var(--text-tertiary)' }} />
                    )}
                  </span>
                  <span className="stamp-desc" style={{ color: isStamped ? 'var(--accent-terracotta)' : isNextSlotLocked ? 'var(--text-tertiary)' : 'var(--text-secondary)', fontWeight: 600 }}>
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
        )}

        {/* ACTION / COOLDOWN AREA */}
        {!isLocked && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', padding: '14px 20px', flexWrap: 'wrap', gap: '12px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddStamp}
                disabled={isAutoResetting || stamps === totalStamps || isLocating}
                style={{
                  opacity: isAutoResetting || isLocating ? 0.65 : 1,
                  cursor: isAutoResetting || isLocating ? 'not-allowed' : 'pointer',
                  transform: animatingIndex !== null ? 'scale(0.98)' : 'scale(1)',
                  transition: 'transform 0.1s ease',
                }}
              >
                {isLocating 
                  ? 'Verifying Location...'
                  : isAutoResetting
                  ? 'Card Auto-resetting...'
                  : stamps === 0
                  ? 'Collect First Stamp'
                  : stamps < totalStamps
                  ? `Collect Stamp #${stamps + 1}`
                  : '3/3 Collected! Reward Unlocked'}
              </button>

              {stamps > 0 && !isAutoResetting && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleManualReset}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                  }}
                >
                  Reset Card
                </button>
              )}
            </div>
            
            {stamps === totalStamps && secondsRemaining > 0 && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Card auto-resets in <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.95rem' }}>{Math.floor(secondsRemaining / 60).toString().padStart(2, '0')}:{(secondsRemaining % 60).toString().padStart(2, '0')}</strong>
              </div>
            )}
            
            {locationError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} /> {locationError}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link className="btn btn-secondary" href="/offers">
          Browse Current Adda Offers & Combos →
        </Link>
      </div>
      
      {userId && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={handleRegisterBiometrics}
            disabled={isRegisteringBiometrics}
            className="btn" 
            style={{ padding: '10px 16px', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}
          >
            {isRegisteringBiometrics ? 'Setting up...' : 'Setup Biometric Login (FaceID / Fingerprint)'}
          </button>
          {biometricsSuccess && <div style={{ color: '#2e7d32', marginTop: '8px', fontSize: '0.85rem' }}>{biometricsSuccess}</div>}
        </div>
      )}
    </main>
  );
}
