'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NavHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check auth state
    const checkAuth = () => {
      const userId = localStorage.getItem('userId');
      const adminFlag = localStorage.getItem('isAdmin');
      setIsLoggedIn(!!userId);
      setIsAdmin(adminFlag === 'true');
    };

    checkAuth();
    
    // Listen for custom event if we want to update header on login without refresh
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  }

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
          {!isAdmin && (
            <>
              <Link className="nav-item" href="/activate">Activate Card</Link>
              <Link className="nav-item" href="/loyalty">My Loyalty</Link>
              <Link className="nav-item" href="/offers">Offers</Link>
            </>
          )}
          {isAdmin && <Link className="nav-item" href="/admin" style={{ color: 'var(--accent-terracotta)' }}>Admin Panel</Link>}
        </nav>

        <div className="auth-controls">
          {isLoggedIn ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <Link href={isAdmin ? "/admin" : "/loyalty"} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
                 <div style={{ background: 'var(--bg-subtle)', padding: '8px', borderRadius: '50%' }}>
                   <User size={18} />
                 </div>
                </Link>
               <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px', color: 'var(--text-tertiary)' }} aria-label="Log Out">
                 <LogOut size={18} />
               </button>
             </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Log In</Link>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
