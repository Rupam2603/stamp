'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '@/lib/auth-context';

export default function NavHeader() {
  const { isLoaded, isSignedIn, user, signOut } = useAuth();

  return (
    <header className="nav-header">
      <div className="nav-container">
        <Link className="brand-link" href="/">
          <div className="brand-logo-frame">
            <Image
              src="/logo.png"
              alt="BHAAR MOSHAI Logo"
              width={44}
              height={44}
              priority
            />
          </div>
          <div className="brand-meta">
            <span className="brand-title">BHAAR MOSHAI</span>
            <span className="brand-bengali">ভাঁড় মশাই · চায়ের আড্ডা</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link className="nav-item" href="/activate">Activate Card</Link>
          <Link className="nav-item" href="/loyalty">My Loyalty</Link>
          <Link className="nav-item" href="/offers">Offers</Link>

          <div className="auth-controls">
            {!isLoaded ? null : isSignedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 600 }}>
                  {user?.displayName || user?.email?.split('@')[0] || 'Member'}
                </span>
                <button
                  className="auth-btn-ghost"
                  onClick={() => signOut()}
                  style={{ cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <a href="/sign-in">
                  <button className="auth-btn-ghost">Sign In</button>
                </a>
                <a href="/sign-up">
                  <button className="auth-btn-primary">Join Club</button>
                </a>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
